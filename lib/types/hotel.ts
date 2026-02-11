export interface HotelProperties {
    name: string;
    place: string;
    country: string;
    stars: string;
    latitude: number;
    longitude: number;
    webpage: string | null;
}

export interface HotelFeature {
    type: 'Feature';
    geometry: {
        type: 'Point';
        coordinates: [number, number];
    };
    properties: HotelProperties;
}

export interface HotelGeoJSON {
    type: 'FeatureCollection';
    features: HotelFeature[];
    name?: string;
}

export interface Hotel {
    id: string;
    name: string;
    location: string;
    country: string;
    stars: string;
    latitude: number;
    longitude: number;
    coordinates: [number, number];
    webpage: string | null;
    category?: string;
}

export type Region =
    | 'Western Europe'
    | 'Northern Europe'
    | 'Southern Europe'
    | 'Eastern Europe'
    | 'Winter Sports'
    | 'Cities'
    | 'Netherlands';

export const EUROPEAN_COUNTRIES = [
    'Albania', 'Andorra', 'Austria', 'Belarus', 'België', 'Belgie', 'Belgium',
    'Bosnia andHerzegovina', 'Bulgaria', 'Croatia', 'Cyprus', 'Czechia',
    'Czech Republic', 'Denemarken', 'Denmark', 'Duitsland', 'Germany',
    'Estland', 'Estonia', 'Finland', 'Frankrijk', 'France', 'Griekenland',
    'Greece', 'Hungary', 'Iceland', 'Ireland', 'Italie', 'Italy', 'Kosovo',
    'Latvia', 'Liechtenstein', 'Lithuania', 'Luxembourg', 'Malta', 'Moldova',
    'Monaco', 'Montenegro', 'Nederland', 'Netherlands', 'North Macedonia',
    'Noorwegen', 'Norway', 'Oostenrijk', 'Poland', 'Portugal', 'România',
    'Romania', 'Russia', 'San Marino', 'Serbia', 'Slovakia', 'Slovenia',
    'Spanje', 'Spain', 'Sweden', 'Zwitserland', 'Switzerland', 'Ukraine',
    'United Kingdom', 'Vatican City'
];
