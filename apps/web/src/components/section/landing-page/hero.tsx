import React from "react";
import Wrapper from "../../layout/wrapper";
import { Card } from "../../ui/card";
import { Input } from "../../ui/input";
import { Button } from "../../ui/button";
import { ChevronRight } from "lucide-react";

const Hero = () => {
  return (
    <Wrapper
      section=""
      className="flex flex-col justify-center items-center gap-5"
    >
      <Card className="w-full h-[700px] flex justify-center items-center">
        <span className="font-black text-6xl text-center w-[30%] mt-36 space-y-10">
          <h1>Film, acara TV tak terbatas, dan banyak lagi</h1>
          <h4 className="text-xl font-semibold">
            Harga mulai Rp. 54.000. Batalkan kapanpun
          </h4>
        </span>
      </Card>
      <Subscripe />
    </Wrapper>
  );
};

export default Hero;

const Subscripe = () => {
  return (
    <>
      <p className="w-1/4 text-center">
        Siap menonton? Masukan email untuk membuat atau memulai lagi
        keanggotaanmu.
      </p>
      <div className="flex gap-5 items-center w-1/2 justify-center">
        <Input
          placeholder="Alamat email"
          className="py-6 w-1/2 rounded-full h-14"
        />
        <Button size={"lg"} rounded={"full"}>
          Mulai <ChevronRight />
        </Button>
      </div>
    </>
  );
};
