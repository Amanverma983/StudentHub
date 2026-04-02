'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MessageCircle, X, Send, User, Bot, 
  ChevronRight, ExternalLink, Smartphone 
} from 'lucide-react';
import { SUPPORT_KNOWLEDGE_BASE, getBotResponse } from '@/lib/support-data';

export default function SupportChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'bot', content: SUPPORT_KNOWLEDGE_BASE.welcome, timestamp: new Date() }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage, timestamp: new Date() }]);

    setIsTyping(true);
    
    // Simulate thinking delay
    setTimeout(() => {
      const botResponse = getBotResponse(userMessage);
      setMessages(prev => [...prev, { role: 'bot', content: botResponse, timestamp: new Date() }]);
      setIsTyping(false);
    }, 800);
  };

  const handleQuickQuestion = (question) => {
    setInput(question);
  };

  return (
    <div className="fixed bottom-6 right-6 z-[999]">
      {/* Floating Bubble */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-premium transition-all ${
          isOpen ? 'bg-void text-white rotate-90' : 'bg-gradient-to-br from-violet-600 to-indigo-700 text-white shadow-glow-sm'
        }`}
      >
        {isOpen ? <X size={24} /> : <MessageCircle size={24} />}
      </motion.button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9, transformOrigin: 'bottom right' }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="absolute bottom-16 right-0 w-[350px] sm:w-[400px] h-[550px] glass-card rounded-[2.5rem] border border-glass-border shadow-2xl flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="p-6 bg-gradient-to-br from-violet-600/20 to-indigo-600/20 border-b border-glass-border">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-violet-600 flex items-center justify-center text-white shadow-glow-sm">
                  <Bot size={20} />
                </div>
                <div>
                  <h3 className="font-display font-700 text-ink text-sm">StudentHub Assistant</h3>
                  <p className="text-[10px] text-emerald-400 font-bold uppercase tracking-widest flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    Online Support
                  </p>
                </div>
              </div>
            </div>

            {/* Messages Body */}
            <div 
              ref={scrollRef}
              className="flex-1 overflow-y-auto p-6 space-y-4 scroll-smooth"
            >
              {messages.map((msg, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: msg.role === 'bot' ? -10 : 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className={`flex ${msg.role === 'bot' ? 'justify-start' : 'justify-end'}`}
                >
                  <div className={`max-w-[85%] p-4 rounded-3xl text-sm ${
                    msg.role === 'bot' 
                      ? 'bg-glass/50 text-ink border border-glass-border' 
                      : 'bg-violet-600 text-white shadow-lg'
                  }`}>
                    {msg.content}
                    {msg.role === 'bot' && msg.content === SUPPORT_KNOWLEDGE_BASE.fallback && (
                      <a 
                        href={`https://wa.me/${SUPPORT_KNOWLEDGE_BASE.admin_whatsapp}`}
                        target="_blank"
                        rel="noreferrer"
                        className="mt-3 flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white py-2 px-4 rounded-xl font-bold transition-all no-underline"
                      >
                        <Smartphone size={14} /> Talk to Admin
                      </a>
                    )}
                  </div>
                </motion.div>
              ))}
              
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-glass/50 p-4 rounded-3xl border border-glass-border flex gap-1">
                    {[0,1,2].map(i => <div key={i} className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-bounce" style={{ animationDelay: `${i*0.1}s` }} />)}
                  </div>
                </div>
              )}
            </div>

            {/* Quick Suggestions */}
            {messages.length < 3 && (
              <div className="px-6 pb-2 flex gap-2 overflow-x-auto no-scrollbar">
                {SUPPORT_KNOWLEDGE_BASE.faqs.slice(0, 3).map(faq => (
                  <button
                    key={faq.question}
                    onClick={() => handleQuickQuestion(faq.question)}
                    className="whitespace-nowrap px-3 py-1.5 rounded-full bg-glass border border-glass-border text-[10px] text-ink-muted hover:border-violet-500/50 hover:text-violet-400 transition-all"
                  >
                    {faq.question}
                  </button>
                ))}
              </div>
            )}

            {/* Input Footer */}
            <form onSubmit={handleSend} className="p-4 border-t border-glass-border flex gap-2">
              <input
                type="text"
                value={input}
                onChange={e => setInput(e.target.value)}
                placeholder="Puchiye apna sawaal..."
                className="flex-1 bg-void/50 border border-glass-border rounded-2xl px-4 py-2.5 text-sm text-ink focus:border-violet-500 outline-none transition-all placeholder:text-ink-subtle"
              />
              <button
                type="submit"
                disabled={!input.trim()}
                className="w-10 h-10 rounded-xl bg-violet-600 flex items-center justify-center text-white disabled:opacity-50 disabled:grayscale hover:bg-violet-700 transition-all shadow-glow-sm"
              >
                <Send size={18} />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
