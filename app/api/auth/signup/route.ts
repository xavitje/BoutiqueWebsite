import { NextRequest, NextResponse } from 'next/server';
import { hashSync } from 'bcryptjs';

export async function POST(request: NextRequest) {
    try {
        const { name, email, password } = await request.json();

        // Validate input
        if (!name || !email || !password) {
            return NextResponse.json(
                { error: 'All fields are required' },
                { status: 400 }
            );
        }

        if (password.length < 6) {
            return NextResponse.json(
                { error: 'Password must be at least 6 characters' },
                { status: 400 }
            );
        }

        // Check if database is configured
        if (!process.env.TURSO_DATABASE_URL && !process.env.DATABASE_URL) {
            return NextResponse.json(
                {
                    error: 'Database not configured. Please set up Turso database in .env.local',
                    message: 'You can browse hotels without an account. Database setup is only needed for bookings.'
                },
                { status: 503 }
            );
        }

        // Import db only if configured
        const { db } = await import('@/db');
        const { users } = await import('@/db/schema');
        const { eq } = await import('drizzle-orm');

        // Check if user exists
        const [existingUser] = await db
            .select()
            .from(users)
            .where(eq(users.email, email))
            .limit(1);

        if (existingUser) {
            return NextResponse.json(
                { error: 'Email already registered' },
                { status: 400 }
            );
        }

        // Hash password
        const hashedPassword = hashSync(password, 10);

        // Create user
        await db.insert(users).values({
            name,
            email,
            password: hashedPassword,
        });

        return NextResponse.json(
            { message: 'User created successfully' },
            { status: 201 }
        );
    } catch (error) {
        console.error('Signup error:', error);
        return NextResponse.json(
            {
                error: 'Database not available',
                message: 'Please set up the database to create an account. See README for instructions.'
            },
            { status: 500 }
        );
    }
}
