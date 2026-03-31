import React from 'react';
import { View, Text, StyleSheet, StatusBar, SafeAreaView } from 'react-native';
import MathGraph from '../components/MathGraph';

export default function HomeScreen() {
  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" backgroundColor="#0a0d14" />
      <View style={styles.screen}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>MathGraph</Text>
          <Text style={styles.subtitle}>Visualize equations instantly</Text>
        </View>

        {/* Main graph component */}
        <MathGraph />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#0a0d14',
  },
  screen: {
    flex: 1,
    backgroundColor: '#0a0d14',
  },
  header: {
    paddingTop: 12,
    paddingBottom: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#151c2c',
  },
  title: {
    color: '#e2e8f0',
    fontSize: 22,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  subtitle: {
    color: '#4a6080',
    fontSize: 12,
    marginTop: 2,
  },
});