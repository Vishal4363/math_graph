import React from 'react';
import { ScrollView, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { PRESETS } from '@mathgraph/core';

interface Props {
  onSelect: (expression: string) => void;
}

export default function PresetBar({ onSelect }: Props) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      style={styles.scroll}
      contentContainerStyle={styles.container}
    >
      {PRESETS.map(preset => (
        <TouchableOpacity
          key={preset.expression}
          onPress={() => onSelect(preset.expression)}
          style={styles.btn}
          activeOpacity={0.7}
        >
          <Text style={styles.label}>{preset.label}</Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: { flexGrow: 0 },
  container: {
    flexDirection: 'row',
    gap: 8,
    paddingHorizontal: 2,
    paddingVertical: 2,
  },
  btn: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#111827',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#1e2d45',
  },
  label: {
    color: '#7a9cc8',
    fontSize: 13,
    fontWeight: '500',
  },
});