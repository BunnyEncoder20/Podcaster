'use client'

import React from 'react'
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

// clerk imports 
import { useUser, SignedIn, UserButton } from "@clerk/nextjs";

// component imports 
import Header from '@/components/Header';
import EmblaCarousel from '@/components/Carousel';

// convex import 
import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';

// ui imports 
import { cn } from '@/lib/utils';
import LoaderSpinner from './LoaderSpinner';


// audio context
import { useAudio } from '@/providers/AudioProvider';


// current components ⚛️
const RightSideBar = () => {

  // navigation
  const  router = useRouter();

  // clerk hooks: auth user 
  const { user } = useUser();

  // fetch top podcast
  const topPodcasters = useQuery(api.users.getTopUserByPodcastCount);
  if (!topPodcasters) return <LoaderSpinner />

  // audio context to check of the podcaster player is open
  const { audio } = useAudio();

  return (
    <section className={cn('right_sidebar h-[calc(100vh-5px)]', {'h-[calc(100vh-140px)]': audio?.audioURL})}>
      <SignedIn>
        <Link href={`/profile/${user?.id}`} className="flex gap-3 pb-12">

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
          fansLikeDetail={topPodcasters!}
        />
      </section>

      {/* Top Podcaster List */}
      <section className="flex flex-col gap-8 pt-12">
        <Header headerTitle='Top Podcasters' />
        <div className='flex flex-col gap-6'>
          { 
            topPodcasters?.slice(0, 5).map((podcaster) => (
              <div key={podcaster._id} onClick={() => router.push(`/profile/${podcaster.clerkId}`)} className="flex coursor-pointer justify-between">
                <Link href={`/profile/!{user?.id}`}>
                  <figure className="flex items-center gap-2">

                    {/* top podcaster profile image */}
                    <Image src={podcaster.imageURL} alt={podcaster.name} height={44} width={44} className='aspect-square rounded-lg'/>

                    {/* top podcaster name */}
                    
                      <h2 className="text-14 font-semibold text-white-1">
                        { podcaster.name }
                      </h2>
                  </figure>
                </Link>

                {/* top podcaster podcasts count */}
                <div className='flex items-center'>
                  <p className="text-12 font-normal">
                    { podcaster.totalPodcasts > 1 ? (
                      `${podcaster.totalPodcasts} podcasts`
                    ) : (
                      `${podcaster.totalPodcasts} podcast`
                    )}
                  </p>
                </div>
              </div>
            ))
          }
        </div>
      </section>
    </section>
  )
}

export default RightSideBar