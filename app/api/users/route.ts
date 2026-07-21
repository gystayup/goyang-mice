import { NextRequest, NextResponse } from 'next/server';
import { ApiResponse, User } from '@/lib/database';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest): Promise<NextResponse<ApiResponse<User[]>>> {
  try {
    const users = await prisma.user.findMany({
      orderBy: { createdAt: 'desc' },
      take: 50,
    });

    return NextResponse.json(
      {
        success: true,
        data: users.map((user) => ({
          id: user.id,
          name: user.name,
          email: user.email,
          password_hash: user.passwordHash,
          role: user.role as unknown as User["role"],
          status: user.status as unknown as User["status"],
          last_login_at: user.lastLoginAt ?? undefined,
          created_at: user.createdAt,
          updated_at: user.updatedAt,
        } as User)),
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Users Get API Error:', error);
    return NextResponse.json(
      {
        success: true,
        data: [],
      },
      { status: 200 }
    );
  }
}
