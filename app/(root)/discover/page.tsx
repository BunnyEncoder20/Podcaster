'use client'

import React from 'react'

// convex imports
import { useQuery } from 'convex/react'
import { api } from '@/convex/_generated/api'

// components imports 
import EmptyState from '@/components/EmptyState'
import LoaderSpinner from '@/components/LoaderSpinner'
import PodcastCard from '@/components/PodcastCard'
import SearchBar from '@/components/SearchBar'




// Dicover Page 📄
const Discover = ({ searchParams: { search } }: { searchParams: { search: string }}) => {

  const podcastData = useQuery(api.podcasts.getPodcastBySearch, { search: search || '' });

  return (
    <div className="flex flex-col gap-9">

      <SearchBar />
      
      <h1 className="text-20 font-bold text-white-1">
          Discover
      </h1>
      {podcastData ? (
        <>
          { podcastData.length > 0 ? (
            <div className="podcast_grid">
            {
              podcastData?.map(({_id, podcastTitle, podcastDescription, imageURL}) => (
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
            <LoaderSpinner />
          )}
        </>
      ) : (
        <EmptyState 
          title="No podcasts found"
        />
      )}
    </div>
  )
}

export default Discover