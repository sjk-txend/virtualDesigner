import React from 'react';
import { StyleSheet, View } from 'react-native';
import { useAppState } from '../state/AppState';
import MannequinScene from '../components/three/MannequinScene';

export default function ViewerScreen() {
  const { measurements, skinTone } = useAppState();

  return (
    <View style={styles.container}>
      <MannequinScene measurements={measurements} skinHex={skinTone.hex} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f2f2f2' },
});
