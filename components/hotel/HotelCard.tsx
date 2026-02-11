'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Hotel } from '@/lib/types/hotel';
import { MapPin, Star } from 'lucide-react';
import { useEffect, useState } from 'react';
import { fetchHotelPhotos } from '@/lib/utils/places';
import { motion } from 'framer-motion';

interface HotelCardProps {
    hotel: Hotel;
}

export function HotelCard({ hotel }: HotelCardProps) {
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
        <Link
            href={`/hotel/${hotel.id}`}
        >
            <motion.div
                whileHover={{ y: -4 }}
                className="group overflow-hidden rounded-sm bg-white shadow-sm border border-charcoal/10 hover:shadow-xl transition-all duration-500"
            >
                {/* Hotel Image */}
                <div className="aspect-[4/3] bg-charcoal/5 relative overflow-hidden">
                    {loading ? (
                        <div className="absolute inset-0 flex items-center justify-center">
                            <span className="text-6xl text-charcoal/20 font-serif animate-pulse">
                                {hotel.name[0]}
                            </span>
                        </div>
                    ) : photo ? (
                        <Image
                            src={photo}
                            alt={hotel.name}
                            fill
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                            className="object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                    ) : (
                        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-gold/20 to-charcoal/10">
                            <span className="text-6xl text-charcoal/20 font-serif">
                                {hotel.name[0]}
                            </span>
                        </div>
                    )}
                    <div className="absolute top-3 right-3 bg-paper/90 backdrop-blur-sm rounded-full px-3 py-1 flex items-center gap-1">
                        <Star size={14} className="fill-gold text-gold" />
                        <span className="text-xs font-mono">{hotel.stars}</span>
                    </div>
                </div>

                <div className="p-4">
                    <h3 className="font-serif text-lg font-semibold mb-2 group-hover:text-gold transition-colors">
                        {hotel.name}
                    </h3>
                    <div className="flex items-center gap-2 text-sm text-charcoal/60">
                        <MapPin size={14} />
                        <span>{hotel.location}, {hotel.country}</span>
                    </div>
                </div>
            </motion.div>
        </Link>
    );
}
