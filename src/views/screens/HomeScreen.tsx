import { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AppHeader } from '../components/GovHeader';
import { useProgress } from '../../viewmodels/useProgress';
import { ALL_CATEGORIES } from '../../models/Question';
import type { Category } from '../../models/Question';
import { getTotalByCategory, getTimeLimitSeconds } from '../../services/questionService';

const CATEGORY_ICONS: Record<Category | 'Mixed', string> = {
  'Mixed': '🔀',
  'Alertness': '👁️',
  'Attitude': '🤝',
  'Safety and Your Vehicle': '🔧',
  'Safety Margins': '📏',
  'Hazard Awareness': '⚠️',
  'Vulnerable Road Users': '🚶',
  'Other Types of Vehicle': '🚛',
  'Vehicle Handling': '🛞',
  'Motorway Rules': '🛣️',
  'Rules of the Road': '📋',
  'Road and Traffic Signs': '🚦',
  'Documents': '📄',
  'Accidents': '🚨',
  'Vehicle Loading': '📦',
};

const COUNT_OPTIONS = [10, 20, 50] as const;
type CountOption = typeof COUNT_OPTIONS[number];

function formatMinutes(seconds: number): string {
  return `${Math.round(seconds / 60)} min`;
}

export function HomeScreen() {
  const router = useRouter();
  const { progress } = useProgress();
  const [selectedCount, setSelectedCount] = useState<CountOption>(50);

  const passRate = progress && progress.totalTests > 0
    ? Math.round((progress.bestScore / 50) * 100)
    : null;

  const startQuiz = (category: Category | 'Mixed') => {
    router.push({ pathname: '/quiz', params: { category, count: String(selectedCount) } });
  };

  const totalQuestions = getTotalByCategory('Mixed');

  return (
    <SafeAreaView className="flex-1 bg-[#f3f2f1]" edges={['top']}>
      <AppHeader title="UK Theory Test" />

      <ScrollView className="flex-1" contentContainerClassName="pb-8">
        {/* Hero */}
        <View className="bg-[#1D70B8] px-4 py-6">
          <Text className="text-white text-2xl font-bold mb-1">
            Practise your theory test
          </Text>
          <Text className="text-[#b1d2f0] text-base">
            {totalQuestions} questions across all 14 DVSA categories
          </Text>
        </View>

        {/* Stats strip */}
        {progress && progress.totalTests > 0 && (
          <View className="flex-row bg-white border-b border-[#b1b4b6]">
            <View className="flex-1 items-center py-4 border-r border-[#b1b4b6]">
              <Text className="text-2xl font-bold text-[#0b0c0c]">{progress.totalTests}</Text>
              <Text className="text-xs text-[#505a5f] mt-1">Tests taken</Text>
            </View>
            <View className="flex-1 items-center py-4 border-r border-[#b1b4b6]">
              <Text className="text-2xl font-bold text-[#0b0c0c]">{progress.bestScore}</Text>
              <Text className="text-xs text-[#505a5f] mt-1">Best score</Text>
            </View>
            <View className="flex-1 items-center py-4">
              <Text className={`text-2xl font-bold ${passRate && passRate >= 86 ? 'text-[#00703C]' : 'text-[#D4351C]'}`}>
                {passRate ?? '–'}%
              </Text>
              <Text className="text-xs text-[#505a5f] mt-1">Best %</Text>
            </View>
          </View>
        )}

        <View className="px-4 pt-6">

          {/* Question count picker */}
          <Text className="text-lg font-bold text-[#0b0c0c] mb-3">Number of questions</Text>
          <View className="flex-row gap-x-3 mb-6">
            {COUNT_OPTIONS.map(n => {
              const active = selectedCount === n;
              const time = formatMinutes(getTimeLimitSeconds(n));
              return (
                <TouchableOpacity
                  key={n}
                  onPress={() => setSelectedCount(n)}
                  className={`flex-1 py-4 rounded-sm border-2 items-center ${
                    active
                      ? 'bg-[#1D70B8] border-[#1D70B8]'
                      : 'bg-white border-[#b1b4b6]'
                  }`}
                  activeOpacity={0.8}
                >
                  <Text className={`text-xl font-bold ${active ? 'text-white' : 'text-[#0b0c0c]'}`}>
                    {n}
                  </Text>
                  <Text className={`text-xs mt-1 ${active ? 'text-[#b1d2f0]' : 'text-[#505a5f]'}`}>
                    {time}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Quick start */}
          <TouchableOpacity
            onPress={() => startQuiz('Mixed')}
            className="bg-[#00703C] px-6 py-5 mb-4 rounded-sm shadow-sm"
            activeOpacity={0.85}
          >
            <Text className="text-white text-lg font-bold">🔀  Start Mixed Test</Text>
            <Text className="text-[#b8dfca] text-sm mt-1">
              All categories · {selectedCount} questions · {formatMinutes(getTimeLimitSeconds(selectedCount))}
            </Text>
          </TouchableOpacity>

          {/* Flagged review */}
          <TouchableOpacity
            onPress={() => router.push({ pathname: '/quiz', params: { category: 'Mixed', count: String(selectedCount), flaggedOnly: 'true' } })}
            className="bg-[#FFDD00] px-6 py-4 mb-8 rounded-sm shadow-sm"
            activeOpacity={0.85}
          >
            <Text className="text-[#0b0c0c] font-bold text-base">🚩  Review flagged questions</Text>
          </TouchableOpacity>

          {/* Category grid */}
          <Text className="text-lg font-bold text-[#0b0c0c] mb-4">Practise by category</Text>

          <View className="flex-row flex-wrap gap-3">
            {ALL_CATEGORIES.map(cat => {
              const stats = progress?.categoryStats[cat];
              const pct = stats && stats.attempted > 0
                ? Math.round((stats.correct / stats.attempted) * 100)
                : null;
              const total = getTotalByCategory(cat);

              return (
                <TouchableOpacity
                  key={cat}
                  onPress={() => startQuiz(cat)}
                  className="bg-white border border-[#b1b4b6] rounded-sm p-4 shadow-sm"
                  style={{ width: '47%' }}
                  activeOpacity={0.8}
                >
                  <Text className="text-2xl mb-2">{CATEGORY_ICONS[cat]}</Text>
                  <Text className="text-sm font-bold text-[#0b0c0c] leading-5" numberOfLines={2}>
                    {cat}
                  </Text>
                  <Text className="text-xs text-[#505a5f] mt-1">{total} questions</Text>
                  {pct !== null && (
                    <Text className={`text-xs mt-1 font-bold ${pct >= 86 ? 'text-[#00703C]' : 'text-[#D4351C]'}`}>
                      {pct}% correct
                    </Text>
                  )}
                </TouchableOpacity>
              );
            })}
          </View>

          <TouchableOpacity
            onPress={() => router.push('/progress')}
            className="mt-8 border-b border-[#1D70B8] self-start"
          >
            <Text className="text-[#1D70B8] text-base">View full progress →</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
