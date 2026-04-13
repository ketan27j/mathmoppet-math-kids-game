import React, { useEffect, useRef } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet,
  Animated, ScrollView, Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router, useLocalSearchParams } from 'expo-router';
import { FONTS } from '../constants/theme';
import { useSound } from '../hooks/useSound';

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
      toValue: 1, duration: 500, delay: delay + 200, useNativeDriver: true,
    }).start();
    Animated.loop(
      Animated.sequence([
        Animated.delay(delay),
        Animated.timing(bob, { toValue: -16, duration: 2000, useNativeDriver: true }),
        Animated.timing(bob, { toValue: 0,   duration: 2000, useNativeDriver: true }),
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

const ACTION_BTNS = [
  { label: '🔄  Play Again',    colors: ['#FF9A3C', '#FF6B35'] as [string,string], slab: '#B03000' },
  { label: '🗺️  Choose Topic',  colors: ['#818CF8', '#6366F1'] as [string,string], slab: '#3A3DAA' },
  { label: '🏠  Home',          colors: ['#34D399', '#14B8A6'] as [string,string], slab: '#0A7A6E' },
];

export function ResultScreen() {
  const { score, total, topic } = useLocalSearchParams<{
    score: string; total: string; topic: string;
  }>();
  const s = Number(score), t = Number(total);
  const pct = t > 0 ? s / t : 0;
  const { playWin } = useSound();

  const starCount = pct === 1 ? 3 : pct >= 0.6 ? 2 : 1;
  const emoji     = pct === 1 ? '🏆' : pct >= 0.6 ? '🌟' : '💪';
  const title     = pct === 1 ? 'PERFECT!' : pct >= 0.6 ? 'Awesome!' : 'Good Try!';
  const sub       = pct === 1 ? 'You got everything right! 🎉' : pct >= 0.6 ? 'Really great work! 🌟' : 'Practice makes perfect! 💪';

  const emojiAnim  = useRef(new Animated.Value(0)).current;
  const titleAnim  = useRef(new Animated.Value(0)).current;
  const titleSlide = useRef(new Animated.Value(30)).current;
  const starAnims  = [
    useRef(new Animated.Value(0)).current,
    useRef(new Animated.Value(0)).current,
    useRef(new Animated.Value(0)).current,
  ];

  useEffect(() => {
    if (pct === 1) playWin();

    Animated.sequence([
      Animated.spring(emojiAnim, { toValue: 1, friction: 4, useNativeDriver: true }),
      Animated.parallel([
        Animated.timing(titleAnim,  { toValue: 1, duration: 300, useNativeDriver: true }),
        Animated.timing(titleSlide, { toValue: 0, duration: 300, useNativeDriver: true }),
      ]),
      ...starAnims.map((a, i) =>
        Animated.spring(a, { toValue: 1, friction: 5, delay: i * 180, useNativeDriver: true })
      ),
    ]).start();
  }, []);

  const handlePress = (idx: number) => {
    if (idx === 0) router.replace({ pathname: '/game', params: { topic } });
    else if (idx === 1) router.replace('/topics');
    else router.replace('/');
  };

  return (
    <LinearGradient
      colors={['#F6D365', '#FDA085', '#F093FB', '#A855F7']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={{ flex: 1 }}
    >
      {/* Background floating decorations */}
      <FloatingEmoji emoji="⭐" top={height * 0.05} left={width * 0.06}  delay={0}    size={28} />
      <FloatingEmoji emoji="✨" top={height * 0.08} left={width * 0.78}  delay={500}  size={22} />
      <FloatingEmoji emoji="🌟" top={height * 0.78} left={width * 0.05}  delay={300}  size={26} />
      <FloatingEmoji emoji="💫" top={height * 0.82} left={width * 0.82}  delay={800}  size={22} />
      <FloatingEmoji emoji="⭐" top={height * 0.14} left={width * 0.88}  delay={200}  size={20} />
      <FloatingEmoji emoji="🎊" top={height * 0.72} left={width * 0.76}  delay={600}  size={30} />

      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        {/* Result card */}
        <View style={styles.card}>
          {/* Big result emoji */}
          <Animated.Text style={[styles.bigEmoji, { transform: [{ scale: emojiAnim }] }]}>
            {emoji}
          </Animated.Text>

          {/* Title */}
          <Animated.Text
            style={[
              styles.title,
              {
                opacity: titleAnim,
                transform: [{ translateY: titleSlide }],
              },
            ]}
          >
            {title}
          </Animated.Text>
          <Animated.Text style={[styles.sub, { opacity: titleAnim }]}>
            {sub}
          </Animated.Text>

          {/* Stars */}
          <View style={styles.starsRow}>
            {[0, 1, 2].map(i => (
              <Animated.Text
                key={i}
                style={[
                  styles.starItem,
                  {
                    transform: [{ scale: starAnims[i] }],
                    opacity: starAnims[i],
                  },
                ]}
              >
                {i < starCount ? '⭐' : '☆'}
              </Animated.Text>
            ))}
          </View>

          {/* Score */}
          <View style={styles.scorePill}>
            <Text style={styles.scoreText}>{s} / {t} Correct</Text>
          </View>

          {/* Action buttons */}
          <View style={styles.btnsWrap}>
            {ACTION_BTNS.map(({ label, colors, slab }, idx) => (
              <View key={idx} style={styles.btnOuter}>
                <TouchableOpacity
                  onPress={() => handlePress(idx)}
                  activeOpacity={0.88}
                >
                  <LinearGradient
                    colors={colors}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={styles.btnFace}
                  >
                    <Text style={styles.btnText}>{label}</Text>
                  </LinearGradient>
                </TouchableOpacity>
                <View style={[styles.btnSlab, { backgroundColor: slab }]} />
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1, alignItems: 'center', justifyContent: 'center', padding: 24,
  },
  card: {
    backgroundColor: 'rgba(255,255,255,0.95)',
    borderRadius: 36,
    padding: 32, maxWidth: 420, width: '100%',
    alignItems: 'center',
    shadowColor: '#000', shadowOpacity: 0.18,
    shadowOffset: { width: 0, height: 12 }, shadowRadius: 30, elevation: 14,
    borderWidth: 2, borderColor: 'rgba(255,255,255,0.8)',
  },
  bigEmoji: { fontSize: 90, marginBottom: 14 },
  title: {
    fontFamily: FONTS.display, fontSize: 42, color: '#1F2937',
    marginBottom: 6, textAlign: 'center',
  },
  sub: {
    fontFamily: FONTS.bodyBold, fontSize: 15, color: '#6B7280',
    marginBottom: 24, textAlign: 'center',
  },
  starsRow: { flexDirection: 'row', gap: 10, marginBottom: 20 },
  starItem: { fontSize: 50 },
  scorePill: {
    backgroundColor: '#F3F4F6',
    borderRadius: 50,
    paddingVertical: 10, paddingHorizontal: 28,
    marginBottom: 28,
  },
  scoreText: { fontFamily: FONTS.display, fontSize: 22, color: '#1F2937' },

  /* Action buttons */
  btnsWrap: { width: '100%', gap: 14 },
  btnOuter: { position: 'relative', width: '100%' },
  btnFace: {
    borderRadius: 50,
    paddingVertical: 16,
    alignItems: 'center', width: '100%',
  },
  btnSlab: {
    position: 'absolute',
    bottom: -6, left: 5, right: 5,
    height: '100%', borderRadius: 50, zIndex: -1,
  },
  btnText: { fontFamily: FONTS.display, fontSize: 22, color: '#fff' },
});
