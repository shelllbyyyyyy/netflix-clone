import React from "react";
import BaseCard from "./base-card";

export type ValueCardProps = {
  title: string;
  image: React.ReactNode;
};

const ValueCard: React.FC<ValueCardProps> = ({ image, title }) => {
  return (
    <BaseCard className="aspect-3/8 h-28 w-[350px] lg:w-80 p-5 flex flex-col justify-between">
      <h3>{title}</h3>
      <span className="justify-items-end">{image}</span>
    </BaseCard>
  );
};

export default ValueCard;
