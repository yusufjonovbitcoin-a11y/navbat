import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode
} from 'react';
import { messagesRu, messagesUz, type MessageKey } from '@/app/i18n/messages';

export type AppLocale = 'uz' | 'ru';

const STORAGE_KEY = 'medform-locale';

const dictionaries: Record<AppLocale, Record<MessageKey, string>> = {
  uz: messagesUz as Record<MessageKey, string>,
  ru: messagesRu
};

function readStoredLocale(): AppLocale {
  try {
    const s = localStorage.getItem(STORAGE_KEY);
    if (s === 'ru' || s === 'uz') return s;
  } catch {
    /* ignore */
  }
  return 'uz';
}

function interpolate(
  template: string,
  vars?: Record<string, string | number>
): string {
  if (!vars) return template;
  return template.replace(/\{(\w+)\}/g, (_, name: string) =>
    vars[name] != null ? String(vars[name]) : `{${name}}`
  );
}

export function dateLocaleFor(appLocale: AppLocale): string {
  return appLocale === 'ru' ? 'ru-RU' : 'uz-UZ';
}

interface LanguageContextValue {
  locale: AppLocale;
  setLocale: (l: AppLocale) => void;
  t: (key: MessageKey, vars?: Record<string, string | number>) => string;
  dateLocale: string;
}

const LanguageContext = createContext<LanguageContextValue | null>(null);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<AppLocale>(() =>
    typeof window !== 'undefined' ? readStoredLocale() : 'uz'
  );

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, locale);
    } catch {
      /* ignore */
    }
    document.documentElement.lang = locale === 'ru' ? 'ru' : 'uz';
  }, [locale]);

  const setLocale = useCallback((l: AppLocale) => {
    setLocaleState(l);
  }, []);

  const t = useCallback(
    (key: MessageKey, vars?: Record<string, string | number>) => {
      const raw =
        dictionaries[locale][key] ?? dictionaries.uz[key] ?? String(key);
      return interpolate(raw, vars);
    },
    [locale]
  );

  const dateLocale = useMemo(() => dateLocaleFor(locale), [locale]);

  const value = useMemo(
    () => ({ locale, setLocale, t, dateLocale }),
    [locale, setLocale, t, dateLocale]
  );

  return (
    <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
  );
}

export function useLanguage(): LanguageContextValue {
  const ctx = useContext(LanguageContext);
  if (!ctx) {
    throw new Error('useLanguage must be used within LanguageProvider');
  }
  return ctx;
}
