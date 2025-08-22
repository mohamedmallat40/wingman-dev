// URL validation utility for testing
export const isValidUrl = (url: string): boolean => {
  if (!url || url.trim() === '') return true; // Allow empty string

  const urlRegex =
    /^https?:\/\/(?:[\w.-])+(?:\:[0-9]+)?(?:\/(?:[\w\/_@~!$&'()*+,;=:-])*(?:\?(?:[\w&=%@~!$'()*+,;:-])*)?(?:\#(?:[\w@~!$&'()*+,;=:-])*)?)?$/;
  return urlRegex.test(url);
};

// Test cases for validation (development only)
export const testUrlValidation = (): boolean => {
  const testCases = [
    { url: '', expected: true, description: 'Empty string should be valid' },
    { url: 'https://google.com', expected: true, description: 'Valid HTTPS URL' },
    { url: 'http://example.com', expected: true, description: 'Valid HTTP URL' },
    { url: 'https://github.com/user/repo', expected: true, description: 'Valid GitHub URL' },
    {
      url: 'https://www.youtube.com/watch?v=123',
      expected: true,
      description: 'Valid YouTube URL'
    },
    {
      url: 'https://medium.com/@sayahayoub9827/shrinking-your-spas-entry-bundle-the-key-to-faster-loads-3db155d5c6b2',
      expected: true,
      description: 'Valid Medium URL with @ and hyphens'
    },
    {
      url: 'https://dev.to/user/my-awesome-post-title',
      expected: true,
      description: 'Valid Dev.to URL with hyphens'
    },
    { url: 'google.com', expected: false, description: 'URL without protocol should be invalid' },
    { url: 'ftp://example.com', expected: false, description: 'FTP URL should be invalid' },
    { url: 'not-a-url', expected: false, description: 'Plain text should be invalid' },
    { url: 'https://', expected: false, description: 'Incomplete URL should be invalid' }
  ];

  const passed = testCases.filter(({ url, expected }) => isValidUrl(url) === expected).length;
  return passed === testCases.length;
};
