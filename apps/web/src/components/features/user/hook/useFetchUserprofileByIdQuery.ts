import defaultAxios, { AxiosPromise } from "axios";
import { useQuery, UseQueryOptions } from "@tanstack/react-query";

import { ApiFn } from "@/lib/react-query";
import { useApiClient } from "@/components/provider/api-client-provider";
import { ApiResponse } from "@/lib/api-response";

import { ProfileResponse } from "../types";

type FetchUserProfileByIdProps = {
  id: string;
};

export const fetchUserProfileById: ApiFn<
  FetchUserProfileByIdProps,
  AxiosPromise<ApiResponse<ProfileResponse | undefined>>
> = async ({ id }, { axios = defaultAxios }) => {
  const result = await axios.get(`api/users/profiles/${id}`);

  return result;
};

export const useFetchUserProfileByIdQuery = (
  query: { id: string },
  options?: Omit<
    UseQueryOptions<unknown, unknown, ProfileResponse, any[]>,
    "queryKey"
  >
) => {
  const { axios, api } = useApiClient();

  return useQuery({
    queryKey: ["fetchUserProfileById", query.id],
    queryFn: async () => {
      const profile = await api(fetchUserProfileById(query, { axios }));

      return profile;
    },
    ...options,
  });
};
