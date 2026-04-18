import { useLanguage, type AppLocale } from '@/app/i18n/LanguageContext';

interface LanguageSettingsPanelProps {
  /** Kengaytirilgan blok (masalan, Super Admin sozlamalari) */
  variant?: 'card' | 'inline';
}

export function LanguageSettingsPanel({ variant = 'card' }: LanguageSettingsPanelProps) {
  const { locale, setLocale, t } = useLanguage();

  const btn = (code: AppLocale, label: string) => (
    <button
      key={code}
      type="button"
      onClick={() => setLocale(code)}
      className={`rounded-lg px-4 py-2 text-sm font-medium transition border ${
        locale === code
          ? 'bg-emerald-600 text-white border-emerald-600'
          : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
      }`}
    >
      {label}
    </button>
  );

  const inner = (
    <div className="space-y-3">
      <div>
        <p className="text-sm font-medium text-gray-900">{t('settings_title')}</p>
        <p className="text-xs text-gray-500 mt-1">{t('settings_hint')}</p>
      </div>
      <div className="flex flex-wrap gap-2">
        {btn('uz', t('lang_uz'))}
        {btn('ru', t('lang_ru'))}
      </div>
    </div>
  );

  if (variant === 'inline') {
    return <div className="rounded-lg border border-gray-200 bg-gray-50/80 p-4">{inner}</div>;
  }

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6 text-left shadow-sm max-w-lg mx-auto">
      {inner}
    </div>
  );
}
