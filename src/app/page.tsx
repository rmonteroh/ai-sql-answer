"use client";
import axios from "axios";
import { useEffect, useState } from "react";
import remarkGfm from 'remark-gfm'
import Markdown from 'react-markdown'

;

export default function Home() {
const [loading, setLoading] = useState(false);
const [message, setMessage] = useState('');
const [messages, setMessages] = useState<{message: string, ai: string}[]>([
  {
    "message": "Can you create a breakout schedule for carpenter and architect activities? I only want to see structural framing activities and Blueprint Analysis.",
    "ai": "The breakout schedule for carpenter and architect activities, specifically for structural framing and blueprint analysis, is as follows:\n\n| Task Name           | Commencement Date | Conclusion Date | Duration |\n|---------------------|-------------------|-----------------|----------|\n| Structural Framing  | 2023-10-20        | 2023-10-23      | 3        |\n| Blueprint Analysis  | 2023-10-14        | 2023-10-17      | 3        |\n| Structural Framing  | 2023-10-29        | 2023-11-01      | 3        |\n| Structural Framing  | 2023-11-01        | 2023-11-04      | 3        |\n| Structural Framing  | 2023-11-03        | 2023-11-06      | 3        |"
}
]);
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
      setLoading(true);
      await setMessages([...messages, {message: message, ai: ''}]);
      console.log('messages',messages);
      
      setMessage('');
      const { data } = await axios.post("/api/chat", {message});
      console.log('data',data);
      let newMessages = [...messages]; 
      console.log('newMessages',newMessages);
      newMessages[messages.length - 1] = data as {message: string, ai: string};
      
      setMessages([...newMessages]);
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  }

 /*  useEffect(() => {
    getUsers();
  }, []) */
  
  return (
    <main className="flex min-h-screen flex-col items-start justify-between p-24 font-mono border-2">
      {/* <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm lg:flex flex-col h-full"> */}
        <h2 className="my-2 text-xl">Chatbot POC</h2>
        <div className="flex-grow bg-gray-200 w-full p-4">{
          messages.map((message, index) => {
            return <div key={index} className="flex flex-col">
              <div className="flex justify-between flex-col gap-4">
                <div className="flex justify-start items-center">
                  <p className="flex text-sm bg-white rounded-xl rounded-bl-none py-2 px-2.5 max-w-[70%] min-w-[60px] w-fit">{message.message}</p>
                </div>
                <div className="flex justify-end items-center">
                  {
                    message.ai && (
                      <div className="text-sm text-white bg-black rounded-xl max-w-[95%] rounded-br-none py-2 px-2.5 w-fit">
                        <Markdown remarkPlugins={[remarkGfm]}>{message.ai}</Markdown>
                      </div>
                    )
                  }
                </div>
              </div>
            </div>
          })
        }</div>
        <div className="w-full border-2 flex justify-between items-center">
          <input value={message} onChange={(e) => setMessage(e.target.value)} className="w-full h-14 px-4 outline-none" type="text" placeholder="Type a Message" />
          <button onClick={() => sendChat()} className="bg-gray-300 h-14 px-4 py-2">{loading ? 'Loading ...' : 'Send'}</button>
        </div>
{/*       </div> */}
    </main>
  )
}
