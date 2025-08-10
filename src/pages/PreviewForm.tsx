import React, { useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormControlLabel,
  Checkbox,
  Radio,
  RadioGroup,
  Alert,
  Chip,
  Tooltip,
} from '@mui/material';
import { useAppDispatch, useAppSelector } from '../hooks/redux';
import { setFormData, setFieldError, clearFieldError } from '../store/formSlice';
import { validateField, computeDerivedValue } from '../utils/validation';
import { FormField } from '../types/form';

const PreviewForm: React.FC = () => {
  const dispatch = useAppDispatch();
  const { currentForm, formData, errors } = useAppSelector((state) => state.form);

  useEffect(() => {
    // Compute derived fields when form data changes
    if (currentForm) {
      currentForm.fields.forEach((field) => {
        if (field.isDerived && field.formula && field.parentFields && field.parentFields.length > 0) {
          const parentValues: { [key: string]: any } = {};
          let allParentsHaveValues = true;
          
          field.parentFields.forEach((parentId) => {
            const parentValue = formData[parentId];
            if (parentValue !== undefined && parentValue !== null && parentValue !== '') {
              parentValues[parentId] = parentValue;
            } else {
              allParentsHaveValues = false;
            }
          });
          
          if (allParentsHaveValues) {
            const derivedValue = computeDerivedValue(field.formula, parentValues);
            dispatch(setFormData({ fieldId: field.id, value: derivedValue }));
          } else {
            // Clear derived field if parent fields don't have values
            dispatch(setFormData({ fieldId: field.id, value: '' }));
          }
        }
      });
    }
  }, [formData, currentForm, dispatch]);

  const handleFieldChange = (fieldId: string, value: any) => {
    dispatch(setFormData({ fieldId, value }));
    
    // Clear previous error
    dispatch(clearFieldError(fieldId));
    
    // Validate field
    const field = currentForm?.fields.find(f => f.id === fieldId);
    if (field) {
      const error = validateField(value, field.validationRules);
      if (error) {
        dispatch(setFieldError({ fieldId, error }));
      }
    }
  };

  const getDerivedFieldStatus = (field: FormField) => {
    if (!field.isDerived || !field.parentFields || field.parentFields.length === 0) {
      return null;
    }

    const missingParents = field.parentFields.filter(parentId => {
      const parentValue = formData[parentId];
      return parentValue === undefined || parentValue === null || parentValue === '';
    });

    if (missingParents.length > 0) {
      const missingParentLabels = missingParents.map(id => {
        const parentField = currentForm?.fields.find(f => f.id === id);
        return parentField?.label || id;
      });
      return `Waiting for: ${missingParentLabels.join(', ')}`;
    }

    return 'Computed automatically';
  };

  const renderField = (field: FormField) => {
    const value = formData[field.id] || field.defaultValue || '';
    const error = errors[field.id];
    const derivedStatus = getDerivedFieldStatus(field);

    switch (field.type) {
      case 'text':
        return (
          <TextField
            fullWidth
            label={field.label}
            value={value}
            onChange={(e) => handleFieldChange(field.id, e.target.value)}
            error={!!error}
            helperText={error || (derivedStatus && `Derived field: ${derivedStatus}`)}
            required={field.required}
            disabled={field.isDerived}
          />
        );

      case 'number':
        return (
          <TextField
            fullWidth
            type="number"
            label={field.label}
            value={value}
            onChange={(e) => handleFieldChange(field.id, Number(e.target.value))}
            error={!!error}
            helperText={error || (derivedStatus && `Derived field: ${derivedStatus}`)}
            required={field.required}
            disabled={field.isDerived}
          />
        );

      case 'textarea':
        return (
          <TextField
            fullWidth
            multiline
            rows={4}
            label={field.label}
            value={value}
            onChange={(e) => handleFieldChange(field.id, e.target.value)}
            error={!!error}
            helperText={error || (derivedStatus && `Derived field: ${derivedStatus}`)}
            required={field.required}
            disabled={field.isDerived}
          />
        );

      case 'select':
        return (
          <FormControl fullWidth error={!!error}>
            <InputLabel>{field.label}</InputLabel>
            <Select
              value={value}
              label={field.label}
              onChange={(e) => handleFieldChange(field.id, e.target.value)}
              disabled={field.isDerived}
            >
              {field.options?.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </Select>
            {(error || derivedStatus) && (
              <Typography color={error ? 'error' : 'textSecondary'} variant="caption">
                {error || `Derived field: ${derivedStatus}`}
              </Typography>
            )}
          </FormControl>
        );

      case 'radio':
        return (
          <FormControl error={!!error}>
            <Typography variant="subtitle2" gutterBottom>
              {field.label} {field.required && '*'}
            </Typography>
            <RadioGroup
              value={value}
              onChange={(e) => handleFieldChange(field.id, e.target.value)}
            >
              {field.options?.map((option) => (
                <FormControlLabel
                  key={option.value}
                  value={option.value}
                  control={<Radio disabled={field.isDerived} />}
                  label={option.label}
                />
              ))}
            </RadioGroup>
            {(error || derivedStatus) && (
              <Typography color={error ? 'error' : 'textSecondary'} variant="caption">
                {error || `Derived field: ${derivedStatus}`}
              </Typography>
            )}
          </FormControl>
        );

      case 'checkbox':
        return (
          <FormControlLabel
            control={
              <Checkbox
                checked={Boolean(value)}
                onChange={(e) => handleFieldChange(field.id, e.target.checked)}
                disabled={field.isDerived}
              />
            }
            label={field.label}
          />
        );

      case 'date':
        return (
          <TextField
            fullWidth
            type="date"
            label={field.label}
            value={value}
            onChange={(e) => handleFieldChange(field.id, e.target.value)}
            error={!!error}
            helperText={error || (derivedStatus && `Derived field: ${derivedStatus}`)}
            required={field.required}
            disabled={field.isDerived}
            InputLabelProps={{ shrink: true }}
          />
        );

      default:
        return null;
    }
  };

  if (!currentForm) {
    return (
      <Box sx={{ textAlign: 'center', py: 4 }}>
        <Typography variant="h5" color="textSecondary">
          No form to preview
        </Typography>
        <Typography color="textSecondary">
          Create a form first to see the preview
        </Typography>
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        Form Preview
      </Typography>
      
      {currentForm.name && (
        <Typography variant="h6" color="textSecondary" gutterBottom>
          {currentForm.name}
        </Typography>
      )}

      <Card>
        <CardContent>
          <Box component="form" sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            {currentForm.fields.length === 0 ? (
              <Typography color="textSecondary" sx={{ textAlign: 'center', py: 4 }}>
                No fields to display
              </Typography>
            ) : (
              currentForm.fields.map((field) => (
                <Box key={field.id}>
                  {field.isDerived && (
                    <Tooltip title={`Formula: ${field.formula || 'No formula set'}`}>
                      <Chip
                        label="Derived Field"
                        color="secondary"
                        size="small"
                        sx={{ mb: 1 }}
                      />
                    </Tooltip>
                  )}
                  {renderField(field)}
                </Box>
              ))
            )}
          </Box>
        </CardContent>
      </Card>

      {Object.keys(errors).length > 0 && (
        <Alert severity="error" sx={{ mt: 2 }}>
          Please fix the validation errors above
        </Alert>
      )}
    </Box>
  );
};

export default PreviewForm; 