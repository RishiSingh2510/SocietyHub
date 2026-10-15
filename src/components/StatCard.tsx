import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, shadow } from '../theme';

type Props = { label: string; value: string; bg: string; fg?: string; icon?: keyof typeof Ionicons.glyphMap; onPress?: () => void };

export default function StatCard({ label, value, bg, fg = colors.ink, icon, onPress }: Props) {
  return (
    <TouchableOpacity activeOpacity={onPress ? 0.7 : 1} onPress={onPress} style={[{ flex: 1, backgroundColor: bg, borderRadius: 12, padding: 14 }, shadow]}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
        <Text style={{ fontSize: 12, color: colors.mute, fontWeight: '600', flexShrink: 1 }}>{label}</Text>
        {icon && <Ionicons name={icon} size={30} color={fg} />}
      </View>
      <Text style={{ fontSize: 22, fontWeight: '800', color: fg, marginTop: 6 }}>{value}</Text>
    </TouchableOpacity>
  );
}
