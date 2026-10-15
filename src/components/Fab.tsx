import React from 'react';
import { TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme';

export default function Fab({ onPress }: { onPress: () => void }) {
  return (
    <TouchableOpacity onPress={onPress} style={{ position: 'absolute', right: 18, bottom: 84, width: 52, height: 52, borderRadius: 26, backgroundColor: colors.navy, alignItems: 'center', justifyContent: 'center', elevation: 4 }}>
      <Ionicons name="add" size={28} color="#fff" />
    </TouchableOpacity>
  );
}
