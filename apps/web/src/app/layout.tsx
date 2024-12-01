import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

import Navigationbar from "@/components/ui/navigation-bar";
import { ThemeProvider } from "@/components/provider/theme-provider";
import Footer from "@/components/ui/footer";
import MyProvider from "@/components/provider/my-provider";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
});

export const metadata: Metadata = {
  title: "Netflix Clone",
  description: "Made by shelllbyyyyy",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} relative`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <MyProvider>{children}</MyProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
