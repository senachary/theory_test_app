import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';

type Props = {
  title: string;
  showBack?: boolean;
};

export function AppHeader({ title, showBack = false }: Props) {
  const router = useRouter();
  return (
    <View className="bg-[#0b0c0c] px-4 py-4">
      <View className="flex-row items-center">
        {showBack && (
          <TouchableOpacity onPress={() => router.back()} className="mr-3 pr-3 border-r border-[#505a5f]">
            <Text className="text-white text-lg">‹</Text>
          </TouchableOpacity>
        )}
        <Text className="text-white text-xl font-bold">{title}</Text>
      </View>
    </View>
  );
}

// keep old name working during transition
export { AppHeader as GovHeader };
