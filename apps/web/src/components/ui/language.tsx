/** TODO ADD LANGUAGE CONTEXT */
"use client";

import { useState } from "react";
import { LanguagesIcon } from "lucide-react";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./select";

export const Language = () => {
  const [language, setLanguage] = useState<string>("Bahasa Indonesia");

  return (
    <Select onValueChange={setLanguage} defaultValue={language}>
      <SelectTrigger className="lg:w-[180px] rounded-full w-auto">
        <div className="flex gap-2">
          <LanguagesIcon size={18} />
          <div className="hidden lg:block">
            <SelectValue />
          </div>
        </div>
      </SelectTrigger>

      <SelectContent>
        <SelectItem value="Bahasa Indonesia">Bahasa Indonesia</SelectItem>
        <SelectItem value="English">English</SelectItem>
      </SelectContent>
    </Select>
  );
};
