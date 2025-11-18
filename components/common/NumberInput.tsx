import React, { useState, useEffect } from 'react';

interface NumberInputProps {
  label: string;
  value: number | undefined;
  onChange: (value: number | undefined) => void;
  placeholder?: string;
  required?: boolean;
  helpText?: string;
  unit?: string; // e.g., "EUR", "%", "m²", "Jahre"
  decimals?: number; // Default: 0 for integers
  min?: number;
  max?: number;
  disabled?: boolean;
}

export default function NumberInput({
  label,
  value,
  onChange,
  placeholder,
  required = false,
  helpText,
  unit,
  decimals = 0,
  min,
  max,
  disabled = false
}: NumberInputProps) {
  const [displayValue, setDisplayValue] = useState('');
  const [isFocused, setIsFocused] = useState(false);

  // Format number for display with thousands separators
  const formatNumber = (num: number): string => {
    return new Intl.NumberFormat('de-DE', {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    }).format(num);
  };

  // Update display value when prop value changes
  useEffect(() => {
    if (value !== undefined && !isFocused) {
      setDisplayValue(formatNumber(value));
    } else if (value === undefined && !isFocused) {
      setDisplayValue('');
    }
  }, [value, isFocused]);

  const handleFocus = () => {
    setIsFocused(true);
    // Show unformatted value for editing
    if (value !== undefined) {
      setDisplayValue(value.toString().replace('.', ','));
    }
  };

  const handleBlur = () => {
    setIsFocused(false);

    if (displayValue.trim() === '') {
      onChange(undefined);
      setDisplayValue('');
      return;
    }

    // Parse the German number format (comma as decimal separator)
    const normalizedValue = displayValue.replace(/\./g, '').replace(',', '.');
    const numValue = parseFloat(normalizedValue);

    if (isNaN(numValue)) {
      onChange(undefined);
      setDisplayValue('');
    } else {
      // Apply min/max constraints
      let constrainedValue = numValue;
      if (min !== undefined && constrainedValue < min) constrainedValue = min;
      if (max !== undefined && constrainedValue > max) constrainedValue = max;

      onChange(constrainedValue);
      setDisplayValue(formatNumber(constrainedValue));
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let inputValue = e.target.value;

    // Allow only numbers, comma, and minus sign
    inputValue = inputValue.replace(/[^\d,-]/g, '');

    // Only one comma allowed
    const commaCount = (inputValue.match(/,/g) || []).length;
    if (commaCount > 1) {
      inputValue = inputValue.replace(/,([^,]*)$/, '$1');
    }

    setDisplayValue(inputValue);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // Allow: backspace, delete, tab, escape, enter
    if ([8, 9, 27, 13, 46].includes(e.keyCode) ||
        // Allow: Ctrl+A, Ctrl+C, Ctrl+V, Ctrl+X
        (e.keyCode === 65 && e.ctrlKey) ||
        (e.keyCode === 67 && e.ctrlKey) ||
        (e.keyCode === 86 && e.ctrlKey) ||
        (e.keyCode === 88 && e.ctrlKey) ||
        // Allow: home, end, left, right
        (e.keyCode >= 35 && e.keyCode <= 39)) {
      return;
    }

    // Ensure it's a number or comma
    if ((e.shiftKey || (e.keyCode < 48 || e.keyCode > 57)) &&
        (e.keyCode < 96 || e.keyCode > 105) &&
        e.keyCode !== 188 && // comma
        e.keyCode !== 109 && // minus (numpad)
        e.keyCode !== 189) { // minus (regular)
      e.preventDefault();
    }
  };

  return (
    <div className="space-y-1.5">
      <label className="block text-sm font-medium text-gray-700">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>

      <div className="relative">
        <input
          type="text"
          inputMode={decimals > 0 ? 'decimal' : 'numeric'}
          value={displayValue}
          onChange={handleChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          placeholder={placeholder || (decimals > 0 ? '0,00' : '0')}
          disabled={disabled}
          className={`
            w-full px-3 py-2 border rounded-lg
            ${unit ? 'pr-16' : ''}
            ${disabled ? 'bg-gray-50 text-gray-500 cursor-not-allowed' : 'bg-white'}
            ${required && !value ? 'border-orange-300 focus:ring-orange-500 focus:border-orange-500' : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'}
            focus:outline-none focus:ring-2
            transition-colors
          `}
        />

        {unit && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
            <span className="text-gray-500 text-sm font-medium">{unit}</span>
          </div>
        )}
      </div>

      {helpText && (
        <p className="text-xs text-gray-500">{helpText}</p>
      )}
    </div>
  );
}
