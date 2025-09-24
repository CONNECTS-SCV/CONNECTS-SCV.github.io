import type { Metadata } from "next";
import { Footer } from "@/components/layout/Footer";
import Header from "@/components/layout/Header";
import "./globals.css";

const metadata: Metadata = {
  title: "TossTech",
  description: "TossTech Blog",
};

export { metadata };

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body>
        <div className="w-full max-w-[1000px] h-full min-h-screen mx-auto">
          <div className="w-full max-w-[1000px] fixed top-0">
            <Header />
          </div>
          <div className="pt-[60px]">{children}</div>
        </div>
        <Footer />
      </body>
    </html>
  );
}
