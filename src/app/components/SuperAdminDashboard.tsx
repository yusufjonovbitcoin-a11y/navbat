import { useState, useEffect } from 'react';
import {
  Hospital,
  Plus,
  Users,
  BarChart3,
  LogOut,
  X,
  Trash2,
  MapPin,
  Mail,
  Phone,
  Calendar,
  Activity,
  LayoutDashboard,
  Settings,
  Menu,
  ClipboardList,
  Key,
  Eye,
  EyeOff
} from 'lucide-react';
import { QuestionTemplatesSection } from '@/app/components/QuestionTemplatesSection';
import { useLanguage } from '@/app/i18n/LanguageContext';
import { LanguageSettingsPanel } from '@/app/components/LanguageSettingsPanel';

interface Clinic {
  id: string;
  name: string;
  city: string;
  plan: 'Basic' | 'Pro' | 'Enterprise';
  adminName: string;
  adminEmail?: string;
  adminPhone?: string;
  /** Demo: faqat super admin panelda ko‘rinadi; productionda hash saqlanadi */
  adminPassword?: string;
  isActive: boolean;
  patients: number;
  forms: number;
  phone?: string;
  address?: string;
  doctorCount?: number;
  openedAt?: string;
}

type SidebarNavId = 'dashboard' | 'templates' | 'reports' | 'settings';

interface SuperAdminDashboardProps {
  onLogout: () => void;
}

