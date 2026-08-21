import React from 'react';
import { StyleSheet, Text, View, Pressable } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/types';

type Props = NativeStackScreenProps<RootStackParamList, 'ScanGarment'>;

/**
 * QR scan / product-link paste lands once there's a real curated catalog in
 * Firebase to resolve against (see FIREBASE_SCHEMA.md). Until then, this
 * screen picks straight from the procedural template library so the
 * snap-to-mannequin pipeline has something to demo end-to-end.
 */
const DEMO_GARMENTS: { templateId: string; label: string; color: string }[] = [
  { templateId: 'tshirt', label: 'T-Shirt', color: '#3a6ea5' },
  { templateId: 'pants', label: 'Pants', color: '#2b2b33' },
  { templateId: 'dress', label: 'Dress', color: '#a5486c' },
];

export default function ScanGarmentScreen({ navigation }: Props) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Try a garment</Text>
      <Text style={styles.subtitle}>
        QR / product-link scanning lands once the real catalog is in Firebase — pick a demo item
        for now.
      </Text>

      {DEMO_GARMENTS.map((g) => (
        <Pressable
          key={g.templateId}
          style={styles.button}
          onPress={() => navigation.navigate('TryOn', { templateId: g.templateId, color: g.color })}
        >
          <View style={[styles.swatch, { backgroundColor: g.color }]} />
          <Text style={styles.buttonText}>{g.label}</Text>
        </Pressable>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24, gap: 12 },
  title: { fontSize: 22, fontWeight: '700' },
  subtitle: { fontSize: 13, color: '#666', textAlign: 'center', marginBottom: 12 },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: '#111',
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 10,
    width: '100%',
  },
  swatch: { width: 18, height: 18, borderRadius: 9 },
  buttonText: { color: '#fff', fontWeight: '600', fontSize: 16 },
});
