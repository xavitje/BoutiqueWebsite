'use client';

import { FloatingNav } from '@/components/navigation/FloatingNav';
import { MagneticButton } from '@/components/ui/MagneticButton';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { getAllHotels } from '@/lib/data/hotels';
import { HotelCard } from '@/components/hotel/HotelCard';

export default function Home() {
    const allHotels = getAllHotels();
    const featuredHotels = allHotels.slice(0, 6);

    return (
        <>
            <main className="page-container">
                {/* Hero Section */}
                <section className="min-h-screen flex items-center justify-center section-padding">
                    <div className="max-w-5xl mx-auto text-center space-y-8">
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, ease: 'easeOut' }}
                        >
                            <h1 className="font-serif mb-6">
                                The Curated Collection
                            </h1>
                            <p className="text-xl md:text-2xl text-charcoal/70 max-w-3xl mx-auto text-balance mb-12">
                                Exclusive boutique hotels across Europe, handpicked for discerning travelers seeking authentic luxury.
                            </p>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.3 }}
                            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
                        >
                            <Link href="/explore">
                                <MagneticButton className="btn-primary text-lg px-8 py-4">
                                    Explore Collection
                                </MagneticButton>
                            </Link>
                            <Link href="/journey-builder">
                                <MagneticButton className="btn-secondary text-lg px-8 py-4">
                                    Plan Your Journey
                                </MagneticButton>
                            </Link>
                        </motion.div>

                        <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 1, delay: 0.6 }}
                            className="text-sm text-charcoal/50 font-mono mt-12"
                        >
                            {allHotels.length} unique properties across Europe
                        </motion.p>
                    </div>
                </section>

                {/* Featured Hotels Section */}
                <section className="section-padding bg-white/50">
                    <div className="max-w-7xl mx-auto">
                        <motion.div
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8 }}
                            className="mb-12"
                        >
                            <h2 className="font-serif text-center mb-4">Featured Destinations</h2>
                            <p className="text-center text-charcoal/60 max-w-2xl mx-auto">
                                Discover our handpicked selection of extraordinary hotels
                            </p>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 40 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                        >
                            {featuredHotels.map((hotel) => (
                                <HotelCard key={hotel.id} hotel={hotel} />
                            ))}
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8, delay: 0.4 }}
                            className="text-center mt-12"
                        >
                            <Link href="/explore">
                                <MagneticButton className="btn-secondary">
                                    View All Hotels
                                </MagneticButton>
                            </Link>
                        </motion.div>
                    </div>
                </section>

                {/* Philosophy Section */}
                <section className="section-padding">
                    <div className="max-w-4xl mx-auto text-center space-y-8">
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8 }}
                        >
                            <h2 className="font-serif mb-6">Curated with Care</h2>
                            <p className="text-lg text-charcoal/70 leading-relaxed">
                                Every property in our collection has been personally selected for its unique character,
                                exceptional service, and authentic connection to its locale. We believe luxury is found
                                in the details, the unexpected, and the genuinely memorable.
                            </p>
                        </motion.div>
                    </div>
                </section>
            </main>

            <FloatingNav />
        </>
    );
}
