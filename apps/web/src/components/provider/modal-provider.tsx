"use client";

import React, { PropsWithChildren, useEffect } from "react";

import { useGlobalStore } from "@/hook/useGlobalStore";
import { useUserStore } from "../features/user/hook/useUserStore";

interface ModalProviderProps extends PropsWithChildren {}

const ModalProvider: React.FC<ModalProviderProps> = ({ children }) => {
  const { modalOpen, setModalOpen, setModalClosed } = useGlobalStore.getState();
  const { profile, logOutProfile } = useUserStore.getState();

  useEffect(() => {
    if (profile == null) {
      setModalOpen();
    }
  }, [profile, modalOpen]);

  useEffect(() => {
    const handleBeforeUnload = () => {
      setModalClosed();
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [profile, modalOpen]);

  return <>{children}</>;
};

export default ModalProvider;
