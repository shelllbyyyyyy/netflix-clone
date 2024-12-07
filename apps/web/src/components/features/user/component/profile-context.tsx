"use client";

import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuShortcut,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import { LucideEdit, LucideTrash } from "lucide-react";
import React, { PropsWithChildren } from "react";
import EditProfile from "./edit-profile";
import DeleteProfile from "./delete-profile";

interface ProfileContextProps extends PropsWithChildren {
  profile: {
    id: string;
    avatar_url: string;
    profile_name: string;
  };
}

const ProfileContext: React.FC<ProfileContextProps> = ({
  children,
  profile,
}) => {
  const { avatar_url, id, profile_name } = profile;

  return (
    <ContextMenu>
      <ContextMenuTrigger>{children}</ContextMenuTrigger>
      <ContextMenuContent className="w-64">
        <ContextMenuItem inset onSelect={(e) => e.preventDefault()}>
          <EditProfile
            id={id}
            avatar_url={avatar_url}
            profile_name={profile_name}
          />
          <ContextMenuShortcut>
            <LucideEdit size={15} />
          </ContextMenuShortcut>
        </ContextMenuItem>
        <ContextMenuItem inset onSelect={(e) => e.preventDefault()}>
          <DeleteProfile id={profile.id} />
          <ContextMenuShortcut>
            <LucideTrash size={15} />
          </ContextMenuShortcut>
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  );
};

export default ProfileContext;
