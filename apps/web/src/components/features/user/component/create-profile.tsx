"use client";

import React from "react";
import { queryClient } from "@/lib/react-query";
import { LucidePlus } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from "@/components/ui/dialog";

import { CreateProfileWithFile, useCreateProfileMutation } from "../hook";
import CreateProfileFormInner from "../form/create-profile-form-inner";

const CreateProfile = () => {
  const { mutateAsync: profileMutate, isPending } = useCreateProfileMutation({
    onSuccess: () => {
      return setTimeout(() => {
        queryClient.invalidateQueries({
          queryKey: ["fetchProfile"],
        });
      }, 800);
    },
  });

  const handleCreateProfile = async (values: CreateProfileWithFile) => {
    try {
      await profileMutate(values);
    } catch (error) {
      alert(error);
    }
  };
  return (
    <Dialog>
      <DialogTrigger className="flex flex-col items-center justify-center">
        Add new Profile
        <LucidePlus />
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader className="items-center">
          <DialogTitle className="text-3xl">Buat profile</DialogTitle>
          <DialogDescription className="sr-only">test</DialogDescription>
        </DialogHeader>
        <CreateProfileFormInner
          onSubmit={handleCreateProfile}
          isLoading={isPending}
        />
      </DialogContent>
    </Dialog>
  );
};

export default CreateProfile;
