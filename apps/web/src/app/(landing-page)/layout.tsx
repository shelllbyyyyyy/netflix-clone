import Navigationbar from "@/components/ui/navigation-bar";
import Footer from "@/components/ui/footer";

export default function HomeLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Navigationbar />
      {children}
      <Footer />
    </>
  );
}
