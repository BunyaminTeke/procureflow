// // middleware.ts
// import { NextResponse } from "next/server";
// import type { NextRequest } from "next/server";
// import jwt from "jsonwebtoken";

// export function middleware(req: NextRequest) {
//   const token = req.cookies.get("token")?.value;

//   if (!token) {
//     return NextResponse.redirect(new URL("/login", req.url));
//   }

//   try {
//     const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as {
//       role: string;
//     };

//     const pathname = req.nextUrl.pathname;

//     // 🔒 Route bazlı erişim kontrolü
//     if (pathname.startsWith("/admin") && decoded.role !== "ADMIN") {
//       return NextResponse.redirect(new URL("/unauthorized", req.url));
//     }

//     if (pathname.startsWith("/manager") && decoded.role !== "MANAGER") {
//       return NextResponse.redirect(new URL("/unauthorized", req.url));
//     }

//     if (pathname.startsWith("/employee") && decoded.role !== "EMPLOYEE") {
//       return NextResponse.redirect(new URL("/unauthorized", req.url));
//     }

//     if (pathname.startsWith("/warehouse") && decoded.role !== "WAREHOUSE") {
//       return NextResponse.redirect(new URL("/unauthorized", req.url));
//     }

//     return NextResponse.next();
//   } catch (err) {
//     console.error("JWT doğrulama hatası:", err);
//     return NextResponse.redirect(new URL("/login", req.url));
//   }
// }

// export const config = {
//   matcher: ["/admin/:path*", "/manager/:path*", "/employee/:path*", "/warehouse/:path*"],
// };

// middleware.ts (basitleştirilmiş)
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const token = req.cookies.get("token")?.value;

  if (!token) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // ⚠️ jwt.verify yerine sadece token var mı kontrol ediyoruz
  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/manager/:path*", "/employee/:path*", "/warehouse/:path*"],
};
