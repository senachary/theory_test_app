import { useState, useMemo, useEffect, useCallback } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity,
  TextInput, Modal, Alert,
} from 'react-native';
import { Image } from 'expo-image';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AppHeader } from '../components/GovHeader';
import roadSigns, { ALL_SIGN_CATEGORIES } from '../../data/roadSigns';
import type { RoadSign, SignCategory } from '../../data/roadSigns';

const REPORTED_KEY = 'reported_sign_images';

const CATEGORY_ICONS: Record<SignCategory, string> = {
  'Warning': '⚠️',
  'Regulatory — Give Way & Priority': '🛑',
  'Regulatory — Speed Limits': '🔢',
  'Regulatory — Prohibitions': '🚫',
  'Regulatory — Mandatory Directions': '🔵',
  'Information & Direction': 'ℹ️',
};

function useReportedSigns() {
  const [reported, setReported] = useState<Set<string>>(new Set());

  useEffect(() => {
    AsyncStorage.getItem(REPORTED_KEY).then(raw => {
      if (raw) setReported(new Set(JSON.parse(raw)));
    });
  }, []);

  const toggle = useCallback(async (id: string) => {
    setReported(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      AsyncStorage.setItem(REPORTED_KEY, JSON.stringify([...next]));
      return next;
    });
  }, []);

  return { reported, toggle };
}

