import React, { useEffect, useRef } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet,
  Animated, Dimensions, ScrollView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { useStore } from '../store/useStore';
import { useSound } from '../hooks/useSound';
import { COLORS, FONTS } from '../constants/theme';

const { width } = Dimensions.get('window');

export default function HomeScreen() {
  const { totalStars, gamesPlayed, loadFromStorage } = useStore();
  const { playClick } = useSound();

  // Mascot bounce animation
  const bounceAnim = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    loadFromStorage();
    Animated.loop(
      Animated.sequence([
        Animated.timing(bounceAnim, { toValue: -16, duration: 700, useNativeDriver: true }),
        Animated.timing(bounceAnim, { toValue: 0,   duration: 700, useNativeDriver: true }),
      ])
    ).start();
  }, []);

  const handlePlay = () => { playClick(); router.push('/topics'); };
  const handleParent = () => { playClick(); router.push('/parent'); };

  return (
    <LinearGradient
      colors={['#87CEEB', '#B0E0FF', '#6BCB77', '#4CAF50']}
      locations={[0, 0.38, 0.38, 1]}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.inner} showsVerticalScrollIndicator={false}>

        {/* Sun decoration */}
        <View style={styles.sun} />

        {/* Mascot */}
        <Animated.Text style={[styles.mascot, { transform: [{ translateY: bounceAnim }] }]}>
          🦁
        </Animated.Text>

        {/* Logo */}
        <Text style={styles.logo}>MathLand</Text>
        <Text style={styles.tagline}>🌈 A Math Adventure for Kids!</Text>

        {/* Play Button */}
        <TouchableOpacity style={styles.playBtn} onPress={handlePlay} activeOpacity={0.85}>
          <Text style={styles.playBtnText}>▶  Let's Play!</Text>
        </TouchableOpacity>

        {/* Secondary buttons */}
        <View style={styles.secondaryRow}>
          <TouchableOpacity style={styles.secBtn} onPress={handleParent} activeOpacity={0.8}>
            <Text style={styles.secBtnText}>👨‍👩‍👧 Parents</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.secBtn} onPress={handlePlay} activeOpacity={0.8}>
            <Text style={styles.secBtnText}>🗺️ Topics</Text>
          </TouchableOpacity>
        </View>

        {/* Stats Banner */}
        <View style={styles.statsBanner}>
          <Text style={styles.statsText}>⭐ {totalStars} Stars</Text>
          <View style={styles.statsDivider} />
          <Text style={styles.statsText}>🏆 {gamesPlayed} Games</Text>
        </View>

      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  inner: {
    flexGrow: 1, alignItems: 'center', justifyContent: 'center',
    paddingHorizontal: 24, paddingVertical: 40,
  },
  sun: {
    position: 'absolute', top: 28, right: 58,
    width: 76, height: 76, borderRadius: 38,
    backgroundColor: '#FFD93D',
    shadowColor: '#FFD93D', shadowOpacity: 0.6,
    shadowRadius: 20, elevation: 8,
  },
  mascot: { fontSize: 88, marginBottom: 20 },
  logo: {
    fontFamily: FONTS.display,
    fontSize: 72, color: '#FF6B35',
    textShadowColor: 'rgba(0,0,0,0.15)',
    textShadowOffset: { width: 3, height: 4 },
    textShadowRadius: 0,
    marginBottom: 6,
  },
  tagline: {
    fontFamily: FONTS.display,
    fontSize: 20, color: '#fff',
    textShadowColor: 'rgba(0,0,0,0.2)',
    textShadowOffset: { width: 1, height: 2 },
    textShadowRadius: 0,
    marginBottom: 36,
    letterSpacing: 0.5,
  },
  playBtn: {
    backgroundColor: '#FF6B35',
    borderRadius: 60,
    paddingVertical: 18, paddingHorizontal: 60,
    shadowColor: '#c73d7a',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 1, shadowRadius: 0,
    elevation: 8, marginBottom: 16,
  },
  playBtnText: {
    fontFamily: FONTS.display,
    fontSize: 30, color: '#fff', letterSpacing: 1,
  },
  secondaryRow: { flexDirection: 'row', gap: 12, marginBottom: 18 },
  secBtn: {
    backgroundColor: 'rgba(255,255,255,0.25)',
    borderWidth: 2.5, borderColor: 'rgba(255,255,255,0.5)',
    borderRadius: 50, paddingVertical: 10, paddingHorizontal: 22,
  },
  secBtnText: {
    fontFamily: FONTS.display, fontSize: 17, color: '#fff',
  },
  statsBanner: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    backgroundColor: 'rgba(255,255,255,0.25)',
    borderRadius: 50, paddingVertical: 10, paddingHorizontal: 24,
    marginTop: 6,
  },
  statsText: {
    fontFamily: FONTS.display, fontSize: 18, color: '#fff',
    textShadowColor: 'rgba(0,0,0,0.15)', textShadowOffset: { width: 1, height: 1 }, textShadowRadius: 0,
  },
  statsDivider: { width: 2, height: 20, backgroundColor: 'rgba(255,255,255,0.4)', borderRadius: 2 },
});
