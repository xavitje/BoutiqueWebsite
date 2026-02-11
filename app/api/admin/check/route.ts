import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { users } from '@/db/schema';
import { auth } from '@/auth';
import { eq } from 'drizzle-orm';

export async function GET(request: NextRequest) {
    try {
        const session = await auth();

        if (!session?.user?.id) {
            return NextResponse.json({ isAdmin: false });
        }

        const [user] = await db.select().from(users).where(eq(users.id, session.user.id));

        return NextResponse.json({ isAdmin: user?.isAdmin || false });

    } catch (error) {
        console.error('Admin check error:', error);
        return NextResponse.json({ isAdmin: false });
    }
}
