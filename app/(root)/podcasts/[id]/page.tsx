import React from 'react'
import Image from 'next/image'

const page = ({ params }: { params: {id: string} }) => {
    // console.log(params.id);
  return (
    <section className="flex w-full flex-col">
      <header className="mt-9 flex items-center justify-between">
        <h1 className="text-20 font-bold text-white-1">
          Curerntly Playing
        </h1>
        <figure className="flex gap-3">
          <Image 
            src="/icons/headphones.svg" 
            width={24}
            height={24}
            alt="headphones icon"
          />
          <h2 className="text-16 font-bold text-white-1">
            { podcast?.views }
          </h2>
        </figure>
      </header>
    </section>
  )
}

export default page