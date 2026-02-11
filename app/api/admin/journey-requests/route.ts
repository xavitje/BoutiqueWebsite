import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { journeyRequests, users } from '@/db/schema';
import { auth } from '@/auth';
import { eq, desc } from 'drizzle-orm';

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

        // Fetch all journey requests with user info
        const requests = await db
            .select({
                id: journeyRequests.id,
                travelStyle: journeyRequests.travelStyle,
                destination: journeyRequests.destination,
                budget: journeyRequests.budget,
                duration: journeyRequests.duration,
                preferences: journeyRequests.preferences,
                status: journeyRequests.status,
                createdAt: journeyRequests.createdAt,
                userName: users.name,
                userEmail: users.email,
                userId: users.id,
                assignedTo: journeyRequests.assignedTo,
            })
            .from(journeyRequests)
            .leftJoin(users, eq(journeyRequests.userId, users.id))
            .orderBy(desc(journeyRequests.createdAt));

        return NextResponse.json({ requests });

    } catch (error) {
        console.error('Fetch journey requests error:', error);
        return NextResponse.json({
            error: 'Failed to fetch journey requests'
        }, { status: 500 });
    }
}
