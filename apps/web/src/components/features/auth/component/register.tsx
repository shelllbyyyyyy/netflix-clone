"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { AxiosError } from "axios";

import { Card, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { queryClient } from "@/lib/react-query";

import RegisterFormInner from "../form/register-form-inner";
import { useRegisterMutation } from "../hook/useRegisterMutation";
import { RegisterFormSchema } from "../types";

const Register = () => {
  const { mutateAsync: RegisterMutate, isPending } = useRegisterMutation({
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["register"],
      });
    },
  });

  const handleRegisterSubmit = async (values: RegisterFormSchema) => {
    try {
      await RegisterMutate(values);
    } catch (error) {
      if (error instanceof AxiosError) {
        const err = error as AxiosError<{ errors: string[] }>;

        alert(err);
        return;
      }
    }
  };
  return (
    <Card className="w-full lg:w-[500px] h-full lg:h-[800px] bg-black/70 rounded-none lg:py-4 lg:px-14">
      <CardHeader>
        <a href="/" className="cursor-pointer static lg:hidden">
          <Image
            src={"/assets/logo-text.png"}
            alt="logo"
            width={120}
            height={100}
            priority
            className="mr-5"
          />
        </a>
        <CardTitle className="text-title">Masuk</CardTitle>
      </CardHeader>
      <RegisterFormInner
        isLoading={isPending}
        onSubmit={handleRegisterSubmit}
      />
      <CardFooter className="flex flex-col justify-center w-full gap-3">
        <div className="flex flex-col w-full gap-3">
          <p className="text-center">ATAU</p>
          <Button variant={"secondary"} disabled={isPending}>
            Gunakan Kode Masuk
          </Button>
          <Button variant={"link"} disabled={isPending}>
            Lupa sandi?
          </Button>
        </div>
        <div className="flex justify-start w-full gap-2 items-center text-center">
          <Checkbox />
          <p>Ingat saya</p>
        </div>
        <div className="flex justify-start w-full gap-2 items-center text-center">
          <p>
            Sudah punya akun ?
            <Link href={"/auth/login"}>
              <Button variant={"link"} disabled={isPending}>
                Masuk Sekarang
              </Button>
            </Link>
          </p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground">
            Halaman ini dilindungi oleh reCAPTCHA Google untuk memastikan kamu
            bukan bot.{" "}
            <a href="" className="text-blue-600">
              Pelajari selengkapnya.
            </a>
          </p>
        </div>
      </CardFooter>
    </Card>
  );
};

export default Register;
