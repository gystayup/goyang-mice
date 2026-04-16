import nodemailer from 'nodemailer';

/**
 * Email 서비스 — 고양 문화관광·MICE 연구소
 */

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST || 'smtp.gmail.com',
  port: Number(process.env.EMAIL_PORT || 587),
  secure: process.env.EMAIL_PORT === '465',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  cc?: string;
  bcc?: string;
}

async function sendEmail(options: EmailOptions) {
  try {
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASSWORD) {
      console.warn('[Email] 환경변수 미설정 — 이메일 발송 생략');
      return { success: true, message: 'Email service not configured' };
    }

    const result = await transporter.sendMail({
      from: `"고양 문화관광·MICE 연구소" <${process.env.EMAIL_FROM || process.env.EMAIL_USER}>`,
      to: options.to,
      subject: options.subject,
      html: options.html,
      cc: options.cc,
      bcc: options.bcc,
    });

    console.log('[Email] 발송 완료:', result.messageId);
    return { success: true, messageId: result.messageId };
  } catch (error) {
    console.error('[Email] 발송 오류:', error);
    return { success: false, error };
  }
}

// ── 공통 래퍼 스타일 ───────────────────────────────────────────
const BRAND_COLOR = '#0f172a';
const ACCENT_COLOR = '#0ea5e9';

function wrapTemplate(title: string, body: string): string {
  return `<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title>${title}</title>
  <style>
    *{box-sizing:border-box;margin:0;padding:0}
    body{font-family:-apple-system,BlinkMacSystemFont,'Segoe UI','Noto Sans KR',sans-serif;background:#f1f5f9;color:#1e293b}
    .wrap{max-width:600px;margin:32px auto;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,.08)}
    .header{background:${BRAND_COLOR};padding:28px 32px;text-align:center}
    .header h1{color:#fff;font-size:20px;font-weight:800;letter-spacing:-.5px}
    .header p{color:#94a3b8;font-size:12px;margin-top:4px}
    .body{background:#fff;padding:32px}
    .greeting{font-size:15px;line-height:1.8;color:#334155;margin-bottom:20px}
    .card{background:#f8fafc;border:1px solid #e2e8f0;border-radius:12px;padding:20px;margin:20px 0}
    .row{display:flex;justify-content:space-between;align-items:center;padding:8px 0;border-bottom:1px solid #f1f5f9}
    .row:last-child{border-bottom:none}
    .row .label{font-size:12px;font-weight:600;color:#64748b;text-transform:uppercase;letter-spacing:.05em}
    .row .value{font-size:14px;font-weight:700;color:#0f172a}
    .badge{display:inline-block;background:${ACCENT_COLOR};color:#fff;font-size:11px;font-weight:700;padding:3px 10px;border-radius:999px}
    .btn{display:inline-block;background:${BRAND_COLOR};color:#fff;font-weight:700;font-size:14px;padding:12px 28px;border-radius:8px;text-decoration:none;margin-top:20px}
    .notice{background:#fff7ed;border:1px solid #fed7aa;border-radius:10px;padding:14px 16px;font-size:13px;color:#9a3412;margin-top:16px;line-height:1.7}
    .footer{background:#f8fafc;padding:20px 32px;text-align:center;font-size:11px;color:#94a3b8;line-height:1.8;border-top:1px solid #e2e8f0}
    .footer a{color:${ACCENT_COLOR};text-decoration:none}
  </style>
</head>
<body>
  <div class="wrap">
    <div class="header">
      <h1>고양 문화관광·MICE 연구소</h1>
      <p>Goyang Culture Tourism &amp; MICE Institute</p>
    </div>
    <div class="body">${body}</div>
    <div class="footer">
      <p>© 2026 고양 문화관광·MICE 연구소. All rights reserved.</p>
      <p>경기도 고양시 &nbsp;|&nbsp; <a href="mailto:${process.env.EMAIL_FROM || 'info@goyangmice.kr'}">${process.env.EMAIL_FROM || 'info@goyangmice.kr'}</a></p>
      <p style="margin-top:6px;font-size:10px;color:#cbd5e1">본 메일은 발신 전용입니다. 문의는 홈페이지를 이용해 주세요.</p>
    </div>
  </div>
</body>
</html>`;
}

// ── 예약 확인 이메일 ────────────────────────────────────────────
function bookingConfirmationTemplate(booking: {
  bookingNo: string;
  customerName: string;
  productName: string;
  bookingDate: string;
  guestCount: number;
  email: string;
}): string {
  const body = `
    <p class="greeting">안녕하세요, <strong>${booking.customerName}</strong>님!<br>
    고양 문화관광·MICE 연구소 서비스 예약이 정상 접수되었습니다.<br>
    담당자 확인 후 순차적으로 안내드리겠습니다.</p>

    <div class="card">
      <div class="row"><span class="label">예약번호</span><span class="value"><span class="badge">${booking.bookingNo}</span></span></div>
      <div class="row"><span class="label">상품명</span><span class="value">${booking.productName}</span></div>
      <div class="row"><span class="label">이용 예정일</span><span class="value">${booking.bookingDate}</span></div>
      <div class="row"><span class="label">인원</span><span class="value">${booking.guestCount}명</span></div>
      <div class="row"><span class="label">예약자 이메일</span><span class="value">${booking.email}</span></div>
      <div class="row"><span class="label">접수 상태</span><span class="value" style="color:#10b981;font-weight:800">✓ 접수 완료</span></div>
    </div>

    <div class="notice">
      📌 예약 확정 전 담당자가 일정 및 가용 여부를 확인한 후 연락드립니다.<br>
      급한 문의 사항이 있으시면 이메일 또는 홈페이지 문의 채널을 이용해 주세요.
    </div>`;

  return wrapTemplate(`예약 확인 — ${booking.bookingNo}`, body);
}

