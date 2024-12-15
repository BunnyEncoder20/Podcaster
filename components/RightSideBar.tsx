'use client'

import React from 'react'
import Image from 'next/image';
import Link from 'next/link';

// clerk imports 
import { useUser, SignedIn, UserButton } from "@clerk/nextjs";

// component imports 
import Header from '@/components/Header';
import EmblaCarousel from '@/components/Carousel';

// convex import 
import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';



// current components ⚛️
const RightSideBar = () => {

  // clerk hooks: auth user 
  const { user } = useUser();

  // fetch top podcast
  const topPodcasters = useQuery(api.users.getTopUserByPodcastCount);

  return (
    <section className="right_sidebar text-white-1">
      <SignedIn>
        <Link href={`/profile/!{user?.id}`} className="flex gap-3 pb-12">

          {/* user profile image/btn */}
          <UserButton />
          
          <div className="flex w-full items-center justify-between">

            {/* user name */}
            <h1 className="text-16 truncate font-semibold text-white-1">
              { user?.firstName } { user?.lastName }
            </h1>

            {/* top right arrow icon */}
            <Image 
              src="/icons/right-arrow.svg"
              alt="right arrow"
              height={24} 
              width={24}
            />
          </div>
        </Link>
      </SignedIn>

      <section>
        <Header 
          headerTitle = "Fans like you"
        />
        <EmblaCarousel 
          fansLikeDetail={topPodcasters}
        />
      </section>
    </section>
  )
}

export default RightSideBar