"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useTheme } from "next-themes";
import { LanguagesIcon, Moon, Sun } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./dropdown-menu";
import { Card } from "./card";
import { Button } from "./button";
import { Language } from "./language";

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
  useEffect(() => {
    const handleScroll = () => {
      const header = document.querySelector("header");
      const scroll = window.scrollY;

      if (scroll > 50) {
        header?.classList.add("scrolled");
        header?.classList.remove("default");
      } else {
        header?.classList.add("default");
        header?.classList.remove("scrolled");
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <header>
      <div className="relative max-w-[1800px] flex justify-between h-16 mx-auto items-center py-12">
        <aside>
          <a href="#">
            <Image
              src={"/assets/logo-text.png"}
              alt="logo"
              width={120}
              height={40}
              className="h-auto w-auto scale-150"
            />
          </a>
        </aside>
        <NavCard />
        <aside className="flex gap-3 items-center">
          <Language />
          <Button variant={"outline"} rounded={"full"}>
            Masuk
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
    <Card className="absolute top-20 left-[50%] translate-x-[-50%] flex justify-center items-center backdrop-blur-md backdrop-brightness-50 bg-backgorund h-11 rounded-full">
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
    </Card>
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
