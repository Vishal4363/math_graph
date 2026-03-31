import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';

export default function ZoomControls({ onZoomIn, onZoomOut, onReset }) {
  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={onZoomIn} style={styles.btn}>
        <Text style={styles.label}>+</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={onZoomOut} style={styles.btn}>
        <Text style={styles.label}>-</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={onReset} style={styles.btn}>
        <Text style={styles.label}>R</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { position: 'absolute', top: 10, right: 10, gap: 6 },
  btn: { width: 36, height: 36, backgroundColor: '#1e2433', borderRadius: 8, borderWidth: 1, borderColor: '#2d3748', alignItems: 'center', justifyContent: 'center' },
  label: { color: '#a0aec0', fontSize: 18 },
});
