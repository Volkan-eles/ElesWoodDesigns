'use client';

import React, { useState, useRef, useEffect } from 'react';

interface Message {
  id: string;
  sender: 'bot' | 'user';
  text: string;
  timestamp: string;
}

export default function ChatbotWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      sender: 'bot',
      text: '👋 Hello! Welcome to ElesWoodDesigns. How can I help you today?',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const quickQuestions = [
    '📥 How do I receive my PDF plans?',
    '🪵 What materials do I need?',
    '💳 Accepted payment methods?',
    '✉️ Contact support team',
  ];

  const handleSend = (textToSend?: string) => {
    const text = textToSend || input.trim();
    if (!text) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      sender: 'user',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInput('');

    // Generate Smart Bot Response
    setTimeout(() => {
      let botReply = '';
      const lower = text.toLowerCase();

      if (lower.includes('download') || lower.includes('pdf') || lower.includes('receive')) {
        botReply = 'Instant Digital Delivery! Right after checkout, a download link is sent to your email by Polar.sh. You can also download files immediately from the confirmation page.';
      } else if (lower.includes('material') || lower.includes('wood') || lower.includes('tool')) {
        botReply = 'All our woodworking blueprints include complete material cut lists, shopping lists, and required tool guides (standard 2x4s, plywood, miter saw, etc.).';
      } else if (lower.includes('payment') || lower.includes('pay') || lower.includes('card')) {
        botReply = 'We accept Google Pay, Apple Pay, PayPal, Visa, Mastercard, and American Express securely via Stripe.';
      } else if (lower.includes('contact') || lower.includes('human') || lower.includes('support') || lower.includes('help')) {
        botReply = 'You can reach our human support team anytime at eleswooddesigns@gmail.com or visit our Contact page!';
      } else if (lower.includes('return') || lower.includes('refund')) {
        botReply = 'Due to the instant digital nature of PDF blueprints, sales are generally final. However, if you have any issues with a file, email us at eleswooddesigns@gmail.com and we will fix it immediately!';
      } else {
        botReply = `Thanks for reaching out! For detailed inquiries regarding "${text}", please feel free to email our team directly at eleswooddesigns@gmail.com.`;
      }

      const botMsg: Message = {
        id: (Date.now() + 1).toString(),
        sender: 'bot',
        text: botReply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, botMsg]);
    }, 600);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 font-sans">
      {/* Floating Chat Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="btn-neo flex items-center gap-2 bg-[#FFE500] text-black font-black py-3 px-5 border-3 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] transition-all text-sm uppercase"
        >
          <span className="text-xl">🤖</span>
          <span>AI Support</span>
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="w-[340px] sm:w-[380px] h-[480px] bg-[#FFFDF0] border-4 border-black shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] flex flex-col overflow-hidden">
          {/* Header */}
          <div className="bg-[#FFE500] border-b-4 border-black p-4 flex justify-between items-center">
            <div className="flex items-center gap-2">
              <span className="text-2xl">🤖</span>
              <div>
                <h3 className="font-black text-sm uppercase tracking-tight text-black">ElesWood Assistant</h3>
                <span className="text-[10px] font-bold text-green-700 uppercase flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-green-600 animate-pulse"></span> Online 24/7
                </span>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="w-8 h-8 font-black text-lg border-2 border-black bg-white hover:bg-red-500 hover:text-white flex items-center justify-center transition-colors text-black"
            >
              ✕
            </button>
          </div>

          {/* Messages Area */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-[#FFFDF0]">
            {messages.map((m) => (
              <div
                key={m.id}
                className={`flex flex-col ${m.sender === 'user' ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`max-w-[85%] p-3 border-2 border-black text-xs font-bold leading-relaxed ${
                    m.sender === 'user'
                      ? 'bg-[#FFE500] text-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]'
                      : 'bg-white text-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]'
                  }`}
                >
                  {m.text}
                </div>
                <span className="text-[9px] font-bold text-gray-500 mt-1 px-1">{m.timestamp}</span>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Questions */}
          <div className="p-2 border-t-2 border-black bg-white flex gap-1.5 overflow-x-auto no-scrollbar">
            {quickQuestions.map((q, idx) => (
              <button
                key={idx}
                onClick={() => handleSend(q)}
                className="whitespace-nowrap text-[10px] font-bold border border-black bg-[#FFFDF0] px-2 py-1 hover:bg-[#FFE500] transition-colors text-black"
              >
                {q}
              </button>
            ))}
          </div>

          {/* Input Area */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="p-3 border-t-4 border-black bg-white flex gap-2"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask a question..."
              className="flex-1 border-2 border-black px-3 py-2 text-xs font-bold focus:outline-none focus:bg-[#FFFDF0] text-black"
            />
            <button
              type="submit"
              className="btn-neo bg-[#FFE500] px-4 py-2 border-2 border-black font-black text-xs uppercase text-black"
            >
              Send
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
