import { NextRequest, NextResponse } from 'next/server';
import { ApiResponse, Product } from '@/lib/database';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest): Promise<NextResponse<ApiResponse<Product[]>>> {
  try {
    const products = await prisma.product.findMany({
      orderBy: { createdAt: 'desc' },
      take: 50,
    });

    return NextResponse.json(
      {
        success: true,
        data: products.map((product) => ({
          id: product.id,
          partner_id: product.partnerId,
          product_type: product.productType as any,
          title: product.title,
          slug: product.slug,
          summary: product.summary,
          description: product.description,
          location: product.location,
          duration_text: product.durationText,
          min_people: product.minPeople,
          max_people: product.maxPeople,
          base_price: product.basePrice ? Number(product.basePrice) : undefined,
          price_type: product.priceType as any,
          is_bookable: product.isBookable,
          status: product.status as any,
          thumbnail_id: product.thumbnailId,
          lang: product.lang as any,
          created_at: product.createdAt,
          updated_at: product.updatedAt,
        } as Product)),
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Product Get API Error:', error);
    return NextResponse.json(
      {
        success: true,
        data: [],
      },
      { status: 200 }
    );
  }
}
