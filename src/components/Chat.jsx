import React, { useState } from 'react';
import apiClient from '../utils/apiClient'; // Using your existing utility

const Chat = () => {
  const [message, setMessage] = useState("");
  const [chatHistory, setChatHistory] = useState([]);
  const [isSending, setIsSending] = useState(false);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!message.trim() || isSending) return;

    const userMessage = { text: message, sender: 'user', timestamp: new Date() };
    setChatHistory(prev => [...prev, userMessage]);
    setMessage("");
    setIsSending(true);

    try {
      // Triggering your specific webhook endpoint
      const response = await apiClient.post('/webhook/bank/chat', {
        message: userMessage.text,
      });

      const botResponse = { 
        text: response.data.reply || "Message received by bank.", 
        sender: 'bank', 
        timestamp: new Date() 
      };
      setChatHistory(prev => [...prev, botResponse]);
    } catch (error) {
      console.error("Chat Webhook Error:", error);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="flex flex-col h-[500px] bg-white border-4 border-gray-400 rounded-xl shadow-2xl overflow-hidden">
      {/* Chat Header */}
      <div className="bg-[#003366] p-4 text-white font-black uppercase text-center">
        DIB Secure Support
      </div>

      {/* Message Area */}
      <div className="flex-grow p-4 overflow-y-auto bg-gray-50 space-y-4">
        {chatHistory.map((msg, i) => (
          <div key={i} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[80%] p-3 rounded-lg font-bold shadow-md ${
              msg.sender === 'user' 
                ? 'bg-[#003366] text-white rounded-br-none' 
                : 'bg-white border-2 border-gray-300 text-black rounded-bl-none'
            }`}>
              {msg.text}
            </div>
          </div>
        ))}
      </div>

      {/* Input Area */}
      <form onSubmit={handleSendMessage} className="p-4 border-t-4 border-gray-200 bg-white flex gap-2">
        <input 
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Ask a question..."
          className="flex-grow p-3 border-2 border-gray-400 rounded-lg text-black font-bold outline-none"
        />
        <button 
          type="submit"
          disabled={isSending}
          style={{ backgroundColor: '#003366' }}
          className="text-white px-6 py-2 rounded-lg font-black uppercase shadow-lg border-2 border-white active:scale-95 disabled:opacity-50"
        >
          {isSending ? '...' : 'Send'}
        </button>
      </form>
    </div>
  );
};

export default Chat;
