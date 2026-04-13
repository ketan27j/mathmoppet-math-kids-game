import React, { useEffect, useRef } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet,
  Animated, ScrollView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router, useLocalSearchParams } from 'expo-router';
import { FONTS, COLORS } from '../src/constants/theme';

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

  return (
    <LinearGradient colors={['#87CEEB','#B0E0FF','#6BCB77','#4CAF50']} locations={[0,0.38,0.38,1]} style={{flex:1}}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.card}>
          <Animated.Text style={[styles.bigEmoji, { transform:[{ scale: emojiAnim }] }]}>{emoji}</Animated.Text>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.sub}>{sub}</Text>

          <View style={styles.starsRow}>
            {[0,1,2].map(i => (
              <Animated.Text key={i} style={[styles.starItem, { transform:[{ scale: starAnims[i] }], opacity: starAnims[i] }]}>
                {i < starCount ? '⭐' : '☆'}
              </Animated.Text>
            ))}
          </View>

          <Text style={styles.scoreText}>⭐ {s} / {t} Correct</Text>

          <TouchableOpacity style={[styles.btn, { backgroundColor: '#FF6B35' }]} onPress={() => router.replace({ pathname:'/game', params:{topic} })}>
            <Text style={styles.btnText}>🔄  Play Again</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.btn, { backgroundColor: '#6366F1', marginTop: 12 }]} onPress={() => router.replace('/topics')}>
            <Text style={styles.btnText}>🗺️  Choose Topic</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.btn, { backgroundColor: '#14B8A6', marginTop: 12 }]} onPress={() => router.replace('/')}>
            <Text style={styles.btnText}>🏠  Home</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow:1, alignItems:'center', justifyContent:'center', padding:24 },
  card: {
    backgroundColor:'rgba(255,255,255,0.97)', borderRadius:32,
    padding:36, maxWidth:400, width:'100%', alignItems:'center',
    shadowColor:'#000', shadowOpacity:0.14, shadowOffset:{width:0,height:10}, shadowRadius:24, elevation:10,
  },
  bigEmoji: { fontSize:72, marginBottom:12 },
  title: { fontFamily:FONTS.display, fontSize:38, color:'#1F2937', marginBottom:6 },
  sub:   { fontFamily:FONTS.bodyBold, fontSize:15, color:'#9CA3AF', marginBottom:24, textAlign:'center' },
  starsRow: { flexDirection:'row', gap:12, marginBottom:20 },
  starItem: { fontSize:44 },
  scoreText: { fontFamily:FONTS.display, fontSize:24, color:COLORS.primary, marginBottom:24 },
  btn: { borderRadius:50, paddingVertical:15, paddingHorizontal:40, width:'100%', alignItems:'center',
    shadowColor:'#000', shadowOpacity:0.1, shadowOffset:{width:0,height:5}, shadowRadius:10, elevation:5 },
  btnText: { fontFamily:FONTS.display, fontSize:22, color:'#fff' },
});
