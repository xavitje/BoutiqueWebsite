'use client';

import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface StaggeredRevealProps {
    children: ReactNode[];
    delay?: number;
    duration?: number;
    className?: string;
}

export function StaggeredReveal({
    children,
    delay = 0.1,
    duration = 0.5,
    className
}: StaggeredRevealProps) {
    const container = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: delay,
            },
        },
    };

    const item = {
        hidden: { opacity: 0, y: 20 },
        show: {
            opacity: 1,
            y: 0,
            transition: {
                duration,
                ease: 'easeOut',
            },
        },
    };

    return (
        <motion.div
            className={className}
            variants={container}
            initial="hidden"
            animate="show"
        >
            {children.map((child, index) => (
                <motion.div key={index} variants={item}>
                    {child}
                </motion.div>
            ))}
        </motion.div>
    );
}
