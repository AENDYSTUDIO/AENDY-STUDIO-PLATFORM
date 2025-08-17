import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { z } from 'zod';

const rewardSchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
  type: z.enum(['STREAM', 'UPLOAD', 'PLAYLIST', 'COMMENT', 'LIKE', 'PREMIUM']),
  value: z.number().int().min(0),
  userId: z.string(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, ...rewardData } = rewardSchema.parse(body);

    const reward = await db.reward.create({
      data: {
        ...rewardData,
        userId,
      },
    });

    return NextResponse.json({ reward }, { status: 201 });
  } catch (error) {
    console.error('Reward creation error:', error);
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

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID required' },
        { status: 400 }
      );
    }

    const rewards = await db.reward.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });

    const tokens = await db.token.findFirst({
      where: { userId, type: 'SAUDIO' },
    });

    return NextResponse.json({
      rewards,
      saudioBalance: tokens?.amount || 0,
    });
  } catch (error) {
    console.error('Rewards fetch error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { rewardId, isClaimed } = body;

    const reward = await db.reward.update({
      where: { id: rewardId },
      data: { isClaimed },
    });

    return NextResponse.json({ reward });
  } catch (error) {
    console.error('Reward update error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}