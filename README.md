# 고양 문화관광·MICE 연구소 & DMC 웹사이트

고양 문화관광·MICE 연구소의 공식 웹사이트입니다. 연구와 실행의 융합을 통해 고양시를 글로벌 MICE 허브로 만들어가는 전문 플랫폼입니다.

## 🚀 주요 기능

### 연구소 서비스
- **문화관광 정책연구**: 고양시 문화관광 자원과 정책 환경 분석
- **MICE 전략연구**: KINTEX 중심 전시·컨벤션·이벤트 산업 생태계 분석
- **도시브랜딩 연구**: 고양 도시 정체성과 브랜드 자산 발굴
- **축제·이벤트 연구**: 지역 축제 기획·운영·평가 방법론 연구

### DMC 서비스
- **국제회의·포럼 운영**: 학회, 협회, 공공포럼, 국제회의 기획·운영
- **기업행사 운영**: 기업 세미나, 브랜드 행사, 리더십 프로그램
- **인센티브투어**: 포상관광, VIP 초청 프로그램, 프리미엄 로컬체험
- **팸투어·시찰 프로그램**: 바이어, 언론, 관계기관 방문단 시찰
- **VIP 의전 서비스**: 교통, 숙박, 안내, 통역, 동선관리

### 상품 서비스
- **전시·회의 연계 비즈니스 스테이**: KINTEX 참가자 및 방문단 숙박
- **고양 문화예술 반일 체험 코스**: 공연·전시·로컬 콘텐츠 결합 프로그램
- **KINTEX 연계 시티투어 프로그램**: 주요 명소 효율적 연결 1일 투어
- **VIP 맞춤형 프리미엄 일정**: 의전, 숙박, 교통, 체험, 만찬 결합

## 🛠 기술 스택

- **Frontend**: Next.js 16 (App Router), React 19, TypeScript
- **Styling**: Tailwind CSS 4
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: NextAuth.js
- **Email**: Nodemailer
- **Internationalization**: next-intl (한국어, 영어, 일본어, 중국어 간체/번체)
- **Deployment**: Vercel

## 📦 설치 및 실행

### 사전 요구사항
- Node.js 18+
- PostgreSQL
- npm 또는 yarn

### 설치 단계

1. **레포지토리 클론**
```bash
git clone https://github.com/your-username/goyang-mice-nextjs.git
cd goyang-mice-nextjs
```

2. **의존성 설치**
```bash
npm install
```

3. **환경 변수 설정**
`.env.local` 파일을 생성하고 다음 변수를 설정하세요:
```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/goyang_mice"

# Authentication
NEXTAUTH_SECRET=your-nextauth-secret-key
NEXTAUTH_URL=http://localhost:3000

# Email
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
EMAIL_FROM=noreply@goyangmice.kr
```

4. **데이터베이스 설정**
```bash
# Prisma 클라이언트 생성
npm run prisma:generate

# 데이터베이스 마이그레이션
npm run prisma:migrate

# (선택) Prisma Studio로 데이터 확인
npm run prisma:studio
```

5. **개발 서버 실행**
```bash
npm run dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000)을 열어 확인하세요.

## 📁 프로젝트 구조

```
goyang-mice-nextjs/
├── app/                          # Next.js App Router
│   ├── [locale]/                # 다국어 라우팅
│   ├── admin/                   # 관리자 페이지
│   ├── api/                     # API 엔드포인트
│   ├── contact/                 # 문의 페이지
│   ├── dmc/                     # DMC 서비스 페이지
│   ├── institute/               # 연구소 소개 페이지
│   ├── products/                # 상품 페이지
│   ├── research/                # 연구 분야 페이지
│   └── news/                    # 뉴스 페이지
├── components/                  # 재사용 컴포넌트
├── i18n/                        # 다국어 설정
├── lib/                         # 유틸리티 및 설정
├── messages/                    # 다국어 메시지 파일
├── prisma/                      # 데이터베이스 스키마
└── public/                      # 정적 파일
```

## 🌐 다국어 지원

- 한국어 (ko)
- 영어 (en)
- 일본어 (ja)
- 중국어 간체 (zh-CN)
- 중국어 번체 (zh-TW)

URL 패턴: `/{locale}/page`

## 🔐 관리자 기능

관리자 계정으로 로그인하여 다음 기능을 사용할 수 있습니다:

- **예약 관리**: 상품 예약 현황 조회 및 관리
- **문의 관리**: 고객 문의 접수 및 처리
- **상품 관리**: DMC 상품 정보 관리
- **사용자 관리**: 시스템 사용자 관리

관리자 로그인: `/admin/login`

## 📧 이메일 알림

다음 이벤트 발생 시 자동 이메일 알림이 발송됩니다:

- 새 예약 접수
- 예약 상태 변경
- 고객 문의 접수
- 관리자 알림

## 🚀 배포

### Vercel 배포 (권장)

1. [Vercel](https://vercel.com)에 가입
2. 프로젝트를 Vercel에 연결
3. 환경 변수 설정
4. 배포 실행

### 기타 플랫폼

- **Netlify**: `npm run build` 후 dist 폴더 배포
- **Railway**: PostgreSQL + Node.js 지원
- **Render**: 유사한 설정으로 배포 가능

## 📄 라이선스

이 프로젝트는 MIT 라이선스를 따릅니다.

## 📞 문의

- **웹사이트**: [www.goyang-mice.kr](https://www.goyang-mice.kr)
- **이메일**: contact@goyang-mice.kr
- **전화**: 031-000-0000
- **주소**: 경기도 고양시 일산서구 킨텍스로 217-60

---

**고양 문화관광·MICE 연구소 & 부설 고양 DMC센터**
*연구와 실행의 융합으로 글로벌 MICE 허브를 실현합니다.*
