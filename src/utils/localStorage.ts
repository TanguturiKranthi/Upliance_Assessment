import { FormSchema } from '../types/form';

const FORMS_STORAGE_KEY = 'formBuilder_savedForms';

export const saveFormsToStorage = (forms: FormSchema[]): void => {
  try {
    localStorage.setItem(FORMS_STORAGE_KEY, JSON.stringify(forms));
  } catch (error) {
    console.error('Error saving forms to localStorage:', error);
  }
};

export const loadFormsFromStorage = (): FormSchema[] => {
  try {
    const stored = localStorage.getItem(FORMS_STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Error loading forms from localStorage:', error);
    return [];
  }
};

export const addFormToStorage = (form: FormSchema): void => {
  try {
    const existingForms = loadFormsFromStorage();
    existingForms.push(form);
    saveFormsToStorage(existingForms);
  } catch (error) {
    console.error('Error adding form to localStorage:', error);
  }
}; 