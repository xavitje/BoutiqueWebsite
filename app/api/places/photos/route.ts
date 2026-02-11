import { NextRequest, NextResponse } from 'next/server';

const GOOGLE_MAPS_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const hotelName = searchParams.get('name');
    const location = searchParams.get('location');

    if (!hotelName || !location) {
        return NextResponse.json({ error: 'Missing parameters' }, { status: 400 });
    }

    if (!GOOGLE_MAPS_API_KEY) {
        return NextResponse.json({ error: 'API key not configured' }, { status: 500 });
    }

    try {
        // Search for the place using Text Search
        const searchQuery = `${hotelName} ${location}`;
        const searchUrl = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${encodeURIComponent(searchQuery)}&key=${GOOGLE_MAPS_API_KEY}`;

        const searchResponse = await fetch(searchUrl);
        const searchData = await searchResponse.json();

        if (searchData.status !== 'OK' || !searchData.results || searchData.results.length === 0) {
            return NextResponse.json({ photos: [] }, { status: 200 });
        }

        const place = searchData.results[0];

        // Get place details for more photos
        if (place.place_id) {
            const detailsUrl = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${place.place_id}&fields=photos&key=${GOOGLE_MAPS_API_KEY}`;
            const detailsResponse = await fetch(detailsUrl);
            const detailsData = await detailsResponse.json();

            if (detailsData.status === 'OK' && detailsData.result?.photos) {
                const photoUrls = detailsData.result.photos.slice(0, 5).map((photo: any) => {
                    return `https://maps.googleapis.com/maps/api/place/photo?maxwidth=800&photo_reference=${photo.photo_reference}&key=${GOOGLE_MAPS_API_KEY}`;
                });

                return NextResponse.json({
                    photos: photoUrls,
                    placeId: place.place_id
                });
            }
        }

        return NextResponse.json({ photos: [] });
    } catch (error) {
        console.error('Places API error:', error);
        return NextResponse.json({ error: 'Failed to fetch photos' }, { status: 500 });
    }
}
