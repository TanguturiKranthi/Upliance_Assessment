# Derived Fields Guide

This guide explains how to use the derived fields functionality in the Dynamic Form Builder.

## What are Derived Fields?

Derived fields are computed fields that automatically calculate their values based on other fields in the form. They update in real-time when their parent fields change.

## How to Create a Derived Field

### Step 1: Add a New Field
1. Go to the **Create Form** page
2. Click **"Add Field"**
3. Enter a label for your derived field
4. Choose any field type (text, number, etc.)
5. **Enable the "Derived Field" toggle**

### Step 2: Select Parent Fields
1. In the field configuration, you'll see a **"Parent Fields"** dropdown
2. Select one or more fields that will provide values for the calculation
3. Only non-derived fields can be selected as parents

### Step 3: Define the Formula
1. Enter a formula using the field IDs of your parent fields
2. Use standard mathematical operators: `+`, `-`, `*`, `/`, `()`
3. The formula will be evaluated automatically

## Formula Examples

### Basic Arithmetic
```
field1 + field2          // Addition
field1 - field2          // Subtraction
field1 * field2          // Multiplication
field1 / field2          // Division
(field1 + field2) * 2    // Complex calculation
```

### Real-World Examples

#### 1. Total Price Calculation
- **Parent Fields**: `price` (number), `quantity` (number)
- **Formula**: `price * quantity`
- **Result**: Automatically calculates total price

#### 2. Age Calculation from Birth Year
- **Parent Fields**: `birthYear` (number)
- **Formula**: `2024 - birthYear`
- **Result**: Calculates current age

#### 3. Full Name from First and Last
- **Parent Fields**: `firstName` (text), `lastName` (text)
- **Formula**: `firstName + " " + lastName`
- **Result**: Combines first and last name

#### 4. Percentage Calculation
- **Parent Fields**: `score` (number), `total` (number)
- **Formula**: `(score / total) * 100`
- **Result**: Calculates percentage

## How It Works

### In the Create Form
1. **Parent Field Selection**: Choose which fields will provide input values
2. **Formula Input**: Write the calculation using field IDs
3. **Helper Text**: Shows available parent fields and their IDs

### In the Preview
1. **Automatic Updates**: Derived fields update when parent fields change
2. **Status Indicators**: Shows "Waiting for..." or "Computed automatically"
3. **Disabled Input**: Derived fields cannot be manually edited
4. **Tooltips**: Hover over "Derived Field" chip to see the formula

## Best Practices

### 1. Field Naming
- Use descriptive field IDs that make formulas readable
- Example: `price`, `quantity`, `totalPrice`

### 2. Formula Writing
- Use field IDs (not labels) in formulas
- Test your formulas with different values
- Keep formulas simple and readable

### 3. Parent Field Selection
- Only select fields that will have numeric values for mathematical operations
- For text operations, ensure parent fields contain appropriate text data

### 4. Error Handling
- Derived fields show "Waiting for..." when parent fields are empty
- Invalid formulas will result in empty derived field values

## Troubleshooting

### Common Issues

#### 1. "Waiting for..." Message
- **Cause**: Parent fields don't have values
- **Solution**: Fill in the parent field values first

#### 2. Formula Not Working
- **Cause**: Invalid formula syntax or field IDs
- **Solution**: Check field IDs and formula syntax

#### 3. Unexpected Results
- **Cause**: Data type mismatches
- **Solution**: Ensure parent fields contain appropriate data types

### Debugging Tips

1. **Check Field IDs**: Verify you're using correct field IDs in formulas
2. **Test with Simple Values**: Start with basic calculations
3. **Check Data Types**: Ensure parent fields contain expected data types
4. **Use Preview**: Test your derived fields in the preview mode

## Advanced Features

### Multiple Parent Fields
You can select multiple parent fields for complex calculations:
```
field1 + field2 + field3
(field1 * field2) / field3
```

### Conditional Logic
Basic conditional operations are supported:
```
field1 > 0 ? field1 * 2 : 0
```

### String Operations
For text fields, you can concatenate strings:
```
firstName + " " + lastName
"Total: " + (price * quantity)
```

## Example Form Setup

Here's a complete example of a shopping cart form with derived fields:

### Fields:
1. **Product Name** (text) - `productName`
2. **Price** (number) - `price`
3. **Quantity** (number) - `quantity`
4. **Discount** (number) - `discount`
5. **Subtotal** (number, derived) - Formula: `price * quantity`
6. **Discount Amount** (number, derived) - Formula: `subtotal * (discount / 100)`
7. **Total** (number, derived) - Formula: `subtotal - discountAmount`

### Result:
- When you change price or quantity, subtotal updates automatically
- When you change discount, discount amount and total update automatically
- All calculations happen in real-time

## Security Notes

- Formulas are evaluated safely with basic mathematical operations
- Only allowed characters and operations are processed
- No external code execution is permitted
- All calculations happen client-side

This derived fields functionality makes your forms dynamic and interactive, providing a better user experience with automatic calculations and real-time updates. 