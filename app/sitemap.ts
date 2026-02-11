import { MetadataRoute } from 'next';
import { getAllHotels } from '@/lib/data/hotels';

export default function sitemap(): MetadataRoute.Sitemap {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://the-curated-collection.vercel.app';
    const hotels = getAllHotels();

    const hotelUrls = hotels.map((hotel) => ({
        url: `${baseUrl}/hotel/${hotel.id}`,
        lastModified: new Date(),
        changeFrequency: 'weekly' as const,
        priority: 0.8,
    }));

    const staticRoutes = [
        '',
        '/explore',
        '/map',
        '/journey-builder',
        '/login',
        '/signup',
    ].map((route) => ({
        url: `${baseUrl}${route}`,
        lastModified: new Date(),
        changeFrequency: 'monthly' as const,
        priority: route === '' ? 1 : 0.8,
    }));

    return [...staticRoutes, ...hotelUrls];
}
