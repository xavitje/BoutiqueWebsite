'use client';

import { useSession, signOut } from 'next-auth/react';
import { FloatingNav } from '@/components/navigation/FloatingNav';
import { MagneticButton } from '@/components/ui/MagneticButton';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function AccountPage() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [isAdmin, setIsAdmin] = useState(false);
    const [makingAdmin, setMakingAdmin] = useState(false);

    useEffect(() => {
        // Check if user is admin
        if (session?.user?.email) {
            fetch('/api/admin/check')
                .then(res => res.json())
                .then(data => setIsAdmin(data.isAdmin))
                .catch(() => setIsAdmin(false));
        }
    }, [session]);

    const handleMakeAdmin = async () => {
        setMakingAdmin(true);
        try {
            const response = await fetch('/api/admin/make-admin', {
                method: 'POST',
            });

            if (response.ok) {
                setIsAdmin(true);
                alert('✅ Je hebt nu admin rechten!');
                // Reload to update session
                window.location.reload();
            }
        } catch (error) {
            alert('Er is iets misgegaan.');
        } finally {
            setMakingAdmin(false);
        }
    };

    if (status === 'loading') {
        return (
            <main className="page-container flex items-center justify-center">
                <p>Loading...</p>
            </main>
        );
    }

    if (!session) {
        router.push('/login');
        return null;
    }

    return (
        <>
            <main className="page-container section-padding">
                <div className="max-w-2xl mx-auto">
                    <h1 className="mb-12 text-center">Uw Account</h1>

                    <div className="glass-effect p-8 rounded-sm space-y-6">
                        <div>
                            <label className="block text-sm text-charcoal/60 mb-1">Naam</label>
                            <p className="text-lg">{session.user?.name}</p>
                        </div>

                        <div>
                            <label className="block text-sm text-charcoal/60 mb-1">Email</label>
                            <p className="text-lg">{session.user?.email}</p>
                        </div>

                        <div>
                            <label className="block text-sm text-charcoal/60 mb-1">Status</label>
                            <p className="text-lg">
                                {isAdmin ? (
                                    <span className="text-gold">✨ Administrator</span>
                                ) : (
                                    <span>Gebruiker</span>
                                )}
                            </p>
                        </div>

                        {isAdmin && (
                            <div className="pt-6 border-t border-charcoal/10">
                                <Link href="/admin" className="btn-primary w-full text-center block">
                                    🎛️ Admin Paneel
                                </Link>
                            </div>
                        )}

                        {!isAdmin && (
                            <div className="pt-6 border-t border-charcoal/10">
                                <MagneticButton
                                    onClick={handleMakeAdmin}
                                    disabled={makingAdmin}
                                    className="btn-primary w-full"
                                >
                                    {makingAdmin ? 'Bezig...' : '🔑 Maak mij admin (tijdelijk)'}
                                </MagneticButton>
                                <p className="text-xs text-charcoal/40 mt-2 text-center">
                                    Tijdelijke knop voor development
                                </p>
                            </div>
                        )}

                        <div className="pt-6 border-t border-charcoal/10">
                            <MagneticButton
                                onClick={() => signOut({ callbackUrl: '/' })}
                                className="btn-secondary w-full"
                            >
                                Uitloggen
                            </MagneticButton>
                        </div>
                    </div>
                </div>
            </main>

            <FloatingNav />
        </>
    );
}
