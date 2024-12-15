import React from 'react'
import Image from 'next/image'
import Link from 'next/link'

// custom type imports 
import { EmptyStateProps } from '@/types'

// ui imports
import { Button } from './ui/button'


// current component ⚛️
const EmptyState = ({ 
  title,
  search,
  buttonLink,
  buttonText,
}: EmptyStateProps) => {
  return (
    <section className='flex-center size-full flex-col gap-3'>
      <Image 
        src="/icons/emptyState.svg"
        alt="Empty State Image"
        height={250}
        width={250}
      />
      <div className="flex-center w-full max-w-[254px] flex-col gap-3">
        <h1 className="text-16 text-center font-medium text-white-1">
          {title}
          {search && (
            <p className="text-16 text-center font-medium text-whit-2">
              Try adjusting your search
            </p>
          )}
        </h1>
        {buttonLink && (
          <Button className="bg-orange-1">
            <Link href={buttonLink} className="gap-1 flex">
              <Image 
                src="/icons/discover.svg" 
                alt="discover icon"
                height={20}
                width={20}
              />
              <h1 className="text-16 font-extrabold text-white-1">
                { buttonText }
              </h1>
            </Link>
          </Button>
        )}
      </div>
    </section>
  )
}

export default EmptyState