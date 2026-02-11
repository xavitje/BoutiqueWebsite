'use client';

import { useEffect, useState } from 'react';
import { APIProvider, Map, AdvancedMarker, InfoWindow } from '@vis.gl/react-google-maps';
import { getAllHotels } from '@/lib/data/hotels';
import { FloatingNav } from '@/components/navigation/FloatingNav';
import { HotelSlideOver } from '@/components/map/HotelSlideOver';
import { MapInfoContent } from '@/components/map/MapInfoContent';
import Link from 'next/link';
import type { Hotel } from '@/lib/types/hotel';

const GOOGLE_MAPS_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '';

export default function MapPage() {
    const [selectedHotel, setSelectedHotel] = useState<Hotel | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const allHotels = getAllHotels();

    // Filter hotels based on search query
    const hotels = allHotels.filter(hotel => {
        if (!searchQuery) return true;
        const query = searchQuery.toLowerCase();
        return (
            hotel.name.toLowerCase().includes(query) ||
            hotel.location.toLowerCase().includes(query) ||
            hotel.country.toLowerCase().includes(query)
        );
    });

    // If no API key, show setup instructions
    if (!GOOGLE_MAPS_API_KEY) {
        return (
            <>
                <main className="page-container flex items-center justify-center section-padding">
                    <div className="max-w-2xl text-center space-y-6">
                        <h1 className="text-4xl">Interactive Map</h1>
                        <div className="glass-effect p-8 rounded-sm">
                            <p className="text-lg text-charcoal/70 mb-4">
                                Om de interactieve kaart te bekijken, heb je een Google Maps API key nodig.
                            </p>
                            <div className="text-left bg-charcoal/5 p-4 rounded-sm font-mono text-sm mb-4">
                                <p className="mb-2">1. Krijg een gratis API key op <a href="https://console.cloud.google.com/google/maps-apis" target="_blank" rel="noopener" className="text-gold hover:underline">Google Cloud Console</a></p>
                                <p className="mb-2">2. Activeer de Maps JavaScript API</p>
                                <p className="mb-2">3. Voeg toe aan .env.local:</p>
                                <code className="block bg-charcoal/10 p-2 rounded">
                                    NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=jouw_api_key_hier
                                </code>
                                <p className="mt-2">4. Herstart de dev server</p>
                            </div>
                            <p className="text-sm text-charcoal/60">
                                In de tussentijd kun je hotels bekijken op de <Link href="/explore" className="text-gold hover:underline">Explore pagina</Link>
                            </p>
                        </div>
                    </div>
                </main>
                <FloatingNav />
            </>
        );
    }

    return (
        <>
            <div className="relative w-full h-screen">
                {/* Search Bar */}
                <div className="absolute top-6 left-1/2 -translate-x-1/2 z-20 w-full max-w-md px-6">
                    <div className="glass-effect rounded-full shadow-lg">
                        <input
                            type="text"
                            placeholder="Zoek op hotel, plaats of land..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full px-6 py-3 bg-transparent rounded-full focus:outline-none focus:ring-2 focus:ring-gold/50"
                        />
                    </div>
                    {searchQuery && (
                        <div className="mt-2 text-center">
                            <span className="text-sm text-white bg-charcoal/80 px-3 py-1 rounded-full">
                                {hotels.length} {hotels.length === 1 ? 'hotel' : 'hotels'} gevonden
                            </span>
                        </div>
                    )}
                </div>

                <APIProvider apiKey={GOOGLE_MAPS_API_KEY}>
                    <Map
                        defaultCenter={{ lat: 50, lng: 10 }}
                        defaultZoom={5}
                        mapId="boutique-hotels-map"
                        gestureHandling="greedy"
                        disableDefaultUI={false}
                        style={{ width: '100%', height: '100%' }}
                    >
                        {hotels.map((hotel) => (
                            <AdvancedMarker
                                key={hotel.id}
                                position={{ lat: hotel.latitude, lng: hotel.longitude }}
                                onClick={() => setSelectedHotel(hotel)}
                            >
                                <div className="w-8 h-8 rounded-full bg-gold border-2 border-white shadow-lg cursor-pointer hover:scale-110 transition-transform" />
                            </AdvancedMarker>
                        ))}

                        {selectedHotel && (
                            <InfoWindow
                                position={{ lat: selectedHotel.latitude, lng: selectedHotel.longitude }}
                                onCloseClick={() => setSelectedHotel(null)}
                                options={{
                                    maxWidth: 280,
                                    pixelOffset: new google.maps.Size(0, -10),
                                }}
                            >
                                <MapInfoContent hotel={selectedHotel} />
                            </InfoWindow>
                        )}
                    </Map>
                </APIProvider>

                {/* Hotel Detail Slide-over */}
                {selectedHotel && (
                    <HotelSlideOver
                        hotel={selectedHotel}
                        onClose={() => setSelectedHotel(null)}
                    />
                )}

                {/* Map Legend */}
                <div className="absolute bottom-24 left-6 glass-effect p-4 rounded-sm">
                    <p className="text-sm font-medium mb-2">Hotels in Europa</p>
                    <div className="flex items-center gap-2">
                        <div className="w-4 h-4 rounded-full bg-gold border-2 border-white"></div>
                        <span className="text-sm text-charcoal/70">{hotels.length} accommodaties</span>
                    </div>
                </div>
            </div>

            <FloatingNav />
        </>
    );
}
