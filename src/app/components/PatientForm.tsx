import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { FileText, CheckCircle, Send } from 'lucide-react';
import { useLanguage } from '@/app/i18n/LanguageContext';

interface FormField {
  id: string;
  label: string;
  type: 'text' | 'number' | 'select' | 'date' | 'yes_no';
  options?: string[];
  required: boolean;
}

interface FormData {
  id: string;
  name: string;
  doctorName: string;
  clinicName: string;
  fields: FormField[];
}

export function PatientForm() {
  const { formId } = useParams();
  const { t } = useLanguage();
  const [submitted, setSubmitted] = useState(false);
  const [patientName, setPatientName] = useState('');
  const [patientPhone, setPatientPhone] = useState('');
  const [answers, setAnswers] = useState<Record<string, string>>({});

  const mockForms: Record<string, FormData> = {
    '1': {
      id: '1',
      name: 'Urolog dastlabki qabul',
      doctorName: 'Dr. Kamol Yusupov',
      clinicName: 'Najot Tibbiyot Markazi',
      fields: [
        { id: '1', label: 'Asosiy shikoyatingiz nima?', type: 'text', required: true },
        { id: '2', label: 'Qancha vaqtdan beri?', type: 'select', options: ['1 kun', '1 hafta', '1 oy', '1 yildan ko\'p'], required: true },
        { id: '3', label: 'Og\'riq darajasi (1-10)?', type: 'number', required: true },
        { id: '4', label: 'Tunda necha marta turasiz?', type: 'number', required: false },
        { id: '5', label: 'Qon bosimi bormi?', type: 'yes_no', required: true }
      ]
    }
  };

  const currentForm = formId ? mockForms[formId] : null;

  if (!currentForm) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-cyan-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <FileText className="w-8 h-8 text-red-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">{t('pf_not_found')}</h2>
          <p className="text-gray-600">{t('pf_not_found_hint')}</p>
        </div>
      </div>
    );
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const requiredFields = currentForm.fields.filter(f => f.required);
    const missingFields = requiredFields.filter(f => !answers[f.id]);

    if (!patientName.trim()) {
      alert(t('pf_alert_name'));
      return;
    }

    if (!patientPhone.trim()) {
      alert(t('pf_alert_phone'));
      return;
    }

    if (missingFields.length > 0) {
      alert(t('pf_alert_required'));
      return;
    }

    console.log('Forma yuborildi:', {
      formId: currentForm.id,
      patientName,
      patientPhone,
      answers,
      submittedAt: new Date().toISOString()
    });

    setSubmitted(true);
  };

  const updateAnswer = (fieldId: string, value: string) => {
    setAnswers({ ...answers, [fieldId]: value });
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-cyan-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
          <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-8 h-8 text-emerald-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">{t('pf_thanks')}</h2>
          <p className="text-gray-600 mb-6">{t('pf_submitted')}</p>
          <div className="bg-cyan-50 rounded-lg p-4 text-left">
            <p className="text-sm text-gray-700 mb-1">
              <strong>{t('pf_patient')}</strong> {patientName}
            </p>
            <p className="text-sm text-gray-700 mb-1">
              <strong>{t('pf_phone')}</strong> {patientPhone}
            </p>
            <p className="text-sm text-gray-700 mb-1">
              <strong>{t('pf_doctor')}</strong> {currentForm.doctorName}
            </p>
            <p className="text-sm text-gray-700">
              <strong>{t('pf_clinic')}</strong> {currentForm.clinicName}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-cyan-50 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="bg-gradient-to-r from-emerald-600 to-cyan-600 p-6 text-white">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
                <FileText className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">{currentForm.name}</h1>
                <p className="text-emerald-100 text-sm">{currentForm.clinicName}</p>
              </div>
            </div>
            <p className="text-emerald-100">
              {t('pf_doctor_prefix')} {currentForm.doctorName}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="patientName" className="block text-sm font-medium text-gray-700 mb-2">
                  {t('pf_name_label')} <span className="text-red-500">*</span>
                </label>
                <input
                  id="patientName"
                  type="text"
                  value={patientName}
                  onChange={(e) => setPatientName(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none"
                  placeholder={t('pf_placeholder_name')}
                  required
                />
              </div>

              <div>
                <label htmlFor="patientPhone" className="block text-sm font-medium text-gray-700 mb-2">
                  {t('pf_phone_label')} <span className="text-red-500">*</span>
                </label>
                <input
                  id="patientPhone"
                  type="tel"
                  value={patientPhone}
                  onChange={(e) => setPatientPhone(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none"
                  placeholder="+998 90 123 45 67"
                  required
                />
              </div>
            </div>

            <div className="border-t border-gray-200 pt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">{t('pf_questions')}</h3>
              <div className="space-y-5">
                {currentForm.fields.map((field, index) => (
                  <div key={field.id}>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {index + 1}. {field.label}
                      {field.required && <span className="text-red-500 ml-1">*</span>}
                    </label>

                    {field.type === 'text' && (
                      <textarea
                        value={answers[field.id] || ''}
                        onChange={(e) => updateAnswer(field.id, e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none resize-none"
                        rows={3}
                        placeholder={t('pf_answer_ph')}
                        required={field.required}
                      />
                    )}

                    {field.type === 'number' && (
                      <input
                        type="number"
                        value={answers[field.id] || ''}
                        onChange={(e) => updateAnswer(field.id, e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none"
                        placeholder={t('pf_placeholder_number')}
                        required={field.required}
                      />
                    )}

                    {field.type === 'select' && (
                      <select
                        value={answers[field.id] || ''}
                        onChange={(e) => updateAnswer(field.id, e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none"
                        required={field.required}
                      >
                        <option value="">{t('pf_select')}</option>
                        {field.options?.map((option) => (
                          <option key={option} value={option}>
                            {option}
                          </option>
                        ))}
                      </select>
                    )}

                    {field.type === 'date' && (
                      <input
                        type="date"
                        value={answers[field.id] || ''}
                        onChange={(e) => updateAnswer(field.id, e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none"
                        required={field.required}
                      />
                    )}

                    {field.type === 'yes_no' && (
                      <div className="flex gap-4">
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="radio"
                            name={field.id}
                            value="Ha"
                            checked={answers[field.id] === 'Ha'}
                            onChange={(e) => updateAnswer(field.id, e.target.value)}
                            className="w-4 h-4 text-emerald-600 focus:ring-emerald-500"
                            required={field.required}
                          />
                          <span className="text-gray-700">{t('yes')}</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="radio"
                            name={field.id}
                            value="Yo'q"
                            checked={answers[field.id] === "Yo'q"}
                            onChange={(e) => updateAnswer(field.id, e.target.value)}
                            className="w-4 h-4 text-emerald-600 focus:ring-emerald-500"
                            required={field.required}
                          />
                          <span className="text-gray-700">{t('no')}</span>
                        </label>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="border-t border-gray-200 pt-6">
              <button
                type="submit"
                className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-600 to-cyan-600 text-white py-4 rounded-lg hover:from-emerald-700 hover:to-cyan-700 transition font-medium text-lg shadow-lg"
              >
                <Send className="w-5 h-5" />
                {t('pf_submit')}
              </button>
              <p className="text-xs text-gray-500 text-center mt-3">{t('pf_consent')}</p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
