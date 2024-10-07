import React from 'react'

export default function PageNotFound() {
  return (
    <div className='flex items-center justify-center h-screen flex-col'>
      <h1 className='text-red-700 font-bold text-4xl'>Page not found</h1>
      <a href="/" className='text-blue-600 mt-5'>Go to home page</a>
    </div>
  )
}
