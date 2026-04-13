export type TopicType =
  | 'counting' | 'addition' | 'subtraction'
  | 'multiplication' | 'division'
  | 'shapes' | 'patterns' | 'time';

export type OptionType = 'num' | 'shape' | 'pattern' | 'text';

export interface Question {
  topic: TopicType;
  visual: string;          // emoji string, 'clock', or sequence
  questionText: string;
  hint: string;
  answer: string | number;
  options: (string | number)[];
  optionType: OptionType;
  // For clock questions
  clockH?: number;
  clockM?: number;
}

// Track previously asked questions to prevent repetition


// ──────── helpers ────────
const rnd = (a: number, b: number) => Math.floor(Math.random() * (b - a + 1)) + a;
const pick = <T>(arr: T[]): T => arr[rnd(0, arr.length - 1)];
const shuffle = <T>(arr: T[]): T[] => {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};

const makeNumOpts = (answer: number, range: number, min = 0): number[] => {
  const set = new Set<number>([answer]);
  let tries = 0;
  while (set.size < 4 && tries++ < 80) {
    const w = answer + rnd(-range, range);
    if (w >= min && w !== answer) set.add(w);
  }
  return shuffle([...set]);
};

// ──────── Level Configurations (10 levels per topic) ────────
function getConfig(topic: TopicType, level: number) {
  const configs: Record<TopicType, any[]> = {
    counting: [
      {n: [1, 3]}, {n: [1, 5]}, {n: [3, 8]}, {n: [5, 10]}, {n: [8, 15]},
      {n: [10, 20]}, {n: [15, 25]}, {n: [20, 30]}, {n: [25, 40]}, {n: [30, 50]}
    ],
    addition: [
      {a: 3, b: 3}, {a: 5, b: 5}, {a: 7, b: 7}, {a: 9, b: 9}, {a: 12, b: 12},
      {a: 15, b: 15}, {a: 20, b: 20}, {a: 30, b: 30}, {a: 50, b: 50}, {a: 99, b: 99}
    ],
    subtraction: [
      {a: 5, b: 3}, {a: 8, b: 5}, {a: 10, b: 8}, {a: 12, b: 10}, {a: 15, b: 12},
      {a: 20, b: 18}, {a: 30, b: 25}, {a: 50, b: 45}, {a: 75, b: 65}, {a: 100, b: 95}
    ],
    multiplication: [
      {a: 2, b: 2}, {a: 3, b: 3}, {a: 4, b: 4}, {a: 5, b: 5}, {a: 6, b: 6},
      {a: 7, b: 7}, {a: 8, b: 8}, {a: 9, b: 9}, {a: 10, b: 10}, {a: 12, b: 12}
    ],
    division: [
      {d: [2], q: 4}, {d: [2, 3], q: 5}, {d: [2, 3, 4], q: 6}, {d: [2, 3, 4, 5], q: 7}, {d: [3, 4, 5, 6], q: 8},
      {d: [4, 5, 6, 7], q: 9}, {d: [5, 6, 7, 8], q: 10}, {d: [6, 7, 8, 9], q: 10}, {d: [7, 8, 9, 10], q: 11}, {d: [8, 9, 10, 11, 12], q: 12}
    ],
    shapes: [
      {s: 3}, {s: 4}, {s: 4}, {s: 5}, {s: 5},
      {s: 6}, {s: 6}, {s: 7}, {s: 7}, {s: 7}
    ],
    patterns: [
      {t: 'AB', l: 4}, {t: 'AB', l: 6}, {t: 'AAB', l: 6}, {t: 'ABB', l: 6}, {t: 'ABC', l: 6},
      {t: 'AABB', l: 8}, {t: 'ABAC', l: 8}, {t: 'ABBA', l: 8}, {t: 'ABCAB', l: 10}, {t: 'ABCBA', l: 10}
    ],
    time: [
      {ty: ['oc'], h: [3, 6, 9, 12]}, {ty: ['oc']}, {ty: ['hf'], h: [1, 2, 3, 4, 5, 6]}, {ty: ['hf']}, {ty: ['oc', 'hf']},
      {ty: ['qt']}, {ty: ['oc', 'hf', 'qt']}, {ty: ['5m']}, {ty: ['oc', 'hf', 'qt', '5m']}, {ty: ['any']}
    ]
  };
  
  return configs[topic][Math.min(level - 1, 9)];
}

