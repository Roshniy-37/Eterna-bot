import React from 'react'
import Image from 'next/image'
import logo from '@/public/ETERNA.svg'
import { SignedIn, SignedOut, SignInButton, UserButton } from '@clerk/nextjs'


function Navbar() {
  return (
    <div className='h-16 w-full'>
      <div className='flex justify-between items-center py-2 px-6 border-b '>
        <div className="flex items-center space-x-2">
          <Image className='size-12 rounded-full bg-gray-600' alt='yo' src={logo}/>
          <p className='font-bold text-3xl px-3'>ETERNA</p>
        </div>
        <div className='flex'>
        <SignedOut>
        <SignInButton/>
      </SignedOut>
      <SignedIn>
      <div className='flex items-center gap-4'>
        <UserButton/>
        </div>
      
      </SignedIn>
        </div>
      </div>
    </div>
  )
}

export default Navbar