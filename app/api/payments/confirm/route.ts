/**
 * 토스페이먼츠 결제 승인 API
 * 프론트엔드에서 결제 완료 후 paymentKey, orderId, amount를 전송하면 최종 승인 처리
 *
 * 사전 준비:
 * 1. https://developers.tosspayments.com 에서 가입 후 시크릿 키 발급
 * 2. .env.local 에 TOSS_SECRET_KEY=test_sk_xxxxx 추가
 */

import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const { paymentKey, orderId, amount } = await req.json();

    if (!paymentKey || !orderId || !amount) {
      return NextResponse.json(
        { success: false, error: "결제 정보가 올바르지 않습니다." },
        { status: 400 }
      );
    }

    const secretKey = process.env.TOSS_SECRET_KEY;
    if (!secretKey) {
      return NextResponse.json(
        { success: false, error: "결제 서비스가 준비되지 않았습니다." },
        { status: 503 }
      );
    }

    const encoded = Buffer.from(`${secretKey}:`).toString("base64");

    const response = await fetch(
      "https://api.tosspayments.com/v1/payments/confirm",
      {
        method: "POST",
        headers: {
          Authorization: `Basic ${encoded}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ paymentKey, orderId, amount }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      console.error("Toss confirm error:", data);
      return NextResponse.json(
        { success: false, error: data.message || "결제 승인에 실패했습니다." },
        { status: response.status }
      );
    }

    // TODO: DB에 결제 내역 저장
    // await prisma.payment.create({ data: { orderId, amount, status: 'PAID', ... } });

    return NextResponse.json({ success: true, data });
  } catch (err) {
    console.error("Payment confirm error:", err);
    return NextResponse.json(
      { success: false, error: "결제 처리 중 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}
