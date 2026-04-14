import React, { useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Animated, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { useStore } from '../store/useStore';
import { useSound } from '../hooks/useSound';
import { TOPIC_COLORS, TOPIC_LABELS as TOPIC_NAMES, FONTS } from '../constants/theme';

const { width } = Dimensions.get('window');
const CARD_W = (width - 36 - 12) / 2;   // 2-per-row, 18px padding each side, 12px gap

const DIFFICULTY = [
  '', 'Starter', 'Easy', 'Getting There', 'Warm Up',
  'Medium', 'Picking Up', 'Challenging', 'Hard', 'Super Hard', 'Expert!',
];

export default function LevelsScreen() {
  const { currentTopic, topicStats, setCurrentLevel } = useStore();
  const { playClick } = useSound();

  const topicColor   = TOPIC_COLORS[currentTopic] ?? '#6BCB77';
  const highestLevel = topicStats[currentTopic]?.highestLevel || 0;

  const cardAnims = useRef(Array.from({ length: 10 }, () => new Animated.Value(0))).current;
  const glowAnim  = useRef(new Animated.Value(0.4)).current;

  useEffect(() => {
    // Stagger cards in
    Animated.stagger(
      55,
      cardAnims.map(a =>
        Animated.spring(a, { toValue: 1, friction: 6, tension: 80, useNativeDriver: true })
      )
    ).start();

    // Current-level glow pulse
    Animated.loop(
      Animated.sequence([
        Animated.timing(glowAnim, { toValue: 1,   duration: 900, useNativeDriver: true }),
        Animated.timing(glowAnim, { toValue: 0.4, duration: 900, useNativeDriver: true }),
      ])
    ).start();
  }, []);

  const handleLevelPress = (level: number) => {
    playClick();
    setCurrentLevel(level);
    router.push('/game');
  };

  return (
    <LinearGradient
      colors={[topicColor + 'FF', topicColor + 'AA', '#1a2f50']}
      start={{ x: 0, y: 0 }}
      end={{ x: 0.6, y: 1 }}
      style={{ flex: 1 }}
    >
      <SafeAreaView style={{ flex: 1 }}>
      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <Text style={styles.topicName}>{TOPIC_NAMES[currentTopic]}</Text>
        <Text style={styles.heading}>Level Up! 🚀</Text>

        {/* Free badge */}
        <View style={styles.freeBadge}>
          <Text style={styles.freeBadgeText}>⭐ All 10 Levels FREE</Text>
        </View>

        {/* Level grid */}
        <View style={styles.grid}>
          {Array.from({ length: 10 }, (_, i) => i + 1).map(level => {
            const stars     = topicStats[currentTopic]?.stars?.[level] || 0;
            const done      = stars > 0;
            const isCurrent = !done && (level === 1 || highestLevel === level - 1);

            const cardBg   = done      ? topicColor          : 'rgba(255,255,255,0.95)';
            const numColor = done      ? '#fff'               : topicColor;
            const diffColor= done      ? 'rgba(255,255,255,0.8)' : '#9CA3AF';

            return (
              <Animated.View
                key={level}
                style={{
                  opacity: cardAnims[level - 1],
                  transform: [
                    { scale: cardAnims[level - 1].interpolate({ inputRange: [0, 1], outputRange: [0.5, 1] }) },
                    { translateY: cardAnims[level - 1].interpolate({ inputRange: [0, 1], outputRange: [30, 0] }) },
                  ],
                }}
              >
                {isCurrent ? (
                  // Current level: animated glow border
                  <Animated.View
                    style={[
                      styles.cardGlowRing,
                      {
                        borderColor: topicColor,
                        shadowColor: topicColor,
                        shadowOpacity: glowAnim,
                      },
                    ]}
                  >
                    <TouchableOpacity
                      style={[styles.card, { backgroundColor: '#fff' }]}
                      onPress={() => handleLevelPress(level)}
                      activeOpacity={0.8}
                    >
                      <CardInner
                        level={level} stars={stars} done={done}
                        numColor={topicColor} diffColor={diffColor}
                      />
                    </TouchableOpacity>
                  </Animated.View>
                ) : (
                  <TouchableOpacity
                    style={[styles.card, { backgroundColor: cardBg }]}
                    onPress={() => handleLevelPress(level)}
                    activeOpacity={0.8}
                  >
                    <CardInner
                      level={level} stars={stars} done={done}
                      numColor={numColor} diffColor={diffColor}
                    />
                  </TouchableOpacity>
                )}
              </Animated.View>
            );
          })}
        </View>

        <TouchableOpacity style={styles.backBtn} onPress={() => router.push('/topics')} activeOpacity={0.8}>
          <Text style={styles.backBtnText}>← Topics</Text>
        </TouchableOpacity>
      </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
}

function CardInner({
  level, stars, done, numColor, diffColor,
}: {
  level: number; stars: number; done: boolean; numColor: string; diffColor: string;
}) {
  return (
    <>
      <Text style={[styles.levelNum, { color: numColor }]}>{level}</Text>
      <Text style={[styles.diffLabel, { color: diffColor }]}>{DIFFICULTY[level]}</Text>
      <View style={styles.starsRow}>
        {[1, 2, 3].map(i => (
          <Text key={i} style={styles.starIcon}>
            {i <= stars ? '⭐' : '☆'}
          </Text>
        ))}
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    alignItems: 'center',
    paddingHorizontal: 18,
    paddingTop: 20,
    paddingBottom: 36,
  },
  topicName: {
    fontFamily: FONTS.display, fontSize: 22, color: 'rgba(255,255,255,0.85)',
    textAlign: 'center', marginBottom: 4,
  },
  heading: {
    fontFamily: FONTS.display, fontSize: 38, color: '#fff',
    textShadowColor: 'rgba(0,0,0,0.2)',
    textShadowOffset: { width: 2, height: 3 }, textShadowRadius: 0,
    marginBottom: 14, textAlign: 'center',
  },
  freeBadge: {
    backgroundColor: '#22C55E',
    borderRadius: 50,
    paddingVertical: 6, paddingHorizontal: 18,
    marginBottom: 26,
    shadowColor: '#15803d', shadowOpacity: 0.4,
    shadowOffset: { width: 0, height: 3 }, shadowRadius: 6, elevation: 4,
  },
  freeBadgeText: {
    fontFamily: FONTS.display, fontSize: 13, color: '#fff',
  },
  grid: {
    flexDirection: 'row', flexWrap: 'wrap',
    gap: 12, justifyContent: 'center',
    width: '100%', maxWidth: 560, marginBottom: 28,
  },

  /* Glow ring wraps the "current" card */
  cardGlowRing: {
    borderRadius: 24, borderWidth: 4,
    shadowOffset: { width: 0, height: 0 }, shadowRadius: 18, elevation: 12,
  },

  card: {
    width: CARD_W,
    borderRadius: 22,
    paddingVertical: 20, paddingHorizontal: 10,
    alignItems: 'center',
    shadowColor: '#000', shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 5 }, shadowRadius: 12, elevation: 6,
  },
  levelNum: {
    fontFamily: FONTS.display, fontSize: 42, marginBottom: 2,
  },
  diffLabel: {
    fontFamily: FONTS.display, fontSize: 10, marginBottom: 8, textAlign: 'center',
  },
  starsRow: { flexDirection: 'row', gap: 2 },
  starIcon: { fontSize: 13 },

  backBtn: {
    backgroundColor: '#fff', borderRadius: 50,
    paddingVertical: 13, paddingHorizontal: 32,
    shadowColor: '#000', shadowOpacity: 0.12,
    shadowOffset: { width: 0, height: 5 }, shadowRadius: 12, elevation: 5,
  },
  backBtnText: { fontFamily: FONTS.display, fontSize: 17, color: '#555' },
});
