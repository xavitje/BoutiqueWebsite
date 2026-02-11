'use client';

import { useParams } from 'next/navigation';
import { getHotelById } from '@/lib/data/hotels';
import { FloatingNav } from '@/components/navigation/FloatingNav';
import { MapPin, Star, Calendar } from 'lucide-react';
import { MagneticButton } from '@/components/ui/MagneticButton';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { fetchHotelPhotos } from '@/lib/utils/places';
import Image from 'next/image';
import { APIProvider, Map, AdvancedMarker } from '@vis.gl/react-google-maps';

export default function HotelPage() {
    const params = useParams();
    const hotelId = params.id as string;
    const hotel = getHotelById(hotelId);
    const [photos, setPhotos] = useState<string[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (hotel) {
            fetchHotelPhotos(hotel).then((fetchedPhotos) => {
                setPhotos(fetchedPhotos);
                setLoading(false);
            });
        }
    }, [hotel]);

    if (!hotel) {
        return (
            <>
                <main className="page-container flex items-center justify-center section-padding">
                    <div className="text-center space-y-6">
                        <h1 className="text-4xl">Hotel niet gevonden</h1>
                        <p className="text-charcoal/70">Dit hotel bestaat niet in onze collectie.</p>
                        <Link href="/map" className="btn-primary inline-block">
                            Terug naar kaart
                        </Link>
                    </div>
                </main>
                <FloatingNav />
            </>
        );
    }

    return (
        <>
            <main className="page-container">
                {/* Hero Image Section */}
                <div className="relative h-[60vh] bg-charcoal/5 overflow-hidden">
                    {loading ? (
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="text-center space-y-4">
                                <div className="text-6xl text-charcoal/20 font-serif animate-pulse">
                                    {hotel.name[0]}
                                </div>
                                <p className="text-sm text-charcoal/40">Foto's laden...</p>
                            </div>
                        </div>
                    ) : photos.length > 0 ? (
                        <div className="relative w-full h-full">
                            <Image
                                src={photos[0]}
                                alt={hotel.name}
                                fill
                                sizes="100vw"
                                className="object-cover"
                                priority
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                        </div>
                    ) : (
                        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-gold/20 to-charcoal/10">
                            <span className="text-9xl text-charcoal/20 font-serif">
                                {hotel.name[0]}
                            </span>
                        </div>
                    )}

                    {/* Hotel Info Overlay */}
                    <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
                        <h1 className="text-5xl font-serif mb-4 animate-fade-in-up">{hotel.name}</h1>
                        <div className="flex items-center gap-6 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
                            <div className="flex items-center gap-2">
                                <MapPin size={20} />
                                <span>{hotel.location}, {hotel.country}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Star size={16} className="fill-gold text-gold" />
                                <span className="font-mono">{hotel.stars}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Photo Gallery */}
                {!loading && photos.length > 1 && (
                    <section className="section-padding bg-white/50">
                        <div className="max-w-6xl mx-auto">
                            <h2 className="text-2xl font-serif mb-6">Foto's</h2>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                {photos.slice(1, 5).map((photo, index) => (
                                    <div key={index} className="aspect-square relative rounded-sm overflow-hidden">
                                        <Image
                                            src={photo}
                                            alt={`${hotel.name} - foto ${index + 2}`}
                                            fill
                                            sizes="(max-width: 768px) 50vw, 25vw"
                                            className="object-cover hover:scale-110 transition-transform duration-300"
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>
                )}

                {/* Hotel Details */}
                <section className="section-padding max-w-4xl mx-auto">
                    <div className="glass-effect p-8 rounded-sm mb-8">
                        <h2 className="text-2xl font-serif mb-4">Over deze accommodatie</h2>
                        <p className="text-charcoal/70 leading-relaxed">
                            {hotel.name} is een boutique hotel gelegen in het hart van {hotel.location}, {hotel.country}.
                            Deze zorgvuldig geselecteerde accommodatie biedt een authentieke en luxueuze ervaring voor veeleisende reizigers.
                        </p>
                    </div>

                    {/* Booking Section */}
                    <div className="glass-effect p-8 rounded-sm">
                        <h2 className="text-2xl font-serif mb-6">Reserveer uw verblijf</h2>
                        <div className="flex flex-col md:flex-row gap-4">
                            <Link href={`/hotel/${hotel.id}?booking=true`} className="flex-1">
                                <MagneticButton className="w-full btn-primary flex items-center justify-center gap-2">
                                    <Calendar size={20} />
                                    <span>Beschikbaarheid bekijken</span>
                                </MagneticButton>
                            </Link>
                            <Link href="/journey-builder" className="flex-1">
                                <MagneticButton className="w-full btn-secondary">
                                    Toevoegen aan reis
                                </MagneticButton>
                            </Link>
                        </div>
                        <p className="text-sm text-charcoal/60 mt-4 text-center">
                            Login vereist om te boeken
                        </p>
                    </div>
                </section>

                {/* Location & Map */}
                <section className="section-padding">
                    <div className="max-w-6xl mx-auto">
                        <div className="glass-effect p-8 rounded-sm">
                            <h2 className="text-3xl font-serif mb-6">Locatie</h2>

                            {/* Address */}
                            <div className="mb-6">
                                <p className="text-xl font-medium mb-1">{hotel.name}</p>
                                <p className="text-charcoal/70 flex items-center gap-2">
                                    <MapPin size={18} className="text-gold" />
                                    {hotel.location}, {hotel.country}
                                </p>
                            </div>

                            {/* Map */}
                            <div className="h-[400px] rounded-sm overflow-hidden border border-charcoal/10">
                                <APIProvider apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || ''}>
                                    <Map
                                        defaultCenter={{ lat: hotel.latitude, lng: hotel.longitude }}
                                        defaultZoom={15}
                                        mapId="hotel-detail-map"
                                        gestureHandling="cooperative"
                                        disableDefaultUI={false}
                                        zoomControl={true}
                                        mapTypeControl={false}
                                        streetViewControl={false}
                                        fullscreenControl={true}
                                    >
                                        <AdvancedMarker
                                            position={{ lat: hotel.latitude, lng: hotel.longitude }}
                                        >
                                            <div className="bg-gold text-white px-4 py-2 rounded-full shadow-lg font-medium text-sm whitespace-nowrap">
                                                📍 {hotel.name}
                                            </div>
                                        </AdvancedMarker>
                                    </Map>
                                </APIProvider>
                            </div>
                        </div>
                    </div>
                </section>
            </main>
            <FloatingNav />
        </>
    );
}
