import React from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet,
  ScrollView, Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { useStore } from '../store/useStore';
import { useSound } from '../hooks/useSound';
import {
  COLORS, FONTS, TOPIC_COLORS, TOPIC_LABELS,
  TOPIC_EMOJIS, TOPIC_DESCRIPTIONS, ALL_TOPICS,
} from '../constants/theme';

const { width } = Dimensions.get('window');
const CARD_W = (width - 48 - 12) / 2;

export default function TopicsScreen() {
  const { setCurrentTopic } = useStore();
  const { playClick } = useSound();

  const handleTopic = (topic: string) => {
    playClick();
    setCurrentTopic(topic);
    router.push('/levels');
  };

  return (
    <LinearGradient
      colors={['#87CEEB', '#B0E0FF', '#6BCB77', '#4CAF50']}
      locations={[0, 0.38, 0.38, 1]}
      style={{ flex: 1 }}
    >
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>🎯 Choose Your Adventure!</Text>

        <View style={styles.grid}>
          {ALL_TOPICS.map((topic) => (
            <TouchableOpacity
              key={topic}
              style={[styles.card, { borderColor: TOPIC_COLORS[topic] }]}
              onPress={() => handleTopic(topic)}
              activeOpacity={0.8}
            >
              <Text style={styles.cardEmoji}>{TOPIC_EMOJIS[topic]}</Text>
              <Text style={styles.cardName}>{TOPIC_LABELS[topic].slice(3)}</Text>
              <Text style={styles.cardDesc}>{TOPIC_DESCRIPTIONS[topic]}</Text>
              <View style={[styles.cardAccent, { backgroundColor: TOPIC_COLORS[topic] }]} />
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()} activeOpacity={0.8}>
          <Text style={styles.backBtnText}>🏠  Home</Text>
        </TouchableOpacity>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1, alignItems: 'center',
    paddingHorizontal: 18, paddingVertical: 28,
  },
  title: {
    fontFamily: FONTS.display, fontSize: 30, color: '#fff',
    textShadowColor: 'rgba(0,0,0,0.2)', textShadowOffset: { width: 2, height: 3 }, textShadowRadius: 0,
    marginBottom: 24, textAlign: 'center',
  },
  grid: {
    flexDirection: 'row', flexWrap: 'wrap',
    gap: 12, justifyContent: 'center', marginBottom: 28,
  },
  card: {
    width: CARD_W, backgroundColor: 'rgba(255,255,255,0.97)',
    borderRadius: 22, borderWidth: 4,
    paddingVertical: 20, paddingHorizontal: 12,
    alignItems: 'center', overflow: 'hidden',
    shadowColor: '#000', shadowOpacity: 0.12,
    shadowOffset: { width: 0, height: 6 }, shadowRadius: 14, elevation: 8,
  },
  cardEmoji: { fontSize: 42, marginBottom: 10 },
  cardName: {
    fontFamily: FONTS.display, fontSize: 17, color: '#1F2937', marginBottom: 4,
  },
  cardDesc: {
    fontFamily: FONTS.bodyBold, fontSize: 11, color: '#9CA3AF',
  },
  cardAccent: {
    position: 'absolute', bottom: 0, left: 0, right: 0, height: 5, borderRadius: 0,
  },
  backBtn: {
    backgroundColor: '#fff', borderRadius: 50,
    paddingVertical: 12, paddingHorizontal: 28,
    shadowColor: '#000', shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 4 }, shadowRadius: 10, elevation: 4,
  },
  backBtnText: { fontFamily: FONTS.display, fontSize: 18, color: '#555' },
});
