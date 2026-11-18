import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'NEXTXEN',
    short_name: 'NEXTXEN',
    description: 'AI-powered marketing studio for New Zealand businesses.',
    start_url: '/',
    display: 'standalone',
    background_color: '#0B1413',
    theme_color: '#0A3B37',
    icons: [
      { src: '/icon-192.png', sizes: '192x192', type: 'image/png' },
      { src: '/icon-512.png', sizes: '512x512', type: 'image/png' },
    ],
  }
}
