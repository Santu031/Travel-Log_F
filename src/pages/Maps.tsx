import React from 'react'

export default function Maps() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white py-14 px-6">
    <div className='flex justify-center text-5xl'>
      <h1> 🧭 Travel History Report</h1>
    </div>
    <div className='flex mb-10 w-full'>
    <h1>Total Trips </h1>
    <h1 className='flex justify-end'>Total Expensess</h1>
    </div>
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
    <div className='flex items-center gap-3 mb-3 text-xl'>
      <h1 className='mt-9'>🧭 Travel History Report</h1>
    </div>
    <div className='flex items-center gap-3 mb-3 text-xl'>
      <h1 className='mt-9'>🧭 Travel History Report</h1>
    </div>
    <div className='flex items-center gap-3 mb-3 text-xl'>
      <h1 className='mt-9'>🧭 Travel History Report</h1>
      
    </div>  
    </div>
    </div>
  )
}
