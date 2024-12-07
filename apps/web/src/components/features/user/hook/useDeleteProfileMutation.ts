import defaultAxios, { AxiosPromise } from "axios";
import { useMutation } from "@tanstack/react-query";

import { useApiClient } from "@/components/provider/api-client-provider";
import { ApiFn, MutationConfig } from "@/lib/react-query";

import { ProfileResponse } from "../types";

const deleteProfile: ApiFn<
  { id: string },
  AxiosPromise<ProfileResponse>
> = async (param, { axios = defaultAxios }) => {
  const { id } = param;

  return await axios.patch(`/api/users/profiles/${id}/delete-profile`, {
    headers: {
      "Content-Type": "application/json",
    },
  });
};

type MutationFnType = typeof deleteProfile;

export const useDeleteProfileMutation = (
  config: MutationConfig<MutationFnType> = {}
) => {
  const { axios } = useApiClient();

  return useMutation({
    mutationFn: (body) => deleteProfile(body, { axios }),
    ...config,
  });
};
