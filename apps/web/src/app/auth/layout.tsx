import LoginFooter from "./_component/footer";
import Navigationbar from "./_component/navigation-bar";

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
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
