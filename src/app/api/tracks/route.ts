import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { z } from 'zod';

const trackSchema = z.object({
  title: z.string().min(1),
  artist: z.string().min(1),
  album: z.string().optional(),
  genre: z.string().optional(),
  duration: z.number().positive(),
  url: z.string().url(),
  coverImage: z.string().optional(),
  userId: z.string(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, ...trackData } = trackSchema.parse(body);

    const track = await db.track.create({
      data: {
        ...trackData,
        userId,
      },
    });

    return NextResponse.json({ track }, { status: 201 });
  } catch (error) {
    console.error('Track creation error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const trending = searchParams.get('trending');

    let tracks;

    if (userId) {
      tracks = await db.track.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
      });
    } else if (trending) {
      tracks = await db.track.findMany({
        orderBy: { plays: 'desc' },
        take: 20,
      });
    } else {
      tracks = await db.track.findMany({
        orderBy: { createdAt: 'desc' },
      });
    }

    return NextResponse.json({ tracks });
  } catch (error) {
    console.error('Tracks fetch error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}