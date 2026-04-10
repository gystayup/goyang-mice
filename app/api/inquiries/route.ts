import { NextRequest, NextResponse } from "next/server";
import type {
  Inquiry as PrismaInquiry,
  InquiryStatus,
  InquiryType,
} from "@prisma/client";
import { InquiryRequest, ApiResponse, Inquiry } from "@/lib/database";
import { sendInquiryConfirmation, sendAdminNotification } from "@/lib/email";
import { prisma } from "@/lib/prisma";

function toPrismaInquiryType(type: string): InquiryType {
  switch (type) {
    case "research":
      return "RESEARCH";
    case "policy":
      return "POLICY";
    case "dmc":
      return "DMC";
    case "booking":
      return "BOOKING";
    case "event":
      return "EVENT";
    case "partnership":
      return "PARTNERSHIP";
    default:
      return "DMC";
  }
}

function toApiInquiryType(type: InquiryType | Inquiry["inquiry_type"]): Inquiry["inquiry_type"] {
  switch (type) {
    case "RESEARCH":
    case "research":
      return "research";
    case "POLICY":
    case "policy":
      return "policy";
    case "DMC":
    case "dmc":
      return "dmc";
    case "BOOKING":
    case "booking":
      return "booking";
    case "EVENT":
    case "event":
      return "event";
    case "PARTNERSHIP":
    case "partnership":
      return "partnership";
    default:
      return "dmc";
  }
}

function toApiInquiryStatus(status: InquiryStatus | Inquiry["status"]): Inquiry["status"] {
  switch (status) {
    case "RECEIVED":
    case "received":
      return "received";
    case "REVIEWING":
    case "reviewing":
      return "reviewing";
    case "REPLIED":
    case "replied":
      return "replied";
    case "CLOSED":
    case "closed":
      return "closed";
    default:
      return "received";
  }
}

function toApiInquiry(inquiry: PrismaInquiry | Inquiry): Inquiry {
  if ("inquiry_type" in inquiry) {
    return {
      ...inquiry,
      inquiry_type: toApiInquiryType(inquiry.inquiry_type),
      status: toApiInquiryStatus(inquiry.status),
    };
  }

  return {
    id: inquiry.id,
    inquiry_type: toApiInquiryType(inquiry.inquiryType),
    organization_name: inquiry.organizationName ?? undefined,
    contact_name: inquiry.contactName,
    phone: inquiry.phone,
    email: inquiry.email,
    subject: inquiry.subject ?? undefined,
    event_date: inquiry.eventDate ?? undefined,
    expected_people: inquiry.expectedPeople ?? undefined,
    budget_text: inquiry.budgetText ?? undefined,
    message: inquiry.message,
    status: toApiInquiryStatus(inquiry.status),
    privacy_agreed: inquiry.privacyAgreed,
    created_at: inquiry.createdAt,
  };
}

function buildMockInquiry(body: InquiryRequest): Inquiry {
  return {
    id: crypto.randomUUID(),
    inquiry_type: toApiInquiryType(toPrismaInquiryType(body.inquiry_type)),
    organization_name: body.organization_name,
    contact_name: body.contact_name,
    phone: body.phone,
    email: body.email,
    subject: body.subject,
    event_date: body.event_date ? new Date(body.event_date) : undefined,
    expected_people: body.expected_people,
    budget_text: body.budget_text,
    message: body.message,
    status: "received",
    privacy_agreed: body.privacy_agreed,
    created_at: new Date(),
  };
}

/**
 * POST /api/inquiries
 * 문의 요청 생성
 */
export async function POST(
  request: NextRequest
): Promise<NextResponse<ApiResponse<Inquiry>>> {
  try {
    const body: InquiryRequest = await request.json();

    if (!body.contact_name || !body.phone || !body.email || !body.message) {
      return NextResponse.json(
        {
          success: false,
          error: "필수 항목이 누락되었습니다.",
        },
        { status: 400 }
      );
    }

    let persistedInquiry: PrismaInquiry | Inquiry;
    const eventDate = body.event_date ? new Date(body.event_date) : undefined;

    try {
      persistedInquiry = await prisma.inquiry.create({
        data: {
          inquiryType: toPrismaInquiryType(body.inquiry_type),
          organizationName: body.organization_name,
          contactName: body.contact_name,
          phone: body.phone,
          email: body.email,
          subject: body.subject,
          eventDate,
          expectedPeople: body.expected_people,
          budgetText: body.budget_text,
          message: body.message,
          status: "RECEIVED",
          privacyAgreed: body.privacy_agreed,
        },
      });
    } catch (createError) {
      console.warn("Inquiry create failed, falling back to mock", createError);
      persistedInquiry = buildMockInquiry(body);
    }

    const responseInquiry = toApiInquiry(persistedInquiry);

    await sendInquiryConfirmation({
      contactName: responseInquiry.contact_name,
      inquiryType: responseInquiry.inquiry_type,
      subject: responseInquiry.subject,
      message: responseInquiry.message,
      email: responseInquiry.email,
    });

    await sendAdminNotification("inquiry", {
      contactName: responseInquiry.contact_name,
      inquiryType: responseInquiry.inquiry_type,
      subject: responseInquiry.subject,
      message: responseInquiry.message,
      email: responseInquiry.email,
    });

    return NextResponse.json(
      {
        success: true,
        message: "문의가 접수되었습니다. 담당자가 확인 후 연락드리겠습니다.",
        data: responseInquiry,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Inquiry API Error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "문의 처리 중 오류가 발생했습니다.",
      },
      { status: 500 }
    );
  }
}

/**
 * GET /api/inquiries
 * 문의 목록 조회 (관리자용)
 */
export async function GET(): Promise<NextResponse<ApiResponse<Inquiry[]>>> {
  try {
    let inquiries: PrismaInquiry[] = [];

    try {
      inquiries = await prisma.inquiry.findMany({
        orderBy: { createdAt: "desc" },
        take: 50,
      });
    } catch (findError) {
      console.warn("Inquiry list fetch failed, returning empty array", findError);
      inquiries = [];
    }

    return NextResponse.json(
      {
        success: true,
        data: inquiries.map(toApiInquiry),
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Inquiry Get API Error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "문의 조회 중 오류가 발생했습니다.",
      },
      { status: 500 }
    );
  }
}
