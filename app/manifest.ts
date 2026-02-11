import { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
    return {
        name: 'The Curated Collection',
        short_name: 'Curated Collection',
        description: 'Exclusive Boutique Hotels & Tailored Journeys',
        start_url: '/',
        display: 'standalone',
        background_color: '#1A1A1A',
        theme_color: '#D4AF37',
        icons: [
            {
                src: '/icon',
                sizes: '32x32',
                type: 'image/png',
            },
            {
                src: '/apple-icon',
                sizes: '180x180',
                type: 'image/png',
            },
        ],
    };
}
