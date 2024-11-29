import React from "react";
import Wrapper from "../../layout/wrapper";
import MovieCard from "../../card/movie-card";

const PopularNow = () => {
  return (
    <Wrapper section="popular-now" className="flex px-36 flex-col gap-10">
      <div className="flex flex-col w-full gap-5">
        <h2 className="text-3xl justify-start font-bold">
          Sedang trend sekarang
        </h2>
        <div className="grid grid-cols-5 place-items-center gap-1">
          <MovieCard />
          <MovieCard />
          <MovieCard />
          <MovieCard />
          <MovieCard />
        </div>
      </div>
      <div className="flex flex-col w-full gap-5">
        <h2 className="text-3xl justify-start font-bold">Hanya di Netflix</h2>
        <div className="grid grid-cols-5 place-items-center gap-1">
          <MovieCard />
          <MovieCard />
          <MovieCard />
          <MovieCard />
          <MovieCard />
        </div>
      </div>
    </Wrapper>
  );
};

export default PopularNow;
