"use client";

import { useRouter } from "next/navigation";
import React from "react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useGlobalStore } from "@/hook/useGlobalStore";

import { useFetchUserProfileQuery, useUserStore } from "../hook";
import MyAvatarProfile from "./my-avatar-profile";
import CreateProfile from "./create-profile";
import ProfileContext from "./profile-context";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

const ChooseProfileModal = () => {
  const { data: profiles } = useFetchUserProfileQuery({});
  const { modalOpen, setModalClosed } = useGlobalStore.getState();
  const { setProfile } = useUserStore.getState();
  const router = useRouter();

  const handleChooseProfile = async ({
    avatar_url,
    id,
    profile_name,
  }: {
    id: string;
    profile_name: string;
    avatar_url: string;
  }) => {
    setModalClosed();
    setProfile({ avatar_url, id, profile_name });
    router.refresh();
  };

  return (
    <Dialog open={modalOpen}>
      <DialogContent className="flex flex-col h-screen w-full justify-center items-center text-center bg-gradient-to-b from-hero via-[#1F1C18] to-[#1F1C18]">
        <DialogHeader className="items-center">
          <DialogTitle className="text-3xl">
            Siapakah yang menonton?
          </DialogTitle>
          <DialogDescription className="sr-only">test</DialogDescription>
        </DialogHeader>
        <div className="flex flex-col lg:flex-row gap-5">
          <Carousel
            opts={{
              align: "start",
            }}
            className="w-full"
          >
            <CarouselContent className="py-5 px-3">
              {profiles?.data.data.map((p, i) => {
                return (
                  <CarouselItem key={i} className="basis-1/2">
                    <ProfileContext profile={p}>
                      <MyAvatarProfile
                        avatar_url={p.avatar_url}
                        profile_name={p.profile_name}
                        onClick={() =>
                          handleChooseProfile({
                            avatar_url: p.avatar_url,
                            id: p.id,
                            profile_name: p.profile_name,
                          })
                        }
                      />
                    </ProfileContext>
                    <CarouselNext />
                    <CarouselPrevious />
                  </CarouselItem>
                );
              })}
            </CarouselContent>
          </Carousel>
          {/* {profiles?.data.data.map((p, i) => {
            return (
              <ProfileContext key={i} profile={p}>
                <MyAvatarProfile
                  avatar_url={p.avatar_url}
                  profile_name={p.profile_name}
                  onClick={() =>
                    handleChooseProfile({
                      avatar_url: p.avatar_url,
                      id: p.id,
                      profile_name: p.profile_name,
                    })
                  }
                />
              </ProfileContext>
            );
          })} */}
          <CreateProfile />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ChooseProfileModal;
