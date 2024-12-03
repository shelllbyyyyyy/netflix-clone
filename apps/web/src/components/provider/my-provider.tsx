"use client";

import React from "react";

import { QueryClientProvider } from "@tanstack/react-query";

import { ApiClientProvider } from "./api-client-provider";

import { AxiosManager } from "@/lib/axios";
import { queryClient } from "@/lib/react-query";

type MyProviderProps = {
  children: React.ReactNode;
};

const axiosManager = new AxiosManager();

const MyProvider = ({ children }: MyProviderProps) => {
  return (
    <ApiClientProvider axiosInstance={axiosManager.axios}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </ApiClientProvider>
  );
};

export default MyProvider;
