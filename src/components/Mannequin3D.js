import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';

export default function Mannequin3D({ bodyParams, skinColor }) {
  const meshRef = useRef();

  // Extract body metrics
  const { height = 1.0, chest = 1.0, waist = 1.0, hips = 1.0 } = bodyParams;

  useFrame(() => {
    if (meshRef.current) {
      // Gentle subtle rotation for interactive preview feedback
      meshRef.current.rotation.y += 0.004;
    }
  });

  return (
    <group ref={meshRef} position={[0, -1.2, 0]}>
      {/* Base Pedestal Platform */}
      <mesh position={[0, 0, 0]}>
        <cylinderGeometry args={[1.1, 1.2, 0.08, 32]} />
        <meshStandardMaterial color="#8A9A86" roughness={0.3} metalness={0.2} />
      </mesh>

      {/* Main Human Anatomy Avatar Mesh Group */}
      {/* Hips / Pelvis / Lower Abdomen */}
      <mesh position={[0, 0.7 * height, 0]} scale={[hips, height, hips]}>
        <cylinderGeometry args={[0.26, 0.22, 0.35, 32]} />
        <meshStandardMaterial color={skinColor} roughness={0.35} metalness={0.05} />
      </mesh>

      {/* Midsection / Waist Curve */}
      <mesh position={[0, 1.02 * height, 0]} scale={[waist, height, waist]}>
        <cylinderGeometry args={[0.22, 0.26, 0.35, 32]} />
        <meshStandardMaterial color={skinColor} roughness={0.35} metalness={0.05} />
      </mesh>

      {/* Upper Torso / Chest / Ribcage */}
      <mesh position={[0, 1.38 * height, 0]} scale={[chest, height, chest]}>
        <cylinderGeometry args={[0.33, 0.23, 0.42, 32]} />
        <meshStandardMaterial color={skinColor} roughness={0.35} metalness={0.05} />
      </mesh>

      {/* Broad Shoulders Joiner */}
      <mesh position={[0, 1.62 * height, 0]} scale={[chest * 1.05, height, chest * 0.8]}>
        <boxGeometry args={[0.68, 0.12, 0.24]} />
        <meshStandardMaterial color={skinColor} roughness={0.35} metalness={0.05} />
      </mesh>

      {/* Neck */}
      <mesh position={[0, 1.74 * height, 0]} scale={[1, height, 1]}>
        <cylinderGeometry args={[0.08, 0.09, 0.16, 24]} />
        <meshStandardMaterial color={skinColor} roughness={0.35} metalness={0.05} />
      </mesh>

      {/* Anatomical Head (Head sphere + jaw taper) */}
      <group position={[0, 1.95 * height, 0]}>
        {/* Main Cranium */}
        <mesh position={[0, 0, 0]}>
          <sphereGeometry args={[0.16, 32, 32]} />
          <meshStandardMaterial color={skinColor} roughness={0.25} metalness={0.1} />
        </mesh>
        {/* Jaw Taper */}
        <mesh position={[0, -0.06, 0.02]} rotation={[0.2, 0, 0]}>
          <coneGeometry args={[0.13, 0.14, 24]} />
          <meshStandardMaterial color={skinColor} roughness={0.25} metalness={0.1} />
        </mesh>
      </group>

      {/* Anatomical Left Arm (Upper Arm, Elbow, Forearm, Hand) */}
      <group position={[-0.34 * chest, 1.58 * height, 0]} rotation={[0, 0, 0.12]}>
        {/* Upper Arm */}
        <mesh position={[0, -0.22 * height, 0]}>
          <cylinderGeometry args={[0.055, 0.045, 0.42, 20]} />
          <meshStandardMaterial color={skinColor} roughness={0.35} />
        </mesh>
        {/* Elbow Joint */}
        <mesh position={[0, -0.44 * height, 0]}>
          <sphereGeometry args={[0.046, 16, 16]} />
          <meshStandardMaterial color={skinColor} roughness={0.35} />
        </mesh>
        {/* Forearm */}
        <mesh position={[0, -0.64 * height, 0]}>
          <cylinderGeometry args={[0.043, 0.035, 0.38, 20]} />
          <meshStandardMaterial color={skinColor} roughness={0.35} />
        </mesh>
        {/* Hand */}
        <mesh position={[0, -0.85 * height, 0]}>
          <boxGeometry args={[0.04, 0.08, 0.06]} />
          <meshStandardMaterial color={skinColor} roughness={0.35} />
        </mesh>
      </group>

      {/* Anatomical Right Arm (Upper Arm, Elbow, Forearm, Hand) */}
      <group position={[0.34 * chest, 1.58 * height, 0]} rotation={[0, 0, -0.12]}>
        {/* Upper Arm */}
        <mesh position={[0, -0.22 * height, 0]}>
          <cylinderGeometry args={[0.055, 0.045, 0.42, 20]} />
          <meshStandardMaterial color={skinColor} roughness={0.35} />
        </mesh>
        {/* Elbow Joint */}
        <mesh position={[0, -0.44 * height, 0]}>
          <sphereGeometry args={[0.046, 16, 16]} />
          <meshStandardMaterial color={skinColor} roughness={0.35} />
        </mesh>
        {/* Forearm */}
        <mesh position={[0, -0.64 * height, 0]}>
          <cylinderGeometry args={[0.043, 0.035, 0.38, 20]} />
          <meshStandardMaterial color={skinColor} roughness={0.35} />
        </mesh>
        {/* Hand */}
        <mesh position={[0, -0.85 * height, 0]}>
          <boxGeometry args={[0.04, 0.08, 0.06]} />
          <meshStandardMaterial color={skinColor} roughness={0.35} />
        </mesh>
      </group>

      {/* Proportional Legs & Knees */}
      {/* Left Leg */}
      <group position={[-0.14 * hips, 0.52 * height, 0]}>
        <mesh position={[0, -0.18 * height, 0]}>
          <cylinderGeometry args={[0.085, 0.065, 0.36, 20]} />
          <meshStandardMaterial color={skinColor} roughness={0.35} />
        </mesh>
        <mesh position={[0, -0.37 * height, 0]}>
          <sphereGeometry args={[0.064, 16, 16]} />
          <meshStandardMaterial color={skinColor} roughness={0.35} />
        </mesh>
        <mesh position={[0, -0.56 * height, 0]}>
          <cylinderGeometry args={[0.062, 0.048, 0.36, 20]} />
          <meshStandardMaterial color={skinColor} roughness={0.35} />
        </mesh>
      </group>

      {/* Right Leg */}
      <group position={[0.14 * hips, 0.52 * height, 0]}>
        <mesh position={[0, -0.18 * height, 0]}>
          <cylinderGeometry args={[0.085, 0.065, 0.36, 20]} />
          <meshStandardMaterial color={skinColor} roughness={0.35} />
        </mesh>
        <mesh position={[0, -0.37 * height, 0]}>
          <sphereGeometry args={[0.064, 16, 16]} />
          <meshStandardMaterial color={skinColor} roughness={0.35} />
        </mesh>
        <mesh position={[0, -0.56 * height, 0]}>
          <cylinderGeometry args={[0.062, 0.048, 0.36, 20]} />
          <meshStandardMaterial color={skinColor} roughness={0.35} />
        </mesh>
      </group>
    </group>
  );
}
