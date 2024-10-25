import React, { } from 'react'
import { ScrollArea } from "@/components/ui/scroll-area"
import Image from 'next/image'  // Importing Next.js Image component


function ChatSection() {
  return (

    


    <div className="mt-4 flex flex-col mx-auto w-5/6 h-3/4 min-h-[75vh] border border-gray-300 rounded-lg shadow-md overflow-hidden">
      
      {/* Scrollable Chat Area */}
      <ScrollArea className="w-full h-full flex-1 p-4 space-y-3 overflow-y-auto bg-gray-50">
        
        {/* Chatbot message with bot profile picture */}
        <div className="flex justify-start items-start space-x-2">
          <Image 
            src="/bot-profile-pic.png"  // Replace with actual bot image source
            alt="Bot" 
            width={40}
            height={40}
            className="rounded-full bg-black"
          />
          <div className="max-w-[70%] p-3 bg-blue-100 text-gray-800 rounded-lg">
            Hello! How can I assist you today?
          </div>
        </div>
        
        {/* User message with user profile picture */}
        <div className="flex justify-end items-start space-x-2">
          <div className="max-w-[70%] p-3 bg-green-100 text-gray-800 rounded-lg">
            I`d like to know more about career opportunities in tech.
          </div>
          <Image 
            src="/user-profile-pic.png"  // Replace with actual user image source
            alt="User" 
            width={40}
            height={40}
            className="rounded-full bg-black"
          />
        </div>
        
        {/* More chat bubbles */}
      </ScrollArea>

      {/* Chat Input */}
      <div className="border-t p-2 bg-white flex items-center space-x-2 bottom-0">
        <input
          type="text"
          placeholder="Type a message..."
          className="flex-1 p-2 border border-gray-300 rounded-md outline-none focus:ring focus:ring-blue-200"
        />
        <button
          type="submit"
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
        >
          Send
        </button>
      </div>
    </div>
  )
}

export default ChatSection
