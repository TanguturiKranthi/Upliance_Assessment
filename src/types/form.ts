export type FieldType = 'text' | 'number' | 'textarea' | 'select' | 'radio' | 'checkbox' | 'date';

export interface ValidationRule {
  type: 'required' | 'minLength' | 'maxLength' | 'email' | 'password' | 'custom';
  value?: string | number;
  message: string;
}

export interface SelectOption {
  label: string;
  value: string;
}

export interface FormField {
  id: string;
  type: FieldType;
  label: string;
  required: boolean;
  defaultValue?: string | number | boolean;
  validationRules: ValidationRule[];
  options?: SelectOption[]; // For select, radio fields
  isDerived: boolean;
  parentFields?: string[]; // IDs of parent fields for derived fields
  formula?: string; // Formula for derived field computation
  order: number;
}

export interface FormSchema {
  id: string;
  name: string;
  fields: FormField[];
  createdAt: string;
}

export interface FormData {
  [fieldId: string]: any;
} 