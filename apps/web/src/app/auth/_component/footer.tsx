import React from "react";

import Wrapper from "@/components/layout/wrapper";
import { Language } from "@/components/ui/language";

const LoginFooter = () => {
  return (
    <footer id="footer-login" className="bg-black h-auto w-full">
      <Wrapper
        section=""
        className="flex flex-col justify-between gap-5 px-5 py-8 lg:px-80 lg:py-16"
      >
        <div>
          <p className="text-md text-muted-foreground">
            Ada pertanyaan? Hubungi{" "}
            <a href="" className="underline">
              081380747343
            </a>
          </p>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-5 lg:gap-0">
          <div className="flex flex-col gap-5">
            {FooterLinks1.map(({ link, text }, i) => {
              return <FooterLink key={i} link={link} text={text} />;
            })}
          </div>
          <div className="flex flex-col gap-5">
            {FooterLinks2.map(({ link, text }, i) => {
              return <FooterLink key={i} link={link} text={text} />;
            })}
          </div>
          <div className="flex flex-col gap-5">
            {FooterLinks3.map(({ link, text }, i) => {
              return <FooterLink key={i} link={link} text={text} />;
            })}
          </div>
          <div className="flex flex-col gap-5">
            {FooterLinks4.map(({ link, text }, i) => {
              return <FooterLink key={i} link={link} text={text} />;
            })}
          </div>
        </div>
        <div className="space-y-2">
          <Language />
          <p className="text-lg text-muted-foreground font-bold">
            Netflix Indonesia Cloned By{" "}
            <a href="https://github.com/shelllbyyyyyy" className="underline">
              @Shelllbyyyyyy
            </a>
          </p>
        </div>
      </Wrapper>
    </footer>
  );
};

export default LoginFooter;

const FooterLinks1 = [
  {
    text: "Tanya Jawab",
    link: "",
  },
  {
    text: "Preferensi Cookie",
    link: "",
  },
];

const FooterLinks2 = [
  {
    text: "Pusat Bantuan",
    link: "",
  },
  {
    text: "Informasi Perusahaan",
    link: "",
  },
];

const FooterLinks3 = [
  {
    text: "Ketentuan Pengguna",
    link: "",
  },
];

const FooterLinks4 = [
  {
    text: "Privasi",
    link: "",
  },
];

const FooterLink = ({ text, link }: { text: string; link: string }) => {
  return (
    <a
      className="text-sm font-semi-bold text-muted-foreground underline"
      href={link}
    >
      {text}
    </a>
  );
};
