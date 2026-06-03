import React from 'react';
import { View, Text } from 'react-native';
import type { Category } from '../../models/Question';

type Props = {
  category: Category | 'Mixed';
};

const categoryColours: Record<string, string> = {
  'Alertness': '#1D70B8',
  'Attitude': '#4c2c92',
  'Safety and Your Vehicle': '#005EA5',
  'Safety Margins': '#d4351c',
  'Hazard Awareness': '#f47738',
  'Vulnerable Road Users': '#00703C',
  'Other Types of Vehicle': '#912b88',
  'Vehicle Handling': '#28a197',
  'Motorway Rules': '#003078',
  'Rules of the Road': '#0b0c0c',
  'Road and Traffic Signs': '#d4351c',
  'Documents': '#505a5f',
  'Accidents': '#d4351c',
  'Vehicle Loading': '#85994b',
  'Mixed': '#1D70B8',
};

export function CategoryBadge({ category }: Props) {
  const colour = categoryColours[category] ?? '#505a5f';
  return (
    <View className="self-start px-2 py-1 rounded-sm mb-2" style={{ backgroundColor: colour }}>
      <Text className="text-white text-xs font-bold uppercase tracking-wide">
        {category}
      </Text>
    </View>
  );
}
