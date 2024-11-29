import React from "react";

import { cn } from "@/lib/utils";

type WrapperProps = {
  children: React.ReactNode;
  section: string;
  className?: string;
};

const Wrapper: React.FC<WrapperProps> = ({ children, className, section }) => {
  return (
    <section
      id={section}
      className={cn("relative max-w-[1800px] mx-auto ", className)}
    >
      {children}
    </section>
  );
};

export default Wrapper;
