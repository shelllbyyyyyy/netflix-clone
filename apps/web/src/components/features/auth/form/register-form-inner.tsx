"use client";

import React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { CardContent } from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import CustomFormField, { FormFieldType } from "@/components/ui/custom-form";

import { RegisterFormSchema, registerFormSchema } from "../types";

type RegisterFormInnerProps = {
  onSubmit: (values: RegisterFormSchema) => void;
  isLoading: boolean;
};

const RegisterFormInner: React.FC<RegisterFormInnerProps> = ({
  isLoading,
  onSubmit,
}) => {
  const form = useForm<RegisterFormSchema>({
    resolver: zodResolver(registerFormSchema),
    defaultValues: {
      email: "",
      fullname: "",
      phone_number: "",
      password: "",
      retry_password: "",
    },
    reValidateMode: "onChange",
  });

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit((values) =>
          onSubmit({
            ...values,
          })
        )}
      >
        <CardContent className="flex flex-col w-full gap-5">
          <CustomFormField
            fieldType={FormFieldType.INPUT}
            control={form.control}
            name="fullname"
            type="text"
            placeholder="Nama lengkap"
          />
          <CustomFormField
            fieldType={FormFieldType.INPUT}
            control={form.control}
            name="phone_number"
            type="text"
            placeholder="Nomor ponsel"
          />
          <CustomFormField
            fieldType={FormFieldType.INPUT}
            control={form.control}
            name="email"
            type="email"
            placeholder="Email"
          />
          <CustomFormField
            fieldType={FormFieldType.INPUT}
            control={form.control}
            name="password"
            type="password"
            placeholder="Sandi"
          />
          <CustomFormField
            fieldType={FormFieldType.INPUT}
            control={form.control}
            name="retry_password"
            type="password"
            placeholder="Ulang Kata Sandi"
          />
          <Button disabled={isLoading} type="submit">
            Daftar
          </Button>
        </CardContent>
      </form>
    </Form>
  );
};

export default RegisterFormInner;
