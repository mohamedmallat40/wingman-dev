// Country flag utility functions
export const getCountryFlag = (countryCode: string): string => {
  if (!countryCode) return '';
  return `https://flagcdn.com/16x12/${countryCode.toLowerCase()}.png`;
};

// Common country code mappings
export const countryNames: Record<string, string> = {
  'BE': 'Belgium',
  'NL': 'Netherlands', 
  'FR': 'France',
  'DE': 'Germany',
  'GB': 'United Kingdom',
  'US': 'United States',
  'CA': 'Canada',
  'AU': 'Australia',
  'ES': 'Spain',
  'IT': 'Italy',
  'PT': 'Portugal',
  'CH': 'Switzerland',
  'AT': 'Austria',
  'DK': 'Denmark',
  'SE': 'Sweden',
  'NO': 'Norway',
  'FI': 'Finland',
  'PL': 'Poland',
  'CZ': 'Czech Republic',
  'HU': 'Hungary',
  'TN': 'Tunisia',
  'MA': 'Morocco',
  'DZ': 'Algeria',
  'EG': 'Egypt',
  'ZA': 'South Africa',
  'IN': 'India',
  'CN': 'China',
  'JP': 'Japan',
  'KR': 'South Korea',
  'SG': 'Singapore',
  'MY': 'Malaysia',
  'TH': 'Thailand',
  'PH': 'Philippines',
  'ID': 'Indonesia',
  'VN': 'Vietnam',
  'BR': 'Brazil',
  'MX': 'Mexico',
  'AR': 'Argentina',
  'CO': 'Colombia',
  'CL': 'Chile',
  'PE': 'Peru'
};

export const getCountryName = (countryCode: string): string => {
  return countryNames[countryCode.toUpperCase()] || countryCode.toUpperCase();
};