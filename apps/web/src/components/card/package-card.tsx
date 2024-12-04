import React from "react";
import {
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";

import BaseCard from "./base-card";
import { Check } from "lucide-react";

export type PackageCardProps = {
  title: string;
  description: string;
  content: string[];
  footer: string;
};

const PackageCard: React.FC<PackageCardProps> = ({
  content,
  description,
  footer,
  title,
}) => {
  return (
    <BaseCard className="flex flex-col justify-between h-52 w-[350px] lg:w-80 p-5 bg-gradient-to-r from-[#193257] to-[#120c1f]">
      <CardHeader className="p-0">
        <CardTitle className="text-xl">{title}</CardTitle>
        <CardDescription className="text-lg">{description}</CardDescription>
      </CardHeader>
      <CardContent className="p-0">
        {content.map((c, i) => {
          return (
            <p key={i} className="flex items-center text-center gap-2">
              <Check size={20} /> {c}
            </p>
          );
        })}
      </CardContent>
      <CardFooter className="p-0">{footer}</CardFooter>
    </BaseCard>
  );
};

export default PackageCard;
