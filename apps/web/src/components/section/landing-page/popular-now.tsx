"use client";

import React from "react";

import Wrapper from "../../layout/wrapper";
import MovieCard from "../../card/movie-card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

const PopularNow = () => {
  return (
    <Wrapper
      section="popular-now"
      className="flex px-6 lg:px-36 flex-col gap-10"
    >
      <div className="flex flex-col w-full gap-2 lg:gap-5">
        <h2 className="text-lg lg:text-3xl justify-start font-bold">
          Sedang trend sekarang
        </h2>
        <Carousel
          opts={{
            align: "start",
          }}
          className="w-full"
        >
          <CarouselContent className="py-5 px-3">
            {Array.from({ length: 20 }).map((_, index) => (
              <CarouselItem key={index} className="flex">
                <MovieCard />
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      </div>
      <div className="flex flex-col w-full gap-2 lg:gap-5">
        <h2 className="text-lg lg:text-3xl justify-start font-bold">
          Hanya di Netflix
        </h2>
        <Carousel
          opts={{
            align: "start",
          }}
          className="w-full"
        >
          <CarouselContent className="py-5 px-3">
            {Array.from({ length: 20 }).map((_, index) => (
              <CarouselItem key={index} className="flex">
                <MovieCard />
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      </div>
    </Wrapper>
  );
};

export default PopularNow;
