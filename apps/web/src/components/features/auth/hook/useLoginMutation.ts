import defaultAxios, { AxiosPromise } from "axios";
import { useMutation } from "@tanstack/react-query";

import { ApiFn, MutationConfig } from "@/lib/react-query";
import { useApiClient } from "@/components/provider/api-client-provider";
import { ApiResponse } from "@/lib/api-response";
import { LoginFormSchema } from "../types";

const login: ApiFn<LoginFormSchema, AxiosPromise<ApiResponse<null>>> = async (
  loginFormSchema,
  { axios = defaultAxios }
) => {
  const result = await axios.post("/api/auth/login", loginFormSchema);

  return result;
};

type MutationFnType = typeof login;

export const useLoginMutation = (
  config: MutationConfig<MutationFnType> = {}
) => {
  const { axios } = useApiClient();

  return useMutation({
    mutationFn: (body) => login(body, { axios }),
    ...config,
  });
};
