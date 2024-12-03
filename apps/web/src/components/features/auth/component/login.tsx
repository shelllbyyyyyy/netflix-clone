"use client";

import { AxiosError } from "axios";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React from "react";

import { Card, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";

import LoginFormInner from "../form/login-form-inner";
import { useLoginMutation } from "../hook/useLoginMutation";
import { LoginFormSchema } from "../types";
import { useUserStore } from "../../user/hook/useUserStore";

const Login = () => {
  const router = useRouter();
  const { setCredentials } = useUserStore();

  const { mutateAsync: LoginMutate, isPending } = useLoginMutation({
    onSuccess: async (data) => {
      setCredentials({ access_token: data.data.data.access_token });
    },
  });

  const handleLoginSubmit = async (values: LoginFormSchema) => {
    try {
      await LoginMutate(values);

      router.push("/home");
    } catch (error) {
      if (error instanceof AxiosError) {
        const err = error as AxiosError<{ errors: string[] }>;

        alert(err);
        return;
      }
    }
  };
  return (
    <Card className="w-full lg:w-[450px] h-[700px] bg-black/70 rounded-none lg:py-4 lg:px-14">
      <CardHeader>
        <Link href="/" className="cursor-pointer static lg:hidden">
          <Image
            src={"/assets/logo-text.png"}
            alt="logo"
            width={120}
            height={100}
            priority
            className="mr-5"
          />
        </Link>
        <CardTitle className="text-title">Masuk</CardTitle>
      </CardHeader>
      <LoginFormInner isLoading={isPending} onSubmit={handleLoginSubmit} />
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
            Baru di Netflix?
            <Link href={"/auth/register"}>
              <Button variant={"link"} disabled={isPending}>
                Daftar Sekarang
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

export default Login;
