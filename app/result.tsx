import React, { useEffect, useRef } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet,
  Animated, ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { router, useLocalSearchParams } from 'expo-router';
import { FONTS, COLORS } from '../src/constants/theme';

const BTN_PALETTE = [
  { face: '#FF6B6B', slab: '#B03030', label: '🔄  Play Again' },
  { face: '#4FC3F7', slab: '#0278A8', label: '🗺️  Choose Topic' },
  { face: '#81C784', slab: '#347537', label: '🏠  Home' },
];

export default function ResultScreen() {
  const { score, total, topic } = useLocalSearchParams<{ score: string; total: string; topic: string }>();
  const s = Number(score), t = Number(total);
  const pct = s / t;

  const starAnims = [useRef(new Animated.Value(0)).current, useRef(new Animated.Value(0)).current, useRef(new Animated.Value(0)).current];
  const emojiAnim = useRef(new Animated.Value(0)).current;

  const starCount = pct === 1 ? 3 : pct >= 0.6 ? 2 : 1;
  const emoji = pct === 1 ? '🏆' : pct >= 0.6 ? '🌟' : '💪';
  const title = pct === 1 ? 'PERFECT!' : pct >= 0.6 ? 'Awesome!' : 'Good Try!';
  const sub   = pct === 1 ? 'You got everything right!' : pct >= 0.6 ? 'Really great work!' : 'Practice makes perfect!';

  useEffect(() => {
    Animated.sequence([
      Animated.spring(emojiAnim, { toValue: 1, friction: 4, useNativeDriver: true }),
      ...starAnims.map((a, i) =>
        Animated.spring(a, { toValue: 1, friction: 4, delay: i * 180, useNativeDriver: true })
      ),
    ]).start();
  }, []);

  const actions = [
    { ...BTN_PALETTE[0], onPress: () => router.replace({ pathname: '/game', params: { topic } }) },
    { ...BTN_PALETTE[1], onPress: () => router.replace('/topics') },
    { ...BTN_PALETTE[2], onPress: () => router.replace('/') },
  ];

  return (
    <LinearGradient colors={['#E0F0FF', '#F5FAFF', '#EAF6EA']} style={{ flex: 1 }}>
      <SafeAreaView style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
          <View style={styles.card}>
            <Animated.Text style={[styles.bigEmoji, { transform: [{ scale: emojiAnim }] }]}>{emoji}</Animated.Text>
            <Text style={styles.title}>{title}</Text>
            <Text style={styles.sub}>{sub}</Text>

            <View style={styles.starsRow}>
              {[0, 1, 2].map(i => (
                <Animated.Text key={i} style={[styles.starItem, { transform: [{ scale: starAnims[i] }], opacity: starAnims[i] }]}>
                  {i < starCount ? '⭐' : '☆'}
                </Animated.Text>
              ))}
            </View>

            <View style={styles.scoreBadge}>
              <Text style={styles.scoreText}>⭐ {s} / {t} Correct</Text>
            </View>
          </View>

          <View style={styles.btnGrid}>
            {actions.map(({ face, slab, label, onPress }) => (
              <View key={label} style={styles.btnWrap}>
                <TouchableOpacity
                  style={[styles.btnFace, { backgroundColor: face }]}
                  onPress={onPress}
                  activeOpacity={0.85}
                >
                  <Text style={styles.btnText}>{label}</Text>
                </TouchableOpacity>
                <View style={[styles.btnSlab, { backgroundColor: slab }]} />
              </View>
            ))}
          </View>
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, alignItems: 'center', justifyContent: 'center', padding: 24 },
  card: {
    backgroundColor: '#fff',
    borderRadius: 28,
    padding: 36, maxWidth: 400, width: '100%', alignItems: 'center',
    shadowColor: '#000', shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 8 }, shadowRadius: 20, elevation: 8,
    marginBottom: 28,
  },
  bigEmoji: { fontSize: 72, marginBottom: 12 },
  title: { fontFamily: FONTS.display, fontSize: 38, color: COLORS.textDark, marginBottom: 6 },
  sub: { fontFamily: FONTS.bodyBold, fontSize: 15, color: COLORS.textLight, marginBottom: 24, textAlign: 'center' },
  starsRow: { flexDirection: 'row', gap: 12, marginBottom: 20 },
  starItem: { fontSize: 44 },
  scoreBadge: {
    backgroundColor: '#F0F9FF', borderRadius: 50,
    paddingVertical: 10, paddingHorizontal: 28,
  },
  scoreText: { fontFamily: FONTS.display, fontSize: 24, color: COLORS.primary },

  btnGrid: { width: '100%', maxWidth: 400, gap: 16 },
  btnWrap: { position: 'relative' },
  btnFace: { borderRadius: 20, paddingVertical: 18, alignItems: 'center' },
  btnSlab: {
    position: 'absolute',
    bottom: -6, left: 4, right: 4,
    height: '100%', borderRadius: 20, zIndex: -1,
  },
  btnText: { fontFamily: FONTS.display, fontSize: 22, color: '#fff' },
});
