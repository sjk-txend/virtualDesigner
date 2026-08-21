import React, { useState, useRef, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Animated,
  Easing,
  Alert
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Lock, Mail, User, Eye, EyeOff, Sparkles, AlertCircle } from 'lucide-react-native';
import {
  createUserWithEmailAndPassword,
  signInAnonymously,
  signInWithEmailAndPassword
} from 'firebase/auth';
import {
  auth,
  db,
  doc,
  setDoc
} from '../config/firebase';

export default function LandingScreen({ onAuthSuccess }) {
  const [isLoginTab, setIsLoginTab] = useState(true);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Form error state
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [nameError, setNameError] = useState('');
  const [bannerError, setBannerError] = useState('');
  const [loading, setLoading] = useState(false);

  // Animations
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  const pillAnim = useRef(new Animated.Value(0)).current;
  const btnScale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: false,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        easing: Easing.out(Easing.back(1.5)),
        useNativeDriver: false,
      }),
    ]).start();
  }, []);

  const switchTab = (toLogin) => {
    setIsLoginTab(toLogin);
    setBannerError('');
    setEmailError('');
    setPasswordError('');
    setNameError('');
    Animated.spring(pillAnim, {
      toValue: toLogin ? 0 : 1,
      friction: 8,
      tension: 50,
      useNativeDriver: false,
    }).start();
  };

  const validateForm = () => {
    let isValid = true;
    setEmailError('');
    setPasswordError('');
    setNameError('');
    setBannerError('');

    const emailRegex = /\S+@\S+\.\S+/;
    if (!email.trim() || !emailRegex.test(email)) {
      setEmailError('Please enter a valid email address.');
      isValid = false;
    }

    if (!password || password.length < 6) {
      setPasswordError('Password must be at least 6 characters.');
      isValid = false;
    }

    if (!isLoginTab && !name.trim()) {
      setNameError('Please enter your full name.');
      isValid = false;
    }

    return isValid;
  };

  const handleSignUp = async () => {
    setLoading(true);
    try {
      console.log("[Auth] Attempting sign-up for:", email);
      const userCredential = await createUserWithEmailAndPassword(auth, email.trim(), password);
      const user = userCredential.user;

      await setDoc(doc(db, 'users', user.uid), {
        email: user.email,
        createdAt: new Date().toISOString(),
        height: 170,
        chest: 90,
        waist: 75,
        hips: 95,
        skinTone: '#E0AC69'
      });

      onAuthSuccess(user);
    } catch (error) {
      console.error("[Auth Error]:", error.code, error.message);
      
      const errorText = `[${error.code}]\n${error.message}`;
      setBannerError(errorText);
      Alert.alert("Sign Up Error", errorText);
    } finally {
      setLoading(false);
    }
  };

  // Login Handler strictly wrapping signInWithEmailAndPassword with Alert popup
  const handleLogin = async () => {
    setLoading(true);
    try {
      console.log("[Auth] Attempting login for:", email);
      const userCredential = await signInWithEmailAndPassword(auth, email.trim(), password);
      const user = userCredential.user;

      console.log("[Auth Success] User logged in:", user.uid);
      onAuthSuccess(user);
    } catch (error) {
      console.error("[Auth Error]:", error.code, error.message);

      const errorText = `[${error.code}]\n${error.message}`;
      setBannerError(errorText);
      Alert.alert("Login Error", errorText);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    Animated.sequence([
      Animated.timing(btnScale, { toValue: 0.96, duration: 100, useNativeDriver: false }),
      Animated.timing(btnScale, { toValue: 1, duration: 100, useNativeDriver: false }),
    ]).start();

    if (isLoginTab) {
      await handleLogin();
    } else {
      await handleSignUp();
    }
  };

  const handleGuestAccess = async () => {
    setLoading(true);
    try {
      const userCredential = await signInAnonymously(auth);
      onAuthSuccess(userCredential.user);
    } catch (error) {
      const errorText = `[${error.code}]\n${error.message}`;
      setBannerError(errorText);
      Alert.alert('Guest Login Error', errorText);
    } finally {
      setLoading(false);
    }
  };

  const pillLeft = pillAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['2%', '50%'],
  });

  return (
    <LinearGradient
      colors={['#0A0A0C', '#121624', '#080E1A']}
      style={styles.gradientContainer}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Animated Hero Section */}
          <Animated.View
            style={[
              styles.heroSection,
              { opacity: fadeAnim, transform: [{ translateY: slideAnim }] },
            ]}
          >
            <View style={styles.badgeContainer}>
              <Sparkles color="#00F2FE" size={16} />
              <Text style={styles.badgeText}>AURA FITTING STUDIO</Text>
            </View>
            <Text style={styles.heroTitle}>Your Digital Wardrobe</Text>
            <Text style={styles.heroSubtitle}>Engineered for You.</Text>
            <Text style={styles.heroDescription}>
              3D mannequin body tailoring & digital garment barcode vault.
            </Text>
          </Animated.View>

          {/* Glassmorphism Translucent Auth Card */}
          <View style={styles.authCard}>
            {/* Animated Segmented Toggle */}
            <View style={styles.segmentedContainer}>
              <Animated.View style={[styles.slidingPill, { left: pillLeft }]} />
              <TouchableOpacity
                style={styles.toggleSegment}
                onPress={() => switchTab(true)}
                activeOpacity={0.8}
              >
                <Text style={[styles.toggleText, isLoginTab && styles.toggleTextActive]}>
                  Login
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.toggleSegment}
                onPress={() => switchTab(false)}
                activeOpacity={0.8}
              >
                <Text style={[styles.toggleText, !isLoginTab && styles.toggleTextActive]}>
                  Sign Up
                </Text>
              </TouchableOpacity>
            </View>

            {/* Error Banner */}
            {bannerError ? (
              <View style={styles.bannerErrorBox}>
                <AlertCircle color="#FF4D4D" size={18} />
                <Text style={styles.bannerErrorText}>{bannerError}</Text>
              </View>
            ) : null}

            {/* Name Input Field (Sign Up Mode) */}
            {!isLoginTab && (
              <View style={styles.fieldGroup}>
                <View style={[styles.inputWrapper, nameError ? styles.inputErrorBorder : null]}>
                  <User color={nameError ? '#FF4D4D' : '#8E9BAE'} size={18} style={styles.inputIcon} />
                  <TextInput
                    style={styles.input}
                    placeholder="Full Name"
                    placeholderTextColor="#5B687C"
                    value={name}
                    onChangeText={(val) => {
                      setName(val);
                      if (nameError) setNameError('');
                    }}
                  />
                </View>
                {nameError ? <Text style={styles.fieldErrorText}>{nameError}</Text> : null}
              </View>
            )}

            {/* Email Input Field */}
            <View style={styles.fieldGroup}>
              <View style={[styles.inputWrapper, emailError ? styles.inputErrorBorder : null]}>
                <Mail color={emailError ? '#FF4D4D' : '#8E9BAE'} size={18} style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Email Address"
                  placeholderTextColor="#5B687C"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  value={email}
                  onChangeText={(val) => {
                    setEmail(val);
                    if (emailError) setEmailError('');
                  }}
                />
              </View>
              {emailError ? <Text style={styles.fieldErrorText}>{emailError}</Text> : null}
            </View>

            {/* Password Input Field */}
            <View style={styles.fieldGroup}>
              <View style={[styles.inputWrapper, passwordError ? styles.inputErrorBorder : null]}>
                <Lock color={passwordError ? '#FF4D4D' : '#8E9BAE'} size={18} style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Password (min 6 chars)"
                  placeholderTextColor="#5B687C"
                  secureTextEntry={!showPassword}
                  value={password}
                  onChangeText={(val) => {
                    setPassword(val);
                    if (passwordError) setPasswordError('');
                  }}
                />
                <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                  {showPassword ? (
                    <EyeOff color="#8E9BAE" size={18} />
                  ) : (
                    <Eye color="#8E9BAE" size={18} />
                  )}
                </TouchableOpacity>
              </View>
              {passwordError ? <Text style={styles.fieldErrorText}>{passwordError}</Text> : null}
            </View>

            {/* Animated Primary CTA Button */}
            <Animated.View style={{ transform: [{ scale: btnScale }] }}>
              <TouchableOpacity
                style={styles.primaryCta}
                onPress={handleSubmit}
                disabled={loading}
                activeOpacity={0.85}
              >
                {loading ? (
                  <ActivityIndicator color="#0A0A0C" />
                ) : (
                  <Text style={styles.primaryCtaText}>
                    {isLoginTab ? 'Login to Fitting Studio' : 'Create Account'}
                  </Text>
                )}
              </TouchableOpacity>
            </Animated.View>

            {/* Guest Bypass Link */}
            <TouchableOpacity
              style={styles.guestBtn}
              onPress={handleGuestAccess}
              disabled={loading}
            >
              <Text style={styles.guestBtnText}>Continue as Guest →</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradientContainer: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 65,
    paddingBottom: 40,
  },
  heroSection: {
    alignItems: 'center',
    marginBottom: 28,
  },
  badgeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: 'rgba(0, 242, 254, 0.1)',
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(0, 242, 254, 0.3)',
    marginBottom: 14,
  },
  badgeText: {
    color: '#00F2FE',
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 2,
  },
  heroTitle: {
    fontSize: 32,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: -0.5,
  },
  heroSubtitle: {
    fontSize: 26,
    fontWeight: '700',
    color: '#00F2FE',
    marginTop: 2,
    marginBottom: 10,
  },
  heroDescription: {
    fontSize: 14,
    color: '#8E9BAE',
    textAlign: 'center',
    lineHeight: 22,
    paddingHorizontal: 16,
  },
  authCard: {
    backgroundColor: 'rgba(18, 22, 36, 0.85)',
    borderRadius: 24,
    padding: 22,
    borderWidth: 1,
    borderColor: '#233044',
  },
  segmentedContainer: {
    flexDirection: 'row',
    backgroundColor: '#0A0A0C',
    borderRadius: 14,
    height: 48,
    padding: 3,
    marginBottom: 20,
    position: 'relative',
  },
  slidingPill: {
    position: 'absolute',
    top: 3,
    bottom: 3,
    width: '48%',
    backgroundColor: '#1E293B',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#00F2FE',
  },
  toggleSegment: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 2,
  },
  toggleText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#8E9BAE',
  },
  toggleTextActive: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  bannerErrorBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: 'rgba(255, 77, 77, 0.12)',
    borderWidth: 1,
    borderColor: 'rgba(255, 77, 77, 0.35)',
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
  },
  bannerErrorText: {
    color: '#FF4D4D',
    fontSize: 13,
    fontWeight: '600',
    flex: 1,
  },
  fieldGroup: {
    marginBottom: 14,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0A0A0C',
    borderRadius: 14,
    paddingHorizontal: 14,
    height: 48,
    borderWidth: 1,
    borderColor: '#233044',
  },
  inputErrorBorder: {
    borderColor: '#FF4D4D',
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    color: '#FFFFFF',
    fontSize: 15,
  },
  fieldErrorText: {
    color: '#FF4D4D',
    fontSize: 12,
    marginTop: 4,
    marginLeft: 4,
  },
  primaryCta: {
    backgroundColor: '#00F2FE',
    height: 50,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 6,
    marginBottom: 16,
  },
  primaryCtaText: {
    color: '#0A0A0C',
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  guestBtn: {
    alignItems: 'center',
    paddingVertical: 6,
  },
  guestBtnText: {
    color: '#8E9BAE',
    fontSize: 14,
    fontWeight: '600',
  },
});
