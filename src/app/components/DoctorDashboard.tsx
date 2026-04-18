import { useMemo, useState } from 'react';
import {
  Hospital,
  LogOut,
  Clock,
  CheckCircle,
  AlertCircle,
  ChevronDown,
  ChevronUp,
  User,
  Phone,
  Calendar,
  X,
  History,
  Settings,
  Menu,
  PanelLeftClose
} from 'lucide-react';
import { useLanguage } from '@/app/i18n/LanguageContext';
import { LanguageSettingsPanel } from '@/app/components/LanguageSettingsPanel';

interface Visit {
  id: string;
  date: string;
  formName: string;
  answers: { question: string; answer: string }[];
  aiSummary?: string;
}

interface Patient {
  id: string;
  name: string;
  phone: string;
  visits: Visit[];
}

interface PatientResponse {
  id: string;
  patientId: string;
  patientName: string;
  patientPhone: string;
  appointmentTime: string;
  status: 'completed' | 'pending';
  formName: string;
  answers: { question: string; answer: string }[];
  aiSummary?: string;
  previousVisits?: number;
}

interface HistoryVisitRow {
  key: string;
  patientId: string;
  patientName: string;
  patientPhone: string;
  date: string;
  formName: string;
  answers: { question: string; answer: string }[];
  aiSummary?: string;
}

interface DoctorDashboardProps {
  onLogout: () => void;
}

