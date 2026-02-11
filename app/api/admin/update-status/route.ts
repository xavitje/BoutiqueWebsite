import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { journeyRequests, users } from '@/db/schema';
import { auth } from '@/auth';
import { eq } from 'drizzle-orm';

export async function PATCH(request: NextRequest) {
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

        const body = await request.json();
        const { requestId, status } = body;

        if (!requestId || !status) {
            return NextResponse.json({ error: 'Missing requestId or status' }, { status: 400 });
        }

        // Validate status
        const validStatuses = ['pending', 'reviewed', 'contacted'];
        if (!validStatuses.includes(status)) {
            return NextResponse.json({ error: 'Invalid status' }, { status: 400 });
        }

        // Update journey request status
        await db.update(journeyRequests)
            .set({ status })
            .where(eq(journeyRequests.id, requestId));

        return NextResponse.json({ success: true });

    } catch (error) {
        console.error('Update journey status error:', error);
        return NextResponse.json({
            error: 'Failed to update status'
        }, { status: 500 });
    }
}
