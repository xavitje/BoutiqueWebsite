'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';
import { MagneticButton } from '@/components/ui/MagneticButton';
import Link from 'next/link';

export default function LoginPage() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const result = await signIn('credentials', {
                email,
                password,
                redirect: false,
            });

            if (result?.error) {
                setError('Invalid email or password');
            } else {
                router.push('/');
                router.refresh();
            }
        } catch (err) {
            setError('An error occurred. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="page-container flex items-center justify-center section-padding">
            <div className="w-full max-w-md">
                <div className="text-center mb-8">
                    <h1 className="text-4xl mb-4">Welcome Back</h1>
                    <p className="text-charcoal/60">Sign in to book your next escape</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6 glass-effect p-8 rounded-sm">
                    {error && (
                        <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-sm text-sm">
                            {error}
                        </div>
                    )}

                    <div>
                        <label htmlFor="email" className="block text-sm font-medium mb-2">
                            Email
                        </label>
                        <input
                            id="email"
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-4 py-3 border border-charcoal/20 rounded-sm focus:outline-none focus:border-gold transition-colors"
                            placeholder="your@email.com"
                        />
                    </div>

                    <div>
                        <label htmlFor="password" className="block text-sm font-medium mb-2">
                            Password
                        </label>
                        <input
                            id="password"
                            type="password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-4 py-3 border border-charcoal/20 rounded-sm focus:outline-none focus:border-gold transition-colors"
                            placeholder="••••••••"
                        />
                    </div>

                    <MagneticButton
                        className="w-full btn-primary"
                        onClick={() => { }}
                        disabled={loading}
                    >
                        {loading ? 'Signing in...' : 'Sign In'}
                    </MagneticButton>

                    <p className="text-center text-sm text-charcoal/60">
                        Don't have an account?{' '}
                        <Link href="/signup" className="text-gold hover:underline">
                            Create one
                        </Link>
                    </p>
                </form>
            </div>
        </main>
    );
}
