'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import type { Hotel } from '@/lib/types/hotel';
import { fetchHotelPhotos } from '@/lib/utils/places';

interface MapInfoContentProps {
    hotel: Hotel;
}

export function MapInfoContent({ hotel }: MapInfoContentProps) {
    const [photo, setPhoto] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchHotelPhotos(hotel).then((photos) => {
            if (photos.length > 0) {
                setPhoto(photos[0]);
            }
            setLoading(false);
        });
    }, [hotel]);

    return (
        <div className="w-64">
            {/* Hotel Photo */}
            <div className="aspect-video bg-charcoal/5 rounded-sm overflow-hidden relative mb-2 -mt-2 -mx-2">
                {loading ? (
                    <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-4xl text-charcoal/20 font-serif animate-pulse">
                            {hotel.name[0]}
                        </span>
                    </div>
                ) : photo ? (
                    <Image
                        src={photo}
                        alt={hotel.name}
                        fill
                        sizes="280px"
                        className="object-cover"
                    />
                ) : (
                    <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-gold/20 to-charcoal/10">
                        <span className="text-4xl text-charcoal/20 font-serif">
                            {hotel.name[0]}
                        </span>
                    </div>
                )}
            </div>

            {/* Hotel Info */}
            <div className="px-2 pb-1">
                <h3 className="font-serif text-base font-semibold mb-1">{hotel.name}</h3>
                <p className="text-xs text-charcoal/60 mb-2">
                    {hotel.location}, {hotel.country}
                </p>
                <Link
                    href={`/hotel/${hotel.id}`}
                    className="text-gold hover:underline text-sm font-medium inline-flex items-center gap-1"
                >
                    Bekijk details
                    <span>→</span>
                </Link>
            </div>
        </div>
    );
}
