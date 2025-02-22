import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
    const response = NextResponse.next();

    // CORS 헤더 설정
    response.headers.set('Access-Control-Allow-Origin', '*');
    // response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    // response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    // OPTIONS 메서드 처리 (Preflight 요청)
    if (req.method === 'OPTIONS') {
        return new NextResponse(null, { status: 200 });
    }

    return response;
}

// 특정 경로에만 미들웨어 적용
export const config = {
    matcher: '/api/:path*', // API 라우트에만 적용
};