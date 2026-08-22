/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      // ── Design tokens from PROJECT.md §10.2 ──────────────────────────────
      colors: {
        navy: {
          900: '#0A1A2F', // nav bar, board panels, headings on light
          700: '#1D3557', // secondary surfaces on dark, hover state
        },
        paper: '#EDEFF2', // app background (cool grey)
        surface: '#FFFFFF', // cards, inputs, sheets
        line: '#D5DAE1', // 1px hairlines, table rules, dividers
        muted: '#5C6B7F', // secondary text, labels, placeholders
        signal: {
          DEFAULT: '#E3A008', // primary action, active route, "today" marker
          soft: '#FDF3DC', // signal at 12% — selected rows, chip backgrounds
        },
        sea: '#2A9D8F', // secondary/positive: under budget, confirmed
        alert: '#C1443B', // destructive, over budget
      },
      // ── Type scale from §10.3 ─────────────────────────────────────────────
      fontFamily: {
        display: ['Archivo', 'sans-serif'],
        body: ['Public Sans', 'sans-serif'],
        mono: ['IBM Plex Mono', 'monospace'],
      },
      fontSize: {
        '2xs': ['12px', { lineHeight: '1.5' }],
        xs: ['14px', { lineHeight: '1.5' }],
        sm: ['16px', { lineHeight: '1.5' }],
        md: ['20px', { lineHeight: '1.5' }],
        lg: ['24px', { lineHeight: '1.2' }],
        xl: ['32px', { lineHeight: '1.2' }],
      },
      // ── Spacing grid (8px base) ───────────────────────────────────────────
      spacing: {
        0.5: '4px',
        1: '8px',
        1.5: '12px',
        2: '16px',
        3: '24px',
        4: '32px',
        5: '40px',
        6: '48px',
      },
      // ── Layout ───────────────────────────────────────────────────────────
      maxWidth: {
        content: '1180px',
      },
      // ── Border radius ─────────────────────────────────────────────────────
      borderRadius: {
        none: '0',
        sm: '4px', // buttons
        DEFAULT: '6px', // cards and inputs
        full: '9999px', // pills / chips only
      },
      // ── Elevation — only one shadow (for modals/popovers) ─────────────────
      boxShadow: {
        modal: '0 8px 24px rgba(10,26,47,.12)',
      },
      // ── Focus ring ────────────────────────────────────────────────────────
      ringColor: {
        DEFAULT: '#E3A008',
      },
      ringOffsetWidth: {
        DEFAULT: '2px',
      },
    },
  },
  plugins: [],
};
