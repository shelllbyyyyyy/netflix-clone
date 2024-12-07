import ChooseProfileModal from "@/components/features/user/component/choose-profile-modal";
import ModalProvider from "@/components/provider/modal-provider";

export default async function HomeLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ModalProvider>
      {children}
      <ChooseProfileModal />
    </ModalProvider>
  );
}
