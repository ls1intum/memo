import { useEffect, useState } from 'react';
import { Theme, ThemeProviderContext } from './theme-context';

type ThemeProviderProps = {
  children: React.ReactNode;
  defaultTheme?: Theme;
  storageKey?: string;
};

function isTheme(value: string | null): value is Theme {
  return value === 'light' || value === 'dark' || value === 'system';
}

function getSystemTheme(): Exclude<Theme, 'system'> {
  return window.matchMedia('(prefers-color-scheme: dark)').matches
    ? 'dark'
    : 'light';
}

function resolveTheme(theme: Theme): Exclude<Theme, 'system'> {
  return theme === 'system' ? getSystemTheme() : theme;
}

function applyTheme(theme: Theme) {
  const root = window.document.documentElement;
  const resolvedTheme = resolveTheme(theme);

  root.classList.remove('light', 'dark');
  root.classList.add(resolvedTheme);
  root.style.colorScheme = resolvedTheme;
}

function getStoredTheme(storageKey: string, defaultTheme: Theme): Theme {
  if (typeof window === 'undefined') {
    return defaultTheme;
  }

  try {
    const storedTheme = window.localStorage.getItem(storageKey);
    return isTheme(storedTheme) ? storedTheme : defaultTheme;
  } catch {
    return defaultTheme;
  }
}

export function ThemeProvider({
  children,
  defaultTheme = 'system',
  storageKey = 'vite-ui-theme',
  ...props
}: ThemeProviderProps) {
  const [theme, setThemeState] = useState<Theme>(() =>
    getStoredTheme(storageKey, defaultTheme)
  );

  useEffect(() => {
    applyTheme(theme);

    if (theme !== 'system') {
      return;
    }

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = () => applyTheme('system');

    mediaQuery.addEventListener('change', handleChange);

    return () => {
      mediaQuery.removeEventListener('change', handleChange);
    };
  }, [theme]);

  useEffect(() => {
    const handleStorage = (event: StorageEvent) => {
      if (event.key !== storageKey) {
        return;
      }

      if (event.newValue === null) {
        setThemeState(defaultTheme);
        return;
      }

      if (isTheme(event.newValue)) {
        setThemeState(event.newValue);
      }
    };

    window.addEventListener('storage', handleStorage);

    return () => {
      window.removeEventListener('storage', handleStorage);
    };
  }, [defaultTheme, storageKey]);

  const value = {
    theme,
    setTheme: (nextTheme: Theme) => {
      try {
        window.localStorage.setItem(storageKey, nextTheme);
      } catch {
        /* localStorage unavailable */
      }

      setThemeState(nextTheme);
    },
  };

  return (
    <ThemeProviderContext.Provider {...props} value={value}>
      {children}
    </ThemeProviderContext.Provider>
  );
}
