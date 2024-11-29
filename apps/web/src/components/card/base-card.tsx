import React from "react";
import { Card } from "../ui/card";
import { cn } from "@/lib/utils";

type BaseCardProps = {
  children: React.ReactNode;
  className?: string;
};

const BaseCard: React.FC<BaseCardProps> = ({ className, children }) => {
  return (
    <Card className={cn("rounded-md shadow border", className)}>
      {children}
    </Card>
  );
};

export default BaseCard;
