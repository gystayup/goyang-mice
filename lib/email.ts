import nodemailer from 'nodemailer';
import type { Booking, Inquiry } from '@/lib/database';

/**
 * Email 서비스
 * 예약 확인, 문의 접수 등의 이메일 발송
 */

// Nodemailer 트랜스포터 설정
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: Number(process.env.EMAIL_PORT),
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

/**
 * 이메일 발송
 */
async function sendEmail(options: EmailOptions) {
  try {
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASSWORD) {
      console.warn('Email service not configured. Skipping email send.');
      return { success: true, message: 'Email service not configured' };
    }

    const result = await transporter.sendMail({
      from: process.env.EMAIL_FROM || 'noreply@goyangmice.kr',
      to: options.to,
      subject: options.subject,
      html: options.html,
      cc: options.cc,
      bcc: options.bcc,
    });

    console.log('Email sent:', result.messageId);
    return { success: true, messageId: result.messageId };
  } catch (error) {
    console.error('Email send error:', error);
    return { success: false, error };
  }
}

/**
 * 예약 확인 이메일 템플릿
 */
function bookingConfirmationTemplate(booking: any): string {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8">
        <style>
          body { font-family: Arial, sans-serif; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background-color: #1e293b; color: white; padding: 20px; border-radius: 8px 8px 0 0; }
          .content { background-color: #f1f5f9; padding: 20px; border-radius: 0 0 8px 8px; }
          .info-row { margin: 10px 0; }
          .label { font-weight: bold; color: #475569; }
          .value { color: #1e293b; margin-left: 10px; }
          .button { background-color: #0f172a; color: white; padding: 10px 20px; border-radius: 4px; text-decoration: none; display: inline-block; margin-top: 20px; }
          .footer { text-align: center; margin-top: 20px; font-size: 12px; color: #94a3b8; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>고양 DMC - 예약 확인</h1>
          </div>
          <div class="content">
            <p>안녕하세요, ${booking.customerName}님!</p>
            <p>고양 DMC 예약이 접수되었습니다.</p>

            <div class="info-row">
              <span class="label">예약번호:</span>
              <span class="value">${booking.bookingNo}</span>
            </div>
            <div class="info-row">
              <span class="label">상품명:</span>
              <span class="value">${booking.productName}</span>
            </div>
            <div class="info-row">
              <span class="label">이용일:</span>
              <span class="value">${booking.bookingDate}</span>
            </div>
            <div class="info-row">
              <span class="label">인원:</span>
              <span class="value">${booking.guestCount}명</span>
            </div>
            <div class="info-row">
              <span class="label">상태:</span>
              <span class="value">${booking.status}</span>
            </div>

            <a href="https://goyangmice.kr/bookings/${booking.bookingNo}" class="button">예약 상세보기</a>

            <p style="margin-top: 30px;">
              예배 관련 문의사항은 언제든 연락주시기 바랍니다.<br>
              이메일: info@goyangmice.kr<br>
              전화: 031-XXXX-XXXX
            </p>
          </div>
          <div class="footer">
            <p>© 2026 Goyang DMC. All rights reserved.</p>
          </div>
        </div>
      </body>
    </html>
  `;
}

/**
 * 문의 접수 이메일 템플릿
 */
function inquiryConfirmationTemplate(inquiry: any): string {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8">
        <style>
          body { font-family: Arial, sans-serif; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background-color: #1e293b; color: white; padding: 20px; border-radius: 8px 8px 0 0; }
          .content { background-color: #f1f5f9; padding: 20px; border-radius: 0 0 8px 8px; }
          .info-row { margin: 10px 0; }
          .label { font-weight: bold; color: #475569; }
          .value { color: #1e293b; margin-left: 10px; }
          .button { background-color: #0f172a; color: white; padding: 10px 20px; border-radius: 4px; text-decoration: none; display: inline-block; margin-top: 20px; }
          .footer { text-align: center; margin-top: 20px; font-size: 12px; color: #94a3b8; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>고양 DMC - 문의 접수</h1>
          </div>
          <div class="content">
            <p>안녕하세요, ${inquiry.contactName}님!</p>
            <p>고양 DMC로 문의해주셔서 감사합니다.</p>
            <p>귀하의 문의는 성공적으로 접수되었으며, 빠른 시일 내에 담당자가 연락을 드리겠습니다.</p>

            <div class="info-row">
              <span class="label">문의 유형:</span>
              <span class="value">${inquiry.inquiryType}</span>
            </div>
            <div class="info-row">
              <span class="label">제목:</span>
              <span class="value">${inquiry.subject || '(없음)'}</span>
            </div>
            <div class="info-row">
              <span class="label">접수일시:</span>
              <span class="value">${new Date().toLocaleString('ko-KR')}</span>
            </div>

            <p style="margin: 20px 0; padding: 15px; background-color: white; border-left: 4px solid #0f172a;">
              <strong>귀하의 문의 내용:</strong><br>
              ${inquiry.message}
            </p>

            <p style="margin-top: 30px;">
              추가 문의사항이나 급할 경우 직접 연락주시기 바랍니다.<br>
              이메일: info@goyangmice.kr<br>
              전화: 031-XXXX-XXXX
            </p>
          </div>
          <div class="footer">
            <p>© 2026 Goyang DMC. All rights reserved.</p>
          </div>
        </div>
      </body>
    </html>
  `;
}

/**
 * 관리자 알림 이메일 템플릿
 */
function adminNotificationTemplate(type: 'booking' | 'inquiry', data: any): string {
  const isBooking = type === 'booking';
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8">
        <style>
          body { font-family: Arial, sans-serif; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background-color: #ea580c; color: white; padding: 15px; border-radius: 8px 8px 0 0; }
          .content { background-color: #fff7ed; padding: 20px; border-radius: 0 0 8px 8px; }
          .info-row { margin: 8px 0; }
          .badge { background-color: #ea580c; color: white; padding: 4px 8px; border-radius: 4px; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>${isBooking ? '새 예약' : '새 문의'} 알림</h1>
          </div>
          <div class="content">
            ${isBooking 
              ? `
                <div class="info-row"><strong>예약번호:</strong> ${data.bookingNo}</div>
                <div class="info-row"><strong>고객명:</strong> ${data.customerName}</div>
                <div class="info-row"><strong>상품:</strong> ${data.productName}</div>
                <div class="info-row"><strong>이용일:</strong> ${data.bookingDate}</div>
                <div class="info-row"><strong>인원:</strong> ${data.guestCount}명</div>
                <div class="info-row"><strong>이메일:</strong> ${data.email}</div>
                <div class="info-row"><strong>전화:</strong> ${data.phone}</div>
              `
              : `
                <div class="info-row"><strong>유형:</strong> <span class="badge">${data.inquiryType}</span></div>
                <div class="info-row"><strong>이름:</strong> ${data.contactName}</div>
                <div class="info-row"><strong>제목:</strong> ${data.subject || '(없음)'}</div>
                <div class="info-row"><strong>메시지:</strong></div>
                <div style="background-color: white; padding: 10px; margin: 10px 0; border-left: 4px solid #ea580c;">
                  ${data.message}
                </div>
              `
            }
          </div>
        </div>
      </body>
    </html>
  `;
}

/**
 * 예약 확인 이메일 발송
 */
export async function sendBookingConfirmation(booking: any) {
  return sendEmail({
    to: booking.email,
    subject: `[고양 DMC] 예약 확인 - ${booking.bookingNo}`,
    html: bookingConfirmationTemplate(booking),
  });
}

/**
 * 문의 접수 이메일 발송
 */
export async function sendInquiryConfirmation(inquiry: any) {
  return sendEmail({
    to: inquiry.email,
    subject: '[고양 DMC] 문의 접수 완료',
    html: inquiryConfirmationTemplate(inquiry),
  });
}

/**
 * 관리자 알림 이메일 발송
 */
export async function sendAdminNotification(type: 'booking' | 'inquiry', data: any) {
  return sendEmail({
    to: process.env.EMAIL_FROM || 'admin@goyangmice.kr',
    subject: `[고양 DMC 관리자] 새 ${type === 'booking' ? '예약' : '문의'}`,
    html: adminNotificationTemplate(type, data),
  });
}
