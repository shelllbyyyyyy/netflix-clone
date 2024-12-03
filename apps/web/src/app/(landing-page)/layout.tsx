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
    <>
      <Navigationbar />
      {children}
      <Footer />
    </>
  );
}
