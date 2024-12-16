'use client';

import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname, useRouter } from 'next/navigation'

// utils imports
import { cn } from '@/lib/utils'
import { SignedOut, SignedIn, useClerk } from '@clerk/nextjs';

// const imports 
import { sidebarLinks } from '@/constants'

// ui imports
import { Button } from './ui/button';

// audio context import
import { useAudio } from '@/providers/AudioProvider';



// curent component ⚛️
const LeftSideBar = () => {

  // for navigation
  const router = useRouter();
  const pathname = usePathname();

  // clerk hooks
  const { signOut } = useClerk();

  // audio context: to see if the player is open or not
  const { audio } = useAudio();

  return (
    <section className={cn("left_sidebar h-[calc(100vh-5px)]", {'h-[calc(100vh-140px)]': audio?.audioURL})}>
      <nav className="flex flex-col gap-6">

        {/* main logo */}
        <Link href='/' className="flex cursor-pointer items-center gap-1 pb-10 max-lg:justify-center">
          <Image src="/icons/logo.svg" alt='logo' width={23} height={27} />
          <h1 className="text-24 font-extrabold text-white max-lg:hidden">Podcastr</h1>
        </Link>

        {
          sidebarLinks.map(({imgURL, route, label}) => {
            const isActive = (pathname === route || pathname.startsWith(`${route}/`));
            
            return <Link href={route} key={label} className={ cn("flex gap-3 items-center py-4 max-lg:px-4 justify-center lg:justify-start", {'bg-nav-focus border-r-4 border-orange-1': isActive}) }>
                    <Image src={imgURL} alt={label} width={24} height={24} />
                    <p>{label}</p>
                  </Link>
          })
        }
      </nav>

      {/* sign out button */}
      <SignedOut>
        <div className="flex-center w-full pb-14 max-lg:px-4 lg:pr-8">
          <Button asChild className="text-16 w-full bg-orange-1 font-extrabold">
            <Link href="/sign-in">
              Login
            </Link>
          </Button>
        </div>
      </SignedOut>

      <SignedIn>
        <div className="flex-center w-full pb-14 max-lg:px-4 lg:pr-8">
          <Button onClick={() => signOut(() => router.push('/'))} className="text-16 w-full bg-orange-1 font-extrabold">
            <Link href="/sign-in">
              Logout
            </Link>
          </Button>
        </div>
      </SignedIn>
    </section>
  )
}

export default LeftSideBar