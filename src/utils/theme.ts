import { accentColors } from '../stores/toolsStore';
import type { AppSettings } from '../types/index';

/**
 * Apply theme settings to the document root
 */
export function applyTheme(settings: AppSettings, isDarkMode: boolean): void {
  const root = document.documentElement;

  // Dark/light mode
  root.classList.toggle('dark', isDarkMode);

  // Font family
  const fontFamilies = {
    default: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    serif: "'Georgia', 'Times New Roman', serif",
    mono: "'Fira Code', 'Courier New', monospace",
  };
  root.style.setProperty('--font-family', fontFamilies[settings.fontFamily]);

  // Font weight
  const fontWeights = {
    normal: '400',
    medium: '500',
    bold: '700',
  };
  root.style.setProperty('--font-weight', fontWeights[settings.fontWeight]);

  // Accent color via CSS variable
  const accent = accentColors[settings.themeAccent] || accentColors.teal;
  root.style.setProperty('--color-accent', accent);
  
  // Calculate darker/lighter variants
  const darken = (hex: string, amount: number) => {
    const num = parseInt(hex.replace('#', ''), 16);
    const r = Math.max((num >> 16) - amount, 0);
    const g = Math.max(((num >> 8) & 0x00FF) - amount, 0);
    const b = Math.max((num & 0x0000FF) - amount, 0);
    return `#${(r << 16 | g << 8 | b).toString(16).padStart(6, '0')}`;
  };
  const lighten = (hex: string, amount: number) => {
    const num = parseInt(hex.replace('#', ''), 16);
    const r = Math.min((num >> 16) + amount, 255);
    const g = Math.min(((num >> 8) & 0x00FF) + amount, 255);
    const b = Math.min((num & 0x0000FF) + amount, 255);
    return `#${(r << 16 | g << 8 | b).toString(16).padStart(6, '0')}`;
  };
  root.style.setProperty('--color-accent-dark', darken(accent, 30));
  root.style.setProperty('--color-accent-light', lighten(accent, 30));

  // High contrast
  root.classList.toggle('high-contrast', settings.highContrast);

  // Reduce motion
  root.classList.toggle('reduce-motion', settings.reduceMotion);
}
