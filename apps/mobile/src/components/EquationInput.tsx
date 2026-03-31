import React from 'react';
import { View, TextInput, TouchableOpacity, Text, StyleSheet } from 'react-native';

interface Props {
  value: string;
  onChange: (val: string) => void;
  onPlot: () => void;
  error: string | null;
}

export default function EquationInput({ value, onChange, onPlot, error }: Props) {
  return (
    <View style={styles.wrapper}>
      <View style={styles.row}>
        <View style={styles.inputWrapper}>
          <Text style={styles.prefix}>f(x) =</Text>
          <TextInput
            value={value}
            onChangeText={onChange}
            onSubmitEditing={onPlot}
            placeholder="x^2, sin(x), 2x+1 …"
            placeholderTextColor="#2d3d58"
            style={styles.input}
            autoCapitalize="none"
            autoCorrect={false}
            returnKeyType="done"
          />
        </View>
        <TouchableOpacity
          onPress={onPlot}
          style={[styles.btn, !value.trim() && styles.btnDisabled]}
          activeOpacity={0.75}
          disabled={!value.trim()}
        >
          <Text style={styles.btnText}>Plot</Text>
        </TouchableOpacity>
      </View>
      {error ? (
        <View style={styles.errorRow}>
          <Text style={styles.errorIcon}>⚠</Text>
          <Text style={styles.error}>{error}</Text>
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    gap: 6,
  },
  row: {
    flexDirection: 'row',
    gap: 8,
  },
  inputWrapper: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#111827',
    borderWidth: 1,
    borderColor: '#1e2d45',
    borderRadius: 10,
    paddingHorizontal: 12,
  },
  prefix: {
    color: '#3d5c8a',
    fontSize: 14,
    fontWeight: '500',
    marginRight: 8,
  },
  input: {
    flex: 1,
    paddingVertical: 11,
    color: '#c8d8f0',
    fontSize: 15,
    fontFamily: 'monospace',
  },
  btn: {
    backgroundColor: '#2563eb',
    borderRadius: 10,
    paddingHorizontal: 22,
    justifyContent: 'center',
    shadowColor: '#2563eb',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.4,
    shadowRadius: 6,
    elevation: 4,
  },
  btnDisabled: {
    backgroundColor: '#1a2540',
    shadowOpacity: 0,
    elevation: 0,
  },
  btnText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '600',
  },
  errorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  errorIcon: {
    color: '#f87171',
    fontSize: 12,
  },
  error: {
    color: '#f87171',
    fontSize: 12,
  },
});