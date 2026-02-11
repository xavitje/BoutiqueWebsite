import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { journeyFiles, users } from '@/db/schema';
import { auth } from '@/auth';
import { eq, and } from 'drizzle-orm';
import { unlink } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';
import { readFile } from 'fs/promises';
import { del } from '@vercel/blob';

// GET - Download a file
export async function GET(
    request: NextRequest,
    props: { params: Promise<{ id: string; fileId: string }> }
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

        const [file] = await db
            .select()
            .from(journeyFiles)
            .where(and(
                eq(journeyFiles.id, params.fileId),
                eq(journeyFiles.journeyId, params.id)
            ));

        if (!file) {
            return NextResponse.json({ error: 'File not found' }, { status: 404 });
        }

        if (file.filepath.startsWith('http')) {
            // Vercel Blob URL - redirect to it
            return NextResponse.redirect(file.filepath);
        } else {
            // Local file
            const filepath = join(process.cwd(), 'public', file.filepath);

            if (!existsSync(filepath)) {
                return NextResponse.json({ error: 'File not found on disk' }, { status: 404 });
            }

            const fileBuffer = await readFile(filepath);

            return new NextResponse(fileBuffer, {
                headers: {
                    'Content-Type': file.fileType,
                    'Content-Disposition': `attachment; filename="${file.filename}"`,
                },
            });
        }

    } catch (error) {
        console.error('Download file error:', error);
        return NextResponse.json({ error: 'Failed to download file' }, { status: 500 });
    }
}

// DELETE - Delete a file
export async function DELETE(
    request: NextRequest,
    props: { params: Promise<{ id: string; fileId: string }> }
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

        const [file] = await db
            .select()
            .from(journeyFiles)
            .where(and(
                eq(journeyFiles.id, params.fileId),
                eq(journeyFiles.journeyId, params.id)
            ));

        if (!file) {
            return NextResponse.json({ error: 'File not found' }, { status: 404 });
        }

        if (file.filepath.startsWith('http')) {
            // Delete from Vercel Blob
            if (process.env.BLOB_READ_WRITE_TOKEN) {
                await del(file.filepath);
            }
        } else {
            // Delete from local filesystem
            const filepath = join(process.cwd(), 'public', file.filepath);
            if (existsSync(filepath)) {
                await unlink(filepath);
            }
        }

        // Delete from database
        await db.delete(journeyFiles).where(eq(journeyFiles.id, params.fileId));

        return NextResponse.json({ success: true });

    } catch (error) {
        console.error('Delete file error:', error);
        return NextResponse.json({ error: 'Failed to delete file' }, { status: 500 });
    }
}
