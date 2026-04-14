export const COLORS = {
  sky:            '#87CEEB',
  skyLight:       '#B0E0FF',
  grass:          '#6BCB77',
  grassDark:      '#4CAF50',
  sun:            '#FFD93D',
  white:          '#FFFFFF',
  cardBg:         'rgba(255,255,255,0.97)',

  // Topic colors
  counting:       '#FFD93D',
  addition:       '#6BCB77',
  subtraction:    '#EC4899',
  multiplication: '#6366F1',
  division:       '#FF6B35',
  shapes:         '#14B8A6',
  patterns:       '#A855F7',
  time:           '#F97316',

  // UI
  primary:        '#FF6B35',
  primaryDark:    '#c73d7a',
  purple:         '#A855F7',
  pink:           '#EC4899',
  indigo:         '#6366F1',
  teal:           '#14B8A6',
  green:          '#6BCB77',
  red:            '#EF4444',

  // Text
  textDark:       '#1F2937',
  textMid:        '#6B7280',
  textLight:      '#9CA3AF',

  // Parent dashboard
  dashBg1:        '#1e1b4b',
  dashBg2:        '#312e81',
  dashBg3:        '#4c1d95',
};

export const FONTS = {
  display:  'FredokaOne',   // for titles, buttons
  body:     'Nunito',       // for general text
  bodyBold: 'Nunito-Bold',
};

export const TOPIC_COLORS: Record<string, string> = {
  counting:       COLORS.counting,
  addition:       COLORS.addition,
  subtraction:    COLORS.subtraction,
  multiplication: COLORS.multiplication,
  division:       COLORS.division,
  shapes:         COLORS.shapes,
  patterns:       COLORS.patterns,
  time:           COLORS.time,
};

export const TOPIC_LABELS: Record<string, string> = {
  counting:       '🍎 Counting',
  addition:       '➕ Addition',
  subtraction:    '➖ Subtraction',
  multiplication: '✖️ Multiply',
  division:       '➗ Division',
  shapes:         '🔷 Shapes',
  patterns:       '🔴 Patterns',
  time:           '🕐 Time',
};

export const TOPIC_EMOJIS: Record<string, string> = {
  counting:       '🍎',
  addition:       '🐣',
  subtraction:    '🎈',
  multiplication: '🦋',
  division:       '🍕',
  shapes:         '🔷',
  patterns:       '🔴',
  time:           '🕐',
};

export const TOPIC_DESCRIPTIONS: Record<string, string> = {
  counting:       '1 · 2 · 3 · ...',
  addition:       'Adding Fun!',
  subtraction:    'Take Away!',
  multiplication: 'Groups of!',
  division:       'Share it!',
  shapes:         'Match \'em!',
  patterns:       'What\'s next?',
  time:           'Read the clock!',
};

export const ALL_TOPICS = [
  'counting','addition','subtraction',
  'multiplication','division','shapes','patterns','time'
];
