import type { Metadata } from "next";
import "./globals.css";
import ThemeProvider from "@/components/layout/ThemeProvider";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

export const metadata: Metadata = {
  title: "박성욱 — Backend Developer",
  description:
    "박성욱(Park Seonguk)의 포트폴리오. Node.js와 MongoDB 전문 백엔드 개발자로 약 7년간 B2B/B2C 서비스를 개발해온 백엔드 개발자입니다.",
  authors: [{ name: "박성욱 (Park Seonguk)" }],
  metadataBase: new URL("https://park.seong.uk"),
  verification: {
    google: "qI_wbXM6u1pdcLMijR68LVNPvxqkO6eMq9tbHYuoL0g",
  },
  openGraph: {
    type: "website",
    url: "https://park.seong.uk/",
    title: "박성욱 — Backend Developer",
    description:
      "Node.js와 MongoDB 전문 백엔드 개발자 박성욱의 포트폴리오입니다. 약 7년간 B2B/B2C 서비스를 개발해왔습니다.",
    locale: "ko_KR",
    siteName: "박성욱 — Backend Developer",
  },
  twitter: {
    card: "summary",
    title: "박성욱 — Backend Developer",
    description:
      "Node.js와 MongoDB 전문 백엔드 개발자 박성욱의 포트폴리오입니다. 약 7년간 B2B/B2C 서비스를 개발해왔습니다.",
  },
  icons: {
    icon: { url: "/favicon.svg", type: "image/svg+xml" },
  },
  alternates: {
    canonical: "https://park.seong.uk/",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" data-theme="dark" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){var s;try{s=localStorage.getItem('psu-theme')}catch(_){}var m=window.matchMedia&&window.matchMedia('(prefers-color-scheme: light)').matches?'light':'dark';document.documentElement.setAttribute('data-theme',s||m)})()`,
          }}
        />
      </head>
      <body className="font-sans antialiased">
        <ThemeProvider>
          <Header />
          {children}
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
