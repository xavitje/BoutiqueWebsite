import { Hotel } from '@/lib/types/hotel';

export async function fetchHotelPhotos(hotel: Hotel): Promise<string[]> {
    try {
        const response = await fetch(
            `/api/places/photos?name=${encodeURIComponent(hotel.name)}&location=${encodeURIComponent(hotel.location + ', ' + hotel.country)}`
        );

        if (!response.ok) {
            return [];
        }

        const data = await response.json();
        return data.photos || [];
    } catch (error) {
        console.error('Error fetching hotel photos:', error);
        return [];
    }
}
