import defaultAxios, { AxiosPromise } from "axios";
import { useMutation } from "@tanstack/react-query";

import { useApiClient } from "@/components/provider/api-client-provider";
import { ApiFn, MutationConfig } from "@/lib/react-query";

import { EditProfileSchema } from "../types";
import { ProfileResponse } from "../types";

export type EditProfileWithFile = EditProfileSchema & {
  id: string;
  imageFile?: File | null;
};

const editProfile: ApiFn<
  EditProfileWithFile,
  AxiosPromise<ProfileResponse>
> = async (editProfileDTO, { axios = defaultAxios }) => {
  const { profile_name, imageFile, id } = editProfileDTO;

  const editProfileFormData = new FormData();

  if (profile_name) {
    editProfileFormData.append("profile_name", profile_name);
  }

  if (imageFile) {
    editProfileFormData.append("profile-picture", imageFile);
  }

  return await axios.patch(`/api/users/profiles/${id}`, editProfileFormData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

type MutationFnType = typeof editProfile;

export const useEditProfileMutation = (
  config: MutationConfig<MutationFnType> = {}
) => {
  const { axios } = useApiClient();

  return useMutation({
    mutationFn: (body) => editProfile(body, { axios }),
    ...config,
  });
};
