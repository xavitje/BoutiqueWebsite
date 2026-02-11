import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { journeyNotes, users } from '@/db/schema';
import { auth } from '@/auth';
import { eq, and } from 'drizzle-orm';

// PATCH - Update a note
export async function PATCH(
    request: NextRequest,
    props: { params: Promise<{ id: string; noteId: string }> }
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

        const [updatedNote] = await db.update(journeyNotes)
            .set({
                content: content.trim(),
                updatedAt: new Date(),
            })
            .where(and(
                eq(journeyNotes.id, params.noteId),
                eq(journeyNotes.journeyId, params.id)
            ))
            .returning();

        if (!updatedNote) {
            return NextResponse.json({ error: 'Note not found' }, { status: 404 });
        }

        return NextResponse.json({ note: updatedNote });

    } catch (error) {
        console.error('Update note error:', error);
        return NextResponse.json({ error: 'Failed to update note' }, { status: 500 });
    }
}

// DELETE - Delete a note
export async function DELETE(
    request: NextRequest,
    props: { params: Promise<{ id: string; noteId: string }> }
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

        await db.delete(journeyNotes)
            .where(and(
                eq(journeyNotes.id, params.noteId),
                eq(journeyNotes.journeyId, params.id)
            ));

        return NextResponse.json({ success: true });

    } catch (error) {
        console.error('Delete note error:', error);
        return NextResponse.json({ error: 'Failed to delete note' }, { status: 500 });
    }
}
