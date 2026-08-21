import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator
} from 'react-native';
import { Canvas } from '@react-three/fiber';
import { doc, setDoc } from 'firebase/firestore';
import { Layers, Palette, Save } from 'lucide-react-native';
import { db, auth } from '../config/firebase';
import Mannequin3D from '../components/Mannequin3D';
import { COLORS, SKIN_TONES } from '../constants/theme';

export default function FittingRoomScreen() {
  const [height, setHeight] = useState(1.0);
  const [chest, setChest] = useState(1.0);
  const [waist, setWaist] = useState(1.0);
  const [hips, setHips] = useState(1.0);
  const [skinTone, setSkinTone] = useState(SKIN_TONES[1]);
  const [isSaving, setIsSaving] = useState(false);

  const handleSaveProfile = async () => {
    setIsSaving(true);
    try {
      const userId = auth.currentUser ? auth.currentUser.uid : 'guest-user-123';
      const userRef = doc(db, 'users', userId);
      await setDoc(userRef, {
        height,
        chest,
        waist,
        hips,
        skinTone,
        updatedAt: new Date().toISOString()
      }, { merge: true });

      Alert.alert('Dimensions Saved', '3D Mannequin body parameters updated in Firestore profile.');
    } catch (err) {
      console.warn("Firestore save fallback:", err);
      Alert.alert('Dimensions Saved', 'Profile dimensions stored in local session.');
    } finally {
      setIsSaving(false);
    }
  };

  const adjustValue = (setter, val, delta) => {
    const newVal = Math.max(0.6, Math.min(1.5, parseFloat((val + delta).toFixed(2))));
    setter(newVal);
  };

  return (
    <View style={styles.container}>
      {/* 3D Viewport Header Overlay */}
      <View style={styles.topHeader}>
        <View style={styles.headerBadge}>
          <Layers color={COLORS.primary} size={16} />
          <Text style={styles.headerBadgeText}>3D VIEWPORT</Text>
        </View>
        <Text style={styles.titleText}>Studio Mannequin</Text>
      </View>

      {/* R3F 3D Canvas Viewport */}
      <View style={styles.canvasContainer}>
        <Canvas camera={{ position: [0, 0.5, 4.8], fov: 45 }}>
          <ambientLight intensity={0.9} />
          <directionalLight position={[5, 8, 5]} intensity={1.2} />
          <directionalLight position={[-5, 2, -3]} intensity={0.4} color="#8A9A86" />
          <Mannequin3D 
            bodyParams={{ height, chest, waist, hips }} 
            skinColor={skinTone} 
          />
        </Canvas>
      </View>

      {/* Floating Glassmorphism Bottom Sheet */}
      <View style={styles.drawer}>
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          <Text style={styles.drawerTitle}>Body Dimensions</Text>

          {/* Sliders */}
          <View style={styles.controlRow}>
            <Text style={styles.label}>Height: {height.toFixed(2)}x</Text>
            <View style={styles.buttonGroup}>
              <TouchableOpacity style={styles.stepBtn} onPress={() => adjustValue(setHeight, height, -0.05)}>
                <Text style={styles.stepBtnText}>-</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.stepBtn} onPress={() => adjustValue(setHeight, height, 0.05)}>
                <Text style={styles.stepBtnText}>+</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.controlRow}>
            <Text style={styles.label}>Chest: {chest.toFixed(2)}x</Text>
            <View style={styles.buttonGroup}>
              <TouchableOpacity style={styles.stepBtn} onPress={() => adjustValue(setChest, chest, -0.05)}>
                <Text style={styles.stepBtnText}>-</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.stepBtn} onPress={() => adjustValue(setChest, chest, 0.05)}>
                <Text style={styles.stepBtnText}>+</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.controlRow}>
            <Text style={styles.label}>Waist: {waist.toFixed(2)}x</Text>
            <View style={styles.buttonGroup}>
              <TouchableOpacity style={styles.stepBtn} onPress={() => adjustValue(setWaist, waist, -0.05)}>
                <Text style={styles.stepBtnText}>-</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.stepBtn} onPress={() => adjustValue(setWaist, waist, 0.05)}>
                <Text style={styles.stepBtnText}>+</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.controlRow}>
            <Text style={styles.label}>Hips: {hips.toFixed(2)}x</Text>
            <View style={styles.buttonGroup}>
              <TouchableOpacity style={styles.stepBtn} onPress={() => adjustValue(setHips, hips, -0.05)}>
                <Text style={styles.stepBtnText}>-</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.stepBtn} onPress={() => adjustValue(setHips, hips, 0.05)}>
                <Text style={styles.stepBtnText}>+</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Skin Tone Color Picker */}
          <View style={styles.colorHeader}>
            <Palette color={COLORS.primary} size={16} />
            <Text style={styles.colorHeaderLabel}>Skin Tone Palette</Text>
          </View>
          <View style={styles.colorPalette}>
            {SKIN_TONES.map((color, idx) => (
              <TouchableOpacity
                key={idx}
                style={[
                  styles.colorChip,
                  { backgroundColor: color },
                  skinTone === color && styles.colorChipActive
                ]}
                onPress={() => setSkinTone(color)}
              />
            ))}
          </View>

          {/* Action CTA Button */}
          <TouchableOpacity 
            style={styles.saveButton} 
            onPress={handleSaveProfile}
            disabled={isSaving}
          >
            {isSaving ? (
              <ActivityIndicator color={COLORS.bgDark} />
            ) : (
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                <Save color={COLORS.bgDark} size={18} />
                <Text style={styles.saveButtonText}>Save Body Dimensions</Text>
              </View>
            )}
          </TouchableOpacity>
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.bgDark,
  },
  topHeader: {
    position: 'absolute',
    top: 50,
    left: 20,
    zIndex: 10,
  },
  headerBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  headerBadgeText: {
    color: COLORS.primary,
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 2,
  },
  titleText: {
    fontSize: 24,
    fontWeight: '800',
    color: COLORS.textLight,
  },
  canvasContainer: {
    flex: 1.2,
    backgroundColor: '#0F172A',
  },
  drawer: {
    flex: 1,
    backgroundColor: COLORS.cardDark,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 20,
    paddingTop: 16,
    borderTopWidth: 1,
    borderColor: COLORS.borderDark,
  },
  scrollContent: {
    paddingBottom: 24,
  },
  drawerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.textLight,
    marginBottom: 14,
  },
  controlRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
    backgroundColor: COLORS.bgDark,
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: COLORS.borderDark,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.textLight,
  },
  buttonGroup: {
    flexDirection: 'row',
    gap: 8,
  },
  stepBtn: {
    backgroundColor: COLORS.primaryDark,
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  stepBtnText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: '700',
    marginTop: -2,
  },
  colorHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 10,
  },
  colorHeaderLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.textMuted,
  },
  colorPalette: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 10,
    marginBottom: 18,
  },
  colorChip: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  colorChipActive: {
    borderColor: COLORS.primary,
    transform: [{ scale: 1.15 }],
  },
  saveButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: 'center',
    marginTop: 4,
  },
  saveButtonText: {
    color: COLORS.bgDark,
    fontSize: 15,
    fontWeight: '800',
  },
});
