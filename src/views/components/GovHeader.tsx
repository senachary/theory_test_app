import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';

type Props = {
  title: string;
  showBack?: boolean;
};

export function GovHeader({ title, showBack = false }: Props) {
  const router = useRouter();
  return (
    <View className="bg-[#0b0c0c] px-4 py-4">
      {/* GOV.UK crown bar */}
      <View className="flex-row items-center justify-between">
        <View className="flex-row items-center gap-x-3">
          {showBack && (
            <TouchableOpacity onPress={() => router.back()} className="mr-3 pr-3 border-r border-[#505a5f]">
              <Text className="text-white text-lg">‹</Text>
            </TouchableOpacity>
          )}
          <Text className="text-[#FFDD00] text-xs font-bold uppercase tracking-widest">GOV.UK</Text>
        </View>
      </View>
      <Text className="text-white text-xl font-bold mt-2">{title}</Text>
    </View>
  );
}
