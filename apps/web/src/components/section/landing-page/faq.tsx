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
    <Wrapper
      section="card-faq"
      className="flex h-auto px-6 lg:px-36 flex-col gap-5 lg:gap-10"
    >
      <h2 className="text-lg lg:text-3xl justify-start font-bold">
        Tanya jawab umum
      </h2>
      <FaqAccordion />
      <Join />
    </Wrapper>
  );
};

export default Faq;

const FaqAccordion = () => {
  return (
    <Accordion type="single" collapsible className="w-full">
      {FaqAccrodions.map((f, i) => {
        return (
          <AccordionItem value={f.value} key={i}>
            <AccordionTrigger className="lg:text-xl text-sm">
              {f.trigger}
            </AccordionTrigger>
            <AccordionContent className="whitespace-pre-line lg:text-xl text-sm">
              {f.content}
            </AccordionContent>
          </AccordionItem>
        );
      })}
    </Accordion>
  );
};

const FaqAccrodions: { value: string; trigger: string; content: string }[] = [
  {
    value: "item-1",
    trigger: "Apa itu Netflix?",
    content: `Netflix adalah layanan streming yang menawarkan berbagai acara TV pemenang penghargaan, film, anime, dokumenter dan banyak lagi di ribuan perangkat yang terhubung di internet.\n
    Kamu bisa menonton sepuasnya, kapanpun kamu mau, tanpa satu iklan pun - semuanya dengan satu harga bulan yang murah. Selalu ada tontonan baru dan acara tv serta film baru yang ditambahkan setiap minggu!`,
  },
  {
    value: "item-2",
    trigger: "Berapa biaya berlangganan Netflix?",
    content: `Tonton Netflix di smartphone, tablet Smart TV, laptop, atau perangkap streaming-mu, sem,uanya dengan satu bulanan dengan Rentang harga mulai dari Rp 54.000 hingga Rp 186.000 per bulan. Tanpa biaya ekstra, tanpa kontrak.`,
  },
  {
    value: "item-3",
    trigger: "Dimana saya bisa menonton?",
    content: `Tonton dimananpun, kapanpun. Masuk ke akun Netflix-mu untuk menonton langsung di nelflix.com dari komputer pribadi atau perangkat yang terhubung ke Internet dan mendukung apikasi Netflix, termasuk aplikasi Smart TV, smartphone, tablet, pemutar media streaming, dan konsole gamae \n
    Kmu juga bisa men-download acara favoritmu dengan aplikasi IOS atau android. Gunakan download untuk menonton saat kamu di perjalanan dan tidak punya koneksi internet. Bawa Netflix kemana saja.`,
  },
  {
    value: "item-4",
    trigger: "Bagaimana cara membatalkan Netflix?",
    content: `Netflix flexibel. Tanpa kontrak menyebalkan dan tanpa komitmen. Kamu dengan mudah membatalkan akunmu secaraonline dengan dua kali klik. Tanpa biaya pembatalan - mulai atau hentikan akunmu kapan pun.`,
  },
  {
    value: "item-5",
    trigger: "Apa yang bisa ditonton di Netflix?",
    content: `Netflix memiliki pustaka lengkap yang berisi film panjang, film dokumenter, acara TV, anime, Netflix original pemenang penghargaan, dan lebih banyak lagi. Tonton sepuasnya kapan pun kamu mau.`,
  },
  {
    value: "item-6",
    trigger: "Apa Netflix sesuai bagi anak-anak?",
    content: `Pengalaman Netflix Anak disertakan dalam keanggotaan agar kamu punya kontrol orang tua saat anak - anak menikmati acara TV dan film untuk keluarga di rumah. \n
    Profil anak dilengkapi kontrol orang tua yang dilindungin PIN sehingga kamu bisa membatasi rating usia konten yang bisa ditonton anak dan memblokir judul tertentu yang tidak boleh ditintin anak-anak.`,
  },
];

const Join = () => {
  return (
    <div className="flex justify-center items-center flex-col gap-4">
      <Button size={"lg"} rounded={"full"} className="w-50px">
        Mulai
      </Button>
      <p className="w-full lg:w-1/4 text-center text-lg lg:text-xl">
        Gabung atau mulai lagi keanggotannmu
      </p>
    </div>
  );
};