// ──────── data tables ────────
const COUNTING_EMOJIS = ['🍎','🍊','🍋','🍇','🌸','⭐','🐥','🍩','🎈','🐸','🌻','🦄'];
const ADDITION_EMOJIS  = ['🐣','🌟','🍭','🎉','🦄'];
const SUBTR_EMOJIS     = ['🎈','🍪','🌺','🍬','🐠','🌙'];
const MULTI_EMOJIS     = ['🦋','🌼','🐝','🌙','🍄','⭐'];
const DIV_EMOJIS       = ['🍕','🍰','🍫','🍉','🍦','🎁'];

const SHAPE_DATA = [
  { name: 'Circle',   emoji: '⭕' },
  { name: 'Square',   emoji: '🟥' },
  { name: 'Triangle', emoji: '🔺' },
  { name: 'Diamond',  emoji: '🔷' },
  { name: 'Star',     emoji: '⭐' },
  { name: 'Heart',    emoji: '❤️' },
  { name: 'Pentagon', emoji: '⬠' }
];

const PATTERN_EMOJIS = ['🔴','🔵','🟡','🟢','🟣','⭐','🌙','🐱','🐶','🍎','🍊','🎀'];

// ──────── Pattern Generator ────────
function makePattern(type: string, length: number) {
  const em = shuffle([...PATTERN_EMOJIS]).slice(0, 5);
  const templates: Record<string, number[]> = {
    AB: [0,1], AAB: [0,0,1], ABB: [0,1,1], ABC: [0,1,2],
    AABB: [0,0,1,1], ABAC: [0,1,0,2], ABBA: [0,1,1,0],
    ABCAB: [0,1,2,0,1], ABCBA: [0,1,2,1,0]
  };
  const tpl = templates[type] || [0,1];
  const full: string[] = [];
  let i = 0;
  while (full.length < length + 1) {
    full.push(em[tpl[i % tpl.length]]);
    i++;
  }
  return {
    seq: [...full.slice(0, length), '?'],
    answer: full[length]
  };
}

function makePatternOpts(answer: string): string[] {
  const pool = shuffle([...PATTERN_EMOJIS]).filter(e => e !== answer);
  return shuffle([answer, ...pool.slice(0, 3)]);
}

// ──────── Time Generator ────────
function makeTime(config: any) {
  const types = config.ty || ['oc'];
  const ty = pick(types);
  const h: number = config.h ? pick(config.h as number[]) : rnd(1, 12);
  let m = 0;
  if (ty === 'oc') m = 0;
  else if (ty === 'hf') m = 30;
  else if (ty === 'qt') m = pick([15, 45]);
  else if (ty === '5m') m = pick([5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55]);
  else m = pick([0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55]);
  
  const fmt = (hh: any, mm: number) => mm === 0 ? `${hh}:00` : `${hh}:${mm < 10 ? '0' + mm : mm}`;
  const label = fmt(h, m);
  const decoys = new Set([label]);
  
  while (decoys.size < 4) {
    const dh = rnd(1, 12);
    const dm = pick([0, 0, 30, 15, 45, m]);
    const d = fmt(dh, dm);
    if (d !== label) decoys.add(d);
  }
  
  return { h, m, label, opts: shuffle([...decoys]) };
}

// ──────── main generator ────────
export const CORRECT_MESSAGES = ['Amazing! 🎉','Super! ⭐','Wow! 🌟','Perfect! 🏆','Great job! 🎊','Brilliant! 🌈'];
export const WRONG_MESSAGES   = ['Almost! 💪','Try again! 🤗','Keep going! 🌈','You got this! ✨'];

export const DIFFICULTY_LABELS = ['', 'Starter', 'Easy', 'Getting There', 'Warm Up', 'Medium', 'Picking Up', 'Challenging', 'Hard', 'Super Hard', 'Expert!'];

