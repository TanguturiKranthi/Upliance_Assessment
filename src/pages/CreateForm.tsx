import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Switch,
  FormControlLabel,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Chip,
  OutlinedInput,
} from '@mui/material';
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  DragIndicator as DragIcon,
  Save as SaveIcon,
} from '@mui/icons-material';
import { useAppDispatch, useAppSelector } from '../hooks/redux';
import { addField, updateField, removeField, saveForm, setCurrentForm } from '../store/formSlice';
import { FormField, FieldType } from '../types/form';
import { addFormToStorage } from '../utils/localStorage';

const CreateForm: React.FC = () => {
  const dispatch = useAppDispatch();
  const { currentForm } = useAppSelector((state) => state.form);
  const [showAddFieldDialog, setShowAddFieldDialog] = useState(false);
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [formName, setFormName] = useState('');
  const [newField, setNewField] = useState<Partial<FormField>>({
    type: 'text',
    label: '',
    required: false,
    validationRules: [],
    isDerived: false,
  });

  useEffect(() => {
    if (!currentForm) {
      dispatch(setCurrentForm({
        id: Date.now().toString(),
        name: '',
        fields: [],
        createdAt: new Date().toISOString(),
      }));
    }
  }, [dispatch, currentForm]);

  const handleAddField = () => {
    if (newField.label && newField.type) {
      const field: FormField = {
        id: Date.now().toString(),
        type: newField.type as FieldType,
        label: newField.label,
        required: newField.required || false,
        validationRules: newField.validationRules || [],
        options: newField.options || [],
        isDerived: newField.isDerived || false,
        parentFields: newField.parentFields || [],
        formula: newField.formula || '',
        order: currentForm?.fields.length || 0,
      };
      dispatch(addField(field));
      setNewField({
        type: 'text',
        label: '',
        required: false,
        validationRules: [],
        isDerived: false,
      });
      setShowAddFieldDialog(false);
    }
  };

  const handleSaveForm = () => {
    if (formName.trim() && currentForm) {
      const formToSave = {
        ...currentForm,
        name: formName,
      };
      addFormToStorage(formToSave);
      dispatch(saveForm(formName));
      setShowSaveDialog(false);
      setFormName('');
    }
  };

  const handleRemoveField = (fieldId: string) => {
    dispatch(removeField(fieldId));
  };

  const handleFieldUpdate = (fieldId: string, updates: Partial<FormField>) => {
    dispatch(updateField({ id: fieldId, field: updates }));
  };

  const handleParentFieldChange = (fieldId: string, parentFieldIds: string[]) => {
    dispatch(updateField({ id: fieldId, field: { parentFields: parentFieldIds } }));
  };

  const fieldTypes: { value: FieldType; label: string }[] = [
    { value: 'text', label: 'Text' },
    { value: 'number', label: 'Number' },
    { value: 'textarea', label: 'Textarea' },
    { value: 'select', label: 'Select' },
    { value: 'radio', label: 'Radio' },
    { value: 'checkbox', label: 'Checkbox' },
    { value: 'date', label: 'Date' },
  ];

  if (!currentForm) {
    return <Typography>Loading...</Typography>;
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1">
          Create Form
        </Typography>
        <Button
          variant="contained"
          startIcon={<SaveIcon />}
          onClick={() => setShowSaveDialog(true)}
          disabled={currentForm.fields.length === 0}
        >
          Save Form
        </Button>
      </Box>

      <Box sx={{ display: 'flex', gap: 3, flexDirection: { xs: 'column', md: 'row' } }}>
        <Box sx={{ flex: { md: 2 } }}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Form Fields ({currentForm.fields.length})
              </Typography>
              
              {currentForm.fields.length === 0 ? (
                <Box sx={{ textAlign: 'center', py: 4 }}>
                  <Typography color="textSecondary">
                    No fields added yet. Click "Add Field" to get started.
                  </Typography>
                </Box>
              ) : (
                <Box>
                  {currentForm.fields.map((field, index) => (
                    <Card key={field.id} sx={{ mb: 2, p: 2 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <DragIcon sx={{ mr: 1, color: 'text.secondary' }} />
                        <Typography variant="subtitle1" sx={{ flexGrow: 1 }}>
                          {field.label} ({field.type})
                        </Typography>
                        <IconButton
                          size="small"
                          onClick={() => handleRemoveField(field.id)}
                          color="error"
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Box>
                      
                      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 2 }}>
                        <Box sx={{ flex: 1 }}>
                          <TextField
                            fullWidth
                            label="Field Label"
                            value={field.label}
                            onChange={(e) => handleFieldUpdate(field.id, { label: e.target.value })}
                            size="small"
                          />
                        </Box>
                        <Box sx={{ flex: 1 }}>
                          <FormControl fullWidth size="small">
                            <InputLabel>Field Type</InputLabel>
                            <Select
                              value={field.type}
                              label="Field Type"
                              onChange={(e) => handleFieldUpdate(field.id, { type: e.target.value as FieldType })}
                            >
                              {fieldTypes.map((type) => (
                                <MenuItem key={type.value} value={type.value}>
                                  {type.label}
                                </MenuItem>
                              ))}
                            </Select>
                          </FormControl>
                        </Box>
                      </Box>
                      
                      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 2, mt: 2 }}>
                        <Box sx={{ flex: 1 }}>
                          <FormControlLabel
                            control={
                              <Switch
                                checked={field.required}
                                onChange={(e) => handleFieldUpdate(field.id, { required: e.target.checked })}
                              />
                            }
                            label="Required"
                          />
                        </Box>
                        <Box sx={{ flex: 1 }}>
                          <FormControlLabel
                            control={
                              <Switch
                                checked={field.isDerived}
                                onChange={(e) => handleFieldUpdate(field.id, { isDerived: e.target.checked })}
                              />
                            }
                            label="Derived Field"
                          />
                        </Box>
                      </Box>
                      
                      {field.isDerived && (
                        <Box sx={{ mt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
                          <FormControl fullWidth size="small">
                            <InputLabel>Parent Fields</InputLabel>
                            <Select
                              multiple
                              value={field.parentFields || []}
                              onChange={(e) => handleParentFieldChange(field.id, e.target.value as string[])}
                              input={<OutlinedInput label="Parent Fields" />}
                              renderValue={(selected) => (
                                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                  {(selected as string[]).map((value) => {
                                    const parentField = currentForm.fields.find(f => f.id === value);
                                    return (
                                      <Chip key={value} label={parentField?.label || value} size="small" />
                                    );
                                  })}
                                </Box>
                              )}
                            >
                              {currentForm.fields
                                .filter(f => f.id !== field.id && !f.isDerived)
                                .map((parentField) => (
                                  <MenuItem key={parentField.id} value={parentField.id}>
                                    {parentField.label} ({parentField.id})
                                  </MenuItem>
                                ))}
                            </Select>
                          </FormControl>
                          
                          <TextField
                            fullWidth
                            label="Formula"
                            value={field.formula || ''}
                            onChange={(e) => handleFieldUpdate(field.id, { formula: e.target.value })}
                            placeholder="e.g., field1 + field2 or field1 * 2"
                            size="small"
                            helperText={`Use field IDs in your formula. Available fields: ${
                              (field.parentFields || [])
                                .map(id => {
                                  const parentField = currentForm.fields.find(f => f.id === id);
                                  return `${parentField?.label} (${id})`;
                                })
                                .join(', ')
                            }`}
                          />
                        </Box>
                      )}
                    </Card>
                  ))}
                </Box>
              )}
            </CardContent>
          </Card>
        </Box>

        <Box sx={{ flex: { md: 1 } }}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Add New Field
              </Typography>
              <Button
                fullWidth
                variant="outlined"
                startIcon={<AddIcon />}
                onClick={() => setShowAddFieldDialog(true)}
              >
                Add Field
              </Button>
            </CardContent>
          </Card>
        </Box>
      </Box>

      {/* Add Field Dialog */}
      <Dialog open={showAddFieldDialog} onClose={() => setShowAddFieldDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Add New Field</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
            <TextField
              fullWidth
              label="Field Label"
              value={newField.label}
              onChange={(e) => setNewField({ ...newField, label: e.target.value })}
            />
            <FormControl fullWidth>
              <InputLabel>Field Type</InputLabel>
              <Select
                value={newField.type}
                label="Field Type"
                onChange={(e) => setNewField({ ...newField, type: e.target.value as FieldType })}
              >
                {fieldTypes.map((type) => (
                  <MenuItem key={type.value} value={type.value}>
                    {type.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControlLabel
              control={
                <Switch
                  checked={newField.required}
                  onChange={(e) => setNewField({ ...newField, required: e.target.checked })}
                />
              }
              label="Required"
            />
            <FormControlLabel
              control={
                <Switch
                  checked={newField.isDerived}
                  onChange={(e) => setNewField({ ...newField, isDerived: e.target.checked })}
                />
              }
              label="Derived Field"
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowAddFieldDialog(false)}>Cancel</Button>
          <Button onClick={handleAddField} variant="contained">Add Field</Button>
        </DialogActions>
      </Dialog>

      {/* Save Form Dialog */}
      <Dialog open={showSaveDialog} onClose={() => setShowSaveDialog(false)}>
        <DialogTitle>Save Form</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Form Name"
            value={formName}
            onChange={(e) => setFormName(e.target.value)}
            sx={{ mt: 1 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowSaveDialog(false)}>Cancel</Button>
          <Button onClick={handleSaveForm} variant="contained" disabled={!formName.trim()}>
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default CreateForm; 