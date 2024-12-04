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
      className="flex flex-col justify-center items-center gap-5 max-lg:px-6"
    >
      <Card className="w-full h-full lg:h-[700px] flex justify-center items-center">
        <span className="font-black text-xl lg:text-6xl text-center lg:w-[30%] mt-36 space-y-10 w-full">
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
      <p className="w-full lg:w-1/4 text-center">
        Siap menonton? Masukan email untuk membuat atau memulai lagi
        keanggotaanmu.
      </p>
      <div className="flex flex-col lg:flex-row gap-5 items-center w-full lg:w-1/2 justify-center">
        <Input
          placeholder="Alamat email"
          className="py-6 w-full lg:w-1/2 rounded-full h-14 placeholder:text-xl"
        />
        <Button size={"lg"} rounded={"full"} className="py-7">
          <h2 className="text-xl">Mulai</h2> <ChevronRight />
        </Button>
      </div>
    </>
  );
};
