"use client";
import axios from "axios";
import { useEffect, useState } from "react";

;

export default function Home() {
const [message, setMessage] = useState('');
  async function getUsers() {
    try {
      const { data } = await axios.get("/api/chat");
      console.log('data',data);
    } catch (error) {
      console.log(error);
    }
  }
  async function sendChat() {
    try {
      const { data } = await axios.post("/api/chat", {message});
      console.log('data',data);
    } catch (error) {
      console.log(error);
    }
  }

 /*  useEffect(() => {
    getUsers();
  }, []) */
  
  return (
    <main className="flex min-h-screen flex-col items-start justify-between p-24 font-mono border-2">
      {/* <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm lg:flex flex-col h-full"> */}
        <h2 className="my-2 text-xl">Chatbot POC</h2>
        <div className="flex-grow bg-gray-200 w-full p-4">Content</div>
        <div className="w-full border-2 flex justify-between items-center">
          <input value={message} onChange={(e) => setMessage(e.target.value)} className="w-full h-14 px-4 outline-none" type="text" placeholder="Type a Message" />
          <button onClick={() => sendChat()} className="bg-gray-300 h-14 px-4 py-2">Send</button>
        </div>
{/*       </div> */}
    </main>
  )
}
