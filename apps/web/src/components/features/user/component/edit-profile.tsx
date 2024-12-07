"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { queryClient } from "@/lib/react-query";

import { EditProfileWithFile, useEditProfileMutation } from "../hook";
import EditProfileFormInner from "../form/edit-profile-form-inner";
import ProfileDisplaySection from "../form/profile-display-section";

interface EditProfileProps {
  id: string;
  profile_name: string;
  avatar_url: string;
}

const EditProfile: React.FC<EditProfileProps> = ({
  id,
  avatar_url,
  profile_name,
}) => {
  const [isEditMode, setIsEditMode] = useState<boolean>(false);
  const { mutateAsync: profileMutate, isPending } = useEditProfileMutation({
    onSuccess: () => {
      return setTimeout(() => {
        queryClient.invalidateQueries({
          queryKey: ["fetchProfile"],
        });
      }, 800);
    },
  });

  const handleEditProfile = async (values: EditProfileWithFile) => {
    try {
      await profileMutate(values);
    } catch (error) {
      alert(error);
    }
  };
  return (
    <Dialog>
      <DialogTrigger asChild>
        <h1>Edit Profile</h1>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader className="items-center">
          <DialogTitle className="text-3xl">Edit profile</DialogTitle>
          <DialogDescription className="sr-only">test</DialogDescription>
        </DialogHeader>
        {isEditMode ? (
          <EditProfileFormInner
            onSubmit={handleEditProfile}
            isLoading={isPending}
            profile={{ id, avatar_url, profile_name }}
            onCancel={() => setIsEditMode(false)}
          />
        ) : (
          <ProfileDisplaySection
            onEditProfile={() => setIsEditMode(true)}
            profile={{ avatar_url, id, profile_name }}
          />
        )}
      </DialogContent>
    </Dialog>
  );
};

export default EditProfile;
