import { ValidationRule } from '../types/form';

export const validateField = (value: any, validationRules: ValidationRule[]): string | null => {
  for (const rule of validationRules) {
    switch (rule.type) {
      case 'required':
        if (!value || (typeof value === 'string' && value.trim() === '')) {
          return rule.message;
        }
        break;
      
      case 'minLength':
        if (value && typeof value === 'string' && value.length < (rule.value as number)) {
          return rule.message;
        }
        break;
      
      case 'maxLength':
        if (value && typeof value === 'string' && value.length > (rule.value as number)) {
          return rule.message;
        }
        break;
      
      case 'email':
        if (value && typeof value === 'string') {
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          if (!emailRegex.test(value)) {
            return rule.message;
          }
        }
        break;
      
      case 'password':
        if (value && typeof value === 'string') {
          const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*#?&]{8,}$/;
          if (!passwordRegex.test(value)) {
            return rule.message;
          }
        }
        break;
      
      case 'custom':
        // Custom validation logic can be added here
        break;
    }
  }
  return null;
};

export const computeDerivedValue = (formula: string, parentValues: { [key: string]: any }): any => {
  try {
    if (!formula || !parentValues) {
      return '';
    }

    // Simple formula evaluation - can be extended for more complex formulas
    let computedFormula = formula;
    
    // Replace field references with actual values
    Object.keys(parentValues).forEach(fieldId => {
      const value = parentValues[fieldId];
      // Handle different data types appropriately
      let replacementValue;
      if (typeof value === 'number') {
        replacementValue = value.toString();
      } else if (typeof value === 'string') {
        // Try to convert string to number if it's numeric
        const numValue = parseFloat(value);
        if (!isNaN(numValue)) {
          replacementValue = numValue.toString();
        } else {
          // For non-numeric strings, wrap in quotes for string operations
          replacementValue = `"${value}"`;
        }
      } else if (typeof value === 'boolean') {
        replacementValue = value.toString();
      } else {
        replacementValue = '0'; // Default fallback
      }
      
      // Replace field ID with its value in the formula
      const fieldIdRegex = new RegExp(`\\b${fieldId}\\b`, 'g');
      computedFormula = computedFormula.replace(fieldIdRegex, replacementValue);
    });
    
    // Basic safety check - only allow mathematical operations and basic functions
    const safeFormula = computedFormula.replace(/[^0-9+\-*/()., "]/g, '');
    
    // Evaluate the formula (basic implementation)
    // eslint-disable-next-line no-eval
    const result = eval(safeFormula);
    
    // Return appropriate type
    if (typeof result === 'number') {
      return result;
    } else if (typeof result === 'string') {
      return result;
    } else {
      return result.toString();
    }
  } catch (error) {
    console.error('Error computing derived value:', error);
    return '';
  }
}; 