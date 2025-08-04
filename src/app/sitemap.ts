import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://wingman.dev';

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1,
      alternates: {
        languages: {
          en: `${baseUrl}/en`,
          fr: `${baseUrl}/fr`,
          nl: `${baseUrl}/nl`
        }
      }
    },
    {
      url: `${baseUrl}/register`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
      alternates: {
        languages: {
          en: `${baseUrl}/en/register`,
          fr: `${baseUrl}/fr/register`,
          nl: `${baseUrl}/nl/register`
        }
      }
    },
    {
      url: `${baseUrl}/private/dashboard`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.7
    },
    {
      url: `${baseUrl}/private/talent-pool`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9
    },
    {
      url: `${baseUrl}/private/profile`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.6
    }
  ];
}
