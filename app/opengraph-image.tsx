import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export const alt = 'The Curated Collection - Boutique Hotels';
export const size = {
    width: 1200,
    height: 630,
};

export const contentType = 'image/png';

export default async function Image() {
    return new ImageResponse(
        (
            <div
                style={{
                    fontSize: 128,
                    background: '#1A1A1A', // Charcoal
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#D4AF37', // Gold
                }}
            >
                <div style={{ fontSize: 80, marginBottom: 20 }}>The Curated Collection</div>
                <div style={{ fontSize: 40, color: 'white', opacity: 0.8 }}>Boutique Hotel Experiences</div>
            </div>
        ),
        {
            ...size,
        }
    );
}
