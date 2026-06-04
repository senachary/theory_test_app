import { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { AppHeader } from '../components/GovHeader';
import { loadSavedTest } from '../../services/storageService';
import type { AnswerLog } from '../../models/Progress';
import type { Question } from '../../models/Question';
import questions from '../../data/questions';

const questionMap = Object.fromEntries(questions.map(q => [q.id, q]));

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-GB', {
    day: 'numeric', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });
}

type Filter = 'all' | 'wrong' | 'correct';

export function ReviewScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ resultId: string; date: string; score: string; total: string; category: string }>();

  const [answerLog, setAnswerLog] = useState<AnswerLog[] | null>(null);
  const [filter, setFilter] = useState<Filter>('all');

  useEffect(() => {
    loadSavedTest(params.resultId).then(saved => {
      setAnswerLog(saved ? saved.answerLog : []);
    });
  }, [params.resultId]);

  if (answerLog === null) {
    return (
      <SafeAreaView className="flex-1 bg-[#f3f2f1] items-center justify-center">
        <ActivityIndicator size="large" color="#1D70B8" />
      </SafeAreaView>
    );
  }

  const score = parseInt(params.score ?? '0', 10);
  const total = parseInt(params.total ?? '0', 10);
  const pct = total > 0 ? Math.round((score / total) * 100) : 0;
  const passed = pct >= 86;

  const filtered = answerLog.filter(entry => {
    if (filter === 'wrong') return !entry.correct;
    if (filter === 'correct') return entry.correct;
    return true;
  });

  const wrongCount = answerLog.filter(e => !e.correct).length;
  const correctCount = answerLog.filter(e => e.correct).length;

  const FILTER_OPTS: { key: Filter; label: string; count: number }[] = [
    { key: 'all', label: 'All', count: answerLog.length },
    { key: 'wrong', label: 'Wrong', count: wrongCount },
    { key: 'correct', label: 'Correct', count: correctCount },
  ];

  return (
    <SafeAreaView className="flex-1 bg-[#f3f2f1]" edges={['top']}>
      <AppHeader title="Test Review" showBack />

      <ScrollView className="flex-1" contentContainerClassName="pb-10">
        {/* Summary bar */}
        <View className={`px-4 py-4 flex-row items-center justify-between ${passed ? 'bg-[#00703C]' : 'bg-[#D4351C]'}`}>
          <View>
            <Text className="text-white font-bold text-lg">{passed ? 'Pass ✓' : 'Fail ✗'}</Text>
            <Text className="text-white text-xs opacity-80">{formatDate(params.date ?? '')}</Text>
          </View>
          <View className="items-end">
            <Text className="text-white font-bold text-2xl">{score}/{total}</Text>
            <Text className="text-white text-xs opacity-80">{pct}% · {params.category}</Text>
          </View>
        </View>

        {/* Filter pills */}
        <View className="flex-row px-4 pt-4 pb-2 gap-x-2">
          {FILTER_OPTS.map(opt => (
            <TouchableOpacity
              key={opt.key}
              onPress={() => setFilter(opt.key)}
              className={`px-4 py-2 rounded-full border ${
                filter === opt.key
                  ? opt.key === 'wrong'
                    ? 'bg-[#D4351C] border-[#D4351C]'
                    : opt.key === 'correct'
                      ? 'bg-[#00703C] border-[#00703C]'
                      : 'bg-[#1D70B8] border-[#1D70B8]'
                  : 'bg-white border-[#b1b4b6]'
              }`}
              activeOpacity={0.8}
            >
              <Text className={`text-sm font-bold ${filter === opt.key ? 'text-white' : 'text-[#505a5f]'}`}>
                {opt.label} ({opt.count})
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Question cards */}
        <View className="px-4 pt-2">
          {filtered.length === 0 && (
            <Text className="text-[#505a5f] text-sm text-center mt-6">No questions in this filter</Text>
          )}
          {filtered.map((entry, idx) => {
            const q: Question | undefined = questionMap[entry.questionId];
            if (!q) return null;

            // The question options were shuffled at runtime — we only stored
            // the selectedOptionId (e.g. 'B') and know the correct_answer from
            // the source question. We need to show what the user picked vs what
            // was correct in terms of text, not just the letter.
            // The source question has the original option order, so we find
            // the text by the original correct_answer letter.
            const correctText = q.options.find(o => o.id === q.correct_answer)?.text ?? '';

            // For the user's selected answer: the selectedOptionId is the label
            // (A/B/C/D) *after* shuffle. We don't have the shuffled order stored,
            // only whether it was correct and which label was picked. So we show:
            //   - If correct: they picked the right answer (show the correct text)
            //   - If wrong: show "Incorrect" and always reveal the correct answer
            const userAnswerLabel = entry.correct
              ? `✓ ${correctText}`
              : `✗ Incorrect`;

            return (
              <View
                key={`${entry.questionId}-${idx}`}
                className={`rounded-sm border mb-4 overflow-hidden ${entry.correct ? 'border-[#00703C]' : 'border-[#D4351C]'}`}
              >
                {/* Status strip */}
                <View className={`px-3 py-1.5 flex-row items-center justify-between ${entry.correct ? 'bg-[#e8f5ee]' : 'bg-[#fde8e5]'}`}>
                  <Text className="text-xs uppercase tracking-wide text-[#505a5f] font-bold">{q.category}</Text>
                  <Text className={`text-xs font-bold ${entry.correct ? 'text-[#00703C]' : 'text-[#D4351C]'}`}>
                    {entry.correct ? 'Correct' : 'Incorrect'}
                  </Text>
                </View>

                <View className="bg-white px-4 py-4">
                  {/* Question text */}
                  <Text className="text-sm font-bold text-[#0b0c0c] leading-6 mb-3">
                    {q.question}
                  </Text>

                  {/* Your answer */}
                  <View className={`rounded-sm px-3 py-2 mb-2 ${entry.correct ? 'bg-[#e8f5ee]' : 'bg-[#fde8e5]'}`}>
                    <Text className="text-xs text-[#505a5f] mb-0.5">Your answer</Text>
                    <Text className={`text-sm font-bold ${entry.correct ? 'text-[#00703C]' : 'text-[#D4351C]'}`}>
                      {userAnswerLabel}
                    </Text>
                  </View>

                  {/* Correct answer (always shown when wrong) */}
                  {!entry.correct && (
                    <View className="bg-[#e8f5ee] rounded-sm px-3 py-2 mb-2">
                      <Text className="text-xs text-[#505a5f] mb-0.5">Correct answer</Text>
                      <Text className="text-sm font-bold text-[#00703C]">{correctText}</Text>
                    </View>
                  )}

                  {/* Explanation */}
                  <View className="border-t border-[#f3f2f1] pt-3 mt-1">
                    <Text className="text-xs text-[#505a5f] mb-1">Explanation</Text>
                    <Text className="text-sm text-[#0b0c0c] leading-5">{q.explanation}</Text>
                  </View>
                </View>
              </View>
            );
          })}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
