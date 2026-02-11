'use client';

import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import type { Hotel } from '@/lib/types/hotel';
import { fetchHotelPhotos } from '@/lib/utils/places';

interface HotelSlideOverProps {
    hotel: Hotel;
    onClose: () => void;
}

export function HotelSlideOver({ hotel, onClose }: HotelSlideOverProps) {
    const [photos, setPhotos] = useState<string[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchHotelPhotos(hotel).then((fetchedPhotos) => {
            setPhotos(fetchedPhotos);
            setLoading(false);
        });
    }, [hotel]);

    return (
        <div className="absolute top-0 right-0 h-full w-full md:w-96 glass-effect shadow-2xl z-10 overflow-y-auto">
            <div className="p-6">
                <div className="flex justify-between items-start mb-6">
                    <div>
                        <h2 className="text-2xl font-serif mb-2">{hotel.name}</h2>
                        <p className="text-charcoal/60">
                            {hotel.location}, {hotel.country}
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-charcoal/10 rounded-full transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>

                <div className="space-y-4">
                    {/* Photo */}
                    <div className="aspect-video bg-charcoal/5 rounded-sm overflow-hidden relative">
                        {loading ? (
                            <div className="absolute inset-0 flex items-center justify-center">
                                <span className="text-6xl text-charcoal/20 font-serif animate-pulse">
                                    {hotel.name[0]}
                                </span>
                            </div>
                        ) : photos.length > 0 ? (
                            <Image
                                src={photos[0]}
                                alt={hotel.name}
                                fill
                                sizes="(max-width: 768px) 100vw, 384px"
                                className="object-cover"
                            />
                        ) : (
                            <div className="absolute inset-0 flex items-center justify-center">
                                <span className="text-6xl text-charcoal/20 font-serif">
                                    {hotel.name[0]}
                                </span>
                            </div>
                        )}
                    </div>

                    <div className="flex items-center gap-2">
                        <span className="text-sm text-charcoal/60">Rating:</span>
                        <span className="font-mono text-gold">{hotel.stars}</span>
                    </div>

                    <p className="text-charcoal/70 leading-relaxed">
                        {hotel.name} is een boutique hotel gelegen in {hotel.location}, {hotel.country}.
                        Deze zorgvuldig geselecteerde accommodatie biedt een authentieke en luxueuze ervaring.
                    </p>

                    <Link
                        href={`/hotel/${hotel.id}`}
                        className="btn-primary w-full text-center block"
                    >
                        Bekijk Details
                    </Link>
                </div>
            </div>
        </div>
    );
}
