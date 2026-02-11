'use client';

import { useEffect, useState } from 'react';
import { FloatingNav } from '@/components/navigation/FloatingNav';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Users, FileText, LayoutDashboard } from 'lucide-react';

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
    assignedTo: string | null;
    assignedAdminName: string | null;
}

interface AdminUser {
    id: string;
    name: string;
    email: string;
}

export default function AdminPanelPage() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [requests, setRequests] = useState<JourneyRequest[]>([]);
    const [admins, setAdmins] = useState<AdminUser[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [activeTab, setActiveTab] = useState<'journeys' | 'users'>('journeys');

    useEffect(() => {
        if (status === 'unauthenticated') {
            router.push('/login');
            return;
        }

        if (status === 'authenticated') {
            fetchRequests();
            fetchAdmins();
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

    const fetchAdmins = async () => {
        try {
            const response = await fetch('/api/admin/list-admins');
            if (response.ok) {
                const data = await response.json();
                setAdmins(data.admins);
            }
        } catch (err) {
            console.error('Failed to fetch admins:', err);
        }
    };

    const updateStatus = async (requestId: string, newStatus: string) => {
        try {
            const response = await fetch('/api/admin/update-status', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ requestId, status: newStatus }),
            });

            if (!response.ok) {
                throw new Error('Failed to update status');
            }

            setRequests(requests.map(req =>
                req.id === requestId ? { ...req, status: newStatus } : req
            ));
        } catch (error) {
            alert('Kon status niet updaten. Probeer opnieuw.');
        }
    };

    const assignJourney = async (requestId: string, adminId: string) => {
        try {
            const response = await fetch('/api/admin/assign-journey', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ requestId, assignedTo: adminId || null }),
            });

            if (!response.ok) {
                throw new Error('Failed to assign journey');
            }

            const assignedAdmin = admins.find(a => a.id === adminId);
            setRequests(requests.map(req =>
                req.id === requestId ? { ...req, assignedTo: adminId || null, assignedAdminName: assignedAdmin?.name || null } : req
            ));
        } catch (error) {
            alert('Kon reis niet toewijzen. Probeer opnieuw.');
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
                <div className="max-w-7xl mx-auto">
                    {/* Header */}
                    <div className="mb-8">
                        <h1 className="text-4xl mb-2">Admin Paneel</h1>
                        <p className="text-charcoal/60">Beheer je boutique hotel platform</p>
                    </div>

                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                        <div className="glass-effect p-6 rounded-sm">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-gold/10 rounded-full">
                                    <FileText className="text-gold" size={24} />
                                </div>
                                <div>
                                    <p className="text-sm text-charcoal/60">Totaal Aanvragen</p>
                                    <p className="text-3xl font-serif">{requests.length}</p>
                                </div>
                            </div>
                        </div>

                        <div className="glass-effect p-6 rounded-sm">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-blue-500/10 rounded-full">
                                    <Users className="text-blue-600" size={24} />
                                </div>
                                <div>
                                    <p className="text-sm text-charcoal/60">Unieke Klanten</p>
                                    <p className="text-3xl font-serif">
                                        {new Set(requests.map(r => r.userId)).size}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="glass-effect p-6 rounded-sm">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-green-500/10 rounded-full">
                                    <LayoutDashboard className="text-green-600" size={24} />
                                </div>
                                <div>
                                    <p className="text-sm text-charcoal/60">In Afwachting</p>
                                    <p className="text-3xl font-serif">
                                        {requests.filter(r => r.status === 'pending').length}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Navigation Tabs */}
                    <div className="flex gap-4 mb-6 border-b border-charcoal/10">
                        <button
                            onClick={() => setActiveTab('journeys')}
                            className={`pb-3 px-4 font-medium transition-colors relative ${activeTab === 'journeys'
                                ? 'text-gold'
                                : 'text-charcoal/60 hover:text-charcoal'
                                }`}
                        >
                            Reis Aanvragen
                            {activeTab === 'journeys' && (
                                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gold" />
                            )}
                        </button>
                    </div>

                    {/* Journey Requests Table */}
                    {activeTab === 'journeys' && (
                        <div className="space-y-4">
                            {requests.length === 0 ? (
                                <div className="glass-effect p-12 rounded-sm text-center">
                                    <p className="text-charcoal/60">Nog geen reis aanvragen ontvangen.</p>
                                </div>
                            ) : (
                                <div className="glass-effect rounded-sm overflow-hidden">
                                    <div className="overflow-x-auto">
                                        <table className="w-full">
                                            <thead className="bg-charcoal/5 border-b border-charcoal/10">
                                                <tr>
                                                    <th className="text-left p-4 font-medium text-sm">Klant</th>
                                                    <th className="text-left p-4 font-medium text-sm">Type Reis</th>
                                                    <th className="text-left p-4 font-medium text-sm">Datum</th>
                                                    <th className="text-left p-4 font-medium text-sm">Reizigers</th>
                                                    <th className="text-left p-4 font-medium text-sm">Budget</th>
                                                    <th className="text-left p-4 font-medium text-sm">Toegewezen aan</th>
                                                    <th className="text-left p-4 font-medium text-sm">Status</th>
                                                    <th className="text-left p-4 font-medium text-sm">Aangemaakt</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {requests.map((request) => (
                                                    <tr
                                                        key={request.id}
                                                        onClick={() => router.push(`/admin/journeys/${request.id}`)}
                                                        className="border-b border-charcoal/5 hover:bg-charcoal/5 transition-colors cursor-pointer"
                                                    >
                                                        <td className="p-4">
                                                            <div>
                                                                <p className="font-medium">{request.userName}</p>
                                                                <p className="text-sm text-charcoal/60">{request.userEmail}</p>
                                                            </div>
                                                        </td>
                                                        <td className="p-4">
                                                            <span className="text-sm">{request.travelStyle || '-'}</span>
                                                        </td>
                                                        <td className="p-4">
                                                            <span className="text-sm">{request.destination || '-'}</span>
                                                        </td>
                                                        <td className="p-4">
                                                            <span className="text-sm">{request.duration || '-'}</span>
                                                        </td>
                                                        <td className="p-4">
                                                            <span className="text-sm">{request.budget || '-'}</span>
                                                        </td>
                                                        <td className="p-4">
                                                            <select
                                                                value={request.assignedTo || ''}
                                                                onChange={(e) => assignJourney(request.id, e.target.value)}
                                                                onClick={(e) => e.stopPropagation()}
                                                                className="px-3 py-1.5 rounded-sm text-xs border border-charcoal/20 cursor-pointer bg-white hover:border-gold transition-colors"
                                                            >
                                                                <option value="">Niet toegewezen</option>
                                                                {admins.map((admin) => (
                                                                    <option key={admin.id} value={admin.id}>
                                                                        {admin.name}
                                                                    </option>
                                                                ))}
                                                            </select>
                                                        </td>
                                                        <td className="p-4">
                                                            <select
                                                                value={request.status}
                                                                onChange={(e) => updateStatus(request.id, e.target.value)}
                                                                onClick={(e) => e.stopPropagation()}
                                                                className={`px-3 py-1.5 rounded-full text-xs font-medium border-0 cursor-pointer transition-colors ${request.status === 'pending'
                                                                    ? 'bg-gold/20 text-gold'
                                                                    : request.status === 'reviewed'
                                                                        ? 'bg-blue-500/20 text-blue-600'
                                                                        : 'bg-green-500/20 text-green-600'
                                                                    }`}
                                                            >
                                                                <option value="pending">In afwachting</option>
                                                                <option value="reviewed">Bekeken</option>
                                                                <option value="contacted">Gecontacteerd</option>
                                                            </select>
                                                        </td>
                                                        <td className="p-4">
                                                            <span className="text-sm text-charcoal/60">
                                                                {new Date(request.createdAt).toLocaleDateString('nl-NL', {
                                                                    day: 'numeric',
                                                                    month: 'short',
                                                                    year: 'numeric',
                                                                })}
                                                            </span>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </main>
            <FloatingNav />
        </>
    );
}