export function SignsScreen() {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<SignCategory | 'All'>('All');
  const [selectedSign, setSelectedSign] = useState<RoadSign | null>(null);
  const { reported, toggle } = useReportedSigns();

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim();
    return roadSigns.filter(sign => {
      const matchesCategory = selectedCategory === 'All' || sign.category === selectedCategory;
      const matchesSearch = !q
        || sign.name.toLowerCase().includes(q)
        || sign.description.toLowerCase().includes(q)
        || (sign.keyFact?.toLowerCase().includes(q) ?? false);
      return matchesCategory && matchesSearch;
    });
  }, [search, selectedCategory]);

  const groupedByCategory = useMemo(() => {
    if (selectedCategory !== 'All') return null;
    const groups: Record<string, RoadSign[]> = {};
    for (const sign of filtered) {
      if (!groups[sign.category]) groups[sign.category] = [];
      groups[sign.category].push(sign);
    }
    return groups;
  }, [filtered, selectedCategory]);

  const reportedCount = reported.size;

  return (
    <SafeAreaView className="flex-1 bg-[#f3f2f1]" edges={['top']}>
      <AppHeader title="Road Signs" showBack />

      {/* Search bar */}
      <View className="bg-white px-4 py-3 border-b border-[#b1b4b6]">
        <View className="bg-[#f3f2f1] border border-[#b1b4b6] rounded-sm px-3 py-2 flex-row items-center">
          <Text className="text-[#505a5f] mr-2">🔍</Text>
          <TextInput
            value={search}
            onChangeText={setSearch}
            placeholder="Search signs..."
            placeholderTextColor="#505a5f"
            className="flex-1 text-sm text-[#0b0c0c]"
            autoCorrect={false}
          />
          {search.length > 0 && (
            <TouchableOpacity onPress={() => setSearch('')}>
              <Text className="text-[#505a5f] text-base ml-2">✕</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Category filter pills */}
      <View className="bg-white border-b border-[#b1b4b6]">
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerClassName="px-4 py-2 gap-x-2">
          {(['All', ...ALL_SIGN_CATEGORIES] as Array<SignCategory | 'All'>).map(cat => {
            const active = selectedCategory === cat;
            const icon = cat === 'All' ? '📋' : CATEGORY_ICONS[cat];
            const label = cat === 'All' ? 'All' : cat.replace('Regulatory — ', '');
            return (
              <TouchableOpacity
                key={cat}
                onPress={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-full border mr-1 flex-row items-center ${
                  active ? 'bg-[#1D70B8] border-[#1D70B8]' : 'bg-white border-[#b1b4b6]'
                }`}
                activeOpacity={0.8}
              >
                <Text className="text-sm mr-1">{icon}</Text>
                <Text className={`text-xs font-bold ${active ? 'text-white' : 'text-[#505a5f]'}`}>
                  {label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* Results count + reported count */}
      <View className="px-4 py-2 flex-row items-center justify-between">
        <Text className="text-xs text-[#505a5f]">
          {filtered.length} sign{filtered.length !== 1 ? 's' : ''}
          {search ? ` matching "${search}"` : ''}
        </Text>
        {reportedCount > 0 && (
          <Text className="text-xs text-[#D4351C] font-bold">
            ⚑ {reportedCount} flagged as wrong
          </Text>
        )}
      </View>

      <ScrollView className="flex-1" contentContainerClassName="pb-8 px-4">
        {groupedByCategory
          ? ALL_SIGN_CATEGORIES.map(cat => {
              const signs = groupedByCategory[cat];
              if (!signs || signs.length === 0) return null;
              return (
                <View key={cat} className="mb-6">
                  <View className="flex-row items-center mb-3">
                    <Text className="text-base mr-2">{CATEGORY_ICONS[cat]}</Text>
                    <Text className="text-base font-bold text-[#0b0c0c]">{cat}</Text>
                    <Text className="text-xs text-[#505a5f] ml-2">({signs.length})</Text>
                  </View>
                  <SignGrid signs={signs} reported={reported} onPress={setSelectedSign} onReport={toggle} />
                </View>
              );
            })
          : <SignGrid signs={filtered} reported={reported} onPress={setSelectedSign} onReport={toggle} />
        }

        {filtered.length === 0 && (
          <View className="items-center py-16">
            <Text className="text-4xl mb-3">🔍</Text>
            <Text className="text-[#505a5f] text-sm">No signs found for "{search}"</Text>
          </View>
        )}
      </ScrollView>

      {/* Sign detail modal */}
      <Modal
        visible={selectedSign !== null}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setSelectedSign(null)}
      >
        {selectedSign && (
          <SignDetailModal
            sign={selectedSign}
            isReported={reported.has(selectedSign.id)}
            onReport={toggle}
            onClose={() => setSelectedSign(null)}
          />
        )}
      </Modal>
    </SafeAreaView>
  );
}

// ── Sub-components ─────────────────────────────────────────────────────────────

function SignGrid({
  signs, reported, onPress, onReport,
}: {
  signs: RoadSign[];
  reported: Set<string>;
  onPress: (s: RoadSign) => void;
  onReport: (id: string) => void;
}) {
  return (
    <View className="flex-row flex-wrap gap-3">
      {signs.map(sign => {
        const isReported = reported.has(sign.id);
        return (
          <TouchableOpacity
            key={sign.id}
            onPress={() => onPress(sign)}
            className={`bg-white rounded-sm p-3 items-center border ${isReported ? 'border-[#D4351C]' : 'border-[#b1b4b6]'}`}
            style={{ width: '30%' }}
            activeOpacity={0.8}
          >
            <View className="relative">
              <Image
                source={{ uri: sign.imageUrl }}
                style={{ width: 64, height: 64 }}
                contentFit="contain"
              />
              {/* Flag button — top-right corner of image */}
              <TouchableOpacity
                onPress={() => {
                  onReport(sign.id);
                }}
                hitSlop={{ top: 6, right: 6, bottom: 6, left: 6 }}
                className={`absolute -top-1 -right-1 w-5 h-5 rounded-full items-center justify-center ${isReported ? 'bg-[#D4351C]' : 'bg-[#b1b4b6]'}`}
              >
                <Text style={{ fontSize: 9, color: 'white', lineHeight: 12 }}>⚑</Text>
              </TouchableOpacity>
            </View>
            <Text
              className="text-xs text-center text-[#0b0c0c] mt-2 leading-4"
              numberOfLines={2}
            >
              {sign.name}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

function SignDetailModal({
  sign, isReported, onReport, onClose,
}: {
  sign: RoadSign;
  isReported: boolean;
  onReport: (id: string) => void;
  onClose: () => void;
}) {
  const handleReport = () => {
    if (isReported) {
      Alert.alert('Remove flag', 'Mark this image as correct?', [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Remove flag', onPress: () => onReport(sign.id) },
      ]);
    } else {
      Alert.alert(
        'Wrong image?',
        `Flag "${sign.name}" as showing the wrong sign?`,
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Yes, flag it',
            style: 'destructive',
            onPress: () => { onReport(sign.id); },
          },
        ]
      );
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-[#f3f2f1]" edges={['top']}>
      <View className="bg-[#0b0c0c] px-4 py-4 flex-row items-center justify-between">
        <Text className="text-white text-base font-bold flex-1 mr-4" numberOfLines={1}>
          {sign.name}
        </Text>
        <TouchableOpacity onPress={onClose}>
          <Text className="text-white text-base">✕ Close</Text>
        </TouchableOpacity>
      </View>

      <ScrollView className="flex-1" contentContainerClassName="pb-10">
        {/* Sign image + report button */}
        <View className="bg-white items-center py-8 border-b border-[#b1b4b6]">
          <Image
            source={{ uri: sign.imageUrl }}
            style={{ width: 160, height: 160 }}
            contentFit="contain"
          />
          <TouchableOpacity
            onPress={handleReport}
            className={`mt-4 px-4 py-2 rounded-full border flex-row items-center gap-x-1 ${
              isReported ? 'border-[#D4351C] bg-[#fde8e5]' : 'border-[#b1b4b6] bg-white'
            }`}
            activeOpacity={0.8}
          >
            <Text className={`text-xs font-bold ${isReported ? 'text-[#D4351C]' : 'text-[#505a5f]'}`}>
              {isReported ? '⚑ Flagged as wrong' : '⚑ Wrong image?'}
            </Text>
          </TouchableOpacity>
        </View>

        <View className="px-4 pt-5">
          <View className="self-start bg-[#1D70B8] px-3 py-1 rounded-sm mb-4">
            <Text className="text-white text-xs font-bold">
              {CATEGORY_ICONS[sign.category]} {sign.category}
            </Text>
          </View>

          <View className="bg-white border border-[#b1b4b6] rounded-sm p-4 mb-3">
            <Text className="text-xs font-bold text-[#505a5f] uppercase tracking-wide mb-2">
              What it means
            </Text>
            <Text className="text-base text-[#0b0c0c] leading-6">{sign.description}</Text>
          </View>

          {sign.keyFact && (
            <View className="bg-[#e8f0fb] border border-[#1D70B8] border-l-4 rounded-sm p-4 mb-3">
              <Text className="text-xs font-bold text-[#1D70B8] uppercase tracking-wide mb-2">
                Key fact for the test
              </Text>
              <Text className="text-sm text-[#0b0c0c] leading-6">{sign.keyFact}</Text>
            </View>
          )}

          <View className="bg-white border border-[#b1b4b6] rounded-sm p-4">
            <Text className="text-xs font-bold text-[#505a5f] uppercase tracking-wide mb-2">
              Quick reference
            </Text>
            {sign.category === 'Warning' && (
              <Text className="text-sm text-[#0b0c0c] leading-6">
                ▲ Red triangle — warns of a hazard ahead. Always triangular with a red border on white.
              </Text>
            )}
            {sign.category === 'Regulatory — Prohibitions' && (
              <Text className="text-sm text-[#0b0c0c] leading-6">
                ⭕ Red circle — something is prohibited. These are mandatory and must be obeyed.
              </Text>
            )}
            {sign.category === 'Regulatory — Mandatory Directions' && (
              <Text className="text-sm text-[#0b0c0c] leading-6">
                🔵 Blue circle — a positive instruction you must follow.
              </Text>
            )}
            {sign.category === 'Regulatory — Speed Limits' && (
              <Text className="text-sm text-[#0b0c0c] leading-6">
                🔴 Red circle with a number — a mandatory maximum speed limit.
              </Text>
            )}
            {sign.category === 'Regulatory — Give Way & Priority' && (
              <Text className="text-sm text-[#0b0c0c] leading-6">
                Priority signs determine who goes first at junctions and narrow sections.
              </Text>
            )}
            {sign.category === 'Information & Direction' && (
              <Text className="text-sm text-[#0b0c0c] leading-6">
                ℹ️ Information signs are generally rectangular. Motorway = blue, primary route = green, local = white.
              </Text>
            )}
          </View>

          {/* ID + URL for debugging flagged signs */}
          {isReported && (
            <View className="mt-3 bg-[#fde8e5] border border-[#D4351C] rounded-sm p-3">
              <Text className="text-xs font-bold text-[#D4351C] mb-1">Flagged for review</Text>
              <Text className="text-xs text-[#505a5f] font-mono" selectable>{sign.id}</Text>
              <Text className="text-xs text-[#505a5f] font-mono mt-1" selectable numberOfLines={2}>
                {sign.imageUrl}
              </Text>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
