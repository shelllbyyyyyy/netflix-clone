"use client";

import React, { ChangeEventHandler, useMemo, useRef, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import CustomFormField, { FormFieldType } from "@/components/ui/custom-form";
import { AvatarImageUploader } from "@/components/features/user/component/avatar-image-uploader";

import { editProfileSchema, EditProfileSchema } from "../types";
import { DialogClose } from "@/components/ui/dialog";

type EditProfileFormInnerProps = {
  onSubmit: (
    values: EditProfileSchema & { imageFile: File | null; id: string }
  ) => void;
  isLoading: boolean;
  profile: {
    id: string;
    avatar_url: string;
    profile_name: string;
  };
  onCancel?: () => void;
};

const EditProfileFormInner: React.FC<EditProfileFormInnerProps> = ({
  isLoading,
  onSubmit,
  profile,
  onCancel,
}) => {
  const [selectedProfilePictureFile, setSelectedProfilePictureFile] =
    useState<File | null>(null);
  const inputProfilePictureRef = useRef<HTMLInputElement>(null);

  const form = useForm<EditProfileSchema>({
    resolver: zodResolver(editProfileSchema),
    defaultValues: {
      profile_name: profile?.profile_name || "",
    },
    reValidateMode: "onBlur",
  });

  const handleInputProfilePictureChange: ChangeEventHandler<
    HTMLInputElement
  > = (event) => {
    const MAX_SIZE = 5 * 1024 * 1024;

    if (event.target.files?.length) {
      const file = event.target.files[0] as File;
      if (file.size > MAX_SIZE) {
        alert("Size tidak boleh lebih dari 5MB");
      }

      setSelectedProfilePictureFile(file);
    }
  };

  const previewProfilePictureUrl = useMemo(() => {
    if (selectedProfilePictureFile)
      return URL.createObjectURL(selectedProfilePictureFile);

    return profile.avatar_url || "";
  }, [selectedProfilePictureFile]);

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit((values) =>
          onSubmit({
            profile_name: values.profile_name,
            imageFile: selectedProfilePictureFile,
            id: profile.id,
          })
        )}
      >
        <div className="flex flex-col w-full gap-5">
          <CustomFormField
            fieldType={FormFieldType.INPUT}
            control={form.control}
            name="profile_name"
            type="text"
            label="Profile Name"
            placeholder="Profile name"
          />
          <AvatarImageUploader
            handleImageChange={handleInputProfilePictureChange}
            preview={previewProfilePictureUrl}
            selectedProductImageFile={selectedProfilePictureFile}
            ref={inputProfilePictureRef}
          />
          <DialogClose asChild>
            <Button disabled={isLoading} type="submit">
              Simpan
            </Button>
          </DialogClose>
          <Button disabled={isLoading} variant={"secondary"} onClick={onCancel}>
            Batal
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default EditProfileFormInner;
