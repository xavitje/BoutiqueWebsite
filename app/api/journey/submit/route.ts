import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { journeyRequests } from '@/db/schema';
import { auth } from '@/auth';

export async function POST(request: NextRequest) {
    try {
        const session = await auth();

        if (!session?.user?.email) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await request.json();
        const { travelStyle, travelDate, guests, budget, preferences } = body;

        // Insert journey request
        const [newRequest] = await db.insert(journeyRequests).values({
            userId: session.user.id as string,
            travelStyle,
            destination: travelDate, // Using destination field for travel date
            budget,
            duration: guests?.toString(), // Using duration field for guests
            preferences,
            status: 'pending',
        }).returning();

        return NextResponse.json({
            success: true,
            requestId: newRequest.id
        }, { status: 201 });

    } catch (error) {
        console.error('Journey submission error:', error);
        return NextResponse.json({
            error: 'Failed to submit journey request'
        }, { status: 500 });
    }
}
