"use client";

import React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { CardContent } from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import CustomFormField, { FormFieldType } from "@/components/ui/custom-form";

import { LoginFormSchema, loginFormSchema } from "../types";

type LoginFormInnerProps = {
  onSubmit: (values: LoginFormSchema) => void;
  isLoading: boolean;
};

const LoginFormInner: React.FC<LoginFormInnerProps> = ({
  isLoading,
  onSubmit,
}) => {
  const form = useForm<LoginFormSchema>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
    reValidateMode: "onChange",
  });

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit((values) =>
          onSubmit({
            email: values.email,
            password: values.password,
          })
        )}
      >
        <CardContent className="flex flex-col w-full gap-5">
          <CustomFormField
            fieldType={FormFieldType.INPUT}
            control={form.control}
            name="email"
            type="email"
            label="Email"
            placeholder="Email atau nomor ponsel"
          />
          <CustomFormField
            fieldType={FormFieldType.INPUT}
            control={form.control}
            name="password"
            type="password"
            placeholder="Sandi"
          />
          <Button disabled={isLoading} type="submit">
            Masuk
          </Button>
        </CardContent>
      </form>
    </Form>
  );
};

export default LoginFormInner;
