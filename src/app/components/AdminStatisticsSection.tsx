import { useMemo, useState } from 'react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  LabelList,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from 'recharts';
import { MessageSquare, Stethoscope, TrendingUp } from 'lucide-react';
import { useLanguage, type AppLocale } from '@/app/i18n/LanguageContext';

type Period = 'day' | 'week' | 'month';

function mockStats(locale: AppLocale) {
  const isRu = locale === 'ru';
  const docNames = {
    d0: isRu ? 'Камол Юсупов' : 'Kamol Yusupov',
    d1: isRu ? 'Нигора Алимова' : 'Nigora Alimova'
  };

  /** Shifokorlar bo‘yicha mijozlar — kunlik */
  const doctorDay = [
    { label: '8.04', d0: 4, d1: 2 },
    { label: '9.04', d0: 6, d1: 3 },
    { label: '10.04', d0: 5, d1: 4 },
    { label: '11.04', d0: 8, d1: 5 },
    { label: '12.04', d0: 7, d1: 4 },
    { label: '13.04', d0: 9, d1: 6 },
    { label: '14.04', d0: 5, d1: 3 },
    { label: '15.04', d0: 7, d1: 5 },
    { label: '16.04', d0: 8, d1: 4 },
    { label: '17.04', d0: 6, d1: 3 }
  ];

  const doctorWeek = isRu
    ? [
        { label: 'Пн', d0: 9, d1: 6 },
        { label: 'Вт', d0: 11, d1: 8 },
        { label: 'Ср', d0: 8, d1: 7 },
        { label: 'Чт', d0: 12, d1: 9 },
        { label: 'Пт', d0: 14, d1: 10 },
        { label: 'Сб', d0: 5, d1: 4 },
        { label: 'Вс', d0: 4, d1: 3 }
      ]
    : [
        { label: 'Du', d0: 9, d1: 6 },
        { label: 'Se', d0: 11, d1: 8 },
        { label: 'Ch', d0: 8, d1: 7 },
        { label: 'Pa', d0: 12, d1: 9 },
        { label: 'Ju', d0: 14, d1: 10 },
        { label: 'Sh', d0: 5, d1: 4 },
        { label: 'Ya', d0: 4, d1: 3 }
      ];

  const doctorMonth = isRu
    ? [
        { label: 'Ноя', d0: 38, d1: 32 },
        { label: 'Дек', d0: 42, d1: 35 },
        { label: 'Янв', d0: 36, d1: 30 },
        { label: 'Фев', d0: 48, d1: 40 },
        { label: 'Мар', d0: 52, d1: 44 },
        { label: 'Апр', d0: 55, d1: 46 }
      ]
    : [
        { label: 'Nov', d0: 38, d1: 32 },
        { label: 'Dek', d0: 42, d1: 35 },
        { label: 'Yan', d0: 36, d1: 30 },
        { label: 'Fev', d0: 48, d1: 40 },
        { label: 'Mar', d0: 52, d1: 44 },
        { label: 'Apr', d0: 55, d1: 46 }
      ];

  const day = isRu
    ? [
        { label: '8.04', v: 5 },
        { label: '9.04', v: 8 },
        { label: '10.04', v: 6 },
        { label: '11.04', v: 11 },
        { label: '12.04', v: 9 },
        { label: '13.04', v: 14 },
        { label: '14.04', v: 7 },
        { label: '15.04', v: 10 },
        { label: '16.04', v: 12 },
        { label: '17.04', v: 8 }
      ]
    : [
        { label: '8.04', v: 5 },
        { label: '9.04', v: 8 },
        { label: '10.04', v: 6 },
        { label: '11.04', v: 11 },
        { label: '12.04', v: 9 },
        { label: '13.04', v: 14 },
        { label: '14.04', v: 7 },
        { label: '15.04', v: 10 },
        { label: '16.04', v: 12 },
        { label: '17.04', v: 8 }
      ];

  const week = isRu
    ? [
        { label: 'Пн', v: 14 },
        { label: 'Вт', v: 18 },
        { label: 'Ср', v: 12 },
        { label: 'Чт', v: 21 },
        { label: 'Пт', v: 25 },
        { label: 'Сб', v: 9 },
        { label: 'Вс', v: 7 }
      ]
    : [
        { label: 'Du', v: 14 },
        { label: 'Se', v: 18 },
        { label: 'Ch', v: 12 },
        { label: 'Pa', v: 21 },
        { label: 'Ju', v: 25 },
        { label: 'Sh', v: 9 },
        { label: 'Ya', v: 7 }
      ];

  const month = isRu
    ? [
        { label: 'Ноя', v: 62 },
        { label: 'Дек', v: 71 },
        { label: 'Янв', v: 58 },
        { label: 'Фев', v: 84 },
        { label: 'Мар', v: 91 },
        { label: 'Апр', v: 106 }
      ]
    : [
        { label: 'Nov', v: 62 },
        { label: 'Dek', v: 71 },
        { label: 'Yan', v: 58 },
        { label: 'Fev', v: 84 },
        { label: 'Mar', v: 91 },
        { label: 'Apr', v: 106 }
      ];

  const complaints = isRu
    ? [
        { text: 'Боль при мочеиспускании', count: 34 },
        { text: 'Частые позывы / никтурия', count: 27 },
        { text: 'Боль в пояснице', count: 21 },
        { text: 'Головная боль', count: 14 },
        { text: 'Другое', count: 11 }
      ]
    : [
        { text: 'Siydik chiqarishda og‘riq', count: 34 },
        { text: 'Chastotali siydik / nikturiya', count: 27 },
        { text: 'Bel og‘rig‘i', count: 21 },
        { text: 'Bosh og‘rig‘i', count: 14 },
        { text: 'Boshqa', count: 11 }
      ];

  const totalResponses = doctorMonth.reduce((s, r) => s + r.d0 + r.d1, 0);
  const maxComplaint = Math.max(...complaints.map(c => c.count), 1);

  return {
    docNames,
    doctorDay,
    doctorWeek,
    doctorMonth,
    day,
    week,
    month,
    complaints,
    totalResponses,
    maxComplaint
  };
}