// ──────── main generator ────────
export function generateQuestion(topic: TopicType, level: number): Question {
  const cfg = getConfig(topic, level);

  if (topic === 'counting') {
    const [min, max] = cfg.n;
    const n = rnd(min, max);
    const emoji = pick(COUNTING_EMOJIS);
    return {
      topic,
      visual: emoji.repeat(n),
      questionText: 'How many?',
      hint: `Count the ${emoji}s`,
      answer: n,
      options: makeNumOpts(n, 3, 0),
      optionType: 'num',
    };
  }

  if (topic === 'addition') {
    const a = rnd(0, cfg.a), b = rnd(0, cfg.b);
    const answer = a + b;
    const emoji = pick(ADDITION_EMOJIS);
    const visual = (a + b <= 16)
      ? `${emoji.repeat(a)} + ${emoji.repeat(b)}`
      : `${emoji} ${a} + ${b} ${emoji}`;
    return {
      topic,
      visual,
      questionText: `${a} + ${b} = ?`,
      hint: 'Add them together!',
      answer,
      options: makeNumOpts(answer, Math.max(3, Math.ceil(answer * 0.25)), 0),
      optionType: 'num',
    };
  }

  if (topic === 'subtraction') {
    const b = rnd(0, cfg.b), a = rnd(b, cfg.a);
    const answer = a - b;
    const emoji = pick(SUBTR_EMOJIS);
    const visual = (a <= 16)
      ? `${emoji.repeat(a)} - ${emoji.repeat(b)}`
      : `${emoji} ${a} - ${b} ${emoji}`;
    return {
      topic,
      visual,
      questionText: `${a} - ${b} = ?`,
      hint: 'Take them away!',
      answer,
      options: makeNumOpts(answer, Math.max(3, Math.ceil(a * 0.3)), 0),
      optionType: 'num',
    };
  }

  if (topic === 'multiplication') {
    const a = rnd(1, cfg.a), b = rnd(1, cfg.b);
    const answer = a * b;
    const emoji = pick(MULTI_EMOJIS);
    const rows = Math.min(a, 4), cols = Math.min(b, 5);
    const visual = Array.from({ length: rows }, () => emoji.repeat(cols)).join('\n');
    return {
      topic,
      visual,
      questionText: `${a} × ${b} = ?`,
      hint: `${a} groups of ${b}`,
      answer,
      options: makeNumOpts(answer, Math.max(5, Math.ceil(answer * 0.3)), 0),
      optionType: 'num',
    };
  }

  if (topic === 'division') {
    const d = pick(cfg.d as number[]);
    const q = rnd(1, cfg.q);
    const a = d * q;
    const emoji = pick(DIV_EMOJIS);
    return {
      topic,
      visual: emoji.repeat(Math.min(a, 10)),
      questionText: `${a} ÷ ${d} = ?`,
      hint: `Split into ${d} equal groups`,
      answer: q,
      options: makeNumOpts(q, Math.max(3, Math.ceil(cfg.q * 0.4)), 1),
      optionType: 'num',
    };
  }

  if (topic === 'shapes') {
    const count = cfg.s as number;
    const pool = SHAPE_DATA.slice(0, count);
    const shape = pick(pool);
    const distractors = SHAPE_DATA.filter(s => s.name !== shape.name);
    const opts = shuffle([shape, ...shuffle(distractors).slice(0, 3)]).map(s => s.name);
    return {
      topic,
      visual: shape.emoji,
      questionText: 'What shape is this?',
      hint: 'Name this shape!',
      answer: shape.name,
      options: opts,
      optionType: 'shape',
    };
  }

  if (topic === 'patterns') {
    const { t, l } = cfg;
    const { seq, answer } = makePattern(t, l);
    return {
      topic,
      visual: seq.join(' '),
      questionText: 'What comes next?',
      hint: `Look at the pattern!`,
      answer,
      options: makePatternOpts(answer),
      optionType: 'pattern',
    };
  }

  // topic === 'time'
  const { h, m, label, opts } = makeTime(cfg);
  return {
    topic,
    visual: 'clock',
    questionText: 'What time is it?',
    hint: 'Look at the clock!',
    answer: label,
    options: opts,
    optionType: 'text',
    clockH: h,
    clockM: m,
  };
}