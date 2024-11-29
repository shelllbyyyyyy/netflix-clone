import React from "react";
import Wrapper from "../../layout/wrapper";
import { PackageCards } from "@/constant";
import PackageCard from "../../card/package-card";

const PlanPrice = () => {
  return (
    <Wrapper section="plan-price-grid" className="flex px-36 flex-col gap-10">
      <h2 className="text-3xl justify-start font-bold">
        Paket yang sesuai dengan kebutuhanmu
      </h2>
      <div className="grid grid-cols-4 place-items-center gap-1">
        {PackageCards.map(({ content, description, footer, title }, i) => {
          return (
            <PackageCard
              key={i}
              content={content}
              description={description}
              footer={footer}
              title={title}
            />
          );
        })}
      </div>
    </Wrapper>
  );
};

export default PlanPrice;
