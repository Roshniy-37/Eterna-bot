"use client";

import React, { useEffect, useState } from 'react';
import { ScrollArea } from "@/components/ui/scroll-area";
import Image from 'next/image';
import botImage from '@/public/ETERNA.svg';
import { useUser } from '@clerk/nextjs';
import { usePathname, useRouter } from 'next/navigation';
import { verifyFID } from '@/actions/server';

interface Message {
  sender: 'user' | 'agent';
  message: string | null;
}

function ChatSection() {
  const router = useRouter();
  const pathname = usePathname()
  const { user } = useUser();
  const fid = pathname.split('/chat/')[1]


  useEffect(()=>{
    async function verifyChat(){
      if(!user){
        router.replace('/');
        return;
      }
      if(!user.username) return;
      const res = await verifyFID(user.username, fid);
      if(!res){
        router.replace('/');
        return;
      }else{
        console.log("Successfully Connected!!")
      }
    }
    verifyChat()
  }, [user])

  const [messages, setMessages] = useState<Message[]>([
    { sender: 'agent', message: 'Hello! How can I assist you today?' }
  ]);
  const [input, setInput] = useState("");

  const handleSend = async () => {
    if (input.trim() === "") return;

    // Append user message to chat
    const newMessages: Message[] = [...messages, { sender: 'user', message: input } as Message];
    setMessages(newMessages);

    // Call API for bot response
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: input }),
      });
      
      const data = await response.json();
      
      if (data?.response) {
        setMessages((prevMessages) => [
          ...prevMessages,
          { sender: 'agent', message: data.response } as Message,
        ]);
      }
    } catch (error) {
      console.error("Error fetching response:", error);
      setMessages((prevMessages) => [
        ...prevMessages,
        { sender: 'agent', message: "Sorry, I'm having trouble responding right now." } as Message,
      ]);
    }

    // Clear input
    setInput("");
  };

  return (
    <div className="mt-4 flex flex-col mx-auto w-5/6 min-h-[75vh] h-[75vh] border border-gray-300 rounded-lg shadow-md overflow-hidden">
      
      {/* Scrollable Chat Area */}
      <ScrollArea className="w-full h-full flex-1 p-4 space-y-3 overflow-y-auto bg-gray-50">
        {messages.map((msg, index) => (
          msg.message && (
            <div
              key={index}
              className={`flex items-start my-1 space-x-2 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {msg.sender === 'agent' && (
                <Image
                  src={botImage}
                  alt="Bot"
                  width={40}
                  height={40}
                  className="rounded-full bg-black"
                />
              )}
              <div className={`max-w-[70%] p-3 rounded-lg ${msg.sender === 'user' ? 'bg-green-100 text-gray-800' : 'bg-blue-100 text-gray-800'}`}>
                {msg.message}
              </div>
              {msg.sender === 'user' && (
                <Image
                  src="/user-profile-pic.png"
                  alt="User"
                  width={40}
                  height={40}
                  className="rounded-full bg-black"
                />
              )}
            </div>
          )
        ))}
      </ScrollArea>

      {/* Chat Input */}
      <div className="border-t p-2 bg-white flex items-center space-x-2 bottom-0">
        <input
          type="text"
          placeholder="Type a message..."
          className="flex-1 p-2 border border-gray-300 rounded-md outline-none focus:ring focus:ring-blue-200"
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <button
          type="submit"
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
          onClick={handleSend}
        >
          Send
        </button>
      </div>
    </div>
  );
}

export default ChatSection;
