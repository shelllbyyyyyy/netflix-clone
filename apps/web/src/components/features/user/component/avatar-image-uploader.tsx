"use client";

import Image from "next/image";
import React, { ChangeEventHandler } from "react";
import { Input } from "@/components/ui/input";

type AvatarImageUploaderProps = {
  handleImageChange: ChangeEventHandler<HTMLInputElement>;
  selectedProductImageFile: File | null | undefined;
  preview: string;
  ref?: React.RefObject<HTMLInputElement>;
};

export const AvatarImageUploader = ({
  handleImageChange,
  preview,
  selectedProductImageFile,
  ref,
}: AvatarImageUploaderProps) => {
  return (
    <div className="flex flex-col text-center space-y-5">
      <Input
        type="file"
        className="input-primary pt-3 h-12"
        onChange={handleImageChange}
        accept="image/png, image/gif, image/jpeg, image/webp, image/jpg, image/svg"
        ref={ref}
      />
      {selectedProductImageFile ? (
        <Image
          src={preview}
          width={1000}
          height={1000}
          alt="uploaded image"
          className="max-h-[400px] overflow-hidden object-cover"
        />
      ) : (
        <div className="flex w-full justify-center">
          <Image
            src={preview}
            width={1000}
            height={1000}
            alt="uploaded image"
            className="max-h-[400px] overflow-hidden object-cover"
          />
        </div>
      )}
    </div>
  );
};
