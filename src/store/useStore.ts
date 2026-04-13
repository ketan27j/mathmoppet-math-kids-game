import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ALL_TOPICS } from '../constants/theme';

export interface TopicStats {
  played:  number;
  correct: number;
  stars: Record<number, number>;
  highestLevel: number;
}

export interface GameSettings {
  soundEnabled:    boolean;
  musicEnabled:    boolean;
  confettiEnabled: boolean;
  timedMode:       boolean;
  questionsPerRound: number;
}

export interface AppState {
  // ── Lifetime stats ──
  totalStars:   number;
  gamesPlayed:  number;
  totalQs:      number;
  totalCorrect: number;
  topicStats:   Record<string, TopicStats>;
  
  isPro: boolean;

  // ── Settings ──
  settings: GameSettings;

  // ── Current session ──
  currentTopic: string;
  currentLevel: number;
  sessionScore: number;

  // ── Actions ──
  recordCorrect:  (topic: string) => void;
  recordWrong:    (topic: string) => void;
  finishGame:     (topic: string, level: number, score: number, total: number) => void;
  updateSetting:  <K extends keyof GameSettings>(key: K, value: GameSettings[K]) => void;
  resetProgress:  () => void;
  setCurrentTopic:(topic: string) => void;
  setCurrentLevel:(level: number) => void;
  activatePro:    () => void;
  loadFromStorage:() => Promise<void>;
}

const defaultTopicStats = (): Record<string, TopicStats> => {
  const out: Record<string, TopicStats> = {};
  ALL_TOPICS.forEach(t => { 
    out[t] = { 
      played: 0, 
      correct: 0,
      stars: {},
      highestLevel: 0
    }; 
  });
  return out;
};

const STORAGE_KEY = '@mathmoppet_stats_v3';

export const useStore = create<AppState>((set, get) => ({
  totalStars:   0,
  gamesPlayed:  0,
  totalQs:      0,
  totalCorrect: 0,
  topicStats:   defaultTopicStats(),
  currentTopic: 'counting',
  currentLevel: 1,
  sessionScore: 0,
  isPro: true,

  settings: {
    soundEnabled:      true,
    musicEnabled:      false,
    confettiEnabled:   true,
    timedMode:         false,
    questionsPerRound: 5,
  },

  recordCorrect: (topic) => set(s => ({
    totalStars:   s.totalStars + 1,
    totalQs:      s.totalQs + 1,
    totalCorrect: s.totalCorrect + 1,
    topicStats: {
      ...s.topicStats,
      [topic]: {
        ...s.topicStats[topic],
        played:  s.topicStats[topic].played + 1,
        correct: s.topicStats[topic].correct + 1,
      },
    },
  })),

  recordWrong: (topic) => set(s => ({
    totalQs: s.totalQs + 1,
    topicStats: {
      ...s.topicStats,
      [topic]: {
        ...s.topicStats[topic],
        played:  s.topicStats[topic].played + 1,
        correct: s.topicStats[topic].correct,
      },
    },
  })),

  finishGame: (topic, level, score, total) => {
    const pct = score / total;
    const stars = pct === 1 ? 3 : pct >= 0.6 ? 2 : 1;
    
    set(s => {
      const currentStars = s.topicStats[topic].stars[level] || 0;
      const newStars = Math.max(currentStars, stars);
      const newHighest = Math.max(s.topicStats[topic].highestLevel, stars >= 1 ? level : s.topicStats[topic].highestLevel);
      
      return {
        gamesPlayed: s.gamesPlayed + 1, 
        sessionScore: score,
        topicStats: {
          ...s.topicStats,
          [topic]: {
            ...s.topicStats[topic],
            stars: {
              ...s.topicStats[topic].stars,
              [level]: newStars
            },
            highestLevel: newHighest
          }
        }
      };
    });
    
    // Persist after game
    const state = get();
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify({
      totalStars:   state.totalStars,
      gamesPlayed:  state.gamesPlayed,
      totalQs:      state.totalQs,
      totalCorrect: state.totalCorrect,
      topicStats:   state.topicStats,
      isPro: state.isPro
    })).catch(() => {});
  },

  updateSetting: (key, value) => set(s => ({
    settings: { ...s.settings, [key]: value },
  })),

  resetProgress: () => {
    AsyncStorage.removeItem(STORAGE_KEY).catch(() => {});
    set({
      totalStars: 0, 
      gamesPlayed: 0,
      totalQs: 0, 
      totalCorrect: 0,
      topicStats: defaultTopicStats(),
    });
  },

  setCurrentTopic: (topic) => set({ currentTopic: topic }),
  setCurrentLevel: (level) => set({ currentLevel: level }),
  
  activatePro: () => set({ isPro: true }),

  loadFromStorage: async () => {
    try {
      const raw = await AsyncStorage.getItem(STORAGE_KEY);
      if (raw) {
        const data = JSON.parse(raw);
        set(s => ({
          totalStars:   data.totalStars   ?? s.totalStars,
          gamesPlayed:  data.gamesPlayed  ?? s.gamesPlayed,
          totalQs:      data.totalQs      ?? s.totalQs,
          totalCorrect: data.totalCorrect ?? s.totalCorrect,
          topicStats:   { ...defaultTopicStats(), ...(data.topicStats ?? {}) },
          isPro: data.isPro ?? false
        }));
      }
    } catch (_) {}
  },
}));