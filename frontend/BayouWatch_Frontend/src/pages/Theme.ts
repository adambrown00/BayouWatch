// theme.ts
export const theme = {
  colors: {
    primary: '#2563eb',      // brand color
    secondary: '#64748b',    // accent or muted color
    background: '#ffffff',   // page background
    surface: '#f1f5f9',      // cards and panels
    text: '#1e293b',         // default text
    success: '#16a34a',      // success messages
    danger: '#dc2626',       // error or alert
    warning: '#facc15',      // warning or highlight
  },
  spacing: {
    small: '8px',
    medium: '16px',
    large: '24px',
  },
  borderRadius: {
    small: '4px',
    medium: '8px',
    large: '12px',
  },
};

/**
 * Injects every theme value as CSS variables on :root.
 * This keeps ALL CSS in sync with the theme automatically.
 */
export function injectThemeCSSVars() {
  const root = document.documentElement;

  // Convert nested theme objects into CSS variables
  Object.entries(theme).forEach(([groupKey, groupObj]) => {
    if (typeof groupObj === 'object') {
      Object.entries(groupObj).forEach(([key, value]) => {
        root.style.setProperty(`--${groupKey}-${key}`, value.toString());
      });
    }
  });
}
