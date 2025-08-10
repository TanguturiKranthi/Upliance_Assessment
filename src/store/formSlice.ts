import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { FormSchema, FormField, FormData } from '../types/form';

interface FormState {
  currentForm: FormSchema | null;
  savedForms: FormSchema[];
  formData: FormData;
  errors: { [fieldId: string]: string };
}

const initialState: FormState = {
  currentForm: null,
  savedForms: [],
  formData: {},
  errors: {},
};

const formSlice = createSlice({
  name: 'form',
  initialState,
  reducers: {
    setCurrentForm: (state, action: PayloadAction<FormSchema | null>) => {
      state.currentForm = action.payload;
      state.formData = {};
      state.errors = {};
    },
    addField: (state, action: PayloadAction<FormField>) => {
      if (state.currentForm) {
        state.currentForm.fields.push(action.payload);
      }
    },
    updateField: (state, action: PayloadAction<{ id: string; field: Partial<FormField> }>) => {
      if (state.currentForm) {
        const index = state.currentForm.fields.findIndex(f => f.id === action.payload.id);
        if (index !== -1) {
          state.currentForm.fields[index] = { ...state.currentForm.fields[index], ...action.payload.field };
        }
      }
    },
    removeField: (state, action: PayloadAction<string>) => {
      if (state.currentForm) {
        state.currentForm.fields = state.currentForm.fields.filter(f => f.id !== action.payload);
      }
    },
    reorderFields: (state, action: PayloadAction<{ fromIndex: number; toIndex: number }>) => {
      if (state.currentForm) {
        const { fromIndex, toIndex } = action.payload;
        const fields = [...state.currentForm.fields];
        const [removed] = fields.splice(fromIndex, 1);
        fields.splice(toIndex, 0, removed);
        fields.forEach((field, index) => {
          field.order = index;
        });
        state.currentForm.fields = fields;
      }
    },
    saveForm: (state, action: PayloadAction<string>) => {
      if (state.currentForm) {
        const formToSave = {
          ...state.currentForm,
          name: action.payload,
          createdAt: new Date().toISOString(),
        };
        state.savedForms.push(formToSave);
        state.currentForm = null;
      }
    },
    loadSavedForms: (state, action: PayloadAction<FormSchema[]>) => {
      state.savedForms = action.payload;
    },
    setFormData: (state, action: PayloadAction<{ fieldId: string; value: any }>) => {
      state.formData[action.payload.fieldId] = action.payload.value;
    },
    setFieldError: (state, action: PayloadAction<{ fieldId: string; error: string }>) => {
      state.errors[action.payload.fieldId] = action.payload.error;
    },
    clearFieldError: (state, action: PayloadAction<string>) => {
      delete state.errors[action.payload];
    },
    clearAllErrors: (state) => {
      state.errors = {};
    },
  },
});

export const {
  setCurrentForm,
  addField,
  updateField,
  removeField,
  reorderFields,
  saveForm,
  loadSavedForms,
  setFormData,
  setFieldError,
  clearFieldError,
  clearAllErrors,
} = formSlice.actions;

export default formSlice.reducer; 