import { useMemo, useState } from 'react';
import { Plus, X, Trash2, Pencil, ClipboardList } from 'lucide-react';
import { useLanguage } from '@/app/i18n/LanguageContext';
import { useQuestionTemplates } from '@/app/context/QuestionTemplatesContext';
import type { FormField, QuestionTemplate } from '@/app/types/questionTemplates';

const emptyDraft = (): Omit<QuestionTemplate, 'id' | 'createdAt'> => ({
  specialty: '',
  title: '',
  questions: []
});

export function QuestionTemplatesSection() {
  const { t, locale } = useLanguage();
  const { templates, addTemplate, updateTemplate, deleteTemplate } = useQuestionTemplates();

  const [editorOpen, setEditorOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [draft, setDraft] = useState<Omit<QuestionTemplate, 'id' | 'createdAt'>>(emptyDraft());
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; title: string } | null>(null);

  const sortLocale = locale === 'ru' ? 'ru' : 'uz';
  const sorted = useMemo(
    () => [...templates].sort((a, b) => a.specialty.localeCompare(b.specialty, sortLocale)),
    [templates, sortLocale]
  );

  const openCreate = () => {
    setEditingId(null);
    setDraft(emptyDraft());
    setEditorOpen(true);
  };

  const openEdit = (tmpl: QuestionTemplate) => {
    setEditingId(tmpl.id);
    setDraft({
      specialty: tmpl.specialty,
      title: tmpl.title,
      questions: tmpl.questions.map(q => ({
        ...q,
        options: q.options ? [...q.options] : undefined
      }))
    });
    setEditorOpen(true);
  };

  const closeEditor = () => {
    setEditorOpen(false);
    setEditingId(null);
    setDraft(emptyDraft());
  };

  const saveEditor = () => {
    if (!draft.specialty.trim() || !draft.title.trim() || draft.questions.length === 0) {
      alert(t('tpl_alert_save'));
      return;
    }
    if (editingId) {
      updateTemplate(editingId, {
        specialty: draft.specialty.trim(),
        title: draft.title.trim(),
        questions: draft.questions
      });
    } else {
      addTemplate({
        specialty: draft.specialty.trim(),
        title: draft.title.trim(),
        questions: draft.questions.map(q => ({
          ...q,
          options: q.options ? [...q.options] : undefined
        }))
      });
    }
    closeEditor();
  };

  const addQuestion = () => {
    const field: FormField = {
      id: `q-${Date.now()}`,
      label: '',
      type: 'text',
      required: true
    };
    setDraft(d => ({ ...d, questions: [...d.questions, field] }));
  };

  const updateQuestion = (id: string, updates: Partial<FormField>) => {
    setDraft(d => ({
      ...d,
      questions: d.questions.map(q => (q.id === id ? { ...q, ...updates } : q))
    }));
  };

  const removeQuestion = (id: string) => {
    setDraft(d => ({ ...d, questions: d.questions.filter(q => q.id !== id) }));
  };

  const openDeleteModal = (id: string, title: string) => {
    setDeleteTarget({ id, title });
  };

  const confirmDelete = () => {
    if (!deleteTarget) return;
    deleteTemplate(deleteTarget.id);
    setDeleteTarget(null);
  };

  return (
    <div>
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">{t('tpl_page_title')}</h2>
            <p className="text-sm text-gray-500 mt-1">{t('tpl_page_desc')}</p>
          </div>
          <button
            type="button"
            onClick={openCreate}
            className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition"
          >
            <Plus className="w-4 h-4" />
            {t('tpl_new')}
          </button>
        </div>

        <div className="p-6">
          {sorted.length === 0 ? (
            <p className="text-center text-gray-500 py-12">{t('tpl_empty')}</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {sorted.map(tmpl => (
                <div
                  key={tmpl.id}
                  className="rounded-xl border border-gray-200 p-5 hover:border-emerald-200 transition bg-white shadow-sm"
                >
                  <div className="mb-3">
                    <span className="inline-flex items-center px-2.5 py-1 text-xs font-medium rounded-full bg-cyan-100 text-cyan-800">
                      {tmpl.specialty}
                    </span>
                  </div>
                  <div className="flex items-start gap-2 mb-2">
                    <ClipboardList className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                    <h3 className="font-semibold text-gray-900 leading-snug">{tmpl.title}</h3>
                  </div>
                  <p className="text-sm text-gray-500 mb-4">
                    {t('tpl_q_count', { n: tmpl.questions.length })}
                  </p>
                  <p className="text-xs text-gray-400 mb-4">
                    {t('tpl_created')} {tmpl.createdAt}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => openEdit(tmpl)}
                      className="flex items-center gap-1 px-3 py-1.5 text-sm rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50"
                    >
                      <Pencil className="w-3.5 h-3.5" />
                      {t('common_edit')}
                    </button>
                    <button
                      type="button"
                      onClick={() => openDeleteModal(tmpl.id, tmpl.title)}
                      className="flex items-center gap-1 px-3 py-1.5 text-sm rounded-lg text-red-600 hover:bg-red-50"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      {t('common_delete')}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {deleteTarget && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-[110]"
          role="dialog"
          aria-modal="true"
          aria-labelledby="delete-template-title"
          onClick={() => setDeleteTarget(null)}
        >
          <div
            className="bg-white rounded-xl max-w-md w-full p-6 shadow-lg border border-gray-200"
            onClick={e => e.stopPropagation()}
          >
            <h3 id="delete-template-title" className="text-lg font-bold text-gray-900 mb-2">
              {t('tpl_delete_title')}
            </h3>
            <p className="text-gray-800 font-medium mb-3">
              {t('tpl_delete_confirm', { title: deleteTarget.title })}
            </p>
            <ul className="text-sm text-gray-600 space-y-2 mb-6 list-disc list-inside">
              <li>{t('tpl_delete_li1')}</li>
              <li>{t('tpl_delete_li2')}</li>
            </ul>
            <div className="flex flex-col-reverse sm:flex-row gap-3 sm:justify-end">
              <button
                type="button"
                onClick={() => setDeleteTarget(null)}
                className="w-full sm:w-auto px-4 py-2.5 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 font-medium"
              >
                {t('common_cancel')}
              </button>
              <button
                type="button"
                onClick={confirmDelete}
                className="w-full sm:w-auto px-4 py-2.5 rounded-lg bg-red-600 text-white hover:bg-red-700 font-medium"
              >
                {t('sa_delete_yes')}
              </button>
            </div>
          </div>
        </div>
      )}

      {editorOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-[100] overflow-y-auto">
          <div className="bg-white rounded-xl max-w-2xl w-full p-6 my-8 shadow-lg border border-gray-200">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900">
                {editingId ? t('tpl_editor_edit') : t('tpl_editor_new')}
              </h3>
              <button
                type="button"
                onClick={closeEditor}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">{t('tpl_field_spec')}</label>
                <input
                  type="text"
                  value={draft.specialty}
                  onChange={e => setDraft(d => ({ ...d, specialty: e.target.value }))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
                  placeholder={t('tpl_field_spec_ph')}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">{t('tpl_field_name')}</label>
                <input
                  type="text"
                  value={draft.title}
                  onChange={e => setDraft(d => ({ ...d, title: e.target.value }))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
                  placeholder={t('tpl_field_name_ph')}
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-3">
                  <label className="text-sm font-medium text-gray-700">{t('tpl_questions')}</label>
                  <button
                    type="button"
                    onClick={addQuestion}
                    className="text-sm text-emerald-600 hover:text-emerald-700 font-medium"
                  >
                    {t('tpl_add_q')}
                  </button>
                </div>

                <div className="space-y-3 max-h-80 overflow-y-auto">
                  {draft.questions.map((field, index) => (
                    <div key={field.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-start justify-between mb-3">
                        <span className="text-sm font-medium text-gray-700">
                          {t('tpl_q_label', { n: index + 1 })}
                        </span>
                        <button
                          type="button"
                          onClick={() => removeQuestion(field.id)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>

                      <input
                        type="text"
                        value={field.label}
                        onChange={e => updateQuestion(field.id, { label: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg mb-2 text-sm outline-none focus:ring-2 focus:ring-emerald-500"
                        placeholder={t('tpl_q_ph')}
                      />

                      <div className="flex gap-2 flex-wrap">
                        <select
                          value={field.type}
                          onChange={e =>
                            updateQuestion(field.id, { type: e.target.value as FormField['type'] })
                          }
                          className="flex-1 min-w-[120px] px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-emerald-500"
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
                            onChange={e => updateQuestion(field.id, { required: e.target.checked })}
                            className="rounded border-gray-300"
                          />
                          {t('required')}
                        </label>
                      </div>

                      {field.type === 'select' && (
                        <input
                          type="text"
                          value={field.options?.join(', ') || ''}
                          onChange={e =>
                            updateQuestion(field.id, {
                              options: e.target.value.split(',').map(o => o.trim()).filter(Boolean)
                            })
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg mt-2 text-sm outline-none focus:ring-2 focus:ring-emerald-500"
                          placeholder={t('admin_options_ph')}
                        />
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={saveEditor}
                  className="flex-1 bg-emerald-600 text-white py-3 rounded-lg hover:bg-emerald-700 transition font-medium"
                >
                  {t('common_save')}
                </button>
                <button
                  type="button"
                  onClick={closeEditor}
                  className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition font-medium"
                >
                  {t('common_cancel')}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
