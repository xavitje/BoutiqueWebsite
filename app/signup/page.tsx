'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { MagneticButton } from '@/components/ui/MagneticButton';
import Link from 'next/link';
import { hashSync } from 'bcryptjs';

export default function SignUpPage() {
    const router = useRouter();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        if (password.length < 6) {
            setError('Password must be at least 6 characters');
            return;
        }

        setLoading(true);

        try {
            const response = await fetch('/api/auth/signup', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, email, password }),
            });

            const data = await response.json();

            if (!response.ok) {
                if (response.status === 503) {
                    setError('Database not configured. You can browse hotels without an account.');
                } else {
                    setError(data.error || 'Something went wrong');
                }
                return;
            }

            router.push('/login?registered=true');
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
                    <h1 className="text-4xl mb-4">Join Us</h1>
                    <p className="text-charcoal/60">Create an account to start booking</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6 glass-effect p-8 rounded-sm">
                    {error && (
                        <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-sm text-sm">
                            {error}
                        </div>
                    )}

                    <div>
                        <label htmlFor="name" className="block text-sm font-medium mb-2">
                            Name
                        </label>
                        <input
                            id="name"
                            type="text"
                            required
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full px-4 py-3 border border-charcoal/20 rounded-sm focus:outline-none focus:border-gold transition-colors"
                            placeholder="John Doe"
                        />
                    </div>

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

                    <div>
                        <label htmlFor="confirmPassword" className="block text-sm font-medium mb-2">
                            Confirm Password
                        </label>
                        <input
                            id="confirmPassword"
                            type="password"
                            required
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className="w-full px-4 py-3 border border-charcoal/20 rounded-sm focus:outline-none focus:border-gold transition-colors"
                            placeholder="••••••••"
                        />
                    </div>

                    <MagneticButton
                        className="w-full btn-primary"
                        onClick={() => { }}
                        disabled={loading}
                    >
                        {loading ? 'Creating Account...' : 'Create Account'}
                    </MagneticButton>

                    <p className="text-center text-sm text-charcoal/60">
                        Already have an account?{' '}
                        <Link href="/login" className="text-gold hover:underline">
                            Sign in
                        </Link>
                    </p>
                </form>
            </div>
        </main>
    );
}
