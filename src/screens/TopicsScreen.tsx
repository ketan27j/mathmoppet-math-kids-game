import React, { useEffect, useRef } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet,
  ScrollView, Dimensions, Animated,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { useStore } from '../store/useStore';
import { useSound } from '../hooks/useSound';
import {
  FONTS, TOPIC_LABELS,
  TOPIC_EMOJIS, TOPIC_DESCRIPTIONS, ALL_TOPICS,
} from '../constants/theme';

const { width } = Dimensions.get('window');
const CARD_W = (width - 48 - 12) / 2;

const TOPIC_GRADIENTS: Record<string, [string, string]> = {
  counting:       ['#FFE55C', '#FFB700'],
  addition:       ['#7EE47E', '#3DAF3D'],
  subtraction:    ['#F8A0CC', '#E91E8C'],
  multiplication: ['#9EA2FB', '#5558EF'],
  division:       ['#FFAA78', '#E85A00'],
  shapes:         ['#5EE5DC', '#0FA89D'],
  patterns:       ['#CC88FA', '#9333EA'],
  time:           ['#FFAA50', '#EA6C00'],
};

export default function TopicsScreen() {
  const { setCurrentTopic } = useStore();
  const { playClick } = useSound();

  const cardAnims = useRef(ALL_TOPICS.map(() => new Animated.Value(0))).current;

  useEffect(() => {
    Animated.stagger(
      70,
      cardAnims.map(a =>
        Animated.spring(a, { toValue: 1, friction: 6, tension: 80, useNativeDriver: true })
      )
    ).start();
  }, []);

  const handleTopic = (topic: string) => {
    playClick();
    setCurrentTopic(topic);
    router.push('/levels');
  };

  return (
    <LinearGradient
      colors={['#0F2040', '#1a3060', '#2C4E80']}
      style={{ flex: 1 }}
    >
      <SafeAreaView style={{ flex: 1 }}>
      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.title}>🎯 Choose a Topic!</Text>
        <Text style={styles.subtitle}>Pick your adventure and start learning</Text>

        <View style={styles.grid}>
          {ALL_TOPICS.map((topic, index) => {
            const anim = cardAnims[index];
            const gradient = TOPIC_GRADIENTS[topic] ?? ['#ccc', '#999'];
            const name = TOPIC_LABELS[topic].replace(/^\S+\s/, ''); // strip leading emoji

            return (
              <Animated.View
                key={topic}
                style={{
                  opacity: anim,
                  transform: [
                    { scale: anim.interpolate({ inputRange: [0, 1], outputRange: [0.6, 1] }) },
                    { translateY: anim.interpolate({ inputRange: [0, 1], outputRange: [20, 0] }) },
                  ],
                }}
              >
                <TouchableOpacity
                  onPress={() => handleTopic(topic)}
                  activeOpacity={0.82}
                >
                  <LinearGradient
                    colors={gradient}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.card}
                  >
                    <Text style={styles.cardEmoji}>{TOPIC_EMOJIS[topic]}</Text>
                    <Text style={styles.cardName}>{name}</Text>
                    <Text style={styles.cardDesc}>{TOPIC_DESCRIPTIONS[topic]}</Text>
                  </LinearGradient>
                </TouchableOpacity>
              </Animated.View>
            );
          })}
        </View>

        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()} activeOpacity={0.8}>
          <Text style={styles.backBtnText}>🏠  Home</Text>
        </TouchableOpacity>
      </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1, alignItems: 'center',
    paddingHorizontal: 18, paddingTop: 20, paddingBottom: 32,
  },
  title: {
    fontFamily: FONTS.display, fontSize: 34, color: '#fff',
    textShadowColor: 'rgba(0,0,0,0.3)',
    textShadowOffset: { width: 2, height: 3 }, textShadowRadius: 0,
    marginBottom: 6, textAlign: 'center',
  },
  subtitle: {
    fontFamily: FONTS.body, fontSize: 14, color: 'rgba(255,255,255,0.65)',
    marginBottom: 28, textAlign: 'center',
  },
  grid: {
    flexDirection: 'row', flexWrap: 'wrap',
    gap: 12, justifyContent: 'center', marginBottom: 32,
  },
  card: {
    width: CARD_W,
    borderRadius: 28,
    paddingVertical: 24, paddingHorizontal: 14,
    alignItems: 'center',
    borderWidth: 3, borderColor: 'rgba(255,255,255,0.3)',
    shadowColor: '#000', shadowOpacity: 0.25,
    shadowOffset: { width: 0, height: 8 }, shadowRadius: 18,
    elevation: 10,
  },
  cardEmoji: { fontSize: 60, marginBottom: 10 },
  cardName: {
    fontFamily: FONTS.display, fontSize: 20, color: '#fff',
    marginBottom: 4, textAlign: 'center',
    textShadowColor: 'rgba(0,0,0,0.2)',
    textShadowOffset: { width: 1, height: 2 }, textShadowRadius: 0,
  },
  cardDesc: {
    fontFamily: FONTS.bodyBold, fontSize: 12,
    color: 'rgba(255,255,255,0.82)', textAlign: 'center',
  },
  backBtn: {
    backgroundColor: '#fff', borderRadius: 50,
    paddingVertical: 13, paddingHorizontal: 32,
    shadowColor: '#000', shadowOpacity: 0.12,
    shadowOffset: { width: 0, height: 5 }, shadowRadius: 12, elevation: 5,
  },
  backBtnText: { fontFamily: FONTS.display, fontSize: 18, color: '#333' },
});
