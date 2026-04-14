/**
 * toneGenerator.ts
 *
 * Synthesises short musical tones entirely in JS and encodes them as
 * base64 WAV data URIs so expo-av can play them without any bundled
 * audio files.
 *
 * Supported APIs: ArrayBuffer / DataView / Uint8Array / btoa
 * — all available in React Native's Hermes engine.
 */

interface Note {
  freq: number;  // Hz
  dur:  number;  // seconds
  vol?: number;  // 0–1  (default 0.55)
}

function writeStr(view: DataView, offset: number, str: string) {
  for (let i = 0; i < str.length; i++) {
    view.setUint8(offset + i, str.charCodeAt(i));
  }
}

function buildWAV(notes: Note[], sampleRate = 22050): string {
  // ── 1. Generate PCM samples ─────────────────────────────────────
  const allSamples: number[] = [];

  for (const { freq, dur, vol = 0.55 } of notes) {
    const n    = Math.floor(sampleRate * dur);
    const fade = Math.max(1, Math.floor(Math.min(n * 0.12, sampleRate * 0.012)));

    for (let i = 0; i < n; i++) {
      const t   = i / sampleRate;
      const env = Math.min(1, i / fade) * Math.min(1, (n - i) / fade);
      allSamples.push(
        Math.round(Math.sin(2 * Math.PI * freq * t) * vol * env * 32767)
      );
    }
  }

  // ── 2. Build WAV binary ─────────────────────────────────────────
  const dataLen = allSamples.length * 2;
  const buf     = new ArrayBuffer(44 + dataLen);
  const view    = new DataView(buf);

  writeStr(view,  0, 'RIFF');
  view.setUint32(  4, 36 + dataLen, true);
  writeStr(view,  8, 'WAVE');
  writeStr(view, 12, 'fmt ');
  view.setUint32( 16, 16, true);           // PCM chunk size
  view.setUint16( 20,  1, true);           // PCM format
  view.setUint16( 22,  1, true);           // mono
  view.setUint32( 24, sampleRate, true);
  view.setUint32( 28, sampleRate * 2, true); // byte rate
  view.setUint16( 32,  2, true);           // block align
  view.setUint16( 34, 16, true);           // bits per sample
  writeStr(view, 36, 'data');
  view.setUint32( 40, dataLen, true);

  for (let i = 0; i < allSamples.length; i++) {
    view.setInt16(44 + i * 2, allSamples[i], true);
  }

  // ── 3. Encode to base64 data URI ────────────────────────────────
  const bytes = new Uint8Array(buf);
  let bin = '';
  // Chunked to avoid stack overflow on large arrays
  const CHUNK = 8192;
  for (let i = 0; i < bytes.length; i += CHUNK) {
    bin += String.fromCharCode(
      ...Array.from(bytes.subarray(i, Math.min(i + CHUNK, bytes.length)))
    );
  }
  return 'data:audio/wav;base64,' + btoa(bin);
}

// ── Pre-computed tones ──────────────────────────────────────────────
// Each is a base64 WAV data URI ready for Audio.Sound.createAsync()

export const TONES = {
  /** Bright two-note chime — correct answer */
  correct: buildWAV([
    { freq: 784,  dur: 0.12 },   // G5
    { freq: 1047, dur: 0.22 },   // C6
  ]),

  /** Descending bwoop — wrong answer */
  wrong: buildWAV([
    { freq: 349, dur: 0.13, vol: 0.5 },  // F4
    { freq: 277, dur: 0.22, vol: 0.4 },  // C#4
  ]),

  /** Short tick — button press */
  click: buildWAV([
    { freq: 1100, dur: 0.05, vol: 0.35 },
  ]),

  /** Ascending arpeggio — game complete / win */
  win: buildWAV([
    { freq: 523,  dur: 0.12 },  // C5
    { freq: 659,  dur: 0.12 },  // E5
    { freq: 784,  dur: 0.12 },  // G5
    { freq: 1047, dur: 0.28 },  // C6
  ]),
} as const;

export type ToneKey = keyof typeof TONES;
