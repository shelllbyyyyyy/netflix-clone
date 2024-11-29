import React from "react";

import { cn } from "@/lib/utils";

type ContainerProps = {
  children: React.ReactNode;
  className?: string;
};

const Container: React.FC<ContainerProps> = ({ children, className }) => {
  return (
    <main className={cn("relative max-w-[1800px] mx-auto pt-36", className)}>
      {children}
    </main>
  );
};

export default Container;
