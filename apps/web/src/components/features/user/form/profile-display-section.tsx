"use client";

import React from "react";

import { Button } from "@/components/ui/button";
import MyAvatarProfile from "../component/my-avatar-profile";

interface ProfileDisplaySectionProps {
  onEditProfile: () => void;
  profile: {
    id: string;
    avatar_url: string;
    profile_name: string;
  };
}

const ProfileDisplaySection: React.FC<ProfileDisplaySectionProps> = ({
  onEditProfile,
  profile,
}) => {
  return (
    <div className="space-y-5">
      <MyAvatarProfile
        profile_name={profile.profile_name}
        avatar_url={profile.avatar_url}
        className=""
      />
      <Button onClick={onEditProfile} className="w-full">
        Edit
      </Button>
    </div>
  );
};

export default ProfileDisplaySection;
