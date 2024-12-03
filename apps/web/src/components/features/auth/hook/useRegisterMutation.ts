import defaultAxios, { AxiosPromise } from "axios";
import { useMutation } from "@tanstack/react-query";

import { ApiFn, MutationConfig } from "@/lib/react-query";
import { useApiClient } from "@/components/provider/api-client-provider";
import { ApiResponse } from "@/lib/api-response";
import { RegisterFormSchema } from "../types";

const register: ApiFn<
  RegisterFormSchema,
  AxiosPromise<ApiResponse<null>>
> = async (registerFormSchema, { axios = defaultAxios }) => {
  const result = await axios.post("/api/auth/register", registerFormSchema);

  return result;
};

type MutationFnType = typeof register;

export const useRegisterMutation = (
  config: MutationConfig<MutationFnType> = {}
) => {
  const { axios } = useApiClient();

  return useMutation({
    mutationFn: (body) => register(body, { axios }),
    ...config,
  });
};
