export interface ThemeColors {
  bgDark: string;
  cardDark: string;
  cardGlass: string;
  borderDark: string;
  primary: string;
  primaryGlow: string;
  primaryDark: string;
  accentGold: string;
  textLight: string;
  textMuted: string;
  textDim: string;
  danger: string;
  overlay: string;
}

export const COLORS: ThemeColors = {
  bgDark: '#0B0F17',          // Deep Midnight Void Background
  cardDark: '#161F2E',        // Sleek Dark Card Surface
  cardGlass: 'rgba(22, 31, 46, 0.85)', // Glassmorphic Card Container
  borderDark: '#233044',      // Soft Glowing Border Divider
  primary: '#8A9A86',         // Signature Sage Green Accent
  primaryGlow: 'rgba(138, 154, 134, 0.3)',
  primaryDark: '#5C6B58',     // Deep Sage Accent
  accentGold: '#D4B886',      // Champagne Accent
  textLight: '#F3F6F1',       // High-Contrast Crisp White Text
  textMuted: '#8E9BAE',       // Soft Cool Muted Text
  textDim: '#5B687C',         // Subtle Form Label Text
  danger: '#EF5350',          // Soft Red Error Alert
  overlay: 'rgba(5, 8, 13, 0.75)', // Glassy Dark Backdrop Overlay
};

export const SKIN_TONES: string[] = [
  '#FFDFC4', // Fair Light
  '#F0C08A', // Warm Beige
  '#D19B64', // Medium Golden
  '#9F6D43', // Deep Tan
  '#5C381E', // Rich Mahogany
];
