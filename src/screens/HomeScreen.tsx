import React, { useEffect, useRef } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet,
  Animated, Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { useStore } from '../store/useStore';
import { useSound } from '../hooks/useSound';
import { FONTS } from '../constants/theme';

const { width, height } = Dimensions.get('window');

function FloatingEmoji({
  emoji, top, left, delay, size = 26,
}: {
  emoji: string; top: number; left: number; delay: number; size?: number;
}) {
  const bob     = useRef(new Animated.Value(0)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(opacity, {
      toValue: 1, duration: 500, delay: delay + 300, useNativeDriver: true,
    }).start();
    Animated.loop(
      Animated.sequence([
        Animated.delay(delay),
        Animated.timing(bob, { toValue: -14, duration: 1800, useNativeDriver: true }),
        Animated.timing(bob, { toValue: 0,   duration: 1800, useNativeDriver: true }),
      ])
    ).start();
  }, []);

  return (
    <Animated.Text
      style={{
        position: 'absolute', top, left, fontSize: size,
        transform: [{ translateY: bob }], opacity, zIndex: 0,
      }}
    >
      {emoji}
    </Animated.Text>
  );
}

export default function HomeScreen() {
  const { totalStars, gamesPlayed, loadFromStorage } = useStore();
  const { playClick } = useSound();

  const bounceAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim  = useRef(new Animated.Value(1)).current;
  const fadeAnim   = useRef(new Animated.Value(0)).current;
  const slideAnim  = useRef(new Animated.Value(40)).current;

  useEffect(() => {
    loadFromStorage();

    Animated.parallel([
      Animated.timing(fadeAnim,  { toValue: 1, duration: 700, useNativeDriver: true }),
      Animated.spring(slideAnim, { toValue: 0, friction: 7,   useNativeDriver: true }),
    ]).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(bounceAnim, { toValue: -18, duration: 700, useNativeDriver: true }),
        Animated.timing(bounceAnim, { toValue: 0,   duration: 700, useNativeDriver: true }),
      ])
    ).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(scaleAnim, { toValue: 1.06, duration: 900, useNativeDriver: true }),
        Animated.timing(scaleAnim, { toValue: 1,    duration: 900, useNativeDriver: true }),
      ])
    ).start();
  }, []);

  const handlePlay   = () => { playClick(); router.push('/topics'); };
  const handleParent = () => { playClick(); router.push('/parent'); };

  return (
    <LinearGradient
      colors={['#6C3DD3', '#C44FA0', '#FF6B6B', '#FF9A3C']}
      start={{ x: 0.1, y: 0 }}
      end={{ x: 0.9, y: 1 }}
      style={{ flex: 1 }}
    >
      <SafeAreaView style={{ flex: 1 }}>
        {/* Floating decorative emojis */}
        <FloatingEmoji emoji="⭐" top={height * 0.06} left={width * 0.05}  delay={0}    size={28} />
        <FloatingEmoji emoji="🌈" top={height * 0.04} left={width * 0.72}  delay={400}  size={32} />
        <FloatingEmoji emoji="✨" top={height * 0.16} left={width * 0.88}  delay={800}  size={22} />
        <FloatingEmoji emoji="🎈" top={height * 0.10} left={width * 0.14}  delay={200}  size={30} />
        <FloatingEmoji emoji="💫" top={height * 0.74} left={width * 0.04}  delay={600}  size={26} />
        <FloatingEmoji emoji="⭐" top={height * 0.80} left={width * 0.86}  delay={1000} size={22} />
        <FloatingEmoji emoji="🍭" top={height * 0.70} left={width * 0.82}  delay={300}  size={30} />

        <Animated.View
          style={[
            styles.inner,
            { opacity: fadeAnim, transform: [{ translateY: slideAnim }] },
          ]}
        >
        {/* Mascot */}
        <Animated.View style={{ transform: [{ translateY: bounceAnim }], marginBottom: 18 }}>
          <View style={styles.mascotRing}>
            <Text style={styles.mascot}>🦁</Text>
          </View>
        </Animated.View>

        {/* Title — two-tone wordmark with comic shadow */}
        <View style={styles.titleRow}>
          {/* Shadow layer (rendered behind) */}
          <Text style={[styles.titleShadow]} numberOfLines={1} adjustsFontSizeToFit minimumFontScale={0.5}>
            Math<Text style={styles.titleShadowAccent}>Moppet</Text>
          </Text>
          {/* Foreground layer */}
          <Text style={[styles.titleFg]} numberOfLines={1} adjustsFontSizeToFit minimumFontScale={0.5}>
            Math<Text style={styles.titleFgAccent}>Moppet</Text>
          </Text>
        </View>

        {/* Tagline pill */}
        <View style={styles.taglinePill}>
          <Text style={styles.taglineText}>🌈 The Fun Math Adventure!</Text>
        </View>

        {/* Stats chips — only when the user has history */}
        {(totalStars > 0 || gamesPlayed > 0) && (
          <View style={styles.statsRow}>
            <View style={styles.statChip}>
              <Text style={styles.statEmoji}>⭐</Text>
              <Text style={styles.statVal}>{totalStars}</Text>
              <Text style={styles.statLabel}> Stars</Text>
            </View>
            <View style={styles.statChip}>
              <Text style={styles.statEmoji}>🏆</Text>
              <Text style={styles.statVal}>{gamesPlayed}</Text>
              <Text style={styles.statLabel}> Games</Text>
            </View>
          </View>
        )}

        {/* 3-D Play button */}
        <Animated.View
          style={{ transform: [{ scale: scaleAnim }], width: '100%', alignItems: 'center' }}
        >
          <TouchableOpacity
            style={styles.playBtnWrap}
            onPress={handlePlay}
            activeOpacity={0.88}
          >
            <LinearGradient
              colors={['#FFE34D', '#FF9A3C']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.playBtnFace}
            >
              <Text style={styles.playBtnText}>▶  LET'S PLAY!</Text>
            </LinearGradient>
            <View style={styles.playBtnSlab} />
          </TouchableOpacity>
        </Animated.View>

        {/* Secondary row */}
        <View style={styles.secondRow}>
          <TouchableOpacity style={styles.secBtn} onPress={handleParent} activeOpacity={0.8}>
            <Text style={styles.secBtnText}>👨‍👩‍👧 Parents</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.secBtn} onPress={handlePlay} activeOpacity={0.8}>
            <Text style={styles.secBtnText}>🗺️ Topics</Text>
          </TouchableOpacity>
        </View>
        </Animated.View>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  inner: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 28,
    paddingVertical: 40,
  },
  mascotRing: {
    width: 130, height: 130, borderRadius: 65,
    backgroundColor: 'rgba(255,255,255,0.22)',
    alignItems: 'center', justifyContent: 'center',
    borderWidth: 3, borderColor: 'rgba(255,255,255,0.4)',
    shadowColor: '#00E5FF', shadowOpacity: 0.75,
    shadowOffset: { width: 0, height: 0 }, shadowRadius: 30,
    elevation: 12,
  },
  mascot: { fontSize: 80 },
  titleRow: {
    width: '100%', alignItems: 'center', marginBottom: 10,
    paddingBottom: 6,
  },
  titleShadow: {
    position: 'absolute',
    fontFamily: FONTS.display,
    fontSize: 70, color: '#5B0080',
    letterSpacing: 1, textAlign: 'center',
    top: 5, left: 5,
  },
  titleShadowAccent: { color: '#B54700' },
  titleFg: {
    fontFamily: FONTS.display,
    fontSize: 70, color: '#fff',
    letterSpacing: 1, textAlign: 'center',
  },
  titleFgAccent: { color: '#FFE556' },
  taglinePill: {
    backgroundColor: 'rgba(255,255,255,0.22)',
    borderRadius: 50,
    paddingVertical: 8, paddingHorizontal: 22,
    marginBottom: 24,
    borderWidth: 1.5, borderColor: 'rgba(255,255,255,0.35)',
  },
  taglineText: {
    fontFamily: FONTS.display, fontSize: 17, color: '#fff',
  },
  statsRow: {
    flexDirection: 'row', gap: 10, marginBottom: 28,
  },
  statChip: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.18)',
    borderRadius: 50,
    paddingVertical: 8, paddingHorizontal: 18,
    borderWidth: 1.5, borderColor: 'rgba(255,255,255,0.3)',
  },
  statEmoji: { fontSize: 18 },
  statVal:   { fontFamily: FONTS.display, fontSize: 20, color: '#fff', marginLeft: 4 },
  statLabel: { fontFamily: FONTS.display, fontSize: 14, color: 'rgba(255,255,255,0.8)' },

  /* Play button */
  playBtnWrap: {
    width: '92%', maxWidth: 340,
    marginBottom: 20,
    position: 'relative',
  },
  playBtnFace: {
    borderRadius: 60,
    paddingVertical: 20,
    alignItems: 'center',
  },
  playBtnSlab: {
    position: 'absolute',
    bottom: -7, left: 6, right: 6,
    height: '100%',
    borderRadius: 60,
    backgroundColor: '#B54700',
    zIndex: -1,
  },
  playBtnText: {
    fontFamily: FONTS.display,
    fontSize: 30, color: '#1a0800', letterSpacing: 1,
  },

  /* Secondary row */
  secondRow: { flexDirection: 'row', gap: 12 },
  secBtn: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderWidth: 2, borderColor: 'rgba(255,255,255,0.4)',
    borderRadius: 50, paddingVertical: 12, paddingHorizontal: 24,
  },
  secBtnText: { fontFamily: FONTS.display, fontSize: 16, color: '#fff' },
});
