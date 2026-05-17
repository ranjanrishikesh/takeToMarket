import type { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: '{{BASE_URL}}', lastModified: new Date() },
    { url: '{{BASE_URL}}/product', lastModified: new Date() },
    { url: '{{BASE_URL}}/pricing', lastModified: new Date() },
    { url: '{{BASE_URL}}/about', lastModified: new Date() },
  ];
}
