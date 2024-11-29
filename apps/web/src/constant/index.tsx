import { HandHelping, Handshake, Heart, Monitor } from "lucide-react";

import { PackageCardProps } from "@/components/card/package-card";
import { ValueCardProps } from "@/components/card/value-card";

export const PackageCards: PackageCardProps[] = [
  {
    title: "Ponsel",
    description: "480p",
    content: [" Kualitas video yang lumayan", " Untuk ponsel atau tablet"],
    footer: "Rp. 54.000",
  },
  {
    title: "Dasar",
    description: "720p",
    content: [" Kualitas video bagus", " Untuk ponsel, tablet, laptop, dan tv"],
    footer: "Rp. 65.000",
  },
  {
    title: "Standar",
    description: "1080p",
    content: [
      " Kualitas video yang luar biasa",
      " Untuk ponsel, tablet, laptop, dan tv",
    ],
    footer: "Rp. 120.000",
  },
  {
    title: "Premium",
    description: "4K + HDR",
    content: [
      " Kualitas video terbaik",
      " Suara memukau(audio spesial)",
      " Untuk ponsel, tablet, laptop, dan tv",
    ],
    footer: "Rp. 186.000",
  },
];
export const ValueCards: ValueCardProps[] = [
  {
    title: "Kisah yang dibuat dengan seleramu",
    image: <HandHelping />,
  },
  {
    title: "Batalkan atau ganti paket kapan pun ",
    image: <Handshake />,
  },
  {
    title: "Dunia khusus bagi anak",
    image: <Heart />,
  },
  {
    title: "Untuk ponsel, tablet, laptop, dan TV",
    image: <Monitor />,
  },
];
