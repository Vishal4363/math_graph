import React from 'react';
import { View, ScrollView, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { Equation } from '@mathgraph/core';

interface Props {
  equations: Equation[];
  onRemove: (id: string) => void;
}

export default function EquationTags({ equations, onRemove }: Props) {
  if (equations.length === 0) return null;

  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.scroll} contentContainerStyle={styles.container}>
      {equations.map(eq => (
        <View key={eq.id} style={[styles.tag, { borderColor: eq.color + '55', backgroundColor: eq.color + '22' }]}>
          <Text style={[styles.label, { color: eq.color }]}>{eq.expression}</Text>
          <TouchableOpacity onPress={() => onRemove(eq.id)}>
            <Text style={[styles.close, { color: eq.color }]}>✕</Text>
          </TouchableOpacity>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: { marginBottom: 10 },
  container: { flexDirection: 'row', gap: 8, paddingHorizontal: 2 },
  tag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    borderWidth: 1,
  },
  label: { fontSize: 13 },
  close: { fontSize: 13, opacity: 0.7 },
});