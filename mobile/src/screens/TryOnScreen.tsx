import React from 'react';
import { StyleSheet, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/types';
import { useAppState } from '../state/AppState';
import MannequinScene from '../components/three/MannequinScene';

type Props = NativeStackScreenProps<RootStackParamList, 'TryOn'>;

export default function TryOnScreen({ route }: Props) {
  const { measurements, skinTone } = useAppState();
  const { templateId, color } = route.params;

  return (
    <View style={styles.container}>
      <MannequinScene
        measurements={measurements}
        skinHex={skinTone.hex}
        garmentTemplateId={templateId}
        garmentColor={color}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f2f2f2' },
});
