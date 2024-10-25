import React, { useState, } from 'react'
import { ScrollArea } from "@/components/ui/scroll-area"
import Image from 'next/image'

// Define the shape of each message, allowing message to be null
interface Message {
  sender: 'user' | 'agent';
  message: string | null;
}

function ChatSection() {
  // Dummy chat data with TypeScript type annotation and potential null messages
  const [messages, setMessages] = useState<Message[]>([
    { sender: 'agent', message: 'Hello! How can I assist you today?' },
    { sender: 'user', message: 'I`d like to know more about career opportunities in tech.' },
    { sender: 'agent', message: 'Sure, I can provide you with some insights on that.' },
    { sender: 'user', message: 'What is the most in-demand skill in tech right now?' },
    { sender: 'agent', message: 'Artificial Intelligence and Cloud Computing are currently very hot.' },
    { sender: 'user', message: 'Thanks for the info!' },
    { sender: 'agent', message: null }, // Example of a null message
  ]);

  return (
    <div className="mt-4 flex flex-col mx-auto w-5/6 h-3/4 min-h-[75vh] border border-gray-300 rounded-lg shadow-md overflow-hidden">
      
      {/* Scrollable Chat Area */}
      <ScrollArea className="w-full h-full flex-1 p-4 space-y-3 overflow-y-auto bg-gray-50">
        {/* Loop through the messages array to dynamically generate chat bubbles */}
        {messages.map((msg, index) => (
          msg.message && ( // Only render non-null messages
            <div
              key={index}
              className={`flex items-start space-x-2 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {msg.sender === 'agent' && (
                <Image
                  src="/bot-profile-pic.png"  // Replace with actual bot image source
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
                  src="/user-profile-pic.png"  // Replace with actual user image source
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

