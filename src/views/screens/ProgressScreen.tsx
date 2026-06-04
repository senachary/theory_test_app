import { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { AppHeader } from '../components/GovHeader';
import { useProgress } from '../../viewmodels/useProgress';
import { ALL_CATEGORIES } from '../../models/Question';
import type { Category } from '../../models/Question';
import questions from '../../data/questions';

const TOTAL_QUESTIONS = questions.length;

// Pre-compute per-category totals once at module level (static data)
const CATEGORY_TOTALS: Record<Category, number> = Object.fromEntries(
  ALL_CATEGORIES.map(cat => [cat, questions.filter(q => q.category === cat).length])
) as Record<Category, number>;

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function formatDuration(secs: number): string {
  const m = Math.floor(secs / 60);
  const s = secs % 60;
  return `${m}m ${s}s`;
}

type Tab = 'overview' | 'questions' | 'history';

export function ProgressScreen() {
  const router = useRouter();
  const { progress, isLoading, reset } = useProgress();
  const [tab, setTab] = useState<Tab>('overview');

  const handleReset = () => {
    Alert.alert(
      'Reset progress',
      'This will delete all your test history and statistics. Are you sure?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Reset', style: 'destructive', onPress: reset },
      ]
    );
  };

  if (isLoading || !progress) {
    return (
      <SafeAreaView className="flex-1 bg-[#f3f2f1] items-center justify-center">
        <Text className="text-[#505a5f]">Loading…</Text>
      </SafeAreaView>
    );
  }

  // ── Derived question stats ───────────────────────────────────────────────
  const answeredIds = new Set(Object.keys(progress.questionStats));
  const answered = answeredIds.size;
  const unseen = TOTAL_QUESTIONS - answered;

  // Per-category unseen counts
  const unseenByCategory = ALL_CATEGORIES.map(cat => {
    const total = CATEGORY_TOTALS[cat];
    const seenInCat = questions.filter(q => q.category === cat && answeredIds.has(q.id)).length;
    return { cat, total, unseen: total - seenInCat };
  });

  // Weak: answered at least once, <60% correct
  const weakQuestions = questions.filter(q => {
    const rec = progress.questionStats[q.id];
    if (!rec || rec.timesAnswered === 0) return false;
    return (rec.timesCorrect / rec.timesAnswered) < 0.6;
  });

  // Strong: answered at least twice, ≥100% correct (always got it right)
  const strongQuestions = questions.filter(q => {
    const rec = progress.questionStats[q.id];
    if (!rec || rec.timesAnswered < 2) return false;
    return rec.timesCorrect === rec.timesAnswered;
  });

  const TAB_STYLES = (t: Tab) =>
    `flex-1 py-3 items-center border-b-2 ${tab === t ? 'border-[#1D70B8]' : 'border-transparent'}`;
  const TAB_TEXT = (t: Tab) =>
    `text-sm font-bold ${tab === t ? 'text-[#1D70B8]' : 'text-[#505a5f]'}`;

  return (
    <SafeAreaView className="flex-1 bg-[#f3f2f1]" edges={['top']}>
      <AppHeader title="Your Progress" showBack />

      {/* Top stats strip */}
      <View className="flex-row bg-white border-b border-[#b1b4b6]">
        <View className="flex-1 items-center py-4 border-r border-[#b1b4b6]">
          <Text className="text-2xl font-bold text-[#0b0c0c]">{progress.totalTests}</Text>
          <Text className="text-xs text-[#505a5f] mt-1">Tests taken</Text>
        </View>
        <View className="flex-1 items-center py-4 border-r border-[#b1b4b6]">
          <Text className="text-2xl font-bold text-[#0b0c0c]">{answered}/{TOTAL_QUESTIONS}</Text>
          <Text className="text-xs text-[#505a5f] mt-1">Questions seen</Text>
        </View>
        <View className="flex-1 items-center py-4">
          <Text className="text-2xl font-bold text-[#0b0c0c]">{progress.bestScore}</Text>
          <Text className="text-xs text-[#505a5f] mt-1">Best score</Text>
        </View>
      </View>

      {/* Tab bar */}
      <View className="flex-row bg-white border-b border-[#b1b4b6]">
        {(['overview', 'questions', 'history'] as Tab[]).map(t => (
          <TouchableOpacity key={t} onPress={() => setTab(t)} className={TAB_STYLES(t)}>
            <Text className={TAB_TEXT(t)}>
              {t === 'overview' ? 'Categories' : t === 'questions' ? 'Questions' : 'History'}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView className="flex-1" contentContainerClassName="pb-10">

        {/* ── OVERVIEW TAB ── */}
        {tab === 'overview' && (
          <View className="px-4 pt-5">
            <Text className="text-lg font-bold text-[#0b0c0c] mb-4">Category breakdown</Text>
            {ALL_CATEGORIES.map(cat => {
              const stats = progress.categoryStats[cat];
              const pct = stats.attempted > 0
                ? Math.round((stats.correct / stats.attempted) * 100)
                : null;
              const isGood = pct !== null && pct >= 86;

              return (
                <View key={cat} className="bg-white border border-[#b1b4b6] rounded-sm px-4 py-4 mb-3">
                  <View className="flex-row items-center justify-between mb-1">
                    <Text className="text-sm font-bold text-[#0b0c0c] flex-1 mr-2" numberOfLines={1}>
                      {cat}
                    </Text>
                    <Text className={`text-sm font-bold ${pct === null ? 'text-[#b1b4b6]' : isGood ? 'text-[#00703C]' : 'text-[#D4351C]'}`}>
                      {pct !== null ? `${pct}%` : 'Not attempted'}
                    </Text>
                  </View>
                  {pct !== null && (
                    <View className="h-2 bg-[#e8e8e8] rounded-full overflow-hidden mb-1">
                      <View
                        className={`h-2 rounded-full ${isGood ? 'bg-[#00703C]' : 'bg-[#D4351C]'}`}
                        style={{ width: `${pct}%` }}
                      />
                    </View>
                  )}
                  {stats.attempted > 0 && (
                    <Text className="text-xs text-[#505a5f]">
                      {stats.correct}/{stats.attempted} correct
                      {stats.lastAttempted ? ` · ${formatDate(stats.lastAttempted)}` : ''}
                    </Text>
                  )}
                  <TouchableOpacity
                    onPress={() => router.push({ pathname: '/quiz', params: { category: cat, count: '20' } })}
                    className="mt-3 self-start"
                  >
                    <Text className="text-[#1D70B8] text-sm">Practise this category →</Text>
                  </TouchableOpacity>
                </View>
              );
            })}

            <TouchableOpacity
              onPress={handleReset}
              className="border border-[#D4351C] py-4 px-6 rounded-sm mt-2"
              activeOpacity={0.85}
            >
              <Text className="text-[#D4351C] font-bold text-base text-center">Reset all progress</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* ── QUESTIONS TAB ── */}
        {tab === 'questions' && (
          <View className="px-4 pt-5">

            {/* Unseen — total + per-category breakdown */}
            <View className="bg-white border border-[#b1b4b6] rounded-sm p-4 mb-4">
              {/* Header row */}
              <View className="flex-row items-center justify-between mb-2">
                <Text className="text-base font-bold text-[#0b0c0c]">Never seen</Text>
                <Text className="text-2xl font-bold text-[#505a5f]">{unseen}</Text>
              </View>
              <View className="h-2 bg-[#e8e8e8] rounded-full overflow-hidden mb-2">
                <View
                  className="h-2 rounded-full bg-[#505a5f]"
                  style={{ width: `${Math.round((unseen / TOTAL_QUESTIONS) * 100)}%` }}
                />
              </View>
              <Text className="text-xs text-[#505a5f] mb-4">
                {unseen} of {TOTAL_QUESTIONS} questions ({Math.round((unseen / TOTAL_QUESTIONS) * 100)}%) not yet answered
              </Text>

              {/* Per-category rows */}
              {unseenByCategory.map(({ cat, total, unseen: catUnseen }) => {
                const seenPct = Math.round(((total - catUnseen) / total) * 100);
                const allSeen = catUnseen === 0;
                return (
                  <View key={cat} className="border-t border-[#f3f2f1] pt-3 mt-1">
                    <View className="flex-row items-center justify-between mb-1">
                      <Text className="text-sm text-[#0b0c0c] flex-1 mr-2" numberOfLines={1}>
                        {cat}
                      </Text>
                      <Text className={`text-xs font-bold ${allSeen ? 'text-[#00703C]' : 'text-[#505a5f]'}`}>
                        {allSeen ? '✓ All seen' : `${catUnseen} unseen`}
                      </Text>
                    </View>
                    <View className="h-1.5 bg-[#e8e8e8] rounded-full overflow-hidden mb-1">
                      <View
                        className={`h-1.5 rounded-full ${allSeen ? 'bg-[#00703C]' : 'bg-[#1D70B8]'}`}
                        style={{ width: `${seenPct}%` }}
                      />
                    </View>
                    <View className="flex-row items-center justify-between">
                      <Text className="text-xs text-[#505a5f]">
                        {total - catUnseen}/{total} seen
                      </Text>
                      {catUnseen > 0 && (
                        <TouchableOpacity
                          onPress={() => router.push({ pathname: '/quiz', params: { category: cat, count: String(Math.min(catUnseen, 20)) } })}
                        >
                          <Text className="text-xs text-[#1D70B8]">Practise unseen →</Text>
                        </TouchableOpacity>
                      )}
                    </View>
                  </View>
                );
              })}
            </View>

            {/* Weak questions */}
            <View className="bg-white border border-[#b1b4b6] rounded-sm p-4 mb-4">
              <View className="flex-row items-center justify-between mb-1">
                <Text className="text-base font-bold text-[#0b0c0c]">Need work</Text>
                <Text className="text-2xl font-bold text-[#D4351C]">{weakQuestions.length}</Text>
              </View>
              <Text className="text-xs text-[#505a5f] mb-3">
                Answered but correct less than 60% of the time
              </Text>
              {weakQuestions.length === 0 ? (
                <Text className="text-xs text-[#00703C]">No weak questions yet — keep going!</Text>
              ) : (
                weakQuestions.slice(0, 8).map(q => {
                  const rec = progress.questionStats[q.id]!;
                  const pct = Math.round((rec.timesCorrect / rec.timesAnswered) * 100);
                  return (
                    <View key={q.id} className="border-t border-[#f3f2f1] pt-3 mt-3">
                      <View className="flex-row items-center justify-between mb-1">
                        <Text className="text-xs text-[#505a5f] uppercase tracking-wide">{q.category}</Text>
                        <Text className="text-xs font-bold text-[#D4351C]">
                          {rec.timesCorrect}/{rec.timesAnswered} ({pct}%)
                        </Text>
                      </View>
                      <Text className="text-sm text-[#0b0c0c] leading-5" numberOfLines={2}>
                        {q.question}
                      </Text>
                    </View>
                  );
                })
              )}
              {weakQuestions.length > 8 && (
                <Text className="text-xs text-[#505a5f] mt-3">
                  …and {weakQuestions.length - 8} more
                </Text>
              )}
              {weakQuestions.length > 0 && (
                <TouchableOpacity
                  onPress={() => router.push({ pathname: '/quiz', params: { category: 'Mixed', count: '20', flaggedOnly: 'false' } })}
                  className="mt-4 self-start"
                >
                  <Text className="text-[#1D70B8] text-sm">Flag weak questions and review them →</Text>
                </TouchableOpacity>
              )}
            </View>

            {/* Strong questions */}
            <View className="bg-white border border-[#b1b4b6] rounded-sm p-4 mb-4">
              <View className="flex-row items-center justify-between mb-1">
                <Text className="text-base font-bold text-[#0b0c0c]">Mastered</Text>
                <Text className="text-2xl font-bold text-[#00703C]">{strongQuestions.length}</Text>
              </View>
              <Text className="text-xs text-[#505a5f] mb-3">
                Answered at least twice and always got right
              </Text>
              {strongQuestions.length === 0 ? (
                <Text className="text-xs text-[#505a5f]">Keep answering to build your mastered list</Text>
              ) : (
                strongQuestions.slice(0, 5).map(q => {
                  const rec = progress.questionStats[q.id]!;
                  return (
                    <View key={q.id} className="border-t border-[#f3f2f1] pt-3 mt-3">
                      <View className="flex-row items-center justify-between mb-1">
                        <Text className="text-xs text-[#505a5f] uppercase tracking-wide">{q.category}</Text>
                        <Text className="text-xs font-bold text-[#00703C]">
                          {rec.timesAnswered}× correct
                        </Text>
                      </View>
                      <Text className="text-sm text-[#0b0c0c] leading-5" numberOfLines={2}>
                        {q.question}
                      </Text>
                    </View>
                  );
                })
              )}
              {strongQuestions.length > 5 && (
                <Text className="text-xs text-[#505a5f] mt-3">
                  …and {strongQuestions.length - 5} more mastered
                </Text>
              )}
            </View>

            {/* Per-question detail for answered questions */}
            {answered > 0 && (
              <View className="bg-white border border-[#b1b4b6] rounded-sm p-4 mb-4">
                <Text className="text-base font-bold text-[#0b0c0c] mb-3">All answered questions</Text>
                {questions
                  .filter(q => progress.questionStats[q.id])
                  .sort((a, b) => {
                    const ra = progress.questionStats[a.id]!;
                    const rb = progress.questionStats[b.id]!;
                    const pctA = ra.timesCorrect / ra.timesAnswered;
                    const pctB = rb.timesCorrect / rb.timesAnswered;
                    return pctA - pctB; // worst first
                  })
                  .slice(0, 30)
                  .map(q => {
                    const rec = progress.questionStats[q.id]!;
                    const pct = Math.round((rec.timesCorrect / rec.timesAnswered) * 100);
                    const isGood = pct >= 86;
                    return (
                      <View key={q.id} className="border-t border-[#f3f2f1] pt-3 mt-3">
                        <View className="flex-row items-center justify-between mb-1">
                          <Text className="text-xs text-[#505a5f] uppercase tracking-wide flex-1 mr-2" numberOfLines={1}>
                            {q.category}
                          </Text>
                          <Text className={`text-xs font-bold ${isGood ? 'text-[#00703C]' : 'text-[#D4351C]'}`}>
                            {rec.timesCorrect}/{rec.timesAnswered} ({pct}%)
                          </Text>
                        </View>
                        <Text className="text-sm text-[#0b0c0c] leading-5" numberOfLines={2}>
                          {q.question}
                        </Text>
                      </View>
                    );
                  })}
                {answered > 30 && (
                  <Text className="text-xs text-[#505a5f] mt-4 text-center">
                    Showing worst 30 of {answered} answered questions
                  </Text>
                )}
              </View>
            )}
          </View>
        )}

        {/* ── HISTORY TAB ── */}
        {tab === 'history' && (
          <View className="px-4 pt-5">
            {progress.recentResults.length === 0 ? (
              <Text className="text-[#505a5f] text-sm text-center mt-8">No tests completed yet</Text>
            ) : (
              progress.recentResults.map(r => (
                <View key={r.id} className="bg-white border border-[#b1b4b6] rounded-sm px-4 py-4 mb-3">
                  <View className="flex-row items-center justify-between">
                    <View className={`px-2 py-1 rounded-sm ${r.passed ? 'bg-[#e8f5ee]' : 'bg-[#fde8e5]'}`}>
                      <Text className={`text-xs font-bold ${r.passed ? 'text-[#00703C]' : 'text-[#D4351C]'}`}>
                        {r.passed ? 'PASS' : 'FAIL'}
                      </Text>
                    </View>
                    <Text className="text-base font-bold text-[#0b0c0c]">
                      {r.score}/{r.total} ({Math.round((r.score / r.total) * 100)}%)
                    </Text>
                    <Text className="text-sm text-[#505a5f]">{formatDuration(r.durationSeconds)}</Text>
                  </View>
                  <Text className="text-xs text-[#505a5f] mt-2">{r.category} · {formatDate(r.date)}</Text>
                </View>
              ))
            )}

            <TouchableOpacity
              onPress={handleReset}
              className="border border-[#D4351C] py-4 px-6 rounded-sm mt-4"
              activeOpacity={0.85}
            >
              <Text className="text-[#D4351C] font-bold text-base text-center">Reset all progress</Text>
            </TouchableOpacity>
          </View>
        )}

      </ScrollView>
    </SafeAreaView>
  );
}
