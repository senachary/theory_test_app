import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useQuiz } from '../../viewmodels/useQuiz';
import { ProgressBar } from '../components/ProgressBar';
import { AnswerOption } from '../components/AnswerOption';
import { CategoryBadge } from '../components/CategoryBadge';
import type { Category } from '../../models/Question';

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60).toString().padStart(2, '0');
  const s = (seconds % 60).toString().padStart(2, '0');
  return `${m}:${s}`;
}

export function QuizScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{
    category: string;
    count: string;
    flaggedOnly?: string;
  }>();

  const category = (params.category ?? 'Mixed') as Category | 'Mixed';
  const count = parseInt(params.count ?? '50', 10);
  const flaggedOnly = params.flaggedOnly === 'true';

  const vm = useQuiz({ category, questionCount: count, flaggedOnly });

  if (vm.questions.length === 0) {
    return (
      <SafeAreaView className="flex-1 bg-[#f3f2f1] items-center justify-center">
        <ActivityIndicator size="large" color="#1D70B8" />
        <Text className="mt-4 text-[#505a5f]">Loading questions…</Text>
      </SafeAreaView>
    );
  }

  if (vm.isComplete && vm.result) {
    const { score, total, passed, durationSeconds } = vm.result;
    const pct = Math.round((score / total) * 100);

    return (
      <SafeAreaView className="flex-1 bg-[#f3f2f1]" edges={['top', 'bottom']}>
        <ScrollView contentContainerClassName="pb-10">
          <View className={`px-4 py-8 ${passed ? 'bg-[#00703C]' : 'bg-[#D4351C]'}`}>
            <Text className="text-white text-3xl font-bold mb-1">
              {vm.timedOut ? 'Time up ⏱' : passed ? 'Pass ✓' : 'Not yet ✗'}
            </Text>
            <Text className="text-white text-base opacity-90">
              {vm.timedOut
                ? 'You ran out of time.'
                : passed
                  ? 'Well done! You met the pass mark.'
                  : 'Keep practising — you\'ll get there.'}
            </Text>
          </View>

          <View className="mx-4 mt-4 bg-white border border-[#b1b4b6] rounded-sm p-6">
            <View className="flex-row justify-around mb-6">
              <View className="items-center">
                <Text className="text-4xl font-bold text-[#0b0c0c]">{score}/{total}</Text>
                <Text className="text-sm text-[#505a5f] mt-1">Score</Text>
              </View>
              <View className="items-center">
                <Text className={`text-4xl font-bold ${passed ? 'text-[#00703C]' : 'text-[#D4351C]'}`}>
                  {pct}%
                </Text>
                <Text className="text-sm text-[#505a5f] mt-1">Percentage</Text>
              </View>
              <View className="items-center">
                <Text className="text-4xl font-bold text-[#0b0c0c]">{formatTime(durationSeconds)}</Text>
                <Text className="text-sm text-[#505a5f] mt-1">Time taken</Text>
              </View>
            </View>

            <View className="bg-[#f3f2f1] rounded-sm p-4 mb-2">
              <Text className="text-sm text-[#505a5f]">Pass mark: 86%</Text>
              <View className="h-2 bg-[#b1b4b6] mt-2 rounded-full overflow-hidden">
                <View
                  className={`h-2 rounded-full ${passed ? 'bg-[#00703C]' : 'bg-[#D4351C]'}`}
                  style={{ width: `${pct}%` }}
                />
              </View>
            </View>
          </View>

          <View className="mx-4 mt-4 gap-y-3">
            <TouchableOpacity
              onPress={vm.restart}
              className="bg-[#00703C] py-4 px-6 rounded-sm"
              activeOpacity={0.85}
            >
              <Text className="text-white font-bold text-base text-center">Try again</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => router.replace('/')}
              className="bg-white border border-[#b1b4b6] py-4 px-6 rounded-sm"
              activeOpacity={0.85}
            >
              <Text className="text-[#0b0c0c] font-bold text-base text-center">Back to home</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => router.push('/progress')}
              className="py-3 px-6"
              activeOpacity={0.85}
            >
              <Text className="text-[#1D70B8] text-base text-center">View progress →</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }

  const q = vm.currentQuestion!;
  const isFlagged = vm.flaggedIds.has(q.id);
  const isWarning = vm.remainingSeconds <= 60;
  const isCritical = vm.remainingSeconds <= 30;

  return (
    <SafeAreaView className="flex-1 bg-[#f3f2f1]" edges={['top', 'bottom']}>
      {/* Top bar */}
      <View className="bg-[#0b0c0c] px-4 py-3 flex-row items-center justify-between">
        <TouchableOpacity onPress={() => router.back()}>
          <Text className="text-white text-base">✕ Quit</Text>
        </TouchableOpacity>

        {/* Countdown timer */}
        <View className={`px-3 py-1 rounded-sm ${isCritical ? 'bg-[#D4351C]' : isWarning ? 'bg-[#FFDD00]' : 'bg-transparent'}`}>
          <Text className={`font-bold text-base tabular-nums ${isCritical ? 'text-white' : isWarning ? 'text-[#0b0c0c]' : 'text-white'}`}>
            ⏱ {formatTime(vm.remainingSeconds)}
          </Text>
        </View>

        <TouchableOpacity onPress={() => vm.toggleFlag(q.id)}>
          <Text className="text-[#FFDD00] text-lg">{isFlagged ? '🚩' : '⚑'}</Text>
        </TouchableOpacity>
      </View>

      {/* Progress */}
      <View className="bg-white px-4 py-3 border-b border-[#b1b4b6]">
        <ProgressBar
          progress={vm.progress}
          current={vm.currentIndex + 1}
          total={vm.questions.length}
        />
        <View className="flex-row items-center justify-between mt-2">
          <Text className="text-sm text-[#505a5f]">Score: {vm.score}</Text>
          <Text className="text-sm text-[#505a5f]">{isFlagged ? '🚩 Flagged' : ''}</Text>
        </View>
      </View>

      <ScrollView className="flex-1 px-4 py-5" contentContainerClassName="pb-6">
        <CategoryBadge category={q.category} />

        <View className="bg-white border border-[#b1b4b6] rounded-sm p-4 mb-4">
          <Text className="text-base font-bold text-[#0b0c0c] leading-7">{q.question}</Text>
          {q.image_url && (
            <Image
              source={{ uri: q.image_url }}
              className="w-full h-48 mt-3 rounded-sm"
              resizeMode="contain"
            />
          )}
        </View>

        {q.options.map(opt => (
          <AnswerOption
            key={opt.id}
            option={opt}
            selectedAnswer={vm.selectedAnswer}
            correctAnswer={q.correct_answer}
            answerState={vm.answerState}
            onSelect={vm.selectAnswer}
          />
        ))}

        {vm.answerState !== 'unanswered' && (
          <View className={`mt-2 p-4 rounded-sm border-l-4 ${
            vm.answerState === 'correct'
              ? 'border-[#00703C] bg-[#e8f5ee]'
              : 'border-[#D4351C] bg-[#fde8e5]'
          }`}>
            <Text className="font-bold text-[#0b0c0c] mb-1">
              {vm.answerState === 'correct' ? '✓ Correct' : '✗ Incorrect'}
            </Text>
            <Text className="text-[#0b0c0c] text-sm leading-6">{q.explanation}</Text>
          </View>
        )}

        {vm.answerState !== 'unanswered' && (
          <TouchableOpacity
            onPress={vm.nextQuestion}
            className="mt-5 bg-[#1D70B8] py-4 px-6 rounded-sm"
            activeOpacity={0.85}
          >
            <Text className="text-white font-bold text-base text-center">
              {vm.currentIndex + 1 >= vm.questions.length ? 'See results' : 'Next question →'}
            </Text>
          </TouchableOpacity>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
