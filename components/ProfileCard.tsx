"use client";


import { useEffect, useState } from "react";
import Image from "next/image";


// provides audio context 
import { useAudio } from "@/providers/AudioProvider";

// custom type imports
import { PodcastProps, ProfileCardProps } from "@/types";

// ui imports
import { Button } from "./ui/button";
import LoaderSpinner from "./LoaderSpinner";



// current component ⚛️
const ProfileCard = ({
  podcastData,
  imageURL,
  userFirstName,
}: ProfileCardProps) => {

  // states 
  const [randomPodcast, setRandomPodcast] = useState<PodcastProps | null>(null);

  // audio context
  const { setAudio } = useAudio();
  
  // select a random index from podcastData length
  const playRandomPodcast = () => {
    const randomIndex = Math.floor(Math.random() * podcastData.podcasts.length);
    setRandomPodcast(podcastData.podcasts[randomIndex]);
  };

  // play that random select podcast
  useEffect(() => {
    if (randomPodcast) {
      setAudio({
        title: randomPodcast.podcastTitle,
        audioURL: randomPodcast.audioURL || "",
        imageURL: randomPodcast.imageURL || "",
        author: randomPodcast.author,
        podcastId: randomPodcast._id,
      });
    }
  }, [randomPodcast, setAudio]);


  if (!imageURL) return <LoaderSpinner />;

  return (
    <div className="mt-6 flex flex-col gap-6 max-md:items-center md:flex-row">

      {/* Profile Photo */}
      <Image
        src={imageURL}
        width={250}
        height={250}
        alt="Podcaster"
        className="aspect-square rounded-lg"
      />

      {/* Profile Details */}
      <div className="flex flex-col justify-center max-md:items-center">
        <div className="flex flex-col gap-2.5">

            {/* verified symbol */}
          <figure className="flex gap-2 max-md:justify-center">
            <Image
              src="/icons/verified.svg"
              width={15}
              height={15}
              alt="verified"
            />
            <h2 className="text-14 font-medium text-white-2">
              Verified Creator
            </h2>
          </figure>

          {/* Name */}
          <h1 className="text-32 font-extrabold tracking-[-0.32px] text-white-1">
            {userFirstName}
          </h1>
        </div>

        {/* Monthly listens */}
        <figure className="flex gap-3 py-6">
          <Image
            src="/icons/headphone.svg"
            width={24}
            height={24}
            alt="headphones"
          />
          <h2 className="text-16 font-semibold text-white-1">
            {podcastData?.listeners} &nbsp;
            <span className="font-normal text-white-2">monthly listeners</span>
          </h2>
        </figure>

        {/* Play a random podcast button */}
        {podcastData?.podcasts.length > 0 && (
          <Button
            onClick={playRandomPodcast}
            className="text-16 bg-orange-1 font-extrabold text-white-1"
          >
            <Image
              src="/icons/Play.svg"
              width={20}
              height={20}
              alt="random play"
            />{" "}
            &nbsp; Play a random podcast
          </Button>
        )}
      </div>
    </div>
  );
};

export default ProfileCard;