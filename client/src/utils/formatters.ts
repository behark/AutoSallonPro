/**
 * Utility functions for formatting data across the application
 */

/**
 * Format a number or string to a currency representation
 * @param value - The number or string to format
 * @param currency - The currency symbol (default: '€')
 * @param locale - The locale to use for formatting (default: 'de-DE')
 */
export const formatCurrency = (
  value: number | string | undefined,
  currency: string = '€',
  locale: string = 'de-DE'
): string => {
  // Handle undefined or empty values
  if (value === undefined || value === '') {
    return 'Price on request';
  }

  // If value is already a string with currency formatting, return as is
  if (typeof value === 'string') {
    // Check if it's already formatted with currency
    if (value.includes('€') || value.includes('EUR') || value.toLowerCase().includes('price')) {
      return value;
    }

    // Try to convert string to number
    const numValue = parseFloat(value.replace(/[^\d.,-]/g, '').replace(',', '.'));
    if (isNaN(numValue)) {
      return value; // Return original string if it can't be parsed
    }
    value = numValue;
  }

  // Format the number with the specified locale and currency
  try {
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: currency === '€' ? 'EUR' : currency,
      currencyDisplay: 'symbol',
      maximumFractionDigits: 0,
    }).format(value as number).replace('EUR', '€');
  } catch (error) {
    // Fallback formatting
    return `${currency}${(value as number).toLocaleString(locale)}`;
  }
};

/**
 * Format a date to a locale string
 * @param dateValue - Date string or Date object
 * @param locale - The locale to use (default: 'en-US')
 */
export const formatDate = (
  dateValue: string | Date | undefined,
  locale: string = 'en-US'
): string => {
  if (!dateValue) return '';
  
  try {
    const date = typeof dateValue === 'string' ? new Date(dateValue) : dateValue;
    return date.toLocaleDateString(locale, {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  } catch (error) {
    return typeof dateValue === 'string' ? dateValue : '';
  }
};

/**
 * Extract year from a string containing a year
 * @param text - Text that might contain a year
 */
export const extractYear = (text: string | undefined): string | null => {
  if (!text) return null;
  
  // Look for 4-digit year between 1900 and current year + 1
  const currentYear = new Date().getFullYear();
  const yearRegex = new RegExp(`\\b(19\\d{2}|20[0-${Math.floor((currentYear + 1) / 100) % 10}]\\d)\\b`);
  const match = text.match(yearRegex);
  
  return match ? match[0] : null;
};

/**
 * Extract make and model from a text description
 */
export const extractMakeModel = (text: string | undefined): { make: string | null, model: string | null } => {
  if (!text) return { make: null, model: null };
  
  // Common car manufacturers
  const manufacturers = [
    'Audi', 'BMW', 'Mercedes', 'Mercedes-Benz', 'Volkswagen', 'VW', 'Toyota',
    'Ford', 'Honda', 'Hyundai', 'Kia', 'Mazda', 'Nissan', 'Subaru', 'Tesla',
    'Volvo', 'Porsche', 'Ferrari', 'Lamborghini', 'Bugatti', 'Bentley',
    'Rolls-Royce', 'Jaguar', 'Land Rover', 'Mini', 'Fiat', 'Alfa Romeo',
    'Maserati', 'Jeep', 'Dodge', 'Chrysler', 'Chevrolet', 'Cadillac',
    'Buick', 'GMC', 'Lincoln', 'Acura', 'Lexus', 'Infiniti', 'Genesis',
    'Renault', 'Peugeot', 'Citroën', 'DS', 'Opel', 'Skoda', 'Seat'
  ];
  
  // Check for manufacturer in text
  const lowerText = text.toLowerCase();
  let make = null;
  let model = null;
  
  for (const manufacturer of manufacturers) {
    if (lowerText.includes(manufacturer.toLowerCase())) {
      make = manufacturer;
      
      // Try to find model after manufacturer name
      const makeIndex = lowerText.indexOf(manufacturer.toLowerCase());
      if (makeIndex !== -1) {
        const afterMake = text.substring(makeIndex + manufacturer.length).trim();
        // Get the first word after manufacturer as the model
        const modelMatch = afterMake.match(/^[,\s]*([A-Za-z0-9-]+)/);
        if (modelMatch && modelMatch[1]) {
          model = modelMatch[1];
        }
      }
      break;
    }
  }
  
  return { make, model };
};
