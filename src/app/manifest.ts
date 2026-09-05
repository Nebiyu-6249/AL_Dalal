import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Al Dalal Henna & Beauty',
    short_name: 'Al Dalal',
    description: 'A ladies salon in Al Maireed, Ras Al Khaimah. Henna, braiding, hair, nails and skin.',
    start_url: '/',
    display: 'standalone',
    background_color: '#f6f1e7',
    theme_color: '#261b14',
    icons: [
      { src: '/images/mark-180.png', sizes: '180x180', type: 'image/png' },
      { src: '/images/mark-512.png', sizes: '512x512', type: 'image/png' },
    ],
  };
}
