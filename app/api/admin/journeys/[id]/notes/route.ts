import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { journeyNotes, users } from '@/db/schema';
import { auth } from '@/auth';
import { eq } from 'drizzle-orm';

// GET - List all notes for a journey
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

        const [user] = await db.select().from(users).where(eq(users.id, session.user.id));

        if (!user?.isAdmin) {
            return NextResponse.json({ error: 'Forbidden - Admin only' }, { status: 403 });
        }

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
            .where(eq(journeyNotes.journeyId, params.id));

        return NextResponse.json({ notes });

    } catch (error) {
        console.error('Fetch notes error:', error);
        return NextResponse.json({ error: 'Failed to fetch notes' }, { status: 500 });
    }
}

// POST - Add a new note
export async function POST(
    request: NextRequest,
    props: { params: Promise<{ id: string }> }
) {
    const params = await props.params;
    try {
        const session = await auth();

        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const [user] = await db.select().from(users).where(eq(users.id, session.user.id));

        if (!user?.isAdmin) {
            return NextResponse.json({ error: 'Forbidden - Admin only' }, { status: 403 });
        }

        const body = await request.json();
        const { content } = body;

        if (!content || content.trim() === '') {
            return NextResponse.json({ error: 'Content is required' }, { status: 400 });
        }

        const [note] = await db.insert(journeyNotes).values({
            journeyId: params.id,
            adminId: session.user.id,
            content: content.trim(),
        }).returning();

        return NextResponse.json({ note });

    } catch (error) {
        console.error('Add note error:', error);
        return NextResponse.json({ error: 'Failed to add note' }, { status: 500 });
    }
}
