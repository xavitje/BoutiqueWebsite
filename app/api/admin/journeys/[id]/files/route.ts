import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { journeyFiles, users } from '@/db/schema';
import { auth } from '@/auth';
import { eq } from 'drizzle-orm';
import { put } from '@vercel/blob';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';

// GET - List all files for a journey
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

        const files = await db
            .select({
                id: journeyFiles.id,
                filename: journeyFiles.filename,
                fileType: journeyFiles.fileType,
                fileSize: journeyFiles.fileSize,
                uploadedAt: journeyFiles.uploadedAt,
                adminId: journeyFiles.adminId,
                adminName: users.name,
                filepath: journeyFiles.filepath, // Added to return the URL/path
            })
            .from(journeyFiles)
            .leftJoin(users, eq(journeyFiles.adminId, users.id))
            .where(eq(journeyFiles.journeyId, params.id));

        return NextResponse.json({ files });

    } catch (error) {
        console.error('Fetch files error:', error);
        return NextResponse.json({ error: 'Failed to fetch files' }, { status: 500 });
    }
}

// POST - Upload a file
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

        const formData = await request.formData();
        const file = formData.get('file') as File;

        if (!file) {
            return NextResponse.json({ error: 'No file provided' }, { status: 400 });
        }

        // Validate file size (10MB max)
        const maxSize = 10 * 1024 * 1024; // 10MB
        if (file.size > maxSize) {
            return NextResponse.json({ error: 'File too large (max 10MB)' }, { status: 400 });
        }

        // Validate file type
        const allowedTypes = [
            'application/pdf',
            'image/jpeg',
            'image/png',
            'image/gif',
            'application/msword',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            'application/vnd.ms-excel',
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        ];

        if (!allowedTypes.includes(file.type)) {
            return NextResponse.json({ error: 'Invalid file type' }, { status: 400 });
        }

        let filepath = '';

        if (process.env.BLOB_READ_WRITE_TOKEN) {
            // Upload to Vercel Blob
            const blob = await put(file.name, file, {
                access: 'public',
            });
            filepath = blob.url;
        } else {
            // Fallback to local storage
            console.warn('BLOB_READ_WRITE_TOKEN not set, falling back to local storage');
            const uploadDir = join(process.cwd(), 'public', 'uploads', 'journeys', params.id);
            if (!existsSync(uploadDir)) {
                await mkdir(uploadDir, { recursive: true });
            }

            const timestamp = Date.now();
            const sanitizedFilename = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
            const uniqueFilename = `${timestamp}-${sanitizedFilename}`;
            const localPath = join(uploadDir, uniqueFilename);

            const bytes = await file.arrayBuffer();
            const buffer = Buffer.from(bytes);
            await writeFile(localPath, buffer);

            filepath = `/uploads/journeys/${params.id}/${uniqueFilename}`;
        }

        // Save to database
        const [fileRecord] = await db.insert(journeyFiles).values({
            journeyId: params.id,
            adminId: session.user.id,
            filename: file.name,
            filepath: filepath,
            fileType: file.type,
            fileSize: file.size,
        }).returning();

        return NextResponse.json({ file: fileRecord });

    } catch (error) {
        console.error('Upload file error:', error);
        return NextResponse.json({ error: 'Failed to upload file' }, { status: 500 });
    }
}
