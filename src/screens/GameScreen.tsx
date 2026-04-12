import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet,
  Animated, Dimensions, ScrollView, SafeAreaView,
} from 'react-native';
import Svg, { Circle, Line, Text as SvgText } from 'react-native-svg';
import { LinearGradient } from 'expo-linear-gradient';
import { router, useLocalSearchParams } from 'expo-router';
import { useStore } from '../store/useStore';
import { useSound } from '../hooks/useSound';
import { generateQuestion, Question, CORRECT_MESSAGES, WRONG_MESSAGES } from '../utils/questionGenerator';
import { COLORS, FONTS, TOPIC_COLORS, TOPIC_LABELS } from '../constants/theme';

const { width } = Dimensions.get('window');

function ClockFace({ h, m }: { h: number; m: number }) {
  const size = 130;
  const cx = size / 2, cy = size / 2, r = size / 2 - 6;
  const toRad = (deg: number) => (deg - 90) * (Math.PI / 180);
  const hAngle = toRad(((h % 12) + m / 60) / 12 * 360);
  const mAngle = toRad((m / 60) * 360);

  return (
    <Svg width={size} height={size}>
      <Circle cx={cx} cy={cy} r={r} fill="#fff" stroke="#333" strokeWidth={4} />
      {[12, 3, 6, 9].map((n, i) => {
        const a = toRad(i * 90);
        return (
          <SvgText
            key={n} x={cx + 30 * Math.cos(a)} y={cy + 30 * Math.sin(a)}
            textAnchor="middle" alignmentBaseline="central"
            fontSize="11" fontFamily={FONTS.display} fill="#333"
          >{n}</SvgText>
        );
      })}
      {/* Hour hand */}
      <Line x1={cx} y1={cy} x2={cx + 24 * Math.cos(hAngle)} y2={cy + 24 * Math.sin(hAngle)}
        stroke="#333" strokeWidth={5} strokeLinecap="round" />
      {/* Minute hand */}
      <Line x1={cx} y1={cy} x2={cx + 34 * Math.cos(mAngle)} y2={cy + 34 * Math.sin(mAngle)}
        stroke="#EC4899" strokeWidth={3} strokeLinecap="round" />
      {/* Center dot */}
      <Circle cx={cx} cy={cy} r={5} fill="#333" />
    </Svg>
  );
}

