import { redirect } from "next/navigation";

import Navigationbar from "@/components/ui/navigation-bar";
import Footer from "@/components/ui/footer";
import { useGetCookies } from "@/hook/useCookie";

export default async function HomeLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const refresh_token = await useGetCookies();

  if (refresh_token) redirect("/home");

  return (
    <div className="bg-gradient-to-b from-hero via-[#1F1C18] to-[#1F1C18]">
      <div className="absolute inset-0 bg-black/50" />
      <Navigationbar />
      {children}
      <Footer />
    </div>
  );
}
