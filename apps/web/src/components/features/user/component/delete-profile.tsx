"use client";

import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { queryClient } from "@/lib/react-query";

import { useDeleteProfileMutation } from "../hook";
import { Button } from "@/components/ui/button";

interface EditProfileProps {
  id: string;
}

const DeleteProfile: React.FC<EditProfileProps> = ({ id }) => {
  const { mutateAsync: profileMutate, isPending } = useDeleteProfileMutation({
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["fetchProfile"],
      });
    },
  });

  const handleDeleteProfile = async (values: { id: string }) => {
    try {
      await profileMutate(values);
    } catch (error) {
      alert(error);
    }
  };
  return (
    <Dialog>
      <DialogTrigger asChild>
        <h1>Delete Profile</h1>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] flex flex-col">
        <DialogHeader className="items-center">
          <DialogTitle className="text-3xl">
            Are you sure to delete this profile ?
          </DialogTitle>
          <DialogDescription className="sr-only">test</DialogDescription>
        </DialogHeader>

        <Button
          onClick={() => handleDeleteProfile({ id })}
          disabled={isPending}
        >
          Yes
        </Button>

        <Button disabled={isPending} variant={"secondary"}>
          No
        </Button>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteProfile;
