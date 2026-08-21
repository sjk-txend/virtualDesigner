import React from 'react';
import { ScrollView, StyleSheet, Text, View, Pressable } from 'react-native';
import Slider from '@react-native-community/slider';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/types';
import { useAppState } from '../state/AppState';
import { MEASUREMENT_RANGES, Measurements, SKIN_TONES } from '../types';
import MannequinScene from '../components/three/MannequinScene';

type Props = NativeStackScreenProps<RootStackParamList, 'Measurements'>;

const FIELD_LABELS: Record<keyof Measurements, string> = {
  height: 'Height',
  chest: 'Chest',
  waist: 'Waist',
  hips: 'Hips',
};

export default function MeasurementsScreen({ navigation }: Props) {
  const { measurements, setMeasurements, skinTone, setSkinTone } = useAppState();

  const updateField = (field: keyof Measurements, value: number) => {
    setMeasurements({ ...measurements, [field]: Math.round(value) });
  };

  return (
    <View style={styles.container}>
      <View style={styles.previewWrap}>
        <MannequinScene measurements={measurements} skinHex={skinTone.hex} />
      </View>

      <ScrollView style={styles.controls} contentContainerStyle={{ paddingBottom: 32 }}>
        {(Object.keys(FIELD_LABELS) as (keyof Measurements)[]).map((field) => {
          const range = MEASUREMENT_RANGES[field];
          return (
            <View key={field} style={styles.sliderRow}>
              <Text style={styles.sliderLabel}>
                {FIELD_LABELS[field]}: {measurements[field]} cm
              </Text>
              <Slider
                minimumValue={range.min}
                maximumValue={range.max}
                step={1}
                value={measurements[field]}
                onValueChange={(v) => updateField(field, v)}
                minimumTrackTintColor="#111"
              />
            </View>
          );
        })}

        <Text style={styles.sectionTitle}>Skin tone</Text>
        <View style={styles.swatchRow}>
          {SKIN_TONES.map((tone) => (
            <Pressable
              key={tone.id}
              onPress={() => setSkinTone(tone)}
              style={[
                styles.swatch,
                { backgroundColor: tone.hex },
                skinTone.id === tone.id && styles.swatchSelected,
              ]}
            />
          ))}
        </View>

        <Pressable style={styles.button} onPress={() => navigation.navigate('ScanGarment')}>
          <Text style={styles.buttonText}>Continue to try-on</Text>
        </Pressable>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  previewWrap: { height: '45%', backgroundColor: '#f2f2f2' },
  controls: { flex: 1, padding: 20 },
  sliderRow: { marginBottom: 18 },
  sliderLabel: { fontSize: 14, fontWeight: '600', marginBottom: 4 },
  sectionTitle: { fontSize: 16, fontWeight: '700', marginTop: 8, marginBottom: 10 },
  swatchRow: { flexDirection: 'row', gap: 10, marginBottom: 24 },
  swatch: {
    width: 34,
    height: 34,
    borderRadius: 17,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  swatchSelected: { borderColor: '#111' },
  button: { backgroundColor: '#111', paddingVertical: 14, borderRadius: 10 },
  buttonText: { color: '#fff', fontWeight: '600', textAlign: 'center', fontSize: 16 },
});
