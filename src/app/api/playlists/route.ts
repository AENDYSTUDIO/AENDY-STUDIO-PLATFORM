import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { z } from 'zod';

const playlistSchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
  isPublic: z.boolean().default(true),
  userId: z.string(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, ...playlistData } = playlistSchema.parse(body);

    const playlist = await db.playlist.create({
      data: {
        ...playlistData,
        userId,
      },
    });

    return NextResponse.json({ playlist }, { status: 201 });
  } catch (error) {
    console.error('Playlist creation error:', error);
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

    let playlists;

    if (userId) {
      playlists = await db.playlist.findMany({
        where: { userId },
        include: {
          tracks: {
            include: {
              track: true,
            },
            orderBy: {
              position: 'asc',
            },
          },
          _count: {
            select: {
              tracks: true,
              likes: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
      });
    } else {
      playlists = await db.playlist.findMany({
        where: { isPublic: true },
        include: {
          tracks: {
            include: {
              track: true,
            },
            orderBy: {
              position: 'asc',
            },
          },
          _count: {
            select: {
              tracks: true,
              likes: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
      });
    }

    return NextResponse.json({ playlists });
  } catch (error) {
    console.error('Playlists fetch error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}