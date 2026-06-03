import React from 'react';
import { TouchableOpacity, Text, View } from 'react-native';
import type { AnswerOption as AnswerOptionModel } from '../../models/Question';
import type { AnswerState } from '../../viewmodels/useQuiz';

type Props = {
  option: AnswerOptionModel;
  selectedAnswer: string | null;
  correctAnswer: string;
  answerState: AnswerState;
  onSelect: (id: string) => void;
};

export function AnswerOption({ option, selectedAnswer, correctAnswer, answerState, onSelect }: Props) {
  const isSelected = selectedAnswer === option.id;
  const isCorrect = option.id === correctAnswer;
  const isAnswered = answerState !== 'unanswered';

  let containerClass = 'border-2 border-[#b1b4b6] bg-white';
  let labelClass = 'bg-[#f3f2f1] border-r-2 border-[#b1b4b6]';
  let textClass = 'text-[#0b0c0c]';

  if (isAnswered) {
    if (isCorrect) {
      containerClass = 'border-2 border-[#00703C] bg-[#e8f5ee]';
      labelClass = 'bg-[#00703C] border-r-2 border-[#00703C]';
      textClass = 'text-[#0b0c0c]';
    } else if (isSelected && !isCorrect) {
      containerClass = 'border-2 border-[#D4351C] bg-[#fde8e5]';
      labelClass = 'bg-[#D4351C] border-r-2 border-[#D4351C]';
      textClass = 'text-[#0b0c0c]';
    }
  } else if (isSelected) {
    containerClass = 'border-2 border-[#1D70B8] bg-[#e8f0fb]';
    labelClass = 'bg-[#1D70B8] border-r-2 border-[#1D70B8]';
  }

  return (
    <TouchableOpacity
      onPress={() => onSelect(option.id)}
      disabled={isAnswered}
      activeOpacity={0.8}
      className={`flex-row items-stretch mb-3 ${containerClass} rounded-sm overflow-hidden`}
    >
      <View className={`w-12 items-center justify-center py-4 ${labelClass}`}>
        <Text className={`font-bold text-base ${isAnswered && (isCorrect || isSelected) ? 'text-white' : 'text-[#0b0c0c]'}`}>
          {option.id}
        </Text>
      </View>
      <View className="flex-1 px-4 py-4 justify-center">
        <Text className={`text-base leading-6 ${textClass}`}>{option.text}</Text>
      </View>
      {isAnswered && isCorrect && (
        <View className="w-10 items-center justify-center pr-2">
          <Text className="text-[#00703C] text-xl font-bold">✓</Text>
        </View>
      )}
      {isAnswered && isSelected && !isCorrect && (
        <View className="w-10 items-center justify-center pr-2">
          <Text className="text-[#D4351C] text-xl font-bold">✗</Text>
        </View>
      )}
    </TouchableOpacity>
  );
}
