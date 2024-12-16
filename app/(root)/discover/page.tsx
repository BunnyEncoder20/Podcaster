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

  // fetch the searched podcast data from convex 
  const podcastsData = useQuery(api.podcasts.getPodcastBySearch, { search: search || '' });

  return (
    <div className="flex flex-col gap-9">

      {/* search bar comp */}
      <SearchBar />
      
      <div className="flex flex-col gap-9">
        <h1 className="text-20 font-bold text-white-1">
          {!search ? 'Discover Trending Podcasts' : 'Search results for '}
          {search && <span className="text-white-2">{search}</span>}
        </h1>
        {podcastsData ? (
          <>
            {podcastsData.length > 0 ? (
              <div className="podcast_grid">
              {podcastsData?.map(({ _id, podcastTitle, podcastDescription, imageURL }) => (
                <PodcastCard 
                  key={_id}
                  imgURL={imageURL!}
                  title={podcastTitle}
                  description={podcastDescription}
                  podcastId={_id}
                />
              ))}
            </div>
            ) : <EmptyState title="No results found" />}
          </>
        ) : (
          <LoaderSpinner />
        )}
      </div>
    </div>
  )
}

export default Discover