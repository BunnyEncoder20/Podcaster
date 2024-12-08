import { Button } from '@/components/ui/button'
import React from 'react'

// component imports
import PodcastCard from '@/components/PodcastCard'

// constants imports
import { podcastData } from '@/constants'




const page = () => {

  return (
    <div className="mt-9 flex flex-col gap-9">
      <section className="flex flex-col gap-5">
        
        <h1 className="text-20 font-bold text-white-1">
          Trending Podcasts
        </h1>

        <div className="podcast_grid">
          {
            podcastData.map(({id, title, description, imgURL}) => (
                <PodcastCard id={id} title={title} description={description} imgURL={imgURL}/>
              ))
          }
        </div>

      </section>
    </div>
  )
}

export default page