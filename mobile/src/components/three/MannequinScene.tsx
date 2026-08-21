import React, { useEffect, useRef } from 'react';
import { GestureResponderEvent, PanResponder, StyleSheet, View } from 'react-native';
import { GLView, ExpoWebGLRenderingContext } from 'expo-gl';
import { Renderer } from 'expo-three';
import * as THREE from 'three';
import { buildMannequin, Mannequin } from './mannequin';
import { buildTemplate, GarmentTemplate } from './garmentTemplates';
import { snapGarmentToMannequin } from './snapGarment';
import { Measurements } from '../../types';

interface Props {
  measurements: Measurements;
  skinHex: string;
  /** Template id from garmentTemplates.ts (e.g. 'tshirt'), or omit for a bare mannequin. */
  garmentTemplateId?: string;
  garmentColor?: string;
  /** Called once the mannequin group is built, so a garment can be snapped onto it. */
  onReady?: (mannequin: Mannequin, scene: THREE.Scene) => void;
}

export default function MannequinScene({
  measurements,
  skinHex,
  garmentTemplateId,
  garmentColor,
  onReady,
}: Props) {
  const rotationY = useRef(0);
  const mannequinRef = useRef<Mannequin | null>(null);
  const garmentRef = useRef<GarmentTemplate | null>(null);

  useEffect(() => {
    mannequinRef.current?.applyMeasurements(measurements);
    if (mannequinRef.current && garmentRef.current) {
      snapGarmentToMannequin(garmentRef.current, mannequinRef.current, measurements);
    }
  }, [measurements]);

  useEffect(() => {
    mannequinRef.current?.setSkinColor(skinHex);
  }, [skinHex]);

  useEffect(() => {
    if (garmentColor) garmentRef.current?.setColor(garmentColor);
  }, [garmentColor]);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderMove: (_evt: GestureResponderEvent, gestureState) => {
        rotationY.current += gestureState.dx * 0.008;
        if (mannequinRef.current) {
          mannequinRef.current.group.rotation.y = rotationY.current;
        }
      },
    })
  ).current;

  const onContextCreate = async (gl: ExpoWebGLRenderingContext) => {
    const width = gl.drawingBufferWidth;
    const height = gl.drawingBufferHeight;

    const renderer = new Renderer({ gl });
    renderer.setSize(width, height);
    renderer.setClearColor(0xf2f2f2, 1);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(35, width / height, 0.1, 100);
    camera.position.set(0, 1.0, 2.6);
    camera.lookAt(0, 0.9, 0);

    const hemi = new THREE.HemisphereLight(0xffffff, 0x444444, 1.1);
    scene.add(hemi);
    const key = new THREE.DirectionalLight(0xffffff, 0.9);
    key.position.set(1, 2, 2);
    scene.add(key);
    const fill = new THREE.DirectionalLight(0xffffff, 0.4);
    fill.position.set(-1.5, 1, -1);
    scene.add(fill);

    const floorGeo = new THREE.CircleGeometry(0.9, 32);
    const floorMat = new THREE.MeshStandardMaterial({ color: 0xdddddd, roughness: 1 });
    const floor = new THREE.Mesh(floorGeo, floorMat);
    floor.rotation.x = -Math.PI / 2;
    scene.add(floor);

    const mannequin = buildMannequin();
    mannequin.applyMeasurements(measurements);
    mannequin.setSkinColor(skinHex);
    mannequin.group.rotation.y = rotationY.current;
    scene.add(mannequin.group);
    mannequinRef.current = mannequin;

    if (garmentTemplateId) {
      const template = buildTemplate(garmentTemplateId);
      if (garmentColor) template.setColor(garmentColor);
      snapGarmentToMannequin(template, mannequin, measurements);
      garmentRef.current = template;
    }

    onReady?.(mannequin, scene);

    const render = () => {
      requestAnimationFrame(render);
      renderer.render(scene, camera);
      gl.endFrameEXP();
    };
    render();
  };

  return (
    <View style={styles.container} {...panResponder.panHandlers}>
      <GLView style={styles.glView} onContextCreate={onContextCreate} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  glView: { flex: 1 },
});
