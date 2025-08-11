// Address parsing function
export const parseAddress = (input: string) => {
  input = input.trim();

  const addressRegex =
    // eslint-disable-next-line sonarjs/slow-regex, sonarjs/single-character-alternation
    /^([^\d\n]{1,100})\s+(\d+[a-zA-Z]?)\s*(?:\n|,)?\s*(\d{4,5})\s+([a-zA-Z\s]{1,100})$/;
  const match = addressRegex.exec(input);
  if (match) {
    const street = match[1] ?? ''.trim();
    const houseNumber = match[2] ?? ''.trim();
    const postalCode = match[3] ?? ''.trim();
    const city = match[4] ?? ''.trim();
    return { street, houseNumber, postalCode, city, country: '' };
  } else {
    const lines = input.split('\n').map((line) => line.trim());
    const streetAndNumber = lines[0] ?? '';
    const postalCodeAndCity = lines[1] ?? '';
    const streetAndNumberParts = streetAndNumber.split(/\s+/);
    const street = streetAndNumberParts.slice(0, -1).join(' ').trim();
    const houseNumber = streetAndNumberParts.at(-1) ?? ''.trim();
    const postalCodeAndCityParts = postalCodeAndCity.split(/\s+/);
    const postalCode = postalCodeAndCityParts[0] ?? '';
    const city = postalCodeAndCityParts.slice(1).join(' ').trim();
    return { street, houseNumber, postalCode, city, country: '' };
  }
};
export const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('nl-BE', {
    year: 'numeric',
    month: 'short'
  });
};

export const formatCurrency = (amount: number | string) => {
  if (typeof amount === 'string') return amount;

  return new Intl.NumberFormat('nl-BE', {
    style: 'currency',
    currency: 'EUR'
  }).format(amount);
};

export const getBaseUrl = (): string => {
  // Use the environment variable from env.js which already has proper validation
  return process.env.NEXT_PUBLIC_API_BASE_URL ?? 'https://dev.extraexpertise.be/api';
};

export const getImageUrl = (imagePath: string): string => {
  return `${getBaseUrl()}/upload/${imagePath}`;
};
