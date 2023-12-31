/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import React, { createRef } from "react";
import axios from "axios";
import { useEffect, useState } from "react";
import remarkGfm from "remark-gfm";
import Markdown from "react-markdown";
import { MessagesSquare, X, SendHorizontal, Loader, Bot, Trash, User2 } from "lucide-react";
import Pusher from "pusher-js";

const Chat = () => {
  const [realMsg, setRealMsg] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<{ message: string; ai: string }[]>([]);
  const messagesEndRef = createRef() as React.MutableRefObject<HTMLDivElement>;
  const inputRef = createRef() as React.MutableRefObject<HTMLInputElement>;
  async function getUsers() {
    try {
      const { data } = await axios.get("/api/resource");
    } catch (error) {
      console.log(error);
    }
  }
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if(e.key === 'Enter'){
      sendChat();
    }
  };
  async function sendChat() {
    try {
      setLoading(true);
      await setMessages([...messages, { message: message, ai: "" }]);
      console.log("messages", messages);

      setMessage("");
      let newMessages = [...messages];
      const lastMessages = newMessages.slice(-5);
      const { data } = await axios.post("/api/chat", { message, history: lastMessages });
      setMessages([...newMessages, data]);
      setLoading(false);
      setRealMsg('');
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  }

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    inputRef.current?.focus();
  }, [messages]);

  useEffect(() => {
    getUsers();
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    inputRef.current?.focus();

    var pusher = new Pusher('cdade7dc808a6745c219', {
      cluster: 'us2'
    });
    var channel = pusher.subscribe('process-status');
    channel.bind('status-update', function(data: {message: string}) {
      // alert(JSON.stringify(data));
      if (data.message !== realMsg) {
        setRealMsg(data.message);
      }
    });
  }, []);
  return (
    <>
      {open ? (
        <div className="fixed bottom-3 right-3 min-w-[400px] max-w-[670px] h-[680px] bg-white flex flex-col items-start justify-between font-mono border-2">
          <div className="px-2 flex justify-between items-center w-full">
            <h2 className="my-2 text-xl">Chatbot POC</h2>
            <div className="flex justify-end items-center gap-2">
              {/* Clear chat history */}
              <Trash className="cursor-pointer" onClick={() => setMessages([])} />
              {/* Close chat */}
              <X className="cursor-pointer" onClick={() => setOpen(!open)} />
            </div>
          </div>
          <div className="flex-grow bg-gray-200 w-full p-4 overflow-y-auto">
            {messages.map((message, index) => {
              return (
                <div key={index} className="flex flex-col mb-4">
                  <div className="flex justify-between flex-col gap-4">
                    <div className="flex justify-start items-center overflow-x-auto">
                      <p className="flex text-sm bg-white rounded-xl rounded-bl-none py-2 px-2.5 max-w-[70%] min-w-[60px] w-fit shadow-2xl">
                        {message.message}
                      </p>
                    </div>
                    <div className="flex justify-end items-center gap-1">
                      {message.ai ? (
                        <div className="overflow-x-auto text-sm text-white bg-gray-950 rounded-xl max-w-[95%] rounded-br-none py-2 px-2.5 w-fit shadow-2xl">
                          <Markdown remarkPlugins={[remarkGfm]}>
                            {message.ai}
                          </Markdown>
                        </div>
                      ): (<span className="text-gray-500 text-sm">{realMsg ? realMsg : 'Processing...'} </span>)}
                      <Bot />
                      
                    </div>
                  </div>
                </div>
              );
            })}
            <div ref={messagesEndRef} />
            {
              messages.length === 0 && (
                <div className="flex justify-center items-center h-full">
                  <p className="text-lg text-gray-500">Hi! How can I help you today?</p>
                </div>
              )
            }
          </div>
          <div className="w-full border-2 flex justify-between items-center">
            <input
              ref={inputRef}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full h-14 px-4 outline-none"
              type="text"
              placeholder="Type a Message"
              disabled={loading}
              autoFocus
              onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => handleKeyDown(e)}
            />
            <button
              onClick={() => sendChat()}
              className="bg-gray-300 h-14 px-4 py-2"
            >
              {loading ? (
                <Loader className="animate-spin" />
              ) : (
                <SendHorizontal />
              )}
            </button>
          </div>
        </div>
      ) : (
        <div
          onClick={() => setOpen(!open)}
          className="fixed right-4 h-16 w-16 bg-red-700 rounded-full bottom-4 flex justify-center items-center cursor-pointer"
        >
          <MessagesSquare className="text-white text-lg" />
        </div>
      )}
    </>
  );
};

export default Chat;
