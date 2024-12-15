'use client'

import React from 'react'
import Image from 'next/image'

// convex imports 
import { useQuery } from 'convex/react'
import { api } from '@/convex/_generated/api'
import { Id } from '@/convex/_generated/dataModel'

// compoenents imports
import PodcastDetailsPlayer from '@/components/PodcastDetailsPlayer'
import LoaderSpinner from '@/components/LoaderSpinner'
import PodcastCard from '@/components/PodcastCard'
import EmptyState from '@/components/EmptyState'


// current page
const page = ({ params: { podcastId } }: { params: { podcastId: Id<'podcasts'> } }) => {

  // queires from convex
  const podcast = useQuery(api.podcasts.getPodcastById, { podcastId })
  const authorsPodcasts = useQuery(api.podcasts.getOtherPodcastsByAuthor, { podcastId })
  if (!authorsPodcasts || !podcast ) return <LoaderSpinner />

  return (
    <section className="flex w-full flex-col">
      <header className="mt-9 flex items-center justify-between">
        <h1 className="text-20 font-bold text-white-1">
          Curerntly Playing
        </h1>
        <figure className="flex gap-3">
          <Image 
            src="/icons/headphone.svg" 
            width={24}
            height={24}
            alt="headphones icon"
          />
          <h2 className="text-16 font-bold text-white-1">
            { podcast?.views }
          </h2>
        </figure>
      </header>

      {/* Podcast Player Component */}
      <PodcastDetailsPlayer />

      {/* Podcast description */}
      <p className="text-white-2 text-16 pb-8 pt-[45px] font-medium max-md:text-center">
        { podcast?.podcastDescription }
      </p>

      {/* Prompts  */}
      <div className="flex flex-col gap-8">

        {/* audio prompt (Transcript) */}
        <div className="flex flex-col gap-4">
          <h1 className="text-18 font-bold text-white-1">
            Transcription
          </h1>
          <p className="text-16 font-medium text-white-2">
            { podcast?.voicePrompt }
          </p>
        </div>

        {/* Image prompt */}
        <div className="flex flex-col gap-4">
          <h1 className="text-18 font-bold text-white-1">
            Thumbnail Prompt
          </h1>
          <p className="text-16 font-medium text-white-2">
            { podcast?.imagePrompt }
          </p>
        </div>
      </div>

      {/* Similar Podcast Section */}
      <section className="mt-8 flex flex-col gap-5">
        <h1 className="text-20 font-bold text-white-1">
          Other Podcasts by Author
        </h1>
        { authorsPodcasts && authorsPodcasts.length > 0 ? (
          <div className="podcast_grid">
          {
            authorsPodcasts?.map(({_id, podcastTitle, podcastDescription, imageURL}) => (
                <PodcastCard 
                  key={_id} 
                  podcastId={_id}
                  title={podcastTitle} 
                  description={podcastDescription} 
                  imgURL={imageURL!}
                />
              ))
          }
        </div>
        ) : (
          <>
            <EmptyState 
              title="No matching Podcasts found"
              buttonLink="/discover"
              buttonText="Discover more Podcasts"
            />
          </>
        )}
      </section>
    </section>
  )
}

export default page