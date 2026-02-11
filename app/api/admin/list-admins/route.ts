import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { users } from '@/db/schema';
import { auth } from '@/auth';
import { eq } from 'drizzle-orm';

export async function GET(request: NextRequest) {
    try {
        const session = await auth();

        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // Check if user is admin
        const [user] = await db.select().from(users).where(eq(users.id, session.user.id));

        if (!user?.isAdmin) {
            return NextResponse.json({ error: 'Forbidden - Admin only' }, { status: 403 });
        }

        // Fetch all admin users
        const adminUsers = await db
            .select({
                id: users.id,
                name: users.name,
                email: users.email,
            })
            .from(users)
            .where(eq(users.isAdmin, true));

        return NextResponse.json({ admins: adminUsers });

    } catch (error) {
        console.error('Fetch admins error:', error);
        return NextResponse.json({
            error: 'Failed to fetch admins'
        }, { status: 500 });
    }
}
