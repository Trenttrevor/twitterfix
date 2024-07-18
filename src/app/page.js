import Feed from '@/components/Feed'
import Input from '@/components/Input'
import React from 'react'

const page = () => {
  return (
    <div className='max-w-xl mx-auto border-r border-l min-h-screen'>
      <div className='py-2 px-3 sticky top-0 z-50 bg-white border-b border-gray-200'>
        <h2 className='text-lg sm:text-xl font-bold'>Home</h2>
      </div>
      <Input/>
      <Feed/>
    </div>
  )
}

export default page