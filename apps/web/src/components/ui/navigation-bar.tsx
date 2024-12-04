"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./dropdown-menu";
import { Card } from "./card";
import { Button } from "./button";
import { Language } from "./language";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "./carousel";

type NavItemProps = {
  path: string;
  title: string;
};

const navItems: NavItemProps[] = [
  {
    path: "#popular-now",
    title: "Populer Sekarang",
  },
  {
    path: "#plan-price-grid",
    title: "Paket",
  },
  {
    path: "#full-value-props",
    title: "Alasan Bergabung",
  },
  {
    path: "#card-faq",
    title: "Tanya Jawab",
  },
];

const Navigationbar = () => {
  return (
    <header>
      <div className="relative max-w-[1800px] flex justify-between h-16 mx-auto items-center py-12 px-6 lg:px-0">
        <aside>
          <Link href="#" className="lg:block hidden">
            <Image
              src={"/assets/logo-text.png"}
              alt="logo"
              width={1000}
              height={1000}
              style={{ width: "200px", height: "80px" }}
            />
          </Link>
          <Link href="#" className="lg:hidden block">
            <Image
              src={"/assets/logo-icon.png"}
              alt="logo"
              width={40}
              height={40}
              style={{ width: "auto", height: "auto" }}
            />
          </Link>
        </aside>
        <NavCard />
        <NavCardCarousel />
        <aside className="flex gap-3 items-center">
          <Language />
          <Button variant={"outline"} rounded={"full"}>
            <Link href={"/auth/login"}>Masuk</Link>
          </Button>
        </aside>
      </div>
    </header>
  );
};

export default Navigationbar;

/** TODO CHANGE BACKGROUND */

const NavCard = () => {
  return (
    <div className="nav-card">
      <nav>
        <ul>
          {navItems.map(({ path, title }, i) => {
            return (
              <li key={i}>
                <a href={path}>{title}</a>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
};

const NavCardCarousel = () => {
  return (
    <Carousel
      opts={{
        align: "start",
      }}
      className="w-full nav-card-mb"
    >
      <CarouselContent className="py-5 px-3">
        <nav className="w-full">
          <ul>
            {navItems.map(({ path, title }, i) => {
              return (
                <CarouselItem key={i}>
                  <li>
                    <a href={path}>{title}</a>
                  </li>
                </CarouselItem>
              );
            })}
          </ul>
        </nav>
      </CarouselContent>
    </Carousel>
  );
};

const ModeToggle = () => {
  const { setTheme } = useTheme();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon">
          <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => setTheme("light")}>
          Light
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("dark")}>
          Dark
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("system")}>
          System
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
