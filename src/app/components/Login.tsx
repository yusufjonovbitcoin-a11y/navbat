import { useState } from 'react';
import { LogIn } from 'lucide-react';
import { useLanguage } from '@/app/i18n/LanguageContext';

interface LoginProps {
  onLogin: (role: 'super_admin' | 'admin' | 'doctor', userId: string) => void;
}

export function Login({ onLogin }: LoginProps) {
  const { t } = useLanguage();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (email === 'superadmin@medform.uz' && password === 'admin123') {
      onLogin('super_admin', '1');
    } else if (email === 'sardor@najot.uz' && password === 'admin123') {
      onLogin('admin', '2');
    } else if (email === 'kamol@najot.uz' && password === 'doctor123') {
      onLogin('doctor', '3');
    } else {
      alert(t('login_error'));
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-cyan-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-emerald-100 rounded-full mb-4">
            <LogIn className="w-8 h-8 text-emerald-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{t('login_title')}</h1>
          <p className="text-gray-600">{t('login_subtitle')}</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
              {t('login_email')}
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition"
              placeholder="email@example.com"
              required
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
              {t('login_password')}
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition"
              placeholder="••••••••"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-emerald-600 text-white py-3 rounded-lg hover:bg-emerald-700 transition font-medium"
          >
            {t('login_submit')}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-gray-200">
          <p className="text-sm text-gray-600 mb-3">{t('login_demo')}</p>
          <div className="space-y-2 text-xs text-gray-500">
            <p>
              <strong>{t('login_demo_super')}</strong> superadmin@medform.uz / admin123
            </p>
            <p>
              <strong>{t('login_demo_admin')}</strong> sardor@najot.uz / admin123
            </p>
            <p>
              <strong>{t('login_demo_doctor')}</strong> kamol@najot.uz / doctor123
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
