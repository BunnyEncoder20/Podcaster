import React from 'react'

const page = ({ params }: { params: {id: string} }) => {
    console.log(params.id);
  return (
    <p className="text-white-1">Podcast Details for id: {params.id}</p>
  )
}

export default page