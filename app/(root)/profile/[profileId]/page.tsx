import React from 'react'

const page = ({ params: { profileId }} : { params: { profileId: string } }) => {
  return (
    <div>
      <h1 className="text-xl text-white-1">
        {profileId}
      </h1>
    </div>
  )
}

export default page