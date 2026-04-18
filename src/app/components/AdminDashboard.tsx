import { useState } from 'react';
import html2canvas from 'html2canvas';
import {
  Hospital,
  UserPlus,
  FileText,
  QrCode,
  LogOut,
  X,
  Download,
  Trash2,
  Printer,
  Layers,
  Menu,
  Users,
  Settings,
  BarChart3
} from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { useLanguage } from '@/app/i18n/LanguageContext';
import { LanguageSettingsPanel } from '@/app/components/LanguageSettingsPanel';
import { AdminStatisticsSection } from '@/app/components/AdminStatisticsSection';
import { useQuestionTemplates } from '@/app/context/QuestionTemplatesContext';
import type { FormField } from '@/app/types/questionTemplates';
import { cloneFormFields } from '@/app/types/questionTemplates';

interface Doctor {
  id: string;
  name: string;
  specialty: string;
  email: string;
  patients: number;
}

interface MedicalForm {
  id: string;
  name: string;
  doctorId: string;
  doctorName: string;
  fields: FormField[];
  createdAt: string;
  responses: number;
  templateId?: string;
}

interface AdminDashboardProps {
  onLogout: () => void;
}

export function AdminDashboard({ onLogout }: AdminDashboardProps) {
  const { t } = useLanguage();
  const { templates } = useQuestionTemplates();
  const [activeTab, setActiveTab] = useState<'doctors' | 'forms' | 'statistics' | 'settings'>('doctors');
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [showAddDoctorModal, setShowAddDoctorModal] = useState(false);
  const [showAddFormModal, setShowAddFormModal] = useState(false);
  const [showTemplatePickerModal, setShowTemplatePickerModal] = useState(false);
  const [showQRModal, setShowQRModal] = useState(false);
  const [selectedFormQR, setSelectedFormQR] = useState<MedicalForm | null>(null);

  const [doctors, setDoctors] = useState<Doctor[]>([
    {
      id: '1',
      name: 'Kamol Yusupov',
      specialty: 'Urolog',
      email: 'kamol@najot.uz',
      patients: 45
    },
    {
      id: '2',
      name: 'Nigora Alimova',
      specialty: 'Ginekolog',
      email: 'nigora@najot.uz',
      patients: 38
    }
  ]);

  const [forms, setForms] = useState<MedicalForm[]>([
    {
      id: '1',
      name: 'Urolog dastlabki qabul',
      doctorId: '1',
      doctorName: 'Kamol Yusupov',
      fields: [
        { id: '1', label: 'Asosiy shikoyatingiz nima?', type: 'text', required: true },
        { id: '2', label: 'Qancha vaqtdan beri?', type: 'select', options: ['1 kun', '1 hafta', '1 oy', '1 yildan ko\'p'], required: true },
        { id: '3', label: 'Og\'riq darajasi (1-10)?', type: 'number', required: true },
        { id: '4', label: 'Tunda necha marta turasiz?', type: 'number', required: false },
        { id: '5', label: 'Qon bosimi bormi?', type: 'yes_no', required: true }
      ],
      createdAt: '2026-04-15',
      responses: 12,
      templateId: 'tpl-urolog'
    }
  ]);

  const [newDoctor, setNewDoctor] = useState({ name: '', specialty: '', email: '' });
  const [newForm, setNewForm] = useState<{
    name: string;
    doctorId: string;
    fields: FormField[];
    templateId?: string;
  }>({
    name: '',
    doctorId: '',
    fields: [],
    templateId: undefined
  });

  const handleAddDoctor = () => {
    const doctor: Doctor = {
      id: Date.now().toString(),
      ...newDoctor,
      patients: 0
    };
    setDoctors([...doctors, doctor]);
    setShowAddDoctorModal(false);
    setNewDoctor({ name: '', specialty: '', email: '' });
    alert(t('admin_alert_doctor_added', { email: doctor.email }));
  };

  const handleAddForm = () => {
    const doctor = doctors.find(d => d.id === newForm.doctorId);
    if (!doctor) return;

    const form: MedicalForm = {
      id: Date.now().toString(),
      name: newForm.name,
      doctorId: newForm.doctorId,
      doctorName: doctor.name,
      fields: newForm.fields.map(f => ({
        ...f,
        options: f.options ? [...f.options] : undefined
      })),
      createdAt: new Date().toISOString().split('T')[0],
      responses: 0,
      ...(newForm.templateId ? { templateId: newForm.templateId } : {})
    };

    setForms([...forms, form]);
    setShowAddFormModal(false);
    setNewForm({ name: '', doctorId: '', fields: [], templateId: undefined });
  };

  const handleDeleteDoctor = (id: string) => {
    const doctor = doctors.find(d => d.id === id);
    if (!doctor) return;
    if (!confirm(t('admin_confirm_delete_doctor', { name: doctor.name }))) return;
    setDoctors(doctors.filter(d => d.id !== id));
    setForms(forms.filter(f => f.doctorId !== id));
  };

  const handleDeleteForm = (id: string) => {
    const form = forms.find(f => f.id === id);
    if (!form) return;
    if (!confirm(t('admin_confirm_delete_form', { name: form.name }))) return;
    setForms(forms.filter(f => f.id !== id));
    if (selectedFormQR?.id === id) {
      setShowQRModal(false);
      setSelectedFormQR(null);
    }
  };

  const addFormField = () => {
    const field: FormField = {
      id: Date.now().toString(),
      label: '',
      type: 'text',
      required: true
    };
    setNewForm({ ...newForm, fields: [...newForm.fields, field] });
  };

  const updateFormField = (id: string, updates: Partial<FormField>) => {
    setNewForm({
      ...newForm,
      fields: newForm.fields.map(f => f.id === id ? { ...f, ...updates } : f)
    });
  };

  const removeFormField = (id: string) => {
    setNewForm({
      ...newForm,
      fields: newForm.fields.filter(f => f.id !== id)
    });
  };

  const applyTemplateFromPicker = (templateId: string) => {
    const t = templates.find(x => x.id === templateId);
    if (!t) return;
    setNewForm(prev => ({
      ...prev,
      templateId: t.id,
      name: prev.name.trim() ? prev.name : t.title,
      fields: cloneFormFields(t.questions)
    }));
    setShowTemplatePickerModal(false);
  };

  const openNewFormModal = () => {
    setNewForm({ name: '', doctorId: '', fields: [], templateId: undefined });
    setShowAddFormModal(true);
  };

  const showQRCode = (form: MedicalForm) => {
    setSelectedFormQR(form);
    setShowQRModal(true);
  };

  const downloadQRCode = async () => {
    const el = document.getElementById('qr-code-capture');
    if (!el || !selectedFormQR) return;
    try {
      const canvas = await html2canvas(el as HTMLElement, {
        scale: 2,
        backgroundColor: '#ffffff',
        logging: false
      });
      const pngFile = canvas.toDataURL('image/png');
      const downloadLink = document.createElement('a');
      downloadLink.download = `qr-${selectedFormQR.name.replace(/\s+/g, '-')}.png`;
      downloadLink.href = pngFile;
      downloadLink.click();
    } catch {
      alert(t('admin_err_qr_download'));
    }
  };

  const navButtonClass = (tab: 'doctors' | 'forms' | 'statistics' | 'settings') =>
    `w-full flex items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm font-medium transition ${
      activeTab === tab
        ? 'bg-emerald-50 text-emerald-700'
        : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
    }`;

  const printQRCode = async () => {
    const el = document.getElementById('qr-code-capture');
    if (!el || !selectedFormQR) return;
    try {
      const canvas = await html2canvas(el as HTMLElement, {
        scale: 2,
        backgroundColor: '#ffffff',
        logging: false
      });
      const dataUrl = canvas.toDataURL('image/png');
      const w = window.open('', '_blank');
      if (!w) return;
      w.document.write(
        `<!DOCTYPE html><html><head><title>QR — ${selectedFormQR.name}</title></head><body style="margin:0;display:flex;justify-content:center;align-items:center;min-height:100vh;"><img src="${dataUrl}" alt="QR" /></body></html>`
      );
      w.document.close();
      setTimeout(() => {
        w.focus();
        w.print();
        w.close();
      }, 200);
    } catch {
      alert(t('admin_err_print'));
    }
  };

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
              <h1 className="text-lg font-bold text-gray-900 truncate">{t('admin_brand')}</h1>
              <p className="text-xs text-gray-500 truncate">{t('admin_clinic_line')}</p>
            </div>
          </div>
          <p className="text-[11px] text-emerald-700 font-medium mt-2">{t('admin_badge')}</p>
        </div>

        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          <button
            type="button"
            className={navButtonClass('doctors')}
            onClick={() => {
              setActiveTab('doctors');
              setMobileSidebarOpen(false);
            }}
          >
            <Users className="w-5 h-5 shrink-0" />
            {t('admin_nav_doctors')}
          </button>
          <button
            type="button"
            className={navButtonClass('forms')}
            onClick={() => {
              setActiveTab('forms');
              setMobileSidebarOpen(false);
            }}
          >
            <FileText className="w-5 h-5 shrink-0" />
            {t('admin_nav_forms')}
          </button>
          <button
            type="button"
            className={navButtonClass('statistics')}
            onClick={() => {
              setActiveTab('statistics');
              setMobileSidebarOpen(false);
            }}
          >
            <BarChart3 className="w-5 h-5 shrink-0" />
            {t('admin_nav_stats')}
          </button>
          <button
            type="button"
            className={navButtonClass('settings')}
            onClick={() => {
              setActiveTab('settings');
              setMobileSidebarOpen(false);
            }}
          >
            <Settings className="w-5 h-5 shrink-0" />
            {t('admin_nav_settings')}
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
              {activeTab === 'doctors' && t('admin_header_doctors')}
              {activeTab === 'forms' && t('admin_header_forms')}
              {activeTab === 'statistics' && t('admin_header_stats')}
              {activeTab === 'settings' && t('admin_nav_settings')}
            </h2>
            <p className="text-xs text-gray-500 truncate">{t('admin_header_sub')}</p>
          </div>
        </header>

        <main className="flex-1 max-w-7xl w-full mx-auto px-4 md:px-6 py-8">
          {activeTab === 'statistics' && <AdminStatisticsSection />}

          <div
            className={`bg-white rounded-xl shadow-sm border border-gray-200 mb-6 ${
              activeTab === 'statistics' ? 'hidden' : ''
            }`}
          >
          {activeTab === 'settings' && (
            <div className="p-6">
              <LanguageSettingsPanel />
            </div>
          )}
          {activeTab === 'doctors' && (
            <div>
              <div className="p-6 border-b border-gray-200 flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900">{t('admin_doctors_list')}</h2>
                <button
                  onClick={() => setShowAddDoctorModal(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition"
                >
                  <UserPlus className="w-4 h-4" />
                  {t('admin_add_doctor')}
                </button>
              </div>

              <div className="divide-y divide-gray-200">
                {doctors.map((doctor) => (
                  <div key={doctor.id} className="p-6 flex items-center justify-between hover:bg-gray-50">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-cyan-100 rounded-full flex items-center justify-center">
                        <span className="text-lg font-semibold text-cyan-700">
                          {doctor.name.split(' ').map(n => n[0]).join('')}
                        </span>
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900">{doctor.name}</h3>
                        <p className="text-sm text-gray-600">{doctor.specialty}</p>
                        <p className="text-xs text-gray-500">{doctor.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="text-2xl font-bold text-gray-900">{doctor.patients}</p>
                        <p className="text-xs text-gray-500">{t('admin_patients_short')}</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleDeleteDoctor(doctor.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                        title={t('common_delete')}
                        aria-label={t('common_delete')}
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'forms' && (
            <div>
              <div className="p-6 border-b border-gray-200 flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900">{t('admin_medical_forms')}</h2>
                <button
                  type="button"
                  onClick={openNewFormModal}
                  className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition"
                >
                  <FileText className="w-4 h-4" />
                  {t('admin_create_form')}
                </button>
              </div>

              <div className="divide-y divide-gray-200">
                {forms.map((form) => (
                  <div key={form.id} className="p-6 hover:bg-gray-50">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-1">{form.name}</h3>
                        <p className="text-sm text-gray-600">
                          {t('admin_form_doctor')} {form.doctorName}
                        </p>
                        {form.templateId && (
                          <p className="text-xs text-cyan-600 mt-1">
                            {t('admin_template_from')}{' '}
                            {templates.find(tpl => tpl.id === form.templateId)?.title ?? form.templateId}
                          </p>
                        )}
                        <p className="text-xs text-gray-500 mt-1">
                          {t('admin_questions_count', { n: form.fields.length })}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => showQRCode(form)}
                          className="flex items-center gap-2 px-4 py-2 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 transition"
                        >
                          <QrCode className="w-4 h-4" />
                          {t('admin_qr')}
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteForm(form.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                          title={t('common_delete')}
                          aria-label={t('common_delete')}
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 text-sm">
                      <span className="text-gray-500">
                        {t('admin_created')} {form.createdAt}
                      </span>
                      <span className="text-emerald-600 font-medium">
                        {t('admin_responses', { n: form.responses })}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          </div>
        </main>
      </div>

      {showAddDoctorModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900">{t('admin_modal_add_doctor_title')}</h3>
              <button onClick={() => setShowAddDoctorModal(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('admin_modal_add_doctor_name')}
                </label>
                <input
                  type="text"
                  value={newDoctor.name}
                  onChange={(e) => setNewDoctor({ ...newDoctor, name: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
                  placeholder="Kamol Yusupov"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('admin_modal_add_doctor_spec')}
                </label>
                <input
                  type="text"
                  value={newDoctor.specialty}
                  onChange={(e) => setNewDoctor({ ...newDoctor, specialty: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
                  placeholder="Urolog"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('admin_modal_add_doctor_email')}
                </label>
                <input
                  type="email"
                  value={newDoctor.email}
                  onChange={(e) => setNewDoctor({ ...newDoctor, email: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
                  placeholder="kamol@najot.uz"
                />
              </div>

              <button
                onClick={handleAddDoctor}
                disabled={!newDoctor.name || !newDoctor.specialty || !newDoctor.email}
                className="w-full bg-emerald-600 text-white py-3 rounded-lg hover:bg-emerald-700 transition disabled:bg-gray-300"
              >
                {t('common_save')}
              </button>
            </div>
          </div>
        </div>
      )}

      {showAddFormModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 overflow-y-auto">
          <div className="bg-white rounded-xl max-w-2xl w-full p-6 my-8">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900">{t('admin_modal_new_form')}</h3>
              <button
                type="button"
                onClick={() => {
                  setShowAddFormModal(false);
                  setShowTemplatePickerModal(false);
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">{t('admin_form_name')}</label>
                <input
                  type="text"
                  value={newForm.name}
                  onChange={(e) => setNewForm({ ...newForm, name: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
                  placeholder="Urolog dastlabki qabul"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('admin_form_doctor_select')}
                </label>
                <select
                  value={newForm.doctorId}
                  onChange={(e) => setNewForm({ ...newForm, doctorId: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
                >
                  <option value="">{t('admin_form_select_ph')}</option>
                  {doctors.map(d => (
                    <option key={d.id} value={d.id}>{d.name} - {d.specialty}</option>
                  ))}
                </select>
              </div>

              {newForm.doctorId && (
                <div className="rounded-lg border border-dashed border-cyan-200 bg-cyan-50/40 px-4 py-3 flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Layers className="w-4 h-4 text-cyan-600 shrink-0" />
                    <span>{t('admin_template_load_hint')}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowTemplatePickerModal(true)}
                    className="text-sm font-medium text-cyan-700 hover:text-cyan-800 underline-offset-2 hover:underline"
                  >
                    {t('admin_template_from_btn')}
                  </button>
                </div>
              )}

              {newForm.templateId && (
                <p className="text-xs text-gray-500">
                  {t('admin_template_note', {
                    title:
                      templates.find(tpl => tpl.id === newForm.templateId)?.title ??
                      newForm.templateId ??
                      ''
                  })}
                </p>
              )}

              <div>
                <div className="flex items-center justify-between mb-3">
                  <label className="text-sm font-medium text-gray-700">{t('admin_questions')}</label>
                  <button
                    type="button"
                    onClick={addFormField}
                    className="text-sm text-emerald-600 hover:text-emerald-700 font-medium"
                  >
                    {t('admin_add_question')}
                  </button>
                </div>

                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {newForm.fields.map((field, index) => (
                    <div key={field.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-start justify-between mb-3">
                        <span className="text-sm font-medium text-gray-700">
                          {t('admin_question_n', { n: index + 1 })}
                        </span>
                        <button
                          type="button"
                          onClick={() => removeFormField(field.id)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>

                      <input
                        type="text"
                        value={field.label}
                        onChange={(e) => updateFormField(field.id, { label: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg mb-2 text-sm outline-none focus:ring-2 focus:ring-emerald-500"
                        placeholder={t('admin_question_ph')}
                      />

                      <div className="flex gap-2">
                        <select
                          value={field.type}
                          onChange={(e) => updateFormField(field.id, { type: e.target.value as any })}
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-emerald-500"
                        >
                          <option value="text">{t('admin_field_text')}</option>
                          <option value="number">{t('admin_field_number')}</option>
                          <option value="select">{t('admin_field_select')}</option>
                          <option value="date">{t('admin_field_date')}</option>
                          <option value="yes_no">{t('admin_field_yesno')}</option>
                        </select>

                        <label className="flex items-center gap-2 text-sm text-gray-600">
                          <input
                            type="checkbox"
                            checked={field.required}
                            onChange={(e) => updateFormField(field.id, { required: e.target.checked })}
                            className="rounded border-gray-300"
                          />
                          {t('required')}
                        </label>
                      </div>

                      {field.type === 'select' && (
                        <input
                          type="text"
                          value={field.options?.join(', ') || ''}
                          onChange={(e) => updateFormField(field.id, { options: e.target.value.split(',').map(o => o.trim()) })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg mt-2 text-sm outline-none focus:ring-2 focus:ring-emerald-500"
                          placeholder={t('admin_options_ph')}
                        />
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <button
                type="button"
                onClick={handleAddForm}
                disabled={!newForm.name || !newForm.doctorId || newForm.fields.length === 0}
                className="w-full bg-emerald-600 text-white py-3 rounded-lg hover:bg-emerald-700 transition disabled:bg-gray-300"
              >
                {t('admin_create_form_btn')}
              </button>
            </div>
          </div>
        </div>
      )}

      {showTemplatePickerModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-[60] overflow-y-auto">
          <div className="bg-white rounded-xl max-w-lg w-full p-6 my-8 shadow-lg border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-900">{t('admin_templates_title')}</h3>
              <button
                type="button"
                onClick={() => setShowTemplatePickerModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <p className="text-sm text-gray-500 mb-4">{t('admin_templates_desc')}</p>
            <div className="space-y-2 max-h-80 overflow-y-auto">
              {templates.length === 0 ? (
                <p className="text-sm text-gray-500 text-center py-6">{t('admin_templates_empty')}</p>
              ) : (
                templates.map(tmpl => (
                  <button
                    key={tmpl.id}
                    type="button"
                    onClick={() => applyTemplateFromPicker(tmpl.id)}
                    className="w-full text-left rounded-lg border border-gray-200 p-4 hover:border-cyan-300 hover:bg-cyan-50/30 transition"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <span className="inline-block px-2 py-0.5 text-xs rounded-full bg-cyan-100 text-cyan-800 mb-1">
                          {tmpl.specialty}
                        </span>
                        <p className="font-medium text-gray-900">{tmpl.title}</p>
                        <p className="text-xs text-gray-500 mt-1">
                          {t('admin_template_q_count', { n: tmpl.questions.length })}
                        </p>
                      </div>
                      <span className="text-xs text-emerald-600 font-medium shrink-0">
                        {t('admin_template_pick')}
                      </span>
                    </div>
                  </button>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {showQRModal && selectedFormQR && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900">{t('admin_qr_title')}</h3>
              <button onClick={() => setShowQRModal(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="text-center">
              <p className="text-sm text-gray-600 mb-4">{selectedFormQR.name}</p>
              <div
                id="qr-code-capture"
                className="bg-white p-6 inline-block rounded-lg border-2 border-gray-200"
              >
                <QRCodeSVG
                  value={`${window.location.origin}/patient-form/${selectedFormQR.id}`}
                  size={256}
                  level="H"
                  includeMargin={true}
                />
              </div>
              <p className="text-xs text-gray-500 mt-4 mb-6">{t('admin_qr_hint')}</p>

              <div className="flex flex-wrap items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={() => void downloadQRCode()}
                  className="flex items-center gap-2 px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition"
                >
                  <Download className="w-4 h-4" />
                  {t('admin_download')}
                </button>
                <button
                  type="button"
                  onClick={() => void printQRCode()}
                  className="flex items-center gap-2 px-6 py-3 border border-gray-300 text-gray-700 bg-white rounded-lg hover:bg-gray-50 transition"
                >
                  <Printer className="w-4 h-4" />
                  {t('admin_print')}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
