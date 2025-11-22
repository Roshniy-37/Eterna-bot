"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { chats } from '@prisma/client';
import { addFriend, getFriends } from '@/actions/server';
import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';

export default function HeroSection() {
  const { user } = useUser()
  const [file, setFile] = useState<File | null>(null);
  const [username, setUsername] = useState<string>('');
  const [Friends, setFriends] = useState<chats[] | null>()
  const router = useRouter();


  async function getData(){
    if(!user) return;
    if(!user.username) return;
    const data = await getFriends(user.username);
    console.log(data)
    setFriends(data)
  }

  useEffect(()=>{
    getData();
  }, [user])


  async function createNewFriend(){
    if(!username || username.length < 4) return;
    if(!user || !user.username) return;
    const res = await addFriend(username, user.username);
    return res;

  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };
  const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUsername(e.target.value);
  };


  const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (file && username) {
        const friend = await createNewFriend();
        console.log(friend)
        await new Promise(r => setTimeout(r, 700));
        router.push('/chat/${friend.chatId}');
    } else {
      alert("Please enter a username and select a file before submitting.");
    }
  };

  return (
    <div className="flex justify-center items-center h-[90vh] gap-4">
      <div className="rounded-lg border border-black h-[60vh] w-1/2 flex flex-col items-center justify-center">
        <h1 className='mb-10 text-3xl font-bold'>Upload Your Chats</h1>
       <input
          type="text"
          placeholder="Name of your friend"
          value={username}
          onChange={handleUsernameChange}
          className="mb-10 px-10 py-2 border border-gray-300 rounded"
        />
        <input
          type="file"
          onChange={handleFileChange}
          className="mb-10 ml-24"
        />
        <button
          onClick={handleSubmit}
          className="px-4 py-2 bg-blue-500 text-white rounded"
        >
          Submit
        </button>
      </div>
      {Friends &&

          <div className='rounded-lg border border-black h-[60vh] w-1/4 flex flex-col overflow-y-auto'>
        {Friends && Friends.map((friend)=>(
            <Link href={`chat/${friend.chatId}`} key={friend.chatId} className=' w-full border-b  p-4 hover:bg-zinc-100'>{friend.FriendName}</Link>
            
        ))}
      </div>
    }
    </div>
  );
}
