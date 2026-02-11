import type { Hotel, HotelGeoJSON, HotelFeature, Region } from '../types/hotel';
import { EUROPEAN_COUNTRIES } from '../types/hotel';

import verData from '../../ver.geojson';
import stedenData from '../../steden.geojson';
import nederlandData from '../../nederland.geojson';
import wintersportData from '../../wintersport.geojson';
import europaData from '../../europa_hotels.geojson';

const geoJsonFiles: HotelGeoJSON[] = [
    verData as HotelGeoJSON,
    stedenData as HotelGeoJSON,
    nederlandData as HotelGeoJSON,
    wintersportData as HotelGeoJSON,
    europaData as HotelGeoJSON,
];

function isEuropeanHotel(country: string): boolean {
    return EUROPEAN_COUNTRIES.some(
        (europeanCountry) =>
            country.toLowerCase() === europeanCountry.toLowerCase()
    );
}

function featureToHotel(feature: HotelFeature, category?: string): Hotel {
    const { properties, geometry } = feature;

    // Create a unique ID from hotel name and location
    const id = `${properties.name}-${properties.place || properties.country}`
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '');

    return {
        id,
        name: properties.name,
        location: properties.place || properties.country,
        country: properties.country,
        stars: properties.stars,
        latitude: properties.latitude,
        longitude: properties.longitude,
        coordinates: geometry.coordinates as [number, number],
        webpage: properties.webpage,
        category,
    };
}

export function getAllHotels(): Hotel[] {
    const allHotels: Hotel[] = [];
    const seenIds = new Set<string>();

    for (const geoJson of geoJsonFiles) {
        const category = geoJson.name;

        for (const feature of geoJson.features) {
            // Filter to European hotels only
            if (!isEuropeanHotel(feature.properties.country)) {
                continue;
            }

            const hotel = featureToHotel(feature, category);

            // Avoid duplicates
            if (!seenIds.has(hotel.id)) {
                allHotels.push(hotel);
                seenIds.add(hotel.id);
            }
        }
    }

    return allHotels;
}

export function getHotelById(id: string): Hotel | null {
    const hotels = getAllHotels();
    return hotels.find((hotel) => hotel.id === id) || null;
}

export function filterHotelsByRegion(region: Region): Hotel[] {
    const hotels = getAllHotels();

    const westEurope = ['France', 'Frankrijk', 'Belgium', 'België', 'Belgie', 'Netherlands', 'Nederland', 'Luxembourg', 'Switzerland', 'Zwitserland'];
    const northEurope = ['Denmark', 'Denemarken', 'Estonia', 'Estland', 'Finland', 'Iceland', 'Norway', 'Noorwegen', 'Sweden'];
    const southEurope = ['Greece', 'Griekenland', 'Italy', 'Italie', 'Portugal', 'Spain', 'Spanje', 'Cyprus', 'Malta'];
    const eastEurope = ['Poland', 'Czechia', 'Czech Republic', 'Hungary', 'Romania', 'România', 'Bulgaria', 'Croatia'];

    switch (region) {
        case 'Western Europe':
            return hotels.filter((h) => westEurope.includes(h.country));
        case 'Northern Europe':
            return hotels.filter((h) => northEurope.includes(h.country));
        case 'Southern Europe':
            return hotels.filter((h) => southEurope.includes(h.country));
        case 'Eastern Europe':
            return hotels.filter((h) => eastEurope.includes(h.country));
        case 'Winter Sports':
            return hotels.filter((h) => h.category === 'wintersport' || h.stars.includes('Winter'));
        case 'Cities':
            return hotels.filter((h) => h.category === 'steden');
        case 'Netherlands':
            return hotels.filter((h) => h.country === 'Nederland' || h.country === 'Netherlands');
        default:
            return hotels;
    }
}

export function searchHotels(query: string): Hotel[] {
    const hotels = getAllHotels();
    const lowerQuery = query.toLowerCase();

    return hotels.filter((hotel) =>
        hotel.name.toLowerCase().includes(lowerQuery) ||
        hotel.location.toLowerCase().includes(lowerQuery) ||
        hotel.country.toLowerCase().includes(lowerQuery)
    );
}

export function getHotelsByStars(stars: string): Hotel[] {
    const hotels = getAllHotels();
    return hotels.filter((hotel) => hotel.stars === stars);
}
