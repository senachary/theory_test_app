import { View, Text, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { AppHeader } from '../components/GovHeader';
import { useProgress } from '../../viewmodels/useProgress';
import { ALL_CATEGORIES } from '../../models/Question';

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

export function ProgressScreen() {
  const router = useRouter();
  const { progress, isLoading, reset } = useProgress();

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

  return (
    <SafeAreaView className="flex-1 bg-[#f3f2f1]" edges={['top']}>
      <AppHeader title="Your Progress" showBack />
      <ScrollView className="flex-1" contentContainerClassName="pb-10">

        {/* Overall stats */}
        <View className="flex-row bg-white border-b border-[#b1b4b6]">
          <View className="flex-1 items-center py-5 border-r border-[#b1b4b6]">
            <Text className="text-3xl font-bold text-[#0b0c0c]">{progress.totalTests}</Text>
            <Text className="text-xs text-[#505a5f] mt-1">Total tests</Text>
          </View>
          <View className="flex-1 items-center py-5">
            <Text className="text-3xl font-bold text-[#0b0c0c]">{progress.bestScore}</Text>
            <Text className="text-xs text-[#505a5f] mt-1">Best score</Text>
          </View>
        </View>

        {/* Category breakdown */}
        <View className="px-4 pt-6">
          <Text className="text-lg font-bold text-[#0b0c0c] mb-4">Category breakdown</Text>

          {ALL_CATEGORIES.map(cat => {
            const stats = progress.categoryStats[cat];
            const pct = stats.attempted > 0
              ? Math.round((stats.correct / stats.attempted) * 100)
              : null;
            const isGood = pct !== null && pct >= 86;

            return (
              <View key={cat} className="bg-white border border-[#b1b4b6] rounded-sm px-4 py-4 mb-3">
                <View className="flex-row items-center justify-between mb-2">
                  <Text className="text-sm font-bold text-[#0b0c0c] flex-1 mr-2" numberOfLines={1}>
                    {cat}
                  </Text>
                  <Text className={`text-sm font-bold ${pct === null ? 'text-[#b1b4b6]' : isGood ? 'text-[#00703C]' : 'text-[#D4351C]'}`}>
                    {pct !== null ? `${pct}%` : 'Not attempted'}
                  </Text>
                </View>
                {pct !== null && (
                  <View className="h-2 bg-[#e8e8e8] rounded-full overflow-hidden">
                    <View
                      className={`h-2 rounded-full ${isGood ? 'bg-[#00703C]' : 'bg-[#D4351C]'}`}
                      style={{ width: `${pct}%` }}
                    />
                  </View>
                )}
                {stats.attempted > 0 && (
                  <Text className="text-xs text-[#505a5f] mt-1">
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
        </View>

        {/* Recent results */}
        {progress.recentResults.length > 0 && (
          <View className="px-4 pt-4">
            <Text className="text-lg font-bold text-[#0b0c0c] mb-4">Recent tests</Text>
            {progress.recentResults.map(r => (
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
            ))}
          </View>
        )}

        {/* Reset */}
        <View className="px-4 mt-6">
          <TouchableOpacity
            onPress={handleReset}
            className="border border-[#D4351C] py-4 px-6 rounded-sm"
            activeOpacity={0.85}
          >
            <Text className="text-[#D4351C] font-bold text-base text-center">Reset all progress</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
