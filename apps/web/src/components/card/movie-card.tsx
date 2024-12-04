import React from "react";
import BaseCard from "./base-card";

const MovieCard = () => {
  return (
    <BaseCard className="aspect-9/16 lg:h-96 lg:w-64 w-[132px] h-[184px] trasition duration-300 hover:scale-110">
      <h1>test film</h1>
    </BaseCard>
  );
};

export default MovieCard;
