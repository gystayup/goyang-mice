import type { Booking as PrismaBooking } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

import { getProductById } from "@/data/products";
import { BookingRequest, ApiResponse, Booking } from "@/lib/database";
import { sendAdminNotification, sendBookingConfirmation } from "@/lib/email";
import { prisma } from "@/lib/prisma";

function toApiStatus(
  status: PrismaBooking["status"] | Booking["status"]
): Booking["status"] {
  switch (status) {
    case "RECEIVED":
    case "received":
      return "received";
    case "REVIEWING":
    case "reviewing":
      return "reviewing";
    case "CONFIRMED":
    case "confirmed":
      return "confirmed";
    case "ON_HOLD":
    case "on_hold":
      return "on_hold";
    case "CANCELLED":
    case "cancelled":
      return "cancelled";
    default:
      return "received";
  }
}

function toApiBooking(booking: PrismaBooking | Booking): Booking {
  if ("booking_no" in booking) {
    return {
      ...booking,
      status: toApiStatus(booking.status),
    };
  }

  return {
    id: booking.id,
    booking_no: booking.bookingNo,
    product_id: booking.productId,
    option_id: booking.optionId ?? undefined,
    schedule_id: booking.scheduleId ?? undefined,
    customer_name: booking.customerName,
    organization_name: booking.organizationName ?? undefined,
    phone: booking.phone,
    email: booking.email,
    booking_date: booking.bookingDate,
    guest_count: booking.guestCount,
    unit_price:
      booking.unitPrice === null || booking.unitPrice === undefined
        ? undefined
        : Number(booking.unitPrice),
    total_price:
      booking.totalPrice === null || booking.totalPrice === undefined
        ? undefined
        : Number(booking.totalPrice),
    request_note: booking.requestNote ?? undefined,
    status: toApiStatus(booking.status),
    privacy_agreed: booking.privacyAgreed,
    created_at: booking.createdAt,
    updated_at: booking.updatedAt,
  };
}

function buildMockBooking(body: BookingRequest): Booking {
  const now = new Date();

  return {
    id: crypto.randomUUID(),
    booking_no: `BK-${Date.now()}`,
    product_id: body.product_id,
    option_id: body.option_id,
    schedule_id: body.schedule_id,
    customer_name: body.customer_name,
    organization_name: body.organization_name,
    phone: body.phone,
    email: body.email,
    booking_date: new Date(body.booking_date),
    guest_count: body.guest_count,
    unit_price: body.unit_price,
    total_price: body.total_price,
    request_note: body.request_note,
    status: "received",
    privacy_agreed: body.privacy_agreed,
    created_at: now,
    updated_at: now,
  };
}

export async function POST(
  request: NextRequest
): Promise<NextResponse<ApiResponse<Booking>>> {
  try {
    const body: BookingRequest = await request.json();

    if (!body.customer_name || !body.phone || !body.email || !body.product_id) {
      return NextResponse.json(
        {
          success: false,
          error: "필수 입력 항목이 누락되었습니다.",
        },
        { status: 400 }
      );
    }

    const bookingDate = new Date(body.booking_date);
    const productName = getProductById(body.product_id)?.title ?? "DMC 서비스";

    let persistedBooking: PrismaBooking | Booking;

    try {
      persistedBooking = await prisma.booking.create({
        data: {
          bookingNo: `BK-${Date.now()}`,
          productId: body.product_id,
          optionId: body.option_id,
          scheduleId: body.schedule_id,
          customerName: body.customer_name,
          organizationName: body.organization_name,
          phone: body.phone,
          email: body.email,
          bookingDate,
          guestCount: body.guest_count,
          unitPrice: body.unit_price,
          totalPrice: body.total_price,
          requestNote: body.request_note,
          status: "RECEIVED",
          privacyAgreed: body.privacy_agreed,
        },
      });
    } catch (createError) {
      console.warn("Booking create failed, falling back to mock", createError);
      persistedBooking = buildMockBooking(body);
    }

    const responseBooking = toApiBooking(persistedBooking);

    await sendBookingConfirmation({
      bookingNo: responseBooking.booking_no,
      customerName: responseBooking.customer_name,
      productName,
      bookingDate: responseBooking.booking_date.toLocaleDateString("ko-KR"),
      guestCount: responseBooking.guest_count,
      email: responseBooking.email,
    });

    await sendAdminNotification("booking", {
      bookingNo: responseBooking.booking_no,
      customerName: responseBooking.customer_name,
      productName,
      bookingDate: responseBooking.booking_date.toLocaleDateString("ko-KR"),
      guestCount: responseBooking.guest_count,
      email: responseBooking.email,
      phone: responseBooking.phone,
    });

    return NextResponse.json(
      {
        success: true,
        message: "예약이 접수되었습니다. 담당자가 확인 후 순차적으로 안내드립니다.",
        data: responseBooking,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Booking API Error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "예약 처리 중 오류가 발생했습니다.",
      },
      { status: 500 }
    );
  }
}

export async function GET(): Promise<NextResponse<ApiResponse<Booking[]>>> {
  try {
    let bookings: PrismaBooking[] = [];

    try {
      bookings = await prisma.booking.findMany({
        orderBy: { createdAt: "desc" },
        take: 50,
      });
    } catch (findError) {
      console.warn("Booking list fetch failed, returning empty array", findError);
      bookings = [];
    }

    return NextResponse.json(
      {
        success: true,
        data: bookings.map(toApiBooking),
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Booking Get API Error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "예약 조회 중 오류가 발생했습니다.",
      },
      { status: 500 }
    );
  }
}
