import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { users } from '@/db/schema';
import { auth } from '@/auth';
import { eq } from 'drizzle-orm';

export async function POST(request: NextRequest) {
    try {
        const session = await auth();

        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // Update user to admin
        await db.update(users)
            .set({ isAdmin: true })
            .where(eq(users.id, session.user.id));

        return NextResponse.json({ success: true });

    } catch (error) {
        console.error('Make admin error:', error);
        return NextResponse.json({
            error: 'Failed to grant admin rights'
        }, { status: 500 });
    }
}
