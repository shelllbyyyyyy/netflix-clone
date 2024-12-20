import React from "react";
import Wrapper from "../layout/wrapper";
import { Language } from "./language";

const Footer = () => {
  return (
    <footer>
      <Wrapper
        section=""
        className="flex flex-col justify-between gap-14 px-6 lg:px-36 py-16"
      >
        <div>
          <p className="text-lg text-muted-foreground font-bold">
            Ada pertanyaan? Hubungi{" "}
            <a href="" className="underline">
              081380747343
            </a>
          </p>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-4">
          <div className="flex flex-col gap-3">
            {FooterLinks1.map(({ link, text }, i) => {
              return <FooterLink key={i} link={link} text={text} />;
            })}
          </div>
          <div className="flex flex-col gap-3">
            {FooterLinks2.map(({ link, text }, i) => {
              return <FooterLink key={i} link={link} text={text} />;
            })}
          </div>
          <div className="flex flex-col gap-3">
            {FooterLinks3.map(({ link, text }, i) => {
              return <FooterLink key={i} link={link} text={text} />;
            })}
          </div>
          <div className="flex flex-col gap-3">
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

export default Footer;

const FooterLinks1 = [
  {
    text: "Tanya Jawab",
    link: "",
  },
  {
    text: "Hubungan Investor",
    link: "",
  },
  {
    text: "Cara Menonton",
    link: "",
  },
  {
    text: "Informasi Perusahaan",
    link: "",
  },
  {
    text: "Hanya di Netflix",
    link: "",
  },
];

const FooterLinks2 = [
  {
    text: "Pusat Bantuan",
    link: "",
  },
  {
    text: "Lowongan kerja",
    link: "",
  },
  {
    text: "Ketentuan Penggunaan",
    link: "",
  },
  {
    text: "Hubungi Kami",
    link: "",
  },
];

const FooterLinks3 = [
  {
    text: "Akun",
    link: "",
  },
  {
    text: "Tukar Kartu Hadiah",
    link: "",
  },
  {
    text: "Privasi",
    link: "",
  },
  {
    text: "Uji Kecepatan",
    link: "",
  },
];

const FooterLinks4 = [
  {
    text: "Pusat Media",
    link: "",
  },
  {
    text: "Beli Kartu Hadiah",
    link: "",
  },
  {
    text: "Preferensi Cookie",
    link: "",
  },
  {
    text: "Informasi Legal",
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
