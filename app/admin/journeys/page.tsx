'use client';

import { useEffect, useState } from 'react';
import { FloatingNav } from '@/components/navigation/FloatingNav';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface JourneyRequest {
    id: string;
    travelStyle: string | null;
    destination: string | null;
    budget: string | null;
    duration: string | null;
    preferences: string | null;
    status: string;
    createdAt: Date;
    userName: string;
    userEmail: string;
    userId: string;
}

export default function AdminJourneysPage() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [requests, setRequests] = useState<JourneyRequest[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        if (status === 'unauthenticated') {
            router.push('/login');
            return;
        }

        if (status === 'authenticated') {
            fetchRequests();
        }
    }, [status, router]);

    const fetchRequests = async () => {
        try {
            const response = await fetch('/api/admin/journey-requests');

            if (response.status === 403) {
                setError('Je hebt geen admin rechten om deze pagina te bekijken.');
                setLoading(false);
                return;
            }

            if (!response.ok) {
                throw new Error('Failed to fetch');
            }

            const data = await response.json();
            setRequests(data.requests);
        } catch (err) {
            setError('Kon aanvragen niet ophalen.');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <>
                <main className="page-container section-padding">
                    <div className="text-center">
                        <p className="text-charcoal/60">Laden...</p>
                    </div>
                </main>
                <FloatingNav />
            </>
        );
    }

    if (error) {
        return (
            <>
                <main className="page-container section-padding">
                    <div className="max-w-4xl mx-auto text-center space-y-6">
                        <h1 className="text-4xl">Toegang geweigerd</h1>
                        <p className="text-charcoal/70">{error}</p>
                        <Link href="/account" className="btn-primary inline-block">
                            Terug naar account
                        </Link>
                    </div>
                </main>
                <FloatingNav />
            </>
        );
    }

    return (
        <>
            <main className="page-container section-padding">
                <div className="max-w-6xl mx-auto space-y-8">
                    <div className="flex justify-between items-center">
                        <h1 className="text-4xl">Reis Aanvragen</h1>
                        <span className="text-sm text-charcoal/60 font-mono">
                            {requests.length} {requests.length === 1 ? 'aanvraag' : 'aanvragen'}
                        </span>
                    </div>

                    {requests.length === 0 ? (
                        <div className="glass-effect p-12 rounded-sm text-center">
                            <p className="text-charcoal/60">Nog geen reis aanvragen ontvangen.</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {requests.map((request) => (
                                <div key={request.id} className="glass-effect p-6 rounded-sm hover:shadow-lg transition-shadow">
                                    <div className="flex justify-between items-start mb-4">
                                        <div>
                                            <h3 className="text-xl font-serif mb-1">{request.userName}</h3>
                                            <p className="text-sm text-charcoal/60">{request.userEmail}</p>
                                        </div>
                                        <div className="text-right">
                                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${request.status === 'pending' ? 'bg-gold/20 text-gold' :
                                                    request.status === 'reviewed' ? 'bg-blue-500/20 text-blue-600' :
                                                        'bg-green-500/20 text-green-600'
                                                }`}>
                                                {request.status === 'pending' ? 'In afwachting' :
                                                    request.status === 'reviewed' ? 'Bekeken' : 'Gecontacteerd'}
                                            </span>
                                            <p className="text-xs text-charcoal/40 mt-2">
                                                {new Date(request.createdAt).toLocaleDateString('nl-NL', {
                                                    day: 'numeric',
                                                    month: 'long',
                                                    year: 'numeric'
                                                })}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="grid md:grid-cols-2 gap-4 text-sm">
                                        <div>
                                            <span className="text-charcoal/60">Type reis:</span>
                                            <p className="font-medium">{request.travelStyle || '-'}</p>
                                        </div>
                                        <div>
                                            <span className="text-charcoal/60">Reisdatum:</span>
                                            <p className="font-medium">{request.destination || '-'}</p>
                                        </div>
                                        <div>
                                            <span className="text-charcoal/60">Aantal reizigers:</span>
                                            <p className="font-medium">{request.duration || '-'}</p>
                                        </div>
                                        <div>
                                            <span className="text-charcoal/60">Budget:</span>
                                            <p className="font-medium">{request.budget || '-'}</p>
                                        </div>
                                    </div>

                                    {request.preferences && (
                                        <div className="mt-4 pt-4 border-t border-charcoal/10">
                                            <span className="text-sm text-charcoal/60">Wensen:</span>
                                            <p className="mt-1 text-charcoal/80">{request.preferences}</p>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </main>
            <FloatingNav />
        </>
    );
}
