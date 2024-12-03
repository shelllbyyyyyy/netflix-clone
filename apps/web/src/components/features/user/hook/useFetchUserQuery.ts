import defaultAxios, { AxiosPromise } from "axios";
import { useQuery } from "@tanstack/react-query";

import { ApiFn, ExtractFnReturnType, QueryConfig } from "@/lib/react-query";
import { useApiClient } from "@/components/provider/api-client-provider";
import { ApiResponse } from "@/lib/api-response";
import { UserResponse } from "../types/user-response";

export const fetchUser: ApiFn<
  {},
  AxiosPromise<ApiResponse<UserResponse[]>>
> = async ({}, { axios = defaultAxios }) => {
  const result = await axios.get("/api/users");

  return result;
};

type QueryFnType = typeof fetchUser;

type UseFetchUserQueryOptions = {
  config?: QueryConfig<QueryFnType>;
};

export const useFetchUserQuery = ({ config }: UseFetchUserQueryOptions) => {
  const { axios } = useApiClient();

  return useQuery<ExtractFnReturnType<QueryFnType>>({
    queryKey: ["fetchUser"],
    queryFn: () => fetchUser({}, { axios }),
    retry: 1,
    staleTime: 5000,
    ...config,
  });
};
