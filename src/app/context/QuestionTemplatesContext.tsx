import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode
} from 'react';
import type { FormField, QuestionTemplate } from '@/app/types/questionTemplates';

const INITIAL_TEMPLATES: QuestionTemplate[] = [
  {
    id: 'tpl-urolog',
    specialty: 'Urolog',
    title: 'Urolog — dastlabki qabul',
    createdAt: '2026-01-10',
    questions: [
      { id: 'u1', label: 'Asosiy shikoyat', type: 'text', required: true },
      {
        id: 'u2',
        label: 'Davomiyligi',
        type: 'select',
        options: ['1 kun', '1 hafta', '1 oy', "1 yildan ko'p"],
        required: true
      },
      { id: 'u3', label: "Og'riq darajasi (1-10)", type: 'number', required: true },
      { id: 'u4', label: 'Tunda necha marta turish', type: 'number', required: false },
      { id: 'u5', label: 'Qon bosimi', type: 'yes_no', required: true }
    ]
  },
  {
    id: 'tpl-ginekolog',
    specialty: 'Ginekolog',
    title: 'Ginekolog — qabul',
    createdAt: '2026-01-12',
    questions: [
      { id: 'g1', label: 'Oxirgi hayz sanasi', type: 'date', required: true },
      { id: 'g2', label: "Og'riq bormi", type: 'yes_no', required: true },
      { id: 'g3', label: "Og'riq joyi", type: 'text', required: false },
      { id: 'g4', label: "Homiladorlik bo'lganmi", type: 'yes_no', required: true },
      {
        id: 'g5',
        label: 'Shikoyat davomiyligi',
        type: 'select',
        options: ['1 kun', '1 hafta', '1 oy'],
        required: true
      }
    ]
  },
  {
    id: 'tpl-kardiolog',
    specialty: 'Kardiolog',
    title: 'Kardiolog — konsultatsiya',
    createdAt: '2026-01-15',
    questions: [
      { id: 'k1', label: "Ko'krak og'rig'i bormi", type: 'yes_no', required: true },
      { id: 'k2', label: 'Nafas qisishmi', type: 'yes_no', required: true },
      { id: 'k3', label: 'Qon bosimi', type: 'text', required: true },
      { id: 'k4', label: 'Yurak urishi (min)', type: 'number', required: false },
      {
        id: 'k5',
        label: 'Shikoyat davomiyligi',
        type: 'select',
        options: ['1 kun', '1 hafta', '1 oy', "1 yildan ko'p"],
        required: true
      }
    ]
  }
];

interface QuestionTemplatesContextValue {
  templates: QuestionTemplate[];
  addTemplate: (input: Omit<QuestionTemplate, 'id' | 'createdAt'>) => QuestionTemplate;
  updateTemplate: (id: string, updates: Partial<Omit<QuestionTemplate, 'id'>>) => void;
  deleteTemplate: (id: string) => void;
}

const QuestionTemplatesContext = createContext<QuestionTemplatesContextValue | null>(null);

export function QuestionTemplatesProvider({ children }: { children: ReactNode }) {
  const [templates, setTemplates] = useState<QuestionTemplate[]>(() =>
    INITIAL_TEMPLATES.map(t => ({
      ...t,
      questions: t.questions.map(q => ({
        ...q,
        options: q.options ? [...q.options] : undefined
      }))
    }))
  );

  const addTemplate = useCallback((input: Omit<QuestionTemplate, 'id' | 'createdAt'>) => {
    const created: QuestionTemplate = {
      ...input,
      id: `tpl-${Date.now()}`,
      createdAt: new Date().toISOString().split('T')[0],
      questions: input.questions.map(q => ({ ...q, options: q.options ? [...q.options] : undefined }))
    };
    setTemplates(prev => [...prev, created]);
    return created;
  }, []);

  const updateTemplate = useCallback((id: string, updates: Partial<Omit<QuestionTemplate, 'id'>>) => {
    setTemplates(prev =>
      prev.map(t => {
        if (t.id !== id) return t;
        const next = { ...t, ...updates };
        if (updates.questions) {
          next.questions = updates.questions.map(q => ({
            ...q,
            options: q.options ? [...q.options] : undefined
          }));
        }
        return next;
      })
    );
  }, []);

  const deleteTemplate = useCallback((id: string) => {
    setTemplates(prev => prev.filter(t => t.id !== id));
  }, []);

  const value = useMemo(
    () => ({
      templates,
      addTemplate,
      updateTemplate,
      deleteTemplate
    }),
    [templates, addTemplate, updateTemplate, deleteTemplate]
  );

  return (
    <QuestionTemplatesContext.Provider value={value}>{children}</QuestionTemplatesContext.Provider>
  );
}

export function useQuestionTemplates() {
  const ctx = useContext(QuestionTemplatesContext);
  if (!ctx) {
    throw new Error('useQuestionTemplates must be used within QuestionTemplatesProvider');
  }
  return ctx;
}
