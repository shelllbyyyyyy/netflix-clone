import defaultAxios, { AxiosPromise, AxiosResponse } from "axios";
import { useMutation } from "@tanstack/react-query";

import { useApiClient } from "@/components/provider/api-client-provider";
import { ApiFn, MutationConfig } from "@/lib/react-query";

import { CreateProfileSchema, ProfileResponse } from "../types";

export type CreateProfileWithFile = CreateProfileSchema & {
  imageFile: File | null;
};

const createProfile: ApiFn<
  CreateProfileWithFile,
  AxiosPromise<ProfileResponse>
> = async (createProfileDTO, { axios = defaultAxios }) => {
  const { profile_name, imageFile } = createProfileDTO;

  const createProfileFormData = new FormData();

  if (profile_name) {
    createProfileFormData.append("profile_name", profile_name);
  }

  if (imageFile) {
    createProfileFormData.append("profile-picture", imageFile);
  }

  return await axios.post("/api/users/profiles", createProfileFormData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

type MutationFnType = typeof createProfile;

export const useCreateProfileMutation = (
  config: MutationConfig<MutationFnType> = {}
) => {
  const { axios } = useApiClient();

  return useMutation({
    mutationFn: (body) => createProfile(body, { axios }),
    ...config,
  });
};
