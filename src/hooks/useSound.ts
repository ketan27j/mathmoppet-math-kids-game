import { useCallback } from 'react';
import { Audio } from 'expo-av';
import * as Haptics from 'expo-haptics';
import { useStore } from '../store/useStore';

/**
 * useSound — play synthesised tones via Expo AV + haptics.
 * Falls back silently if audio is unavailable.
 */
export function useSound() {
  const soundEnabled = useStore(s => s.settings.soundEnabled);

  const playCorrect = useCallback(async () => {
    if (!soundEnabled) return;
    try {
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      // In production replace with actual .mp3 assets:
      // const { sound } = await Audio.Sound.createAsync(require('../assets/sounds/correct.mp3'));
      // await sound.playAsync();
    } catch (_) {}
  }, [soundEnabled]);

  const playWrong = useCallback(async () => {
    if (!soundEnabled) return;
    try {
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    } catch (_) {}
  }, [soundEnabled]);

  const playClick = useCallback(async () => {
    if (!soundEnabled) return;
    try {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    } catch (_) {}
  }, [soundEnabled]);

  const playWin = useCallback(async () => {
    if (!soundEnabled) return;
    try {
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } catch (_) {}
  }, [soundEnabled]);

  return { playCorrect, playWrong, playClick, playWin };
}
