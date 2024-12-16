"use client";


import React from 'react'

// component imports
import PodcastCard from '@/components/PodcastCard'

// constants imports
import { podcastData } from '@/constants'

// convex imports
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";




// current component
const page = () => {

  const trendingPodcasts = useQuery(api.podcasts.getTrendingPodcasts);

  return (
    <div className="mt-9 flex flex-col gap-9">
      <section className="flex flex-col gap-5">
        
        <h1 className="text-20 font-bold text-white-1">
          Trending Podcasts
        </h1>

        <div className="podcast_grid">
          {
            trendingPodcasts?.map(({_id, podcastTitle, podcastDescription, imageURL}) => (
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

      </section>
    </div>
  )
}

export default page