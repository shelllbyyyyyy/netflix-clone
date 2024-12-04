"use client";

import * as React from "react";
import * as AccordionPrimitive from "@radix-ui/react-accordion";
import { Minus, Plus } from "lucide-react";

import { cn } from "@/lib/utils";

const Accordion = AccordionPrimitive.Root;

const AccordionItem = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Item>
>(({ className, ...props }, ref) => (
  <AccordionPrimitive.Item ref={ref} className={cn("", className)} {...props} />
));
AccordionItem.displayName = "AccordionItem";

const AccordionTrigger = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Trigger>
>(({ className, children, ...props }, ref) => (
  <AccordionPrimitive.Header className="flex">
    <AccordionPrimitive.Trigger
      ref={ref}
      className={cn(
        "relative flex p-6 items-center text-xl font-bold justify-between mt-2 bg-card hover:bg-neutral-700 transition-all duration-300 border rounded-lg w-full [&[data-state=open]>svg]:rotate-180 [&[data-state=open]>#plus]:opacity-0 [&[data-state=closed]>#plus]:opacity-100 [&[data-state=closed]>#minus]:opacity-0 [&[data-state=open]>#minus]:opacity-100",
        className
      )}
      {...props}
    >
      <div className="flex justify-start w-full">{children}</div>

      <Plus
        id="plus"
        className="absolute right-10 h-4 w-4 text-muted-foreground transition-transform duration-200"
      />
      <Minus
        id="minus"
        className="absolute right-10 h-4 w-4 text-muted-foreground transition-transform duration-200"
      />
    </AccordionPrimitive.Trigger>
  </AccordionPrimitive.Header>
));
AccordionTrigger.displayName = AccordionPrimitive.Trigger.displayName;

const AccordionContent = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Content>
>(({ className, children, ...props }, ref) => (
  <AccordionPrimitive.Content
    ref={ref}
    className="flex bg-card rounded-md mt-2 w-full text-xl font-bold transition-[max-height] duration-300 ease-in  overflow-hidden data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down data-[state=open]:p-8  data-[state=open]:-max-h-20  data-[state=closed]:max-h-0"
    {...props}
  >
    <div className={cn("pb-4 pt-0", className)}>{children}</div>
  </AccordionPrimitive.Content>
));
AccordionContent.displayName = AccordionPrimitive.Content.displayName;

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent };
