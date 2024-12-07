import defaultAxios, { AxiosPromise } from "axios";
import { useQuery } from "@tanstack/react-query";

import { ApiFn, ExtractFnReturnType, QueryConfig } from "@/lib/react-query";
import { useApiClient } from "@/components/provider/api-client-provider";
import { ApiResponse } from "@/lib/api-response";

import { ProfileResponse } from "../types";

export const fetchUserProfile: ApiFn<
  {},
  AxiosPromise<ApiResponse<ProfileResponse[]>>
> = async ({}, { axios = defaultAxios }) => {
  return await axios.get("api/users/profiles");
};

type QueryFnType = typeof fetchUserProfile;

type UseFetchUserProfileQueryOptions = {
  config?: QueryConfig<QueryFnType>;
};

export const useFetchUserProfileQuery = ({
  config,
}: UseFetchUserProfileQueryOptions) => {
  const { axios } = useApiClient();

  return useQuery<ExtractFnReturnType<QueryFnType>>({
    queryFn: () => fetchUserProfile({}, { axios }),
    queryKey: ["fetchProfile"],
    ...config,
  });
};
