# The Curated Collection - Boutique Hotel Website

A luxury Next.js website for browsing and booking boutique hotels across Europe.

## Getting Started

### Prerequisites
- Node.js 18+ installed
- A Mapbox account and access token (optional, for map features)
- A Turso database (optional, for authentication and bookings)

### Installation

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables:

Copy `.env.local.example` to `.env.local` and fill in the values:

```bash
# Mapbox (optional - for map features)
NEXT_PUBLIC_MAPBOX_TOKEN=your_mapbox_token

# Turso Database (optional - for auth/bookings)
TURSO_DATABASE_URL=your_turso_url
TURSO_AUTH_TOKEN=your_turso_token

# NextAuth
NEXTAUTH_SECRET=your_secret_key
NEXTAUTH_URL=http://localhost:3000
```

3. Run the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the site.

## Features

- ✅ **Editorial Home Page** with featured hotels
- ✅ **Explore Page** with search and region filtering
- ✅ **Hotel Detail Pages** with booking CTAs
- ✅ **Journey Builder** - Multi-step questionnaire for custom travel
- ✅ **Authentication** - Login/signup (required for bookings)
- ✅ **European Hotels Only** - Filtered from GeoJSON data
- ✅ **Luxury Design** - Minimalist aesthetic with sophisticated animations
- ✅ **Floating Navigation** - Icon-based minimal UI
- ✅ **Magnetic Buttons** - Interactive cursor-following effects
- ✅ **Responsive Design** - Mobile-first approach

## Technology Stack

- **Framework**: Next.js 15 with App Router
- **Styling**: Tailwind CSS v3
- **Animations**: Framer Motion
- **Authentication**: NextAuth.js
- **Database**: Turso (SQLite) with Drizzle ORM
- **Icons**: Lucide React
- **Maps**: Mapbox GL JS (integration ready)

## Project Structure

```
├── app/                    # Next.js app router pages
│   ├── api/               # API routes
│   ├── explore/           # Hotel exploration page
│   ├── hotel/[id]/        # Dynamic hotel detail pages
│   ├── journey-builder/   # Custom journey form
│   ├── login/             # Authentication pages
│   └── signup/
├── components/            # React components
│   ├── hotel/            # Hotel-specific components
│   ├── navigation/       # Navigation components
│   ├── providers/        # Context providers
│   └── ui/               # Reusable UI components
├── db/                   # Database schema and config
├── lib/                  # Utilities and data services
│   ├── data/            # Hotel data loading
│   └── types/           # TypeScript types
└── *.geojson            # Hotel data files
```

## Database Setup (Optional)

If you want to enable authentication and bookings:

1. Install Turso CLI:
```bash
curl -sSfL https://get.tur.so/install.sh | bash
```

2. Create a database:
```bash
turso db create boutique-hotels
```

3. Get the database URL and token:
```bash
turso db show boutique-hotels
```

4. Run migrations:
```bash
npm run db:generate
npm run db:migrate
```

## Development

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run db:studio` - Open Drizzle Studio (database GUI)

## Design Philosophy

This website reimagines the standard hotel booking experience with:

- **No traditional header navigation** - Uses floating minimal nav at bottom
- **Discovery-first approach** - Home page invites exploration without immediate search
- **Editorial quality** - Large imagery and thoughtful typography
- **Authentic luxury** - Focus on boutique properties with character
- **Smooth interactions** - Magnetic buttons, staggered animations, seamless transitions

## Color Palette

- **Paper White**: #F9F9F9 - Background
- **Deep Charcoal**: #1A1A1A - Text and UI elements
- **Dusty Gold**: #C5A059 - Accent color for CTAs and highlights

## Typography

- **Headers**: Playfair Display (Serif)
- **Body**: Inter (Sans-serif)
- **Data**: JetBrains Mono (Monospace)

## License

Private project for Travel Counsellors.
