export interface FormField {
  id: string;
  label: string;
  type: 'text' | 'number' | 'select' | 'date' | 'yes_no';
  options?: string[];
  required: boolean;
}

export interface QuestionTemplate {
  id: string;
  specialty: string;
  title: string;
  questions: FormField[];
  createdAt: string;
}

/** Deep copy fields with new ids (for admin form from template). */
export function cloneFormFields(fields: FormField[]): FormField[] {
  const ts = () => `${Date.now()}-${Math.random().toString(36).slice(2, 11)}`;
  return fields.map(f => ({
    ...f,
    id: ts(),
    options: f.options ? [...f.options] : undefined
  }));
}
