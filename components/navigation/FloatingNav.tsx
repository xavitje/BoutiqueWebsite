'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Map, Compass, User } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

const navItems = [
    { name: 'Home', href: '/', icon: Home },
    { name: 'Map', href: '/map', icon: Map },
    { name: 'Journey', href: '/journey-builder', icon: Compass },
    { name: 'Account', href: '/account', icon: User },
];

export function FloatingNav() {
    const pathname = usePathname();

    return (
        <motion.nav
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50"
        >
            <div className="glass-effect rounded-full px-6 py-3 shadow-2xl">
                <ul className="flex items-center gap-6">
                    {navItems.map((item) => {
                        const isActive = pathname === item.href;
                        const Icon = item.icon;

                        return (
                            <li key={item.name}>
                                <Link
                                    href={item.href}
                                    className="group flex flex-col items-center gap-1 transition-all"
                                >
                                    <motion.div
                                        whileHover={{ scale: 1.1 }}
                                        whileTap={{ scale: 0.95 }}
                                        className={cn(
                                            'p-2 rounded-full transition-colors',
                                            isActive ? 'bg-gold text-charcoal' : 'text-charcoal/60 hover:text-gold'
                                        )}
                                    >
                                        <Icon size={20} />
                                    </motion.div>
                                    <span
                                        className={cn(
                                            'text-xs font-mono opacity-0 group-hover:opacity-100 transition-opacity',
                                            isActive ? 'opacity-100 text-gold' : 'text-charcoal/60'
                                        )}
                                    >
                                        {item.name}
                                    </span>
                                </Link>
                            </li>
                        );
                    })}
                </ul>
            </div>
        </motion.nav>
    );
}