export default function GameScreen() {
  const { currentTopic, currentLevel, settings, recordCorrect, recordWrong, finishGame } = useStore();
  const topic = currentTopic;
  const level = currentLevel;
  const { playCorrect, playWrong } = useSound();

  const TOTAL = settings.questionsPerRound;
  const [questions]  = useState<Question[]>(() =>
    Array.from({ length: TOTAL }, () => generateQuestion(topic as any, level))
  );
  const [qIdx,     setQIdx]     = useState(0);
  const [score,    setScore]    = useState(0);
  const [chosen,   setChosen]   = useState<string | number | null>(null);
  const [feedback, setFeedback] = useState<{ msg: string; correct: boolean } | null>(null);

  const progressAnim = useRef(new Animated.Value(0)).current;
  const feedbackAnim = useRef(new Animated.Value(0)).current;
  const feedbackScale = useRef(new Animated.Value(0.5)).current;

  const q = questions[qIdx];
  const color = TOPIC_COLORS[topic] ?? COLORS.primary;

  useEffect(() => {
    Animated.timing(progressAnim, {
      toValue: qIdx / TOTAL,
      duration: 400, useNativeDriver: false,
    }).start();
  }, [qIdx]);

  const showFeedback = (msg: string, correct: boolean) => {
    setFeedback({ msg, correct });
    feedbackAnim.setValue(0); feedbackScale.setValue(0.5);
    Animated.parallel([
      Animated.timing(feedbackAnim, { toValue: 1, duration: 200, useNativeDriver: true }),
      Animated.spring(feedbackScale, { toValue: 1, friction: 4, useNativeDriver: true }),
    ]).start();
  };

  const handleAnswer = useCallback((opt: string | number) => {
    if (chosen !== null) return;
    setChosen(opt);
    const isCorrect = opt === q.answer;
    if (isCorrect) {
      recordCorrect(topic);
      setScore(s => s + 1);
      playCorrect();
      showFeedback(CORRECT_MESSAGES[Math.floor(Math.random() * CORRECT_MESSAGES.length)], true);
    } else {
      recordWrong(topic);
      playWrong();
      showFeedback(WRONG_MESSAGES[Math.floor(Math.random() * WRONG_MESSAGES.length)], false);
    }

    setTimeout(() => {
      setFeedback(null); setChosen(null);
      if (qIdx + 1 >= TOTAL) {
        const finalScore = isCorrect ? score + 1 : score;
        finishGame(topic, level, finalScore, TOTAL);
        router.replace({ pathname: '/result', params: { score: finalScore, total: TOTAL, topic } });
      } else {
        setQIdx(i => i + 1);
      }
    }, 1300);
  }, [chosen, q, qIdx, score, topic]);

  const progressWidth = progressAnim.interpolate({
    inputRange: [0, 1], outputRange: ['0%', '100%'],
  });

  return (
    <LinearGradient
      colors={['#87CEEB', '#B0E0FF', '#6BCB77', '#4CAF50']}
      locations={[0, 0.38, 0.38, 1]}
      style={{ flex: 1 }}
    >
      <SafeAreaView style={{ flex: 1 }}>
        {/* Feedback overlay */}
        {feedback && (
          <Animated.View style={[styles.feedbackOverlay, { opacity: feedbackAnim }]}>
            <Animated.Text style={[styles.feedbackEmoji, { transform: [{ scale: feedbackScale }] }]}>
              {feedback.correct ? '🎉' : '💪'}
            </Animated.Text>
            <Animated.Text style={[styles.feedbackText, { transform: [{ scale: feedbackScale }] }]}>
              {feedback.msg}
            </Animated.Text>
          </Animated.View>
        )}

        <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
              <Text style={styles.backBtnText}>← Back</Text>
            </TouchableOpacity>
            <Text style={styles.qCounter}>Q {qIdx + 1} / {TOTAL}</Text>
            <View style={styles.scoreBox}>
              <Text style={styles.scoreText}>⭐ {score}</Text>
            </View>
          </View>

          {/* Progress */}
          <View style={styles.progressWrap}>
            <Animated.View style={[styles.progressBar, { width: progressWidth }]} />
          </View>

          {/* Question card */}
          <View style={styles.qCard}>
            <View style={[styles.topicLabel, { backgroundColor: color }]}>
              <Text style={styles.topicLabelText}>{TOPIC_LABELS[topic]}</Text>
            </View>

            {/* Visual */}
            <View style={styles.visualArea}>
              {q.visual === 'clock' && q.clockH !== undefined ? (
                <ClockFace h={q.clockH} m={q.clockM!} />
              ) : (
                <Text style={styles.visual} numberOfLines={3}>
                  {q.visual.slice(0, 40)}
                </Text>
              )}
            </View>

            <Text style={styles.qText}>{q.questionText}</Text>
            <Text style={styles.qHint}>{q.hint}</Text>
          </View>

          {/* Options */}
          <View style={styles.optGrid}>
            {q.options.map((opt, i) => {
              const isChosen = chosen === opt;
              const isCorrect = opt === q.answer;
              let bg = '#fff', borderC = '#e5e7eb', textC = '#1F2937';
              if (isChosen) {
                if (isCorrect) { bg = '#6BCB77'; borderC = '#4CAF50'; textC = '#fff'; }
                else           { bg = '#EF4444'; borderC = '#c62828'; textC = '#fff'; }
              } else if (chosen !== null && isCorrect) {
                bg = '#6BCB77'; borderC = '#4CAF50'; textC = '#fff';
              }
              return (
                <TouchableOpacity
                  key={i}
                  style={[styles.optBtn, { backgroundColor: bg, borderColor: borderC }]}
                  onPress={() => handleAnswer(opt)}
                  activeOpacity={0.85}
                  disabled={chosen !== null}
                >
                  <Text style={[styles.optText, { color: textC }]}>{opt}</Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, alignItems: 'center', padding: 16 },
  header: {
    width: '100%', maxWidth: 560,
    flexDirection: 'row', alignItems: 'center',
    justifyContent: 'space-between', marginBottom: 12,
  },
  backBtn: {
    backgroundColor: '#fff', borderRadius: 50,
    paddingVertical: 8, paddingHorizontal: 18,
    shadowColor: '#000', shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 3 }, shadowRadius: 8, elevation: 4,
  },
  backBtnText: { fontFamily: FONTS.display, fontSize: 15, color: '#555' },
  qCounter: {
    fontFamily: FONTS.display, fontSize: 16, color: '#fff',
    textShadowColor: 'rgba(0,0,0,0.15)', textShadowOffset: { width: 1, height: 1 }, textShadowRadius: 0,
  },
  scoreBox: {
    backgroundColor: '#fff', borderRadius: 50,
    paddingVertical: 8, paddingHorizontal: 16,
    shadowColor: '#000', shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 3 }, shadowRadius: 8, elevation: 4,
  },
  scoreText: { fontFamily: FONTS.display, fontSize: 18, color: COLORS.primary },
  progressWrap: {
    width: '100%', maxWidth: 560,
    backgroundColor: 'rgba(255,255,255,0.4)',
    borderRadius: 20, height: 13, marginBottom: 16, overflow: 'hidden',
  },
  progressBar: {
    height: '100%', borderRadius: 20,
    backgroundColor: COLORS.primary,
  },
  qCard: {
    width: '100%', maxWidth: 560,
    backgroundColor: 'rgba(255,255,255,0.97)',
    borderRadius: 28, padding: 28,
    alignItems: 'center', marginBottom: 16,
    shadowColor: '#000', shadowOpacity: 0.12,
    shadowOffset: { width: 0, height: 8 }, shadowRadius: 20, elevation: 8,
    borderWidth: 3, borderColor: 'rgba(255,255,255,0.8)',
  },
  topicLabel: {
    position: 'absolute', top: -14,
    paddingVertical: 5, paddingHorizontal: 18,
    borderRadius: 28,
    shadowColor: '#000', shadowOpacity: 0.15,
    shadowOffset: { width: 0, height: 3 }, shadowRadius: 6, elevation: 4,
  },
  topicLabelText: { fontFamily: FONTS.display, fontSize: 13, color: '#fff' },
  visualArea: { marginTop: 12, marginBottom: 10, alignItems: 'center' },
  visual: { fontSize: 40, textAlign: 'center', lineHeight: 52 },
  qText: {
    fontFamily: FONTS.display, fontSize: 46, color: '#1F2937',
    textAlign: 'center', marginBottom: 4, letterSpacing: -1,
  },
  qHint: { fontFamily: FONTS.bodyBold, fontSize: 13, color: '#bbb', textAlign: 'center' },
  optGrid: {
    width: '100%', maxWidth: 560,
    flexDirection: 'row', flexWrap: 'wrap', gap: 12,
  },
  optBtn: {
    width: (width - 32 - 12) / 2,
    borderRadius: 20, borderWidth: 4,
    paddingVertical: 20, alignItems: 'center',
    shadowColor: '#000', shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 5 }, shadowRadius: 10, elevation: 5,
  },
  optText: { fontFamily: FONTS.display, fontSize: 28, textAlign: 'center' },
  feedbackOverlay: {
    position: 'absolute', inset: 0, zIndex: 100,
    alignItems: 'center', justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.15)',
  },
  feedbackEmoji: { fontSize: 80, marginBottom: 8 },
  feedbackText: {
    fontFamily: FONTS.display, fontSize: 38, color: '#fff',
    textShadowColor: 'rgba(0,0,0,0.3)', textShadowOffset: { width: 2, height: 3 }, textShadowRadius: 0,
  },
});
