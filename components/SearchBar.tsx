import React,{ useState, useEffect } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import Image from 'next/image'

// ui imports
import { Input } from '@/components/ui/input'



// current component ⚛️
const SearchBar = () => {
  
  // navigation
  const router = useRouter();
  const pathname = usePathname();

  // states
  const [search, setSearch] = useState('');

  // useEffect to update the url with the search query
  useEffect(() => {
    if (search) {
      router.push(`/discover?search=${search}`)
    } else {
      router.push('/discover')
    }
  }, [router, pathname, search])
  

  return (
    <div className="relative mt-8 block">
        <Input 
          placeholder='Search for podcasts'
          value={search}
          onChange={(e) => setSearch(e.target.value)}   // instant update search query
          onLoad={() => setSearch('')}                  // clear search 
          className="input-class py-6 pl-13 focus-visible:ring-offset-orange-1"
        />
        <Image 
          src="/icons/search.svg"
          alt="search icon"
          height={20}
          width={20}
          className='absolute right-4 top-3.5'
        />

    </div>
  )
}

export default SearchBar