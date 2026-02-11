import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { journeyRequests, users, journeyNotes, journeyFiles } from '@/db/schema';
import { auth } from '@/auth';
import { eq, desc } from 'drizzle-orm';

export async function GET(
    request: NextRequest,
    props: { params: Promise<{ id: string }> }
) {
    const params = await props.params;
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

        const journeyId = params.id;

        // Fetch journey request with user info
        const [journey] = await db
            .select({
                id: journeyRequests.id,
                travelStyle: journeyRequests.travelStyle,
                destination: journeyRequests.destination,
                budget: journeyRequests.budget,
                duration: journeyRequests.duration,
                preferences: journeyRequests.preferences,
                status: journeyRequests.status,
                createdAt: journeyRequests.createdAt,
                assignedTo: journeyRequests.assignedTo,
                userName: users.name,
                userEmail: users.email,
                userId: users.id,
            })
            .from(journeyRequests)
            .leftJoin(users, eq(journeyRequests.userId, users.id))
            .where(eq(journeyRequests.id, journeyId));

        if (!journey) {
            return NextResponse.json({ error: 'Journey not found' }, { status: 404 });
        }

        // Fetch assigned admin if exists
        let assignedAdmin = null;
        if (journey.assignedTo) {
            const [admin] = await db
                .select({ id: users.id, name: users.name, email: users.email })
                .from(users)
                .where(eq(users.id, journey.assignedTo));
            assignedAdmin = admin;
        }

        // Fetch notes with admin info
        const notes = await db
            .select({
                id: journeyNotes.id,
                content: journeyNotes.content,
                createdAt: journeyNotes.createdAt,
                updatedAt: journeyNotes.updatedAt,
                adminId: journeyNotes.adminId,
                adminName: users.name,
            })
            .from(journeyNotes)
            .leftJoin(users, eq(journeyNotes.adminId, users.id))
            .where(eq(journeyNotes.journeyId, journeyId))
            .orderBy(desc(journeyNotes.createdAt));

        // Fetch files with admin info
        const files = await db
            .select({
                id: journeyFiles.id,
                filename: journeyFiles.filename,
                filepath: journeyFiles.filepath,
                fileType: journeyFiles.fileType,
                fileSize: journeyFiles.fileSize,
                uploadedAt: journeyFiles.uploadedAt,
                adminId: journeyFiles.adminId,
                adminName: users.name,
            })
            .from(journeyFiles)
            .leftJoin(users, eq(journeyFiles.adminId, users.id))
            .where(eq(journeyFiles.journeyId, journeyId))
            .orderBy(desc(journeyFiles.uploadedAt));

        return NextResponse.json({
            journey: {
                ...journey,
                assignedAdmin,
            },
            notes,
            files,
        });

    } catch (error) {
        console.error('Fetch journey details error:', error);
        return NextResponse.json({
            error: 'Failed to fetch journey details'
        }, { status: 500 });
    }
}
