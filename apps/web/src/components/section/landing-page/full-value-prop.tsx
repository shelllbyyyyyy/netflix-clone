import React from "react";
import Wrapper from "../../layout/wrapper";
import ValueCard from "../../card/value-card";
import { ValueCards } from "@/constant";

const FullValueProp = () => {
  return (
    <Wrapper
      section="full-value-prop"
      className="flex h-auto px-36 flex-col gap-10"
    >
      <h2 className="text-3xl justify-start font-bold">
        Alasan lainnya untuk bergabung
      </h2>
      <div className="grid grid-cols-4 place-items-center">
        {ValueCards.map(({ image, title }, i) => {
          return <ValueCard key={i} image={image} title={title} />;
        })}
      </div>
    </Wrapper>
  );
};

export default FullValueProp;
