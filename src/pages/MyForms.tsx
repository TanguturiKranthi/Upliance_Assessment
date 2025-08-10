import React, { useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  CardActions,
  Button,
  Chip,
  IconButton,
  Divider,
} from '@mui/material';
import {
  Visibility as PreviewIcon,
  Delete as DeleteIcon,
  CalendarToday as CalendarIcon,
} from '@mui/icons-material';
import { useAppDispatch, useAppSelector } from '../hooks/redux';
import { useNavigate } from 'react-router-dom';
import { loadSavedForms, setCurrentForm } from '../store/formSlice';
import { loadFormsFromStorage, saveFormsToStorage } from '../utils/localStorage';
import { FormSchema } from '../types/form';

const MyForms: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { savedForms } = useAppSelector((state) => state.form);

  useEffect(() => {
    // Load saved forms from localStorage on component mount
    const forms = loadFormsFromStorage();
    dispatch(loadSavedForms(forms));
  }, [dispatch]);

  const handlePreviewForm = (form: FormSchema) => {
    dispatch(setCurrentForm(form));
    navigate('/preview');
  };

  const handleDeleteForm = (formId: string) => {
    const updatedForms = savedForms.filter(form => form.id !== formId);
    saveFormsToStorage(updatedForms);
    dispatch(loadSavedForms(updatedForms));
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (savedForms.length === 0) {
    return (
      <Box sx={{ textAlign: 'center', py: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          My Forms
        </Typography>
        <Typography variant="h6" color="textSecondary" gutterBottom>
          No saved forms yet
        </Typography>
        <Typography color="textSecondary" sx={{ mb: 3 }}>
          Create your first form to get started
        </Typography>
        <Button
          variant="contained"
          onClick={() => navigate('/create')}
          size="large"
        >
          Create New Form
        </Button>
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        My Forms
      </Typography>
      
      <Typography variant="body1" color="textSecondary" sx={{ mb: 3 }}>
        {savedForms.length} form{savedForms.length !== 1 ? 's' : ''} saved
      </Typography>

      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)', lg: 'repeat(3, 1fr)' }, gap: 3 }}>
        {savedForms.map((form) => (
          <Card key={form.id} sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <CardContent sx={{ flexGrow: 1 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                <Typography variant="h6" component="h2" sx={{ wordBreak: 'break-word' }}>
                  {form.name}
                </Typography>
                <Chip
                  label={`${form.fields.length} field${form.fields.length !== 1 ? 's' : ''}`}
                  size="small"
                  color="primary"
                  variant="outlined"
                />
              </Box>
              
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <CalendarIcon sx={{ fontSize: 16, mr: 1, color: 'text.secondary' }} />
                <Typography variant="caption" color="textSecondary">
                  Created: {formatDate(form.createdAt)}
                </Typography>
              </Box>

              <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
                {form.fields.length > 0 
                  ? `Fields: ${form.fields.map(f => f.label).join(', ')}`
                  : 'No fields defined'
                }
              </Typography>

              {form.fields.some(f => f.isDerived) && (
                <Chip
                  label="Has Derived Fields"
                  size="small"
                  color="secondary"
                  sx={{ mb: 1 }}
                />
              )}
            </CardContent>
            
            <Divider />
            
            <CardActions sx={{ justifyContent: 'space-between', p: 2 }}>
              <Button
                size="small"
                startIcon={<PreviewIcon />}
                onClick={() => handlePreviewForm(form)}
              >
                Preview
              </Button>
              <IconButton
                size="small"
                color="error"
                onClick={() => handleDeleteForm(form.id)}
              >
                <DeleteIcon />
              </IconButton>
            </CardActions>
          </Card>
        ))}
      </Box>

      <Box sx={{ mt: 4, textAlign: 'center' }}>
        <Button
          variant="outlined"
          onClick={() => navigate('/create')}
          size="large"
        >
          Create New Form
        </Button>
      </Box>
    </Box>
  );
};

export default MyForms; 