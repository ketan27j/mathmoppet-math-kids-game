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
  const h = config.h ? pick(config.h) : rnd(1, 12);
  let m = 0;
  if (ty === 'oc') m = 0;
  else if (ty === 'hf') m = 30;
  else if (ty === 'qt') m = pick([15, 45]);
  else if (ty === '5m') m = pick([5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55]);
  else m = pick([0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55]);
  
  const fmt = (hh: number, mm: number) => mm === 0 ? `${hh}:00` : `${hh}:${mm < 10 ? '0' + mm : mm}`;
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
export function generateQuestion(topic: TopicType, level: number = 1): Question {
  const c = getConfig(topic, level);
  
  switch (topic) {
    case 'counting': {
      const em = pick(COUNTING_EMOJIS);
      const n  = rnd(c.n[0], c.n[1]);
      return {
        topic, visual: n <= 15 ? em.repeat(n) : '',
        questionText: `How many ${em}?`, hint: n > 15 ? `(Count shown: ${n})` : 'Count them all!',
        answer: n, options: makeNumOpts(n, Math.max(3, Math.ceil(n * 0.4)), 1), optionType: 'num',
      };
    }
    case 'addition': {
      const em = pick(ADDITION_EMOJIS);
      const a = rnd(1, c.a), b = rnd(1, c.b);
      return {
        topic,
        visual: a + b <= 12 ? `${em.repeat(a)} + ${em.repeat(b)}` : '',
        questionText: `${a} + ${b} = ?`, hint: 'Add the numbers!',
        answer: a + b, options: makeNumOpts(a + b, Math.max(4, Math.ceil((a + b) * 0.3)), 0), optionType: 'num',
      };
    }
    case 'subtraction': {
      const em = pick(SUBTR_EMOJIS);
      const a = rnd(2, c.a), b = rnd(1, Math.min(a, c.b));
      return {
        topic, visual: a <= 10 ? em.repeat(a) : '',
        questionText: `${a} − ${b} = ?`, hint: 'Take away!',
        answer: a - b, options: makeNumOpts(a - b, Math.max(3, Math.ceil(a * 0.3)), 0), optionType: 'num',
      };
    }
    case 'multiplication': {
      const em = pick(MULTI_EMOJIS);
      const a = rnd(1, c.a), b = rnd(1, c.b);
      return {
        topic,
        visual: a <= 4 && b <= 5 ? Array.from({ length: a }, () => em.repeat(b)).join(' ') : '',
        questionText: `${a} × ${b} = ?`, hint: 'Groups of!',
        answer: a * b, options: makeNumOpts(a * b, Math.max(4, Math.ceil(a * b * 0.4)), 0), optionType: 'num',
      };
    }
    case 'division': {
      const em = pick(DIV_EMOJIS);
      const b = pick(c.d), a = b * rnd(2, c.q);
      return {
        topic, visual: a <= 12 ? em.repeat(a) : '',
        questionText: `${a} ÷ ${b} = ?`, hint: 'Share equally!',
        answer: a / b, options: makeNumOpts(a / b, Math.max(3, Math.ceil(a / b * 0.5)), 1), optionType: 'num',
      };
    }
    case 'shapes': {
      const names = SHAPE_DATA.slice(0, Math.min(c.s, 7));
      const target = pick(names);
      const others = shuffle(names.filter(n => n.name !== target.name).map(n => n.emoji)).slice(0, 3);
      return {
        topic, visual: '',
        questionText: `Find the ${target.name}!`, hint: 'Tap the right shape!',
        answer: target.emoji, options: shuffle([target.emoji, ...others]), optionType: 'shape',
      };
    }
    case 'patterns': {
      const { seq, answer } = makePattern(c.t, c.l);
      return {
        topic, visual: seq.join('  '),
        questionText: 'What comes next?', hint: 'Look at the pattern!',
        answer, options: makePatternOpts(answer), optionType: 'pattern',
      };
    }
    case 'time': {
      const { h, m, label, opts } = makeTime(c);
      return {
        topic, visual: 'clock',
        questionText: 'What time is it?', hint: 'Read the clock hands!',
        answer: label, options: opts, optionType: 'text',
        clockH: h, clockM: m,
      };
    }
  }
}

export const CORRECT_MESSAGES = ['Amazing! 🎉','Super! ⭐','Wow! 🌟','Perfect! 🏆','Great job! 🎊','Brilliant! 🌈'];
export const WRONG_MESSAGES   = ['Almost! 💪','Try again! 🤗','Keep going! 🌈','You got this! ✨'];

export const DIFFICULTY_LABELS = ['', 'Starter', 'Easy', 'Getting There', 'Warm Up', 'Medium', 'Picking Up', 'Challenging', 'Hard', 'Super Hard', 'Expert!'];