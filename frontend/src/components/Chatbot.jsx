import React, { useState, useContext, useRef, useEffect } from 'react';
import { DemoContext } from '../context/DemoContext';
import { chatWithAI } from '../services/api';
import { Send, X, Bot, BrainCircuit } from 'lucide-react';

const Chatbot = () => {
  const { 
    darkMode, 
    chatbotMessages, 
    setChatbotMessages,
    showChatbot,
    setShowChatbot,
    role
  } = useContext(DemoContext);

  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatbotMessages]);

  const handleSend = async (textToSend) => {
    if (!textToSend.trim()) return;

    const userMessage = { 
      id: Date.now(), 
      sender: 'user', 
      text: textToSend, 
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) 
    };
    setChatbotMessages(prev => [...prev, userMessage]);
    setLoading(true);

    try {
      // Connect to local Spring Boot API via helper
      const data = await chatWithAI(textToSend, role);
      setChatbotMessages(prev => [...prev, { 
        id: Date.now() + 1, 
        sender: 'bot', 
        text: data.reply,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) 
      }]);
    } catch (err) {
      // Offline fallback: Use local AI simulation from model file
      setTimeout(() => {
        const reply = simulateLocalResponse(textToSend, role);
        setChatbotMessages(prev => [...prev, { 
          id: Date.now() + 1, 
          sender: 'bot', 
          text: reply,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) 
        }]);
      }, 700);
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    const msg = input;
    setInput('');
    handleSend(msg);
  };

  const simulateLocalResponse = (message, userRole) => {
    const msg = message.toLowerCase();
    if (msg.includes("eligibility") || msg.includes("eligible") || msg.includes("can i donate")) {
      return "You must be between 18-65 years old, weigh at least 50 kg, and have had no donations in the past 90 days (3 months). This matches the eligibility rules in our system.";
    }
    if (msg.includes("compatibility") || msg.includes("blood group") || msg.includes("match")) {
      return "Compatibility Guidelines:\n- O- is the Universal Donor (can donate to all, receives only O-)\n- AB+ is the Universal Recipient (can receive from all, donates only AB+)\n- A+ can receive A+, A-, O+, O-\n- B+ can receive B+, B-, O+, O-";
    }
    if (msg.includes("sos") || msg.includes("emergency") || msg.includes("request")) {
      return "To broadcast an emergency request, switch to the 'Seeker' dashboard, specify the blood group and location coordinates, and hit 'SOS broadcast'. Matching available donors will instantly receive alert notifications.";
    }
    if (msg.includes("badge") || msg.includes("hero")) {
      return "Complete 5 donations via QR scan to earn the HERO BADGE! The leaderboard displays all community rankings based on total lives saved.";
    }
    return "I am LifeLink AI, your emergency blood network assistant. I can help with donor compatibility, eligibility limits, emergency SOS, and badging rules. Ask me anything!";
  };

  const quickReplies = [
    "Check eligibility criteria",
    "Show blood compatibility matrix",
    "How to trigger emergency SOS?"
  ];

  if (!showChatbot) return null;

  return (
    <div className={`fixed bottom-6 right-6 w-96 h-[500px] rounded-2xl shadow-2xl flex flex-col z-50 border transition-all duration-300 ${
      darkMode ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-800'
    }`}>
      {/* Header */}
      <div className="p-4 border-b border-inherit flex items-center justify-between bg-gradient-to-r from-red-600 to-rose-600 rounded-t-2xl text-white">
        <div className="flex items-center gap-2">
          <BrainCircuit className="w-5 h-5 animate-pulse" />
          <div>
            <h3 className="font-bold text-sm">LifeLink AI Assistant</h3>
            <p className="text-[10px] text-white/80">Gemini Powered Guidance</p>
          </div>
        </div>
        <button 
          onClick={() => setShowChatbot(false)}
          className="p-1 hover:bg-white/10 rounded-lg transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {chatbotMessages.map((m) => (
          <div 
            key={m.id} 
            className={`flex gap-2 max-w-[85%] ${m.sender === 'user' ? 'ml-auto flex-row-reverse' : ''}`}
          >
            {m.sender === 'bot' && (
              <div className="w-7 h-7 rounded-lg bg-red-100 dark:bg-red-950 flex items-center justify-center shrink-0">
                <Bot className="w-4 h-4 text-red-500" />
              </div>
            )}
            <div className="flex flex-col">
              <div className={`p-3 rounded-xl text-xs leading-relaxed whitespace-pre-line ${
                m.sender === 'user'
                  ? 'bg-red-600 text-white rounded-tr-none'
                  : darkMode 
                    ? 'bg-slate-800 text-slate-100 rounded-tl-none border border-slate-700/50' 
                    : 'bg-slate-100 text-slate-800 rounded-tl-none border border-slate-200'
              }`}>
                {m.text}
              </div>
              <span className={`text-[8px] text-slate-500 mt-1 ${m.sender === 'user' ? 'text-right' : ''}`}>
                {m.time || '10:00 AM'}
              </span>
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex gap-2 max-w-[80%] items-center text-xs text-slate-500">
            <Bot className="w-4 h-4 text-red-500 animate-bounce" />
            <div className="flex gap-1 items-center">
              <span>AI is analyzing request</span>
              <span className="animate-pulse">...</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Quick Replies */}
      <div className="px-3 py-2 border-t border-inherit flex gap-1.5 overflow-x-auto whitespace-nowrap bg-slate-950/20">
        {quickReplies.map((qr, idx) => (
          <button
            key={idx}
            onClick={() => handleSend(qr)}
            className={`text-[9px] px-2.5 py-1 rounded-full border transition hover:scale-102 ${
              darkMode ? 'bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-800' : 'bg-slate-100 border-slate-250 text-slate-600 hover:bg-slate-200'
            }`}
          >
            {qr}
          </button>
        ))}
      </div>

      {/* Input */}
      <form onSubmit={onSubmit} className="p-3 border-t border-inherit flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask about eligibility, matches, SOS..."
          className={`flex-1 px-3 py-2 text-xs rounded-lg border focus:outline-none focus:ring-1 focus:ring-red-500 ${
            darkMode ? 'bg-slate-950 border-slate-800 text-white' : 'bg-slate-50 border-slate-200 text-slate-800'
          }`}
        />
        <button
          type="submit"
          className="p-2 rounded-lg bg-red-600 text-white hover:bg-red-700 transition-colors"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
};

export default Chatbot;
