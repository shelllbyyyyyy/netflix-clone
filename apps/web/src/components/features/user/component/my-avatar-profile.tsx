import React from "react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

type MyAvatarProfileProps = {
  profile_name: string;
  avatar_url: string;
  onClick?: (e: any | undefined) => void | Promise<void>;
  className?: string;
};

const MyAvatarProfile: React.FC<MyAvatarProfileProps> = ({
  avatar_url,
  profile_name,
  onClick,
  className,
}) => {
  return (
    <figure
      className={
        "flex flex-col items-center gap-5 overflow-hidden transition duration-300 hover:scale-105"
      }
    >
      <Avatar
        className={cn("h-52 w-52 cursor-pointer", className)}
        onClick={onClick}
      >
        <AvatarFallback>{profile_name}</AvatarFallback>
        <AvatarImage src={avatar_url || ""} />
      </Avatar>
      <h2>{profile_name}</h2>
    </figure>
  );
};

export default MyAvatarProfile;
