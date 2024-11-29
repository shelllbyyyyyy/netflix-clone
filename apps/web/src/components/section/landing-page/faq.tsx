import React from "react";
import Wrapper from "../../layout/wrapper";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../../ui/accordion";
import { Button } from "../../ui/button";

const Faq = () => {
  return (
    <Wrapper section="card-faq" className="flex h-auto px-36 flex-col gap-10">
      <h2 className="text-3xl justify-start font-bold">Tanya jawab umum</h2>
      <FaqAccordion />
      <Join />
    </Wrapper>
  );
};

export default Faq;

const FaqAccordion = () => {
  return (
    <Accordion type="single" collapsible className="w-full">
      <AccordionItem value="item-1">
        <AccordionTrigger>Is it accessible?</AccordionTrigger>
        <AccordionContent>
          Yes. It adheres to the WAI-ARIA design pattern.
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-2">
        <AccordionTrigger>Is it styled?</AccordionTrigger>
        <AccordionContent>
          Yes. It comes with default styles that matches the other
          components&apos; aesthetic.
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-3">
        <AccordionTrigger>Is it animated?</AccordionTrigger>
        <AccordionContent>
          Yes. It&apos;s animated by default, but you can disable it if you
          prefer.
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};

const Join = () => {
  return (
    <div className="flex justify-center items-center flex-col gap-4">
      <Button size={"lg"} rounded={"full"} className="w-50px">
        Mulai
      </Button>
      <p className="w-1/4 text-center text-xl">
        Gabung atau mulai lagi keanggotannmu
      </p>
    </div>
  );
};
