import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { useStore } from '../store/useStore';
import { useSound } from '../hooks/useSound';
import { TOPIC_COLORS, TOPIC_LABELS as TOPIC_NAMES, FONTS } from '../constants/theme';

export default function LevelsScreen() {
  const { currentTopic, topicStats, isPro, setCurrentLevel } = useStore();
  const { playClick } = useSound();
  
  const canPlayLevel = (level: number) => level === 1 || isPro;
  const highestLevel = topicStats[currentTopic]?.highestLevel || 0;
  
  const handleLevelPress = (level: number) => {
    playClick();
    if (!canPlayLevel(level)) {
      router.push('/paywall');
      return;
    }
    setCurrentLevel(level);
    router.push('/game');
  };
  
  const handleBack = () => {
    playClick();
    router.push('/topics');
  };

  return (
    <LinearGradient
      colors={['#87CEEB', '#B0E0FF', '#6BCB77', '#4CAF50']}
      locations={[0, 0.38, 0.38, 1]}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.inner} showsVerticalScrollIndicator={false}>
        
        <Text style={styles.title}>{TOPIC_NAMES[currentTopic]} — Levels</Text>
        
        <View style={styles.hintBanner}>
          <Text style={styles.hintText}>
            ⭐ Level 1 is FREE · 👑 Levels 2–10 need MathMoppet Pro
          </Text>
        </View>
        
        <View style={styles.grid}>
          {Array.from({ length: 10 }, (_, i) => i + 1).map(level => {
            const stars = topicStats[currentTopic]?.stars?.[level] || 0;
            const done = stars > 0;
            const locked = !canPlayLevel(level);
            const isCurrent = !done && (level === 1 || (highestLevel === level - 1 && canPlayLevel(level)));
            
            return (
              <TouchableOpacity
                key={level}
                style={[
                  styles.levelButton,
                  done && { borderColor: TOPIC_COLORS[currentTopic], backgroundColor: `${TOPIC_COLORS[currentTopic]}15` },
                  isCurrent && !locked && styles.currentLevel,
                  locked && styles.lockedLevel
                ]}
                onPress={() => handleLevelPress(level)}
                activeOpacity={locked ? 1 : 0.8}
              >
                {locked && <Text style={styles.lockIcon}>🔒</Text>}
                <Text style={[styles.levelNumber, { color: locked ? '#bbb' : TOPIC_COLORS[currentTopic] }]}>
                  {level}
                </Text>
                <Text style={styles.starsText}>
                  {done ? '⭐'.repeat(stars) + '☆'.repeat(3 - stars) : ''}
                </Text>
                <View style={[
                  styles.levelTag,
                  locked ? styles.tagLocked : level === 1 ? styles.tagFree : styles.tagPro
                ]}>
                  <Text style={styles.tagText}>
                    {locked ? '🔒 Pro' : level === 1 ? 'FREE' : '👑 Pro'}
                  </Text>
                </View>
                <Text style={styles.diffText}>
                  {['', 'Starter', 'Easy', 'Getting There', 'Warm Up', 'Medium', 'Picking Up', 'Challenging', 'Hard', 'Super Hard', 'Expert!'][level]}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
        
        <TouchableOpacity style={styles.backButton} onPress={handleBack} activeOpacity={0.8}>
          <Text style={styles.backButtonText}>← Topics</Text>
        </TouchableOpacity>
        
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  inner: {
    flexGrow: 1,
    alignItems: 'center',
    padding: 18,
    paddingTop: 30,
    paddingBottom: 40
  },
  title: {
    fontFamily: FONTS.display,
    fontSize: 32,
    color: '#fff',
    textShadowColor: 'rgba(0,0,0,0.2)',
    textShadowOffset: { width: 2, height: 4 },
    marginBottom: 20,
    textAlign: 'center'
  },
  hintBanner: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 14,
    padding: 10,
    marginBottom: 20,
    maxWidth: 600,
    width: '100%',
    alignItems: 'center',
    backdropFilter: 'blur(6px)'
  },
  hintText: {
    fontFamily: FONTS.display,
    fontSize: 13,
    color: '#fff'
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    maxWidth: 600,
    width: '100%',
    marginBottom: 20
  },
  levelButton: {
    width: '18%',
    minWidth: 70,
    backgroundColor: 'rgba(255,255,255,0.97)',
    borderRadius: 18,
    padding: 12,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 100,
    borderWidth: 3,
    borderColor: '#e5e7eb',
    shadowColor: 'rgba(0,0,0,0.13)',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 1,
    shadowRadius: 32,
    elevation: 6
  },
  currentLevel: {
    shadowColor: 'rgba(99,102,241,0.3)',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 3
  },
  lockedLevel: {
    opacity: 0.75,
    filter: 'grayscale(0.5)'
  },
  lockIcon: {
    fontSize: 18,
    marginBottom: 2
  },
  levelNumber: {
    fontFamily: FONTS.display,
    fontSize: 22
  },
  starsText: {
    fontSize: 10,
    letterSpacing: 1,
    minHeight: 13,
    marginTop: 3
  },
  levelTag: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
    marginTop: 6
  },
  tagFree: { backgroundColor: '#D1FAE5' },
  tagPro: { backgroundColor: '#FEF3C7' },
  tagLocked: { backgroundColor: '#F3F4F6' },
  tagText: {
    fontFamily: FONTS.display,
    fontSize: 9,
    color: '#333'
  },
  diffText: {
    fontFamily: FONTS.display,
    fontSize: 9,
    color: '#bbb',
    marginTop: 3
  },
  backButton: {
    backgroundColor: '#fff',
    borderRadius: 50,
    paddingHorizontal: 22,
    paddingVertical: 10,
    shadowColor: 'rgba(0,0,0,0.12)',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 12,
    elevation: 4
  },
  backButtonText: {
    fontFamily: FONTS.display,
    fontSize: 15,
    color: '#555'
  }
});