export function DoctorDashboard({ onLogout }: DoctorDashboardProps) {
  const { t, dateLocale } = useLanguage();
  const [expandedPatients, setExpandedPatients] = useState<Set<string>>(new Set());
  const [showPatientCard, setShowPatientCard] = useState(false);
  const [selectedPatientId, setSelectedPatientId] = useState<string | null>(null);
  const [mainTab, setMainTab] = useState<'today' | 'history' | 'settings'>('today');
  const [expandedHistoryIds, setExpandedHistoryIds] = useState<Set<string>>(new Set());
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const [patientsData] = useState<Patient[]>([
    {
      id: 'p1',
      name: 'Aliyev Jasur',
      phone: '+998 90 123 45 67',
      visits: [
        {
          id: 'v1',
          date: '2026-04-18',
          formName: 'Urolog dastlabki qabul',
          answers: [
            { question: 'Asosiy shikoyatingiz nima?', answer: 'Siydik chiqarishda og\'riq' },
            { question: 'Qancha vaqtdan beri?', answer: '1 hafta' },
            { question: 'Og\'riq darajasi (1-10)?', answer: '7' },
            { question: 'Tunda necha marta turasiz?', answer: '3-4 marta' },
            { question: 'Qon bosimi bormi?', answer: 'Ha' }
          ],
          aiSummary: 'Bemor 1 hafta davomida siydik chiqarishda kuchli og\'riq (7/10) va nikturiya (tunda 3-4 marta) shikoyati bilan murojaat qilgan. Qon bosimi mavjud. Sistit yoki prostatit ehtimoli yuqori. Qo\'shimcha tekshiruv tavsiya etiladi.'
        }
      ]
    },
    {
      id: 'p2',
      name: 'Karimova Dilnoza',
      phone: '+998 91 234 56 78',
      visits: [
        {
          id: 'v2',
          date: '2026-03-15',
          formName: 'Urolog dastlabki qabul',
          answers: [
            { question: 'Asosiy shikoyatingiz nima?', answer: 'Chastotali siydik chiqarish' },
            { question: 'Qancha vaqtdan beri?', answer: '1 oy' },
            { question: 'Og\'riq darajasi (1-10)?', answer: '4' }
          ],
          aiSummary: 'Takroriy tashriflar. Avvalgi davolash samarali bo\'lmagan.'
        },
        {
          id: 'v3',
          date: '2026-04-01',
          formName: 'Urolog takroriy qabul',
          answers: [
            { question: 'Ahvol qanday?', answer: 'Yaxshilandi lekin to\'liq o\'tmadi' },
            { question: 'Og\'riq bormi?', answer: 'Yo\'q' }
          ],
          aiSummary: 'Yaxshilanish bor, lekin davom etish kerak.'
        }
      ]
    },
    {
      id: 'p3',
      name: 'Toshmatov Sanjar',
      phone: '+998 93 345 67 89',
      visits: [
        {
          id: 'v4',
          date: '2026-03-20',
          formName: 'Urolog dastlabki qabul',
          answers: [
            { question: 'Asosiy shikoyatingiz nima?', answer: 'Bel og\'rig\'i' },
            { question: 'Qancha vaqtdan beri?', answer: '1 oy' }
          ],
          aiSummary: 'Buyrak tosh ehtimoli.'
        },
        {
          id: 'v5',
          date: '2026-04-18',
          formName: 'Urolog takroriy qabul',
          answers: [
            { question: 'Asosiy shikoyatingiz nima?', answer: 'Bel og\'rig\'i' },
            { question: 'Qancha vaqtdan beri?', answer: '1 oy' },
            { question: 'Og\'riq darajasi (1-10)?', answer: '5' },
            { question: 'Tunda necha marta turasiz?', answer: '1-2 marta' },
            { question: 'Qon bosimi bormi?', answer: 'Yo\'q' }
          ],
          aiSummary: 'Bemor 1 oy davomida bel og\'rig\'i (5/10) va engil nikturiya bilan murojaat qilgan. Qon bosimi yo\'q. Buyrak toshlari yoki infeksiya ehtimoli mavjud. USG va qon tahlili tavsiya etiladi.'
        }
      ]
    }
  ]);

  const [patients] = useState<PatientResponse[]>([
    {
      id: '1',
      patientId: 'p1',
      patientName: 'Aliyev Jasur',
      patientPhone: '+998 90 123 45 67',
      appointmentTime: '09:00',
      status: 'completed',
      formName: 'Urolog dastlabki qabul',
      previousVisits: 0,
      answers: [
        { question: 'Asosiy shikoyatingiz nima?', answer: 'Siydik chiqarishda og\'riq' },
        { question: 'Qancha vaqtdan beri?', answer: '1 hafta' },
        { question: 'Og\'riq darajasi (1-10)?', answer: '7' },
        { question: 'Tunda necha marta turasiz?', answer: '3-4 marta' },
        { question: 'Qon bosimi bormi?', answer: 'Ha' }
      ],
      aiSummary: 'Bemor 1 hafta davomida siydik chiqarishda kuchli og\'riq (7/10) va nikturiya (tunda 3-4 marta) shikoyati bilan murojaat qilgan. Qon bosimi mavjud. Sistit yoki prostatit ehtimoli yuqori. Qo\'shimcha tekshiruv tavsiya etiladi.'
    },
    {
      id: '2',
      patientId: 'p2',
      patientName: 'Karimova Dilnoza',
      patientPhone: '+998 91 234 56 78',
      appointmentTime: '10:30',
      status: 'pending',
      formName: 'Urolog takroriy qabul',
      previousVisits: 2,
      answers: [],
      aiSummary: undefined
    },
    {
      id: '3',
      patientId: 'p3',
      patientName: 'Toshmatov Sanjar',
      patientPhone: '+998 93 345 67 89',
      appointmentTime: '11:00',
      status: 'completed',
      formName: 'Urolog takroriy qabul',
      previousVisits: 1,
      answers: [
        { question: 'Asosiy shikoyatingiz nima?', answer: 'Bel og\'rig\'i' },
        { question: 'Qancha vaqtdan beri?', answer: '1 oy' },
        { question: 'Og\'riq darajasi (1-10)?', answer: '5' },
        { question: 'Tunda necha marta turasiz?', answer: '1-2 marta' },
        { question: 'Qon bosimi bormi?', answer: 'Yo\'q' }
      ],
      aiSummary: 'Bemor 1 oy davomida bel og\'rig\'i (5/10) va engil nikturiya bilan murojaat qilgan. Qon bosimi yo\'q. Buyrak toshlari yoki infeksiya ehtimoli mavjud. USG va qon tahlili tavsiya etiladi.'
    }
  ]);

  const historyRows = useMemo(() => {
    const rows: HistoryVisitRow[] = [];
    for (const p of patientsData) {
      for (const v of p.visits) {
        rows.push({
          key: `${p.id}-${v.id}`,
          patientId: p.id,
          patientName: p.name,
          patientPhone: p.phone,
          date: v.date,
          formName: v.formName,
          answers: v.answers,
          aiSummary: v.aiSummary
        });
      }
    }
    rows.sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0));
    return rows;
  }, [patientsData]);

  const togglePatientExpand = (patientId: string) => {
    const newExpanded = new Set(expandedPatients);
    if (newExpanded.has(patientId)) {
      newExpanded.delete(patientId);
    } else {
      newExpanded.add(patientId);
    }
    setExpandedPatients(newExpanded);
  };

  const toggleHistoryExpand = (key: string) => {
    const next = new Set(expandedHistoryIds);
    if (next.has(key)) {
      next.delete(key);
    } else {
      next.add(key);
    }
    setExpandedHistoryIds(next);
  };

  const openPatientCard = (patientId: string) => {
    setSelectedPatientId(patientId);
    setShowPatientCard(true);
  };

  const completedCount = patients.filter(p => p.status === 'completed').length;
  const pendingCount = patients.filter(p => p.status === 'pending').length;

  const selectedPatientData = patientsData.find(p => p.id === selectedPatientId);

  const closeSidebar = () => setSidebarOpen(false);

  const dismissSidebarIfMobile = () => {
    if (typeof window !== 'undefined' && window.matchMedia('(max-width: 767px)').matches) {
      setSidebarOpen(false);
    }
  };

  const navBtn = (tab: 'today' | 'history' | 'settings') =>
    `w-full flex items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm font-medium transition ${
      mainTab === tab
        ? 'bg-cyan-50 text-cyan-700'
        : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
    }`;

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {sidebarOpen && (
        <button
          type="button"
          className="fixed inset-0 bg-black/40 z-40 md:hidden"
          aria-label={t('menu_close')}
          onClick={closeSidebar}
        />
      )}

      <aside
        className={`fixed md:static z-50 top-0 h-screen min-w-0 shrink-0 flex flex-col bg-white border-r border-gray-200 transition-all duration-200 ease-out overflow-hidden
          w-64 left-0
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
          md:translate-x-0 md:h-screen
          ${!sidebarOpen ? 'md:w-0 md:max-w-0 md:border-transparent md:p-0' : 'md:w-64'}
        `}
      >
        <div className="p-5 border-b border-gray-200 flex items-start justify-between gap-2">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 bg-cyan-100 rounded-lg flex items-center justify-center shrink-0">
              <Hospital className="w-6 h-6 text-cyan-600" />
            </div>
            <div className="min-w-0">
              <h1 className="text-lg font-bold text-gray-900 truncate">Dr. Kamol Yusupov</h1>
              <p className="text-xs text-gray-500 truncate">{t('doc_subtitle')}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={closeSidebar}
            className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg shrink-0"
            aria-label={t('menu_close')}
          >
            <PanelLeftClose className="w-5 h-5" />
          </button>
        </div>

        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          <button
            type="button"
            className={navBtn('today')}
            onClick={() => {
              setMainTab('today');
              dismissSidebarIfMobile();
            }}
          >
            <Clock className="w-5 h-5 shrink-0" />
            {t('doc_tab_today')}
          </button>
          <button
            type="button"
            className={navBtn('history')}
            onClick={() => {
              setMainTab('history');
              dismissSidebarIfMobile();
            }}
          >
            <History className="w-5 h-5 shrink-0" />
            {t('doc_tab_history')}
          </button>
          <button
            type="button"
            className={navBtn('settings')}
            onClick={() => {
              setMainTab('settings');
              dismissSidebarIfMobile();
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
        <header className="bg-white border-b border-gray-200 px-4 md:px-6 py-4 flex items-center gap-3 sticky top-0 z-30">
          {!sidebarOpen && (
            <button
              type="button"
              className="p-2 -ml-2 text-gray-600 hover:bg-gray-100 rounded-lg shrink-0"
              onClick={() => setSidebarOpen(true)}
              aria-label={t('menu_open')}
            >
              <Menu className="w-6 h-6" />
            </button>
          )}
          <div className="flex-1 min-w-0">
            <h2 className="text-lg font-semibold text-gray-900 truncate">
              {mainTab === 'today' && t('doc_tab_today')}
              {mainTab === 'history' && t('doc_tab_history')}
              {mainTab === 'settings' && t('admin_nav_settings')}
            </h2>
            <p className="text-xs text-gray-500 truncate">{t('doc_subtitle')}</p>
          </div>
        </header>

        <main className="flex-1 max-w-7xl w-full mx-auto px-4 md:px-6 py-8">
          {mainTab !== 'settings' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">{t('doc_stat_today')}</p>
                    <p className="text-3xl font-bold text-gray-900">{patients.length}</p>
                  </div>
                  <div className="w-12 h-12 bg-cyan-100 rounded-lg flex items-center justify-center">
                    <Clock className="w-6 h-6 text-cyan-600" />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">{t('doc_stat_done')}</p>
                    <p className="text-3xl font-bold text-emerald-600">{completedCount}</p>
                  </div>
                  <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center">
                    <CheckCircle className="w-6 h-6 text-emerald-600" />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">{t('doc_stat_pending')}</p>
                    <p className="text-3xl font-bold text-amber-600">{pendingCount}</p>
                  </div>
                  <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center">
                    <AlertCircle className="w-6 h-6 text-amber-600" />
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          {mainTab === 'settings' && (
            <div className="p-6">
              <LanguageSettingsPanel />
            </div>
          )}

          {mainTab === 'today' && (
            <>
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">{t('doc_today_title')}</h2>
                <p className="text-sm text-gray-600 mt-1">
                  {t('doc_today_date', { date: new Date().toLocaleDateString(dateLocale) })}
                </p>
              </div>

              <div className="divide-y divide-gray-200">
                {patients.map((patient) => (
                  <div key={patient.id}>
                    <div
                      className="p-6 hover:bg-gray-50 cursor-pointer"
                      onClick={() => togglePatientExpand(patient.id)}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-4 flex-1">
                          <div className="w-12 h-12 bg-gradient-to-br from-emerald-400 to-cyan-500 rounded-full flex items-center justify-center text-white font-semibold">
                            {patient.patientName.split(' ').map(n => n[0]).join('')}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h3 className="font-semibold text-gray-900">{patient.patientName}</h3>
                              {patient.status === 'completed' ? (
                                <span className="flex items-center gap-1 px-2 py-1 bg-emerald-100 text-emerald-700 text-xs rounded-full">
                                  <CheckCircle className="w-3 h-3" />
                                  {t('doc_status_done')}
                                </span>
                              ) : (
                                <span className="flex items-center gap-1 px-2 py-1 bg-amber-100 text-amber-700 text-xs rounded-full">
                                  <Clock className="w-3 h-3" />
                                  {t('doc_status_wait')}
                                </span>
                              )}
                            </div>
                            <div className="flex items-center gap-4 text-sm text-gray-600">
                              <span className="flex items-center gap-1">
                                <Clock className="w-4 h-4" />
                                {patient.appointmentTime}
                              </span>
                              <span className="flex items-center gap-1">
                                <Phone className="w-3 h-3" />
                                {patient.patientPhone}
                              </span>
                              <span>{patient.formName}</span>
                              {patient.previousVisits !== undefined && patient.previousVisits > 0 && (
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    openPatientCard(patient.patientId);
                                  }}
                                  className="text-cyan-600 font-medium hover:text-cyan-700 underline"
                                >
                                  {t('doc_visits_n', { n: patient.previousVisits })}
                                </button>
                              )}
                            </div>

                            {patient.aiSummary && expandedPatients.has(patient.id) && (
                              <div className="mt-4 p-4 bg-gradient-to-r from-emerald-50 to-cyan-50 rounded-lg border border-emerald-200">
                                <div className="flex items-start gap-2">
                                  <div className="w-6 h-6 bg-emerald-600 rounded flex items-center justify-center flex-shrink-0 mt-0.5">
                                    <span className="text-white text-xs font-bold">AI</span>
                                  </div>
                                  <div>
                                    <p className="text-sm font-medium text-gray-900 mb-2">{t('doc_ai_summary')}</p>
                                    <p className="text-sm text-gray-700 leading-relaxed">{patient.aiSummary}</p>
                                  </div>
                                </div>
                              </div>
                            )}

                            {patient.answers.length > 0 && expandedPatients.has(patient.id) && (
                              <div className="mt-4 space-y-3">
                                <p className="text-sm font-medium text-gray-900">{t('doc_answers_title')}</p>
                                {patient.answers.map((answer, index) => (
                                  <div key={index} className="pl-4 border-l-2 border-gray-200">
                                    <p className="text-sm text-gray-600 mb-1">{answer.question}</p>
                                    <p className="text-sm font-medium text-gray-900">{answer.answer}</p>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>

                        <button type="button" className="text-gray-400 hover:text-gray-600 ml-4">
                          {expandedPatients.has(patient.id) ? (
                            <ChevronUp className="w-5 h-5" />
                          ) : (
                            <ChevronDown className="w-5 h-5" />
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}

          {mainTab === 'history' && (
            <>
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">{t('doc_history_title')}</h2>
                <p className="text-sm text-gray-600 mt-1">{t('doc_history_sub')}</p>
              </div>

              <div className="divide-y divide-gray-200">
                {historyRows.map((row) => (
                  <div key={row.key}>
                    <div
                      className="p-6 hover:bg-gray-50 cursor-pointer"
                      onClick={() => toggleHistoryExpand(row.key)}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-4 flex-1">
                          <div className="w-12 h-12 bg-gradient-to-br from-emerald-400 to-cyan-500 rounded-full flex items-center justify-center text-white font-semibold">
                            {row.patientName.split(' ').map(n => n[0]).join('')}
                          </div>
                          <div className="flex-1">
                            <div className="flex flex-wrap items-center gap-3 mb-2">
                              <h3 className="font-semibold text-gray-900">{row.patientName}</h3>
                              <span className="flex items-center gap-1 text-sm text-gray-600">
                                <Calendar className="w-4 h-4" />
                                {new Date(row.date).toLocaleDateString(dateLocale, {
                                  year: 'numeric',
                                  month: 'long',
                                  day: 'numeric'
                                })}
                              </span>
                            </div>
                            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                              <span className="flex items-center gap-1">
                                <Phone className="w-3 h-3" />
                                {row.patientPhone}
                              </span>
                              <span>{row.formName}</span>
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  openPatientCard(row.patientId);
                                }}
                                className="text-cyan-600 font-medium hover:text-cyan-700 underline"
                              >
                                {t('doc_card_btn')}
                              </button>
                            </div>

                            {row.aiSummary && expandedHistoryIds.has(row.key) && (
                              <div className="mt-4 p-4 bg-gradient-to-r from-emerald-50 to-cyan-50 rounded-lg border border-emerald-200">
                                <div className="flex items-start gap-2">
                                  <div className="w-6 h-6 bg-emerald-600 rounded flex items-center justify-center flex-shrink-0 mt-0.5">
                                    <span className="text-white text-xs font-bold">AI</span>
                                  </div>
                                  <div>
                                    <p className="text-sm font-medium text-gray-900 mb-2">{t('doc_ai_summary')}</p>
                                    <p className="text-sm text-gray-700 leading-relaxed">{row.aiSummary}</p>
                                  </div>
                                </div>
                              </div>
                            )}

                            {row.answers.length > 0 && expandedHistoryIds.has(row.key) && (
                              <div className="mt-4 space-y-3">
                                <p className="text-sm font-medium text-gray-900">{t('doc_answers_title')}</p>
                                {row.answers.map((answer, index) => (
                                  <div key={index} className="pl-4 border-l-2 border-gray-200">
                                    <p className="text-sm text-gray-600 mb-1">{answer.question}</p>
                                    <p className="text-sm font-medium text-gray-900">{answer.answer}</p>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>

                        <button type="button" className="text-gray-400 hover:text-gray-600 ml-4">
                          {expandedHistoryIds.has(row.key) ? (
                            <ChevronUp className="w-5 h-5" />
                          ) : (
                            <ChevronDown className="w-5 h-5" />
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </main>
      </div>

      {showPatientCard && selectedPatientData && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-[60] overflow-y-auto">
          <div className="bg-white rounded-xl max-w-4xl w-full my-8">
            <div className="sticky top-0 bg-gradient-to-r from-cyan-600 to-emerald-600 text-white p-6 rounded-t-xl">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                    <User className="w-8 h-8" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold mb-1">{selectedPatientData.name}</h2>
                    <div className="flex items-center gap-3 text-cyan-100">
                      <span className="flex items-center gap-1">
                        <Phone className="w-4 h-4" />
                        {selectedPatientData.phone}
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {t('doc_modal_visit_count', { n: selectedPatientData.visits.length })}
                      </span>
                    </div>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setShowPatientCard(false)}
                  className="text-white hover:bg-white hover:bg-opacity-20 rounded-lg p-2 transition"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>

            <div className="p-6 max-h-[70vh] overflow-y-auto">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">{t('doc_modal_visits')}</h3>
              <div className="space-y-4">
                {selectedPatientData.visits.map((visit, index) => (
                  <div key={visit.id} className="border border-gray-200 rounded-lg p-5 hover:border-cyan-300 transition">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-cyan-100 rounded-full flex items-center justify-center">
                          <span className="font-bold text-cyan-700">{selectedPatientData.visits.length - index}</span>
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">{visit.formName}</p>
                          <p className="text-sm text-gray-500">
                            {new Date(visit.date).toLocaleDateString(dateLocale, {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric'
                            })}
                          </p>
                        </div>
                      </div>
                      {index === 0 && (
                        <span className="px-2 py-1 bg-emerald-100 text-emerald-700 text-xs rounded-full font-medium">
                          {t('doc_latest')}
                        </span>
                      )}
                    </div>

                    {visit.aiSummary && (
                      <div className="mb-3 p-3 bg-gradient-to-r from-emerald-50 to-cyan-50 rounded-lg border border-emerald-200">
                        <div className="flex items-start gap-2">
                          <div className="w-5 h-5 bg-emerald-600 rounded flex items-center justify-center flex-shrink-0 mt-0.5">
                            <span className="text-white text-xs font-bold">AI</span>
                          </div>
                          <p className="text-sm text-gray-700 leading-relaxed">{visit.aiSummary}</p>
                        </div>
                      </div>
                    )}

                    {visit.answers.length > 0 && (
                      <div className="mb-3 space-y-2">
                        <p className="text-sm font-medium text-gray-900">{t('doc_visit_answers')}</p>
                        <div className="grid grid-cols-1 gap-2">
                          {visit.answers.map((answer, ansIdx) => (
                            <div key={ansIdx} className="pl-3 border-l-2 border-gray-200">
                              <p className="text-xs text-gray-600">{answer.question}</p>
                              <p className="text-sm font-medium text-gray-900">{answer.answer}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="border-t border-gray-200 p-6 bg-gray-50 rounded-b-xl">
              <button
                type="button"
                onClick={() => setShowPatientCard(false)}
                className="w-full px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition font-medium"
              >
                {t('common_close')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
