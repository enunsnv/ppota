import type { Metadata } from "next";
import "./globals.css";
import Script from "next/script";
import { Providers } from "./providers";

export const metadata: Metadata = {
  title: "뽀타 (Potta)",

  description:
    "시간 감각을 직관적으로 보여주는 ADHD 맞춤 60분 시각적 타이머 뽀타(Potta). 시간 블라인드니스 극복, 집중력 향상, 시험 공부 및 업무 몰입을 위한 다국어(한국어, 영어, 일본어) 무료 타이머.",

  keywords: [
    "ADHD 타이머",
    "ADHD 집중 도구",
    "시각적 타이머",
    "타임 블라인드니스",
    "Time Timer",
    "구글 타이머",
    "뽀모도로 타이머",
    "뽀타",
    "Potta",
    "공부 타이머",
    "몰입 타이머",
  ],

  icons: {
    icon: "/icon",
  },

  openGraph: {
    title: "뽀타 (Potta) - ADHD와 타임 블라인드니스를 위한 시각 타이머",
    description:
      "남은 시간이 눈으로 직관적으로 보이는 60분 타이머. 지금 바로 집중력을 시작하세요.",
    url: "https://potta.app",
    siteName: "Potta Timer",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "뽀타 ADHD 시각 타이머",
      },
    ],
    locale: "ko_KR",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <head>
        {" "}
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-5178512088906089"
          crossOrigin="anonymous"
        ></script>
      </head>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