function PeriodToggle({
  value,
  onChange
}: {
  value: Period;
  onChange: (p: Period) => void;
}) {
  const { t } = useLanguage();
  const btn = (p: Period) => (
    <button
      key={p}
      type="button"
      onClick={() => onChange(p)}
      className={`px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium rounded-md transition ${
        value === p ? 'bg-white text-emerald-700 shadow-sm' : 'text-gray-600 hover:text-gray-900'
      }`}
    >
      {p === 'day' && t('admin_stats_period_day')}
      {p === 'week' && t('admin_stats_period_week')}
      {p === 'month' && t('admin_stats_period_month')}
    </button>
  );
  return (
    <div className="flex flex-wrap rounded-lg border border-gray-200 p-0.5 bg-gray-50 gap-0.5">
      {btn('day')}
      {btn('week')}
      {btn('month')}
    </div>
  );
}

export function AdminStatisticsSection() {
  const { t, locale } = useLanguage();
  const [doctorPeriod, setDoctorPeriod] = useState<Period>('week');
  const [formPeriod, setFormPeriod] = useState<Period>('week');

  const data = useMemo(() => mockStats(locale), [locale]);
  const doctorChartData =
    doctorPeriod === 'day'
      ? data.doctorDay
      : doctorPeriod === 'week'
        ? data.doctorWeek
        : data.doctorMonth;

  const doctorRowData = useMemo(() => {
    const v0 = doctorChartData.reduce((s, r) => s + r.d0, 0);
    const v1 = doctorChartData.reduce((s, r) => s + r.d1, 0);
    return [
      { name: data.docNames.d0, value: v0, fill: '#10b981' as const },
      { name: data.docNames.d1, value: v1, fill: '#6366f1' as const }
    ];
  }, [doctorChartData, data.docNames]);

  const formChartData =
    formPeriod === 'day' ? data.day : formPeriod === 'week' ? data.week : data.month;

  const avgWeek = Math.max(1, Math.round(data.totalResponses / 24));

  const chartColor = '#0d9488';
  const gridClass = 'stroke-gray-200';

  return (
    <div className="space-y-6">
      <p className="text-sm text-gray-600 max-w-3xl">{t('admin_stats_intro')}</p>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
            {t('admin_stats_kpi_total')}
          </p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{data.totalResponses}</p>
          <p className="text-xs text-emerald-600 mt-2 flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5" />
            {t('admin_stats_kpi_growth')}
          </p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
            {t('admin_stats_kpi_forms')}
          </p>
          <p className="text-2xl font-bold text-gray-900 mt-1">3</p>
          <p className="text-xs text-gray-500 mt-2">{t('admin_stats_kpi_forms_sub')}</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
            {t('admin_stats_kpi_avg')}
          </p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{avgWeek}</p>
          <p className="text-xs text-gray-500 mt-2">{t('admin_stats_kpi_avg_sub')}</p>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-gray-200 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-start gap-3 min-w-0">
            <div className="w-10 h-10 rounded-lg bg-emerald-50 flex items-center justify-center shrink-0">
              <Stethoscope className="w-5 h-5 text-emerald-600" />
            </div>
            <div className="min-w-0">
              <h3 className="text-lg font-semibold text-gray-900">{t('admin_stats_by_doctor')}</h3>
              <p className="text-sm text-gray-500 mt-0.5">{t('admin_stats_by_doctor_hint')}</p>
            </div>
          </div>
          <PeriodToggle value={doctorPeriod} onChange={setDoctorPeriod} />
        </div>
        <div className="p-4 md:p-6">
          <div className="h-[min(240px,40vh)] w-full min-h-[200px] min-w-0">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                layout="vertical"
                data={doctorRowData}
                margin={{ top: 8, right: 28, left: 0, bottom: 8 }}
              >
                <CartesianGrid className={gridClass} strokeDasharray="3 3" vertical={false} />
                <XAxis type="number" tick={{ fontSize: 11 }} allowDecimals={false} />
                <YAxis
                  type="category"
                  dataKey="name"
                  width={locale === 'ru' ? 168 : 152}
                  tick={{ fontSize: 12 }}
                />
                <Tooltip
                  contentStyle={{ borderRadius: 8, border: '1px solid #e5e7eb' }}
                  formatter={(value: number, _name: string, item: { payload?: { name?: string } }) => [
                    t('admin_stats_count', { n: value }),
                    item.payload?.name ?? ''
                  ]}
                />
                <Bar dataKey="value" radius={[0, 4, 4, 0]} maxBarSize={36}>
                  {doctorRowData.map(row => (
                    <Cell key={row.name} fill={row.fill} />
                  ))}
                  <LabelList
                    dataKey="value"
                    position="right"
                    offset={10}
                    fill="#374151"
                    fontSize={12}
                    fontWeight={600}
                  />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-gray-200 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-lg bg-cyan-50 flex items-center justify-center shrink-0">
              <TrendingUp className="w-5 h-5 text-cyan-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">{t('admin_stats_chart_title')}</h3>
            </div>
          </div>
          <PeriodToggle value={formPeriod} onChange={setFormPeriod} />
        </div>
        <div className="p-4 md:p-6">
          <div className="h-[280px] w-full min-w-0">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={formChartData}
                margin={{ top: 8, right: 8, left: 0, bottom: formPeriod === 'day' ? 8 : 0 }}
              >
                <CartesianGrid className={gridClass} strokeDasharray="3 3" />
                <XAxis
                  dataKey="label"
                  tick={{ fontSize: formPeriod === 'day' ? 10 : 11 }}
                  interval={formPeriod === 'day' ? 0 : 'preserveStartEnd'}
                  angle={formPeriod === 'day' ? -35 : 0}
                  textAnchor={formPeriod === 'day' ? 'end' : 'middle'}
                  height={formPeriod === 'day' ? 52 : 30}
                />
                <YAxis tick={{ fontSize: 11 }} allowDecimals={false} />
                <Tooltip
                  contentStyle={{ borderRadius: 8, border: '1px solid #e5e7eb' }}
                  formatter={(value: number) => [t('admin_stats_count', { n: value }), t('admin_stats_tooltip_count')]}
                />
                <Line
                  type="monotone"
                  dataKey="v"
                  stroke={chartColor}
                  strokeWidth={2.5}
                  dot={{ fill: chartColor, strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-gray-200 flex items-start gap-3">
          <div className="w-10 h-10 rounded-lg bg-violet-50 flex items-center justify-center shrink-0">
            <MessageSquare className="w-5 h-5 text-violet-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">{t('admin_stats_complaints')}</h3>
            <p className="text-sm text-gray-500 mt-0.5">{t('admin_stats_complaints_hint')}</p>
          </div>
        </div>
        <div className="p-5 md:p-6 space-y-5">
          {data.complaints.map(row => {
            const pct = Math.round((row.count / data.maxComplaint) * 100);
            return (
              <div key={row.text}>
                <div className="flex justify-between gap-4 text-sm mb-1.5">
                  <span className="text-gray-800 font-medium leading-snug">{row.text}</span>
                  <span className="text-gray-600 shrink-0 tabular-nums">
                    {t('admin_stats_count', { n: row.count })}{' '}
                    <span className="text-gray-400">({t('admin_stats_share', { pct })})</span>
                  </span>
                </div>
                <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-violet-500 to-emerald-500 transition-all"
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