export function SuperAdminDashboard({ onLogout }: SuperAdminDashboardProps) {
  const { t, dateLocale } = useLanguage();
  const [activeNav, setActiveNav] = useState<SidebarNavId>('dashboard');
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [clinics, setClinics] = useState<Clinic[]>([
    {
      id: '1',
      name: 'Najot Tibbiyot Markazi',
      city: 'Toshkent',
      plan: 'Pro',
      adminName: 'Sardor Rahimov',
      adminEmail: 'sardor@najot.uz',
      adminPhone: '+998 90 111 22 33',
      adminPassword: 'NajotAdmin2024!',
      isActive: true,
      patients: 248,
      forms: 12,
      phone: '+998 71 200 00 01',
      address: 'Chilonzor tumani, Bunyodkor ko\'chasi 12',
      doctorCount: 14,
      openedAt: '2023-04-12'
    },
    {
      id: '2',
      name: 'Shifo Klinikasi',
      city: 'Samarqand',
      plan: 'Basic',
      adminName: 'Malika Karimova',
      adminEmail: 'malika@shifo.uz',
      adminPhone: '+998 91 444 55 66',
      adminPassword: 'Shifo#2024',
      isActive: true,
      patients: 156,
      forms: 8,
      phone: '+998 66 222 33 44',
      address: 'Registon ko\'chasi 8',
      doctorCount: 7,
      openedAt: '2024-01-20'
    }
  ]);

  const [detailClinic, setDetailClinic] = useState<Clinic | null>(null);
  const [showAdminPasswordInDetail, setShowAdminPasswordInDetail] = useState(false);
  const [clinicDeleteConfirmOpen, setClinicDeleteConfirmOpen] = useState(false);

  useEffect(() => {
    setShowAdminPasswordInDetail(false);
  }, [detailClinic?.id]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newClinic, setNewClinic] = useState({
    name: '',
    city: '',
    plan: 'Basic' as 'Basic' | 'Pro' | 'Enterprise',
    adminName: '',
    adminPhone: '',
    adminPassword: ''
  });

  const handleAddClinic = () => {
    const { adminPassword, ...rest } = newClinic;
    const clinic: Clinic = {
      id: Date.now().toString(),
      ...rest,
      adminPhone: rest.adminPhone.trim(),
      adminPassword,
      isActive: true,
      patients: 0,
      forms: 0
    };

    setClinics([...clinics, clinic]);
    setShowAddModal(false);
    setNewClinic({
      name: '',
      city: '',
      plan: 'Basic',
      adminName: '',
      adminPhone: '',
      adminPassword: ''
    });
    alert(
      t('sa_clinic_created', {
        admin: clinic.adminName,
        phone: clinic.adminPhone
      })
    );
  };

  const toggleClinicStatus = (id: string) => {
    setClinics(clinics.map(c => (c.id === id ? { ...c, isActive: !c.isActive } : c)));
    setDetailClinic(prev =>
      prev?.id === id ? { ...prev, isActive: !prev.isActive } : prev
    );
  };

  const performDeleteClinic = (id: string) => {
    setClinics(clinics.filter(c => c.id !== id));
    setDetailClinic(prev => (prev?.id === id ? null : prev));
    setClinicDeleteConfirmOpen(false);
  };

  const totalPatients = clinics.reduce((sum, c) => sum + c.patients, 0);
  const totalForms = clinics.reduce((sum, c) => sum + c.forms, 0);

  const openClinicDetail = (clinic: Clinic) => {
    setDetailClinic(clinic);
  };

  const detailShare =
    detailClinic && totalPatients > 0
      ? Math.round((detailClinic.patients / totalPatients) * 1000) / 10
      : 0;
  const detailFormsPerPatient =
    detailClinic && detailClinic.patients > 0
      ? Math.round((detailClinic.forms / detailClinic.patients) * 100) / 100
      : 0;

  const navButtonClass = (id: SidebarNavId) =>
    `w-full flex items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm font-medium transition ${
      activeNav === id
        ? 'bg-emerald-50 text-emerald-700'
        : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
    }`;

  const dashboardContent = (
    <>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">{t('sa_stats_clinics')}</p>
                <p className="text-3xl font-bold text-gray-900">{clinics.length}</p>
              </div>
              <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center">
                <Hospital className="w-6 h-6 text-emerald-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">{t('sa_stats_patients')}</p>
                <p className="text-3xl font-bold text-gray-900">{totalPatients}</p>
              </div>
              <div className="w-12 h-12 bg-cyan-100 rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-cyan-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">{t('sa_stats_forms')}</p>
                <p className="text-3xl font-bold text-gray-900">{totalForms}</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <BarChart3 className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">{t('sa_clinic_list')}</h2>
            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition"
            >
              <Plus className="w-4 h-4" />
              {t('sa_new_clinic')}
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    {t('sa_th_clinic')}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    {t('sa_th_city')}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    {t('sa_th_plan')}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    {t('sa_th_admin')}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    {t('sa_th_patients')}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    {t('sa_th_forms')}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    {t('sa_th_status')}
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {clinics.map((clinic) => (
                  <tr
                    key={clinic.id}
                    role="button"
                    tabIndex={0}
                    onClick={() => openClinicDetail(clinic)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        openClinicDetail(clinic);
                      }
                    }}
                    className="hover:bg-gray-50 cursor-pointer"
                  >
                    <td className="px-6 py-4">
                      <div className="font-medium text-gray-900">{clinic.name}</div>
                    </td>
                    <td className="px-6 py-4 text-gray-600">{clinic.city}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        clinic.plan === 'Enterprise' ? 'bg-purple-100 text-purple-700' :
                        clinic.plan === 'Pro' ? 'bg-cyan-100 text-cyan-700' :
                        'bg-gray-100 text-gray-700'
                      }`}>
                        {clinic.plan}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm">
                        <div className="font-medium text-gray-900">{clinic.adminName}</div>
                        {clinic.adminEmail && (
                          <div className="text-gray-500">{clinic.adminEmail}</div>
                        )}
                        {clinic.adminPhone && (
                          <div className="text-gray-500 text-xs mt-0.5">{clinic.adminPhone}</div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-600">{clinic.patients}</td>
                    <td className="px-6 py-4 text-gray-600">{clinic.forms}</td>
                    <td className="px-6 py-4">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleClinicStatus(clinic.id);
                        }}
                        aria-pressed={clinic.isActive}
                        title={
                          clinic.isActive ? t('sa_title_deactivate_row') : t('sa_title_activate_row')
                        }
                        aria-label={
                          clinic.isActive ? t('sa_aria_deactivate') : t('sa_aria_activate')
                        }
                        className={`px-3 py-1 text-xs rounded-full font-medium ${
                          clinic.isActive
                            ? 'bg-emerald-100 text-emerald-700'
                            : 'bg-red-100 text-red-700'
                        }`}
                      >
                        {clinic.isActive ? t('sa_active') : t('sa_inactive')}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
    </>
  );

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {mobileSidebarOpen && (
        <button
          type="button"
          className="fixed inset-0 bg-black/40 z-40 md:hidden"
          aria-label={t('menu_close')}
          onClick={() => setMobileSidebarOpen(false)}
        />
      )}

      <aside
        className={`fixed md:sticky top-0 z-50 h-screen w-64 shrink-0 flex flex-col bg-white border-r border-gray-200 transition-transform duration-200 md:translate-x-0 ${
          mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="p-5 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
              <Hospital className="w-6 h-6 text-emerald-600" />
            </div>
            <div className="min-w-0">
              <h1 className="text-lg font-bold text-gray-900 truncate">{t('sa_brand')}</h1>
              <p className="text-xs text-gray-500">{t('sa_role')}</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          <button
            type="button"
            className={navButtonClass('dashboard')}
            onClick={() => {
              setActiveNav('dashboard');
              setMobileSidebarOpen(false);
            }}
          >
            <LayoutDashboard className="w-5 h-5 shrink-0" />
            {t('sa_nav_home')}
          </button>
          <button
            type="button"
            className={navButtonClass('templates')}
            onClick={() => {
              setActiveNav('templates');
              setMobileSidebarOpen(false);
            }}
          >
            <ClipboardList className="w-5 h-5 shrink-0" />
            {t('sa_nav_templates')}
          </button>
          <button
            type="button"
            className={navButtonClass('reports')}
            onClick={() => {
              setActiveNav('reports');
              setMobileSidebarOpen(false);
            }}
          >
            <BarChart3 className="w-5 h-5 shrink-0" />
            {t('sa_nav_reports')}
          </button>
          <button
            type="button"
            className={navButtonClass('settings')}
            onClick={() => {
              setActiveNav('settings');
              setMobileSidebarOpen(false);
            }}
          >
            <Settings className="w-5 h-5 shrink-0" />
            {t('sa_nav_settings')}
          </button>
        </nav>

        <div className="p-3 border-t border-gray-200">
          <button
            type="button"
            onClick={onLogout}
            className="w-full flex items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm font-medium text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition"
          >
            <LogOut className="w-5 h-5 shrink-0" />
            {t('common_logout')}
          </button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0 min-h-screen">
        <header className="bg-white border-b border-gray-200 px-4 md:px-6 py-4 flex items-center gap-4 sticky top-0 z-30">
          <button
            type="button"
            className="md:hidden p-2 -ml-2 text-gray-600 hover:bg-gray-100 rounded-lg"
            onClick={() => setMobileSidebarOpen(o => !o)}
            aria-label={t('menu_open')}
          >
            <Menu className="w-6 h-6" />
          </button>
          <div className="flex-1 min-w-0">
            <h2 className="text-lg font-semibold text-gray-900 truncate">
              {activeNav === 'dashboard' && t('sa_head_overview')}
              {activeNav === 'templates' && t('sa_head_templates')}
              {activeNav === 'reports' && t('sa_head_reports')}
              {activeNav === 'settings' && t('sa_head_settings')}
            </h2>
            <p className="text-xs text-gray-500 truncate">{t('sa_head_sub')}</p>
          </div>
        </header>

        <main className="flex-1 max-w-7xl w-full mx-auto px-4 md:px-6 py-8">
          {activeNav === 'dashboard' && dashboardContent}

          {activeNav === 'templates' && <QuestionTemplatesSection />}

          {activeNav === 'reports' && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
              <BarChart3 className="w-12 h-12 text-emerald-600 mx-auto mb-4" />
              <p className="text-gray-900 font-medium mb-1">{t('sa_reports_title')}</p>
              <p className="text-sm text-gray-500">{t('sa_reports_soon')}</p>
            </div>
          )}

          {activeNav === 'settings' && (
            <div className="space-y-8">
              <LanguageSettingsPanel />
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center max-w-lg mx-auto">
                <Settings className="w-12 h-12 text-emerald-600 mx-auto mb-4" />
                <p className="text-sm text-gray-500">{t('sa_settings_soon')}</p>
              </div>
            </div>
          )}
        </main>
      </div>

      {detailClinic && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-[100] overflow-y-auto">
          <div className="bg-white rounded-xl max-w-2xl w-full my-8 shadow-lg border border-gray-200">
            <div className="p-6 border-b border-gray-200 flex items-start justify-between gap-4">
              <div className="flex items-start gap-4 min-w-0">
                <div className="w-14 h-14 bg-emerald-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Hospital className="w-8 h-8 text-emerald-600" />
                </div>
                <div className="min-w-0">
                  <h3 className="text-xl font-bold text-gray-900 truncate">{detailClinic.name}</h3>
                  <p className="text-sm text-gray-500 flex items-center gap-1 mt-1">
                    <MapPin className="w-4 h-4 flex-shrink-0" />
                    {detailClinic.city}
                    {detailClinic.address && (
                      <span className="text-gray-400 hidden sm:inline"> — {detailClinic.address}</span>
                    )}
                  </p>
                </div>
              </div>
              <div className="flex items-center justify-end gap-2 flex-shrink-0">
                <button
                  type="button"
                  onClick={() => toggleClinicStatus(detailClinic.id)}
                  aria-pressed={detailClinic.isActive}
                  title={
                    detailClinic.isActive ? t('sa_title_deactivate') : t('sa_title_activate')
                  }
                  aria-label={
                    detailClinic.isActive ? t('sa_aria_deactivate') : t('sa_aria_activate')
                  }
                  className={`px-3 py-1.5 text-xs rounded-full font-medium ${
                    detailClinic.isActive
                      ? 'bg-emerald-100 text-emerald-700'
                      : 'bg-red-100 text-red-700'
                  }`}
                >
                  {detailClinic.isActive ? t('sa_active') : t('sa_inactive')}
                </button>
                <button
                  type="button"
                  onClick={() => setClinicDeleteConfirmOpen(true)}
                  className="inline-flex p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                  title={t('sa_delete_clinic')}
                  aria-label={t('sa_delete_clinic')}
                >
                  <Trash2 className="w-5 h-5" />
                </button>
                <button
                  type="button"
                  onClick={() => setDetailClinic(null)}
                  className="text-gray-400 hover:text-gray-600"
                  aria-label={t('common_close')}
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>

            <div className="p-6 max-h-[70vh] overflow-y-auto space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="rounded-lg border border-gray-200 p-4">
                  <p className="text-xs font-medium text-gray-500 uppercase mb-2">{t('sa_detail_tariff')}</p>
                  <span
                    className={`inline-block px-2 py-1 text-sm rounded-full ${
                      detailClinic.plan === 'Enterprise'
                        ? 'bg-purple-100 text-purple-700'
                        : detailClinic.plan === 'Pro'
                          ? 'bg-cyan-100 text-cyan-700'
                          : 'bg-gray-100 text-gray-700'
                    }`}
                  >
                    {detailClinic.plan}
                  </span>
                  <p className="text-sm text-gray-600 mt-3">
                    {t('sa_detail_status')}{' '}
                    <span className={detailClinic.isActive ? 'text-emerald-700 font-medium' : 'text-red-700 font-medium'}>
                      {detailClinic.isActive ? t('sa_active') : t('sa_inactive')}
                    </span>
                  </p>
                </div>
                <div className="rounded-lg border border-gray-200 p-4">
                  <p className="text-xs font-medium text-gray-500 uppercase mb-2">{t('sa_detail_admin')}</p>
                  <p className="font-medium text-gray-900">{detailClinic.adminName}</p>
                  {detailClinic.adminEmail && (
                    <p className="text-sm text-gray-600 flex items-center gap-1 mt-1">
                      <Mail className="w-4 h-4 text-gray-400 shrink-0" />
                      {detailClinic.adminEmail}
                    </p>
                  )}
                  <div className="mt-3 pt-3 border-t border-gray-100">
                    <p className="text-xs font-medium text-gray-500 mb-2">{t('sa_detail_login_demo')}</p>
                    {detailClinic.adminPhone ? (
                      <p className="text-sm text-gray-800 flex items-center gap-2">
                        <Phone className="w-4 h-4 text-cyan-600 shrink-0" />
                        <span className="font-mono">{detailClinic.adminPhone}</span>
                      </p>
                    ) : (
                      <p className="text-sm text-gray-400">{t('sa_detail_no_phone')}</p>
                    )}
                    <div className="mt-2 flex flex-wrap items-center gap-2">
                      <Key className="w-4 h-4 text-gray-400 shrink-0" />
                      <span className="text-sm text-gray-600">{t('sa_detail_password')}</span>
                      {detailClinic.adminPassword ? (
                        <>
                          <code className="text-sm font-mono bg-gray-50 px-2 py-0.5 rounded border border-gray-200">
                            {showAdminPasswordInDetail
                              ? detailClinic.adminPassword
                              : '•'.repeat(8)}
                          </code>
                          <button
                            type="button"
                            onClick={() => setShowAdminPasswordInDetail(v => !v)}
                            className="inline-flex items-center gap-1 text-xs font-medium text-cyan-700 hover:text-cyan-800"
                          >
                            {showAdminPasswordInDetail ? (
                              <>
                                <EyeOff className="w-3.5 h-3.5" />
                                {t('sa_detail_hide')}
                              </>
                            ) : (
                              <>
                                <Eye className="w-3.5 h-3.5" />
                                {t('sa_detail_show')}
                              </>
                            )}
                          </button>
                        </>
                      ) : (
                        <span className="text-sm text-gray-400">{t('sa_detail_no_pwd')}</span>
                      )}
                    </div>
                    <p className="text-[11px] text-gray-400 mt-2">{t('sa_detail_pwd_note')}</p>
                  </div>
                </div>
              </div>

              {(detailClinic.phone || detailClinic.address || detailClinic.openedAt) && (
                <div className="rounded-lg border border-gray-200 p-4 space-y-3">
                  <p className="text-xs font-medium text-gray-500 uppercase">{t('sa_detail_contact')}</p>
                  {detailClinic.phone && (
                    <p className="text-sm text-gray-800 flex items-center gap-2">
                      <Phone className="w-4 h-4 text-gray-400" />
                      {detailClinic.phone}
                    </p>
                  )}
                  {detailClinic.address && (
                    <p className="text-sm text-gray-800 flex items-start gap-2">
                      <MapPin className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                      {detailClinic.address}
                    </p>
                  )}
                  {detailClinic.openedAt && (
                    <p className="text-sm text-gray-600 flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      {t('sa_detail_registered')}{' '}
                      {new Date(detailClinic.openedAt).toLocaleDateString(dateLocale, {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                  )}
                </div>
              )}

              <div className="rounded-lg border border-gray-200 p-4">
                <p className="text-xs font-medium text-gray-500 uppercase mb-3">{t('sa_detail_metrics')}</p>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
                  <div>
                    <p className="text-2xl font-bold text-gray-900">{detailClinic.patients}</p>
                    <p className="text-xs text-gray-500 mt-1">{t('sa_metric_patients')}</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-900">{detailClinic.forms}</p>
                    <p className="text-xs text-gray-500 mt-1">{t('sa_metric_forms')}</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-900">
                      {detailClinic.doctorCount ?? '—'}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">{t('sa_metric_doctors')}</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-900">{detailFormsPerPatient}</p>
                    <p className="text-xs text-gray-500 mt-1">{t('sa_metric_ratio')}</p>
                  </div>
                </div>
              </div>

              <div className="rounded-lg border border-emerald-200 bg-emerald-50/50 p-4">
                <p className="text-sm font-semibold text-gray-900 flex items-center gap-2 mb-3">
                  <Activity className="w-4 h-4 text-emerald-600" />
                  {t('sa_analysis_title')}
                </p>
                <ul className="text-sm text-gray-700 space-y-2">
                  <li>
                    {t('sa_analysis_1', {
                      pct: detailShare,
                      total: totalPatients,
                      n: detailClinic.patients
                    })}
                  </li>
                  <li>
                    {t('sa_analysis_2', {
                      pct:
                        totalForms > 0
                          ? Math.round((detailClinic.forms / totalForms) * 1000) / 10
                          : 0,
                      total: totalForms,
                      n: detailClinic.forms
                    })}
                  </li>
                  <li>
                    {t('sa_analysis_3', { ratio: detailFormsPerPatient })}
                  </li>
                  {detailClinic.doctorCount != null && detailClinic.doctorCount > 0 && (
                    <li>
                      {t('sa_analysis_4', {
                        n: Math.round(detailClinic.patients / detailClinic.doctorCount)
                      })}
                    </li>
                  )}
                </ul>
              </div>
            </div>

            <div className="border-t border-gray-200 p-4 bg-gray-50 rounded-b-xl">
              <button
                type="button"
                onClick={() => setDetailClinic(null)}
                className="w-full px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition font-medium"
              >
                {t('common_close')}
              </button>
            </div>
          </div>
        </div>
      )}

      {detailClinic && clinicDeleteConfirmOpen && (
        <div
          className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-[120]"
          role="dialog"
          aria-modal="true"
          aria-labelledby="delete-clinic-title"
          onClick={() => setClinicDeleteConfirmOpen(false)}
        >
          <div
            className="bg-white rounded-xl max-w-md w-full p-6 shadow-xl border border-gray-200"
            onClick={e => e.stopPropagation()}
          >
            <h3 id="delete-clinic-title" className="text-lg font-bold text-gray-900 mb-2">
              {t('sa_delete_clinic')}
            </h3>
            <p className="text-gray-700 mb-1">{t('sa_delete_clinic_confirm', { name: detailClinic.name })}</p>
            <p className="text-sm text-gray-500 mb-6">{t('sa_delete_clinic_note')}</p>
            <div className="flex flex-col-reverse sm:flex-row gap-3 sm:justify-end">
              <button
                type="button"
                onClick={() => setClinicDeleteConfirmOpen(false)}
                className="w-full sm:w-auto px-4 py-2.5 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 font-medium"
              >
                {t('common_cancel')}
              </button>
              <button
                type="button"
                onClick={() => performDeleteClinic(detailClinic.id)}
                className="w-full sm:w-auto px-4 py-2.5 rounded-lg bg-red-600 text-white hover:bg-red-700 font-medium"
              >
                {t('sa_delete_yes')}
              </button>
            </div>
          </div>
        </div>
      )}

      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-[100]">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900">{t('sa_add_clinic_title')}</h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('sa_field_clinic_name')}
                </label>
                <input
                  type="text"
                  value={newClinic.name}
                  onChange={(e) => setNewClinic({ ...newClinic, name: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none"
                  placeholder="Najot Tibbiyot Markazi"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('sa_field_city')}
                </label>
                <input
                  type="text"
                  value={newClinic.city}
                  onChange={(e) => setNewClinic({ ...newClinic, city: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none"
                  placeholder="Toshkent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('sa_field_plan')}
                </label>
                <select
                  value={newClinic.plan}
                  onChange={(e) => setNewClinic({ ...newClinic, plan: e.target.value as any })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none"
                >
                  <option value="Basic">Basic</option>
                  <option value="Pro">Pro</option>
                  <option value="Enterprise">Enterprise</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('sa_field_admin_name')}
                </label>
                <input
                  type="text"
                  value={newClinic.adminName}
                  onChange={(e) => setNewClinic({ ...newClinic, adminName: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none"
                  placeholder="Sardor Rahimov"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('sa_field_admin_phone')}
                </label>
                <input
                  type="tel"
                  value={newClinic.adminPhone}
                  onChange={(e) => setNewClinic({ ...newClinic, adminPhone: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none"
                  placeholder="+998 90 123 45 67"
                  autoComplete="tel"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('sa_field_admin_pwd')}
                </label>
                <input
                  type="password"
                  value={newClinic.adminPassword}
                  onChange={(e) => setNewClinic({ ...newClinic, adminPassword: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none"
                  placeholder={t('sa_pwd_ph')}
                  autoComplete="new-password"
                />
                <p className="text-xs text-gray-500 mt-1">{t('sa_pwd_hint')}</p>
              </div>

              <button
                type="button"
                onClick={handleAddClinic}
                disabled={
                  !newClinic.name ||
                  !newClinic.city ||
                  !newClinic.adminName ||
                  !newClinic.adminPhone.trim() ||
                  newClinic.adminPassword.trim().length < 6
                }
                className="w-full bg-emerald-600 text-white py-3 rounded-lg hover:bg-emerald-700 transition font-medium disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                {t('common_save')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
