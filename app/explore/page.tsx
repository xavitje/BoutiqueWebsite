'use client';

import { FloatingNav } from '@/components/navigation/FloatingNav';
import { getAllHotels, filterHotelsByRegion } from '@/lib/data/hotels';
import { HotelCard } from '@/components/hotel/HotelCard';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Search } from 'lucide-react';
import type { Region } from '@/lib/types/hotel';

const REGIONS: Region[] = [
    'Western Europe',
    'Northern Europe',
    'Southern Europe',
    'Eastern Europe',
    'Winter Sports',
    'Cities',
    'Netherlands',
];

export default function ExplorePage() {
    const [selectedRegion, setSelectedRegion] = useState<Region | 'All'>('All');
    const [searchQuery, setSearchQuery] = useState('');

    const allHotels = getAllHotels();
    const filteredHotels = selectedRegion === 'All'
        ? allHotels
        : filterHotelsByRegion(selectedRegion);

    const searchedHotels = searchQuery
        ? filteredHotels.filter((hotel) =>
            hotel.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            hotel.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
            hotel.country.toLowerCase().includes(searchQuery.toLowerCase())
        )
        : filteredHotels;

    return (
        <>
            <main className="page-container section-padding">
                <div className="max-w-7xl mx-auto">
                    {/* Header */}
                    <div className="text-center mb-12">
                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="mb-4"
                        >
                            Explore Our Collection
                        </motion.h1>
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="text-xl text-charcoal/60"
                        >
                            {allHotels.length} boutique hotels across Europe
                        </motion.p>
                    </div>

                    {/* Search */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="mb-8"
                    >
                        <div className="relative max-w-xl mx-auto">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-charcoal/40" size={20} />
                            <input
                                type="text"
                                placeholder="Search hotels, cities, or countries..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-12 pr-4 py-4 glass-effect rounded-full focus:outline-none focus:ring-2 focus:ring-gold/50 transition-all"
                            />
                        </div>
                    </motion.div>

                    {/* Region Filters */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="mb-12"
                    >
                        <div className="flex flex-wrap gap-3 justify-center">
                            <button
                                onClick={() => setSelectedRegion('All')}
                                className={`px-6 py-2 rounded-full transition-all ${selectedRegion === 'All'
                                        ? 'bg-gold text-charcoal'
                                        : 'glass-effect hover:bg-charcoal/5'
                                    }`}
                            >
                                All
                            </button>
                            {REGIONS.map((region) => (
                                <button
                                    key={region}
                                    onClick={() => setSelectedRegion(region)}
                                    className={`px-6 py-2 rounded-full transition-all ${selectedRegion === region
                                            ? 'bg-gold text-charcoal'
                                            : 'glass-effect hover:bg-charcoal/5'
                                        }`}
                                >
                                    {region}
                                </button>
                            ))}
                        </div>
                    </motion.div>

                    {/* Hotel Grid */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.4 }}
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                    >
                        {searchedHotels.map((hotel, index) => (
                            <motion.div
                                key={hotel.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.4 + index * 0.05 }}
                            >
                                <HotelCard hotel={hotel} />
                            </motion.div>
                        ))}
                    </motion.div>

                    {searchedHotels.length === 0 && (
                        <div className="text-center py-20">
                            <p className="text-xl text-charcoal/60">No hotels found matching your criteria</p>
                        </div>
                    )}
                </div>
            </main>

            <FloatingNav />
        </>
    );
}