// ── 문의 접수 확인 이메일 ───────────────────────────────────────
function inquiryConfirmationTemplate(inquiry: {
  contactName: string;
  inquiryType: string;
  subject?: string;
  message: string;
  email: string;
}): string {
  const typeLabels: Record<string, string> = {
    research: '연구용역 문의', policy: '정책협력 문의', dmc: 'DMC 상담',
    booking: '숙박·체험 예약 문의', event: '행사운영 문의', partnership: '협업 제안',
  };
  const typeLabel = typeLabels[inquiry.inquiryType] ?? inquiry.inquiryType;

  const body = `
    <p class="greeting">안녕하세요, <strong>${inquiry.contactName}</strong>님!<br>
    문의해 주셔서 감사합니다. 접수 완료되었으며 빠른 시일 내에 답변 드리겠습니다.</p>

    <div class="card">
      <div class="row"><span class="label">문의 유형</span><span class="value"><span class="badge">${typeLabel}</span></span></div>
      ${inquiry.subject ? `<div class="row"><span class="label">제목</span><span class="value">${inquiry.subject}</span></div>` : ''}
      <div class="row"><span class="label">접수 일시</span><span class="value">${new Date().toLocaleString('ko-KR', { timeZone: 'Asia/Seoul' })}</span></div>
      <div class="row"><span class="label">접수 상태</span><span class="value" style="color:#10b981;font-weight:800">✓ 접수 완료</span></div>
    </div>

    <div style="background:#f8fafc;border-left:4px solid ${BRAND_COLOR};border-radius:0 8px 8px 0;padding:14px 16px;margin:16px 0;font-size:13px;line-height:1.8;color:#334155">
      <strong style="display:block;margin-bottom:6px;color:#64748b;font-size:11px;text-transform:uppercase;letter-spacing:.05em">접수된 문의 내용</strong>
      ${inquiry.message.replace(/\n/g, '<br>')}
    </div>`;

  return wrapTemplate('문의 접수 완료', body);
}

// ── 관리자 알림 이메일 ─────────────────────────────────────────
function adminNotificationTemplate(
  type: 'booking' | 'inquiry',
  data: Record<string, string | number>
): string {
  const isBooking = type === 'booking';
  const body = `
    <p class="greeting" style="font-size:16px;font-weight:700;color:#0f172a">
      ${isBooking ? '🛎️ 새 예약이 접수되었습니다' : '📨 새 문의가 접수되었습니다'}
    </p>
    <div class="card">
      ${isBooking ? `
        <div class="row"><span class="label">예약번호</span><span class="value"><span class="badge">${data.bookingNo}</span></span></div>
        <div class="row"><span class="label">고객명</span><span class="value">${data.customerName}</span></div>
        <div class="row"><span class="label">상품</span><span class="value">${data.productName}</span></div>
        <div class="row"><span class="label">이용일</span><span class="value">${data.bookingDate}</span></div>
        <div class="row"><span class="label">인원</span><span class="value">${data.guestCount}명</span></div>
        <div class="row"><span class="label">이메일</span><span class="value">${data.email}</span></div>
        <div class="row"><span class="label">전화</span><span class="value">${data.phone}</span></div>
      ` : `
        <div class="row"><span class="label">이름</span><span class="value">${data.contactName}</span></div>
        <div class="row"><span class="label">문의 유형</span><span class="value">${data.inquiryType}</span></div>
        ${data.subject ? `<div class="row"><span class="label">제목</span><span class="value">${data.subject}</span></div>` : ''}
        <div class="row"><span class="label">이메일</span><span class="value">${data.email}</span></div>
      `}
    </div>
    ${!isBooking && data.message ? `
    <div style="background:#fff7ed;border:1px solid #fed7aa;border-radius:10px;padding:14px 16px;font-size:13px;color:#7c2d12;margin-top:8px;line-height:1.8">
      <strong>문의 내용:</strong><br>${String(data.message).replace(/\n/g, '<br>')}
    </div>` : ''}
    <a href="${process.env.NEXT_PUBLIC_SITE_URL || 'https://goyang-mice.vercel.app'}/ko/admin" class="btn">관리자 페이지에서 확인하기 →</a>`;

  return wrapTemplate(isBooking ? '새 예약 알림' : '새 문의 알림', body);
}

// ── Public API ────────────────────────────────────────────────
export async function sendBookingConfirmation(booking: {
  bookingNo: string;
  customerName: string;
  productName: string;
  bookingDate: string;
  guestCount: number;
  email: string;
}) {
  return sendEmail({
    to: booking.email,
    subject: `[고양 MICE] 예약 접수 완료 — ${booking.bookingNo}`,
    html: bookingConfirmationTemplate(booking),
  });
}

export async function sendInquiryConfirmation(inquiry: {
  contactName: string;
  inquiryType: string;
  subject?: string;
  message: string;
  email: string;
}) {
  return sendEmail({
    to: inquiry.email,
    subject: '[고양 MICE] 문의가 접수되었습니다',
    html: inquiryConfirmationTemplate(inquiry),
  });
}

export async function sendAdminNotification(
  type: 'booking' | 'inquiry',
  data: Record<string, string | number>
) {
  const adminEmail =
    process.env.ADMIN_EMAIL ||
    process.env.EMAIL_FROM ||
    process.env.EMAIL_USER ||
    '';

  if (!adminEmail) return { success: false, error: 'ADMIN_EMAIL not set' };

  return sendEmail({
    to: adminEmail,
    subject: `[고양 MICE 관리자] 새 ${type === 'booking' ? '예약' : '문의'} 알림`,
    html: adminNotificationTemplate(type, data),
  });
}
