/**
 * 토스페이먼츠 결제 취소 API
 */

import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const { paymentKey, cancelReason, cancelAmount } = await req.json();

    if (!paymentKey || !cancelReason) {
      return NextResponse.json(
        { success: false, error: "취소 정보가 올바르지 않습니다." },
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

    const body: Record<string, unknown> = { cancelReason };
    if (cancelAmount) body.cancelAmount = cancelAmount;

    const response = await fetch(
      `https://api.tosspayments.com/v1/payments/${paymentKey}/cancel`,
      {
        method: "POST",
        headers: {
          Authorization: `Basic ${encoded}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      console.error("Toss cancel error:", data);
      return NextResponse.json(
        { success: false, error: data.message || "결제 취소에 실패했습니다." },
        { status: response.status }
      );
    }

    return NextResponse.json({ success: true, data });
  } catch (err) {
    console.error("Payment cancel error:", err);
    return NextResponse.json(
      { success: false, error: "결제 취소 중 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}
