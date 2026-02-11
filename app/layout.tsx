import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "@/components/providers/Providers";

export const metadata: Metadata = {
    metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL || 'https://the-curated-collection.vercel.app'),
    title: {
        default: 'The Curated Collection | Boutique Hotels in Europe',
        template: '%s | The Curated Collection',
    },
    description: 'Discover exclusive boutique hotels across Europe. Handpicked luxury accommodations for discerning travelers seeking authentic experiences.',
    keywords: ['boutique hotels', 'luxury travel', 'europe', 'curated collection', 'small hotels', 'authentic experiences'],
    authors: [{ name: 'The Curated Collection' }],
    openGraph: {
        title: 'The Curated Collection | Boutique Hotels',
        description: 'Discover exclusive boutique hotels across Europe.',
        type: 'website',
        locale: 'en_US',
        siteName: 'The Curated Collection',
    },
    twitter: {
        card: 'summary_large_image',
        title: 'The Curated Collection',
        description: 'Discover exclusive boutique hotels across Europe.',
    },
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" suppressHydrationWarning>
            <body>
                <Providers>{children}</Providers>
            </body>
        </html>
    );
}
