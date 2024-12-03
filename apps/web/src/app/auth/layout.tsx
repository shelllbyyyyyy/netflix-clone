import { redirect } from "next/navigation";

import LoginFooter from "./_component/footer";
import Navigationbar from "./_component/navigation-bar";
import { useGetCookies } from "@/hook/useCookie";

export default async function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const refresh_token = await useGetCookies();

  if (refresh_token) {
    redirect("/home");
  }

  return (
    <div
      className="relative h-full bg-center bg-cover"
      style={{
        backgroundImage: "url('/assets/background-login.jpg')",
      }}
    >
      <div className="absolute inset-0 lg:bg-black/50 bg-black" />
      <Navigationbar />
      {children}
      <LoginFooter />
    </div>
  );
}
