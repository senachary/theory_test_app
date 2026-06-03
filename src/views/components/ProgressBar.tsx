import React from 'react';
import { View, Text } from 'react-native';

type Props = {
  progress: number; // 0–1
  current: number;
  total: number;
};

export function ProgressBar({ progress, current, total }: Props) {
  const pct = Math.round(progress * 100);
  return (
    <View className="w-full">
      <View className="flex-row justify-between mb-1">
        <Text className="text-sm text-[#505a5f]">
          Question {current} of {total}
        </Text>
        <Text className="text-sm text-[#505a5f]">{pct}%</Text>
      </View>
      <View className="h-2 bg-[#b1b4b6] w-full rounded-full overflow-hidden">
        <View
          className="h-2 bg-[#1D70B8] rounded-full"
          style={{ width: `${pct}%` }}
        />
      </View>
    </View>
  );
}
