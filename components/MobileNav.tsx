"use client"

import React from 'react'
import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation"

// ui imports 
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet"


// constants imports 
import { sidebarLinks } from "@/constants"

// utils imports 
import { cn } from "@/lib/utils"


const MobileNav = () => {

  // for navigation
  const pathname = usePathname();

  return (
    <section>
      <Sheet>

        {/* Movile Nav Icon */}
        <SheetTrigger>
          <Image 
            src="/icons/hamburger.svg"
            alt="menu"
            height={30}
            width={30}
            className="cursor-pointer"
          />
        </SheetTrigger>

        {/* Mobile Nav Body */}
        <SheetContent side="left" className="border-none bg-black-1">

          {/* Site Logo */}
          <Link href="/" className="flex cursor-pointer items-center gap-1 pb-10 pl-4">
            <Image 
              src="/icons/logo.svg" 
              alt="logo" 
              width={23} height={27} 
            />
            <h1 className="text-24 font-extrabold text-white-1 ml-2">
              Podcastr
            </h1>
          </Link>

          {/* Nav Links (clicking any of these will also close the shadcn sheet) */}
          <div className="flex h-[calc(100vh-72px)] flex-col justify-between overflow-y-auto">
            <SheetClose asChild>
              <nav className="flex h-full flex-col gap-6 text-white-1">
              {sidebarLinks.map(({ route, label, imgURL }) => {
                const isActive = pathname === route || pathname.startsWith(`${route}/`);

                return <SheetClose asChild key={route}>
                        <Link href={route} className={cn("flex gap-3 items-center py-4 max-lg:px-4 justify-start", {'bg-nav-focus border-r-4 border-orange-1': isActive})}>
                          <Image src={imgURL} alt={label} width={24} height={24} />
                          <p>{label}</p>
                        </Link>
                      </SheetClose>
              })}
              </nav>
            </SheetClose>
          </div>
        </SheetContent>
      </Sheet>
    </section>
  )
}

export default MobileNav