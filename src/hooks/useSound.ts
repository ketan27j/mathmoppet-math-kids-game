import { useEffect, useCallback, useRef } from 'react';
import { Audio } from 'expo-audio';
import * as Haptics from 'expo-haptics';
import { useStore } from '../store/useStore';
import { TONES, ToneKey } from '../utils/toneGenerator';

type SoundMap = Partial<Record<ToneKey, Audio.Sound>>;

/**
 * useSound — synthesised tones via expo-av + haptics.
 *
 * Tones are generated as WAV data URIs by toneGenerator.ts (no bundled
 * audio files required). Audio mode is configured on mount so sounds
 * play through the media stream, bypassing Android silent/ringer mode.
 */
export function useSound() {
  const soundEnabled = useStore(s => s.settings.soundEnabled);
  const soundsRef    = useRef<SoundMap>({});

  useEffect(() => {
    let active = true;

    async function init() {
      // Allow audio to play through media volume on Android and bypass
      // iOS silent switch.
      try {
        await Audio.setAudioModeAsync({
          playsInSilentModeIOS:    true,
          allowsRecordingIOS:      false,
          staysActiveInBackground: false,
          shouldDuckAndroid:       true,
        });
      } catch (e) {
        console.warn('[useSound] setAudioMode failed:', e);
      }

      // Load all tones
      for (const key of Object.keys(TONES) as ToneKey[]) {
        try {
          const { sound } = await Audio.Sound.createAsync({ uri: TONES[key] });
          if (active) {
            soundsRef.current[key] = sound;
          } else {
            sound.unloadAsync().catch(() => {});
          }
        } catch (e) {
          console.warn(`[useSound] failed to load tone "${key}":`, e);
        }
      }
    }

    init();

    return () => {
      active = false;
      for (const sound of Object.values(soundsRef.current)) {
        sound?.unloadAsync().catch(() => {});
      }
      soundsRef.current = {};
    };
  }, []);

  const play = useCallback(async (key: ToneKey) => {
    const sound = soundsRef.current[key];
    if (!sound) return;
    try {
      await sound.replayAsync();
    } catch (_) {}
  }, []);

  const playCorrect = useCallback(async () => {
    if (!soundEnabled) return;
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
    await play('correct');
  }, [soundEnabled, play]);

  const playWrong = useCallback(async () => {
    if (!soundEnabled) return;
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error).catch(() => {});
    await play('wrong');
  }, [soundEnabled, play]);

  const playClick = useCallback(async () => {
    if (!soundEnabled) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
    await play('click');
  }, [soundEnabled, play]);

  const playWin = useCallback(async () => {
    if (!soundEnabled) return;
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
    await play('win');
  }, [soundEnabled, play]);

  return { playCorrect, playWrong, playClick, playWin };
}
