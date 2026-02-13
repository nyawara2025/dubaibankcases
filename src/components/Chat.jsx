import React, { useState, useRef, useEffect } from 'react';
import apiClient from '../utils/apiClient';

const Chat = () => {
  const [message, setMessage] = useState("");
  const [chatHistory, setChatHistory] = useState();
  const [isSending, setIsSending] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [chatHistory]);

  const userData = JSON.parse(localStorage.getItem('soc_user')) || { name: 'Unknown' };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!message.trim() || isSending) return;

    const currentMessage = message;
    const userMsgObj = { text: currentMessage, sender: 'user', timestamp: new Date() };
    
    setChatHistory((prev) => [...(prev || []), userMsgObj]);
    setMessage("");
    setIsSending(true);

    try {
      const response = await apiClient.post('https://n8n.tenear.com/webhook/bank/chat', {
        event: "MESSAGE_SENT",
        user: userData.name,
        message: currentMessage,
        role: userData.role || "operator",
        timestamp: new Date().toISOString()
      });

      const botReply = { 
        text: response.data?.reply || "Directive received. Processing...", 
        sender: 'bank', 
        timestamp: new Date() 
      };
      setChatHistory((prev) => [...(prev || []), botReply]);
    } catch (error) {
      const errorMsg = { text: "Connection lost. Command Center unreachable.", sender: 'bank' };
      setChatHistory((prev) => [...(prev || []), errorMsg]);
    } finally {
      setIsSending(false);
    }
  };

  return (
    /* Changed to min-height and flex-1 to fill the dashboard space properly */
    <div className="flex flex-col w-full max-w-4xl mx-auto bg-white border-4 border-gray-400 rounded-xl shadow-2xl overflow-hidden min-h-[500px]">
      
      {/* Header */}
      <div className="bg-[#003366] p-4 text-white font-black uppercase text-center flex justify-between items-center shrink-0">
        <span>DIB Secure Support</span>
        <span className="text-[10px] bg-emerald-500 px-2 py-1 rounded animate-pulse">Encrypted</span>
      </div>

      {/* Message Area - Forced to grow */}
      <div ref={scrollRef} className="flex-1 p-4 overflow-y-auto bg-gray-50 space-y-4 min-h-[300px]">
        {chatHistory?.map((msg, i) => (
          <div key={i} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] p-3 rounded-lg font-bold shadow-md ${
              msg.sender === 'user' 
                ? 'bg-[#003366] text-white rounded-br-none' 
                : 'bg-white border-2 border-gray-300 text-black rounded-bl-none italic'
            }`}>
              {msg.text}
            </div>
          </div>
        ))}
      </div>

      {/* Input Area - Visible at the bottom */}
      <form onSubmit={handleSendMessage} className="p-3 border-t-4 border-gray-200 bg-white flex items-center gap-2 shrink-0">
        <input 
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Enter command..."
          className="flex-grow p-3 border-2 border-gray-400 rounded-lg text-black font-bold outline-none focus:border-[#003366] text-base"
        />
        <button 
          type="submit"
          disabled={isSending}
          className="bg-[#003366] text-white px-5 py-3 rounded-lg font-black uppercase shadow-lg border-2 border-white active:scale-95 disabled:opacity-50 min-w-[90px]"
        >
          {isSending ? '...' : 'Send'}
        </button>
      </form>
    </div>
  );
};

export default Chat;
