"use client";

import React, { ChangeEventHandler, useMemo, useRef, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import Compressor from "compressorjs";

import { AvatarImageUploader } from "@/components/features/user/component/avatar-image-uploader";
import { Button } from "@/components/ui/button";
import CustomFormField, { FormFieldType } from "@/components/ui/custom-form";
import { DialogClose } from "@/components/ui/dialog";
import { Form } from "@/components/ui/form";
import {
  createProfileSchema,
  CreateProfileSchema,
} from "../types/create-profile-schema";

type CreateProfileFormInnerProps = {
  onSubmit: (values: CreateProfileSchema & { imageFile: File | null }) => void;
  isLoading: boolean;
};

const CreateProfileFormInner: React.FC<CreateProfileFormInnerProps> = ({
  isLoading,
  onSubmit,
}) => {
  const [selectedProfilePictureFile, setSelectedProfilePictureFile] =
    useState<File | null>(null);
  const inputProfilePictureRef = useRef<HTMLInputElement>(null);

  const form = useForm<CreateProfileSchema>({
    resolver: zodResolver(createProfileSchema),
    defaultValues: {
      profile_name: "",
    },
    reValidateMode: "onChange",
  });

  const handleInputProfilePictureChange: ChangeEventHandler<
    HTMLInputElement
  > = (event) => {
    const MAX_SIZE = 2 * 1024 * 1024;

    if (event.target.files?.length) {
      const file = event.target.files[0] as File;
      if (file.size > MAX_SIZE) {
        new Compressor(file, {
          quality: 0.8,
          success: (img: File) => {
            setSelectedProfilePictureFile(img);
          },
        });

        return;
      }

      setSelectedProfilePictureFile(file);
    }
  };

  const previewProfilePictureUrl = useMemo(() => {
    if (selectedProfilePictureFile)
      return URL.createObjectURL(selectedProfilePictureFile);

    return "/assets/avatar_default.jpg";
  }, [selectedProfilePictureFile]);

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit((values) =>
          onSubmit({
            profile_name: values.profile_name,
            imageFile: selectedProfilePictureFile,
          })
        )}
      >
        <div className="flex flex-col gap-5">
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
        </div>
      </form>
    </Form>
  );
};

export default CreateProfileFormInner;
