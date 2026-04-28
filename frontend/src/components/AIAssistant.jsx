import { useState, useRef } from 'react';
import { MessageSquare, X, Send, Bot, Settings, Key } from 'lucide-react';

const SSE_CONTEXT = `You are an AI assistant for SSE Impact Hub - India's first Social Stock Exchange platform. You help users understand:
- ZCZP (Zero Coupon Zero Principal) bonds - social impact investment instruments
- 80G tax benefits - tax deductions on donations to verified NGOs
- NGO verification and impact tracking
- Social Return on Investment (SROI)
- Green funds and sustainable investing

Key facts:
- Minimum investment is ₹1,000
- All NGOs are SEBI registered and verified under 12A/80G
- Investors get instant 80G tax receipts
- Platform is powered by Social Stock Exchange
- Tax benefits: 30% bracket gets ₹3,000 tax saving per ₹10,000 invested

Always be helpful, concise, and informative. If you don't know something, suggest users check the dashboard or contact support.`;

export default function AIAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [showSettings, setShowSettings] = useState(false);
  const [apiKey, setApiKey] = useState(() => localStorage.getItem('gemini_api_key') || 'AIzaSyCfg2Wo9d9W6pGiCWeFa8fwWFqKSjZGAmk');
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState([
    { text: "Hi! I'm your SSE Hub assistant. I can help you understand ZCZP bonds, 80G tax benefits, or recommend NGOs. How can I help?", isBot: true }
  ]);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSaveApiKey = () => {
    if (apiKey.trim()) {
      localStorage.setItem('gemini_api_key', apiKey.trim());
      setShowSettings(false);
    }
  };

  const callGeminiAPI = async (userMessage) => {
    if (!apiKey) {
      return "⚠️ Please configure your Gemini API key in settings to enable AI responses.";
    }

    setIsLoading(true);
    
    try {
      // Use gemini-2.0-flash as primary model
      const response = await fetch(`https://generativelanguage.googleapis.com/v1/models/gemini-2.0-flash:generateContent?key=${apiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: `${SSE_CONTEXT}\n\nUser question: ${userMessage}`
            }]
          }],
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 500,
          }
        })
      });

      const data = await response.json();
      
      if (data.error) {
        // If quota exceeded or model not found, try alternative
        if (data.error.code === 429 || data.error.message?.includes('quota') || data.error.message?.includes('not found')) {
          return tryAlternativeModel(userMessage);
        }
        return `⚠️ API Error: ${data.error.message}`;
      }
      
      if (data.candidates && data.candidates[0]?.content?.parts[0]?.text) {
        return data.candidates[0].content.parts[0].text;
      }
      
      return "I couldn't generate a response. Please try again.";
    } catch (error) {
      return `⚠️ Connection error: ${error.message}. Using fallback responses instead.`;
    } finally {
      setIsLoading(false);
    }
  };

  const tryAlternativeModel = async (userMessage) => {
    const models = [
      'gemini-1.5-flash',
      'gemini-pro'
    ];
    
    for (const model of models) {
      try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1/models/${model}:generateContent?key=${apiKey}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            contents: [{
              parts: [{
                text: `${SSE_CONTEXT}\n\nUser question: ${userMessage}`
              }]
            }],
            generationConfig: {
              temperature: 0.7,
              maxOutputTokens: 500,
            }
          })
        });

        const data = await response.json();
        
        if (data.candidates && data.candidates[0]?.content?.parts[0]?.text) {
          return data.candidates[0].content.parts[0].text;
        }
      } catch (e) {
        continue;
      }
    }
    
    // All APIs failed, use fallback
    return getRuleBasedResponse(userMessage);
  };

  const handleSend = async () => {
    if (!input.trim()) return;
    
    const userMsg = input.trim();
    setMessages(prev => [...prev, { text: userMsg, isBot: false }]);
    setInput('');
    scrollToBottom();
    
    // Try API first, fallback to rule-based if quota exceeded
    try {
      const reply = await callGeminiAPI(userMsg);
      setMessages(prev => [...prev, { text: reply, isBot: true }]);
    } catch (e) {
      // Fallback to rule-based responses
      const reply = getRuleBasedResponse(userMsg);
      setMessages(prev => [...prev, { text: reply, isBot: true }]);
    }
    scrollToBottom();
  };

  const getRuleBasedResponse = (query) => {
    const lower = query.toLowerCase();
    
    if (lower.includes('80g') || lower.includes('tax benefit') || lower.includes('tax deduction')) {
      return `🎯 <b>Section 80G Tax Benefits</b><br/><br/>
✅ Allows tax deductions on donations to verified NGOs<br/>
💰 <b>30% tax bracket:</b> ₹10,000 investment = ₹3,000 tax savings<br/>
💰 <b>20% tax bracket:</b> ₹10,000 investment = ₹2,000 tax savings<br/>
📄 Instant 80G receipts generated after investment<br/>
🏢 NGOs must be registered under 12A & 80G`;
    }
    
    if (lower.includes('zczp') || lower.includes('bond') || lower.includes('zero coupon')) {
      return `📊 <b>ZCZP Bonds</b> (Zero Coupon Zero Principal)<br/><br/>
🏛️ Instruments listed on Social Stock Exchange<br/>
💸 No financial returns or principal paid back<br/>
🌍 100% of capital goes to social impact<br/>
📈 Listed and regulated by SEBI<br/>
📊 Investors receive 'Social Return on Investment' (SROI)<br/>
💵 Minimum investment: ₹1,000`;
    }
    
    if (lower.includes('ngo') || lower.includes('organization') || lower.includes('donate')) {
      return `🤝 <b>Verified NGOs on SSE Impact Hub</b><br/><br/>
✅ All NGOs are SEBI registered<br/>
✔️ Verified under 12A & 80G provisions<br/>
📊 Trackable impact reporting<br/>
🏷️ Categories: Education, Healthcare, Environment, Women Empowerment<br/>
📈 Real-time funding progress on dashboard`;
    }
    
    if (lower.includes('sroi') || lower.includes('impact') || lower.includes('social return')) {
      return `📈 <b>Social Return on Investment (SROI)</b><br/><br/>
📏 Measures non-financial impact of investments<br/>
💵 For every ₹1,000 invested, ~₹3,500 social value created<br/>
🏷️ Categories: Education, Healthcare, Environment<br/>
🔍 Transparent impact tracking on dashboard<br/>
📋 Verified impact metrics from NGOs`;
    }
    
    if (lower.includes('minimum') || lower.includes('invest') || lower.includes('start')) {
      return `🚀 <b>Getting Started</b><br/><br/>
💵 Minimum investment: ₹1,000<br/>
📝 Create account via KYC process<br/>
🔍 Browse verified NGOs on Dashboard<br/>
💳 Select NGO → Enter amount → Pay via UPI<br/>
📄 Instant 80G tax receipt generated<br/>
💼 Track investments in Portfolio`;
    }
    
    if (lower.includes('green') || lower.includes('environment') || lower.includes('climate')) {
      return `🌱 <b>Green Funds</b><br/><br/>
🌍 Climate-positive investment projects<br/>
☀️ Renewable energy initiatives<br/>
🌾 Sustainable agriculture programs<br/>
🦋 Environmental conservation<br/>
📈 Both social and financial returns`;
    }
    
    if (lower.includes('hello') || lower.includes('hi') || lower.includes('hey')) {
      return `👋 Welcome to <b>SSE Impact Hub</b>!<br/><br/>
I'm your AI assistant specialized in social impact investing.<br/><br/>
I can help you with:<br/>
🔹 <b>ZCZP Bonds</b> - Zero Coupon Zero Principal instruments<br/>
🔹 <b>80G Tax Benefits</b> - Tax deductions on donations<br/>
🔹 <b>NGO Information</b> - Verified organizations<br/>
🔹 <b>Getting Started</b> - How to begin investing<br/>
🔹 <b>Green Funds</b> - Climate-positive investments<br/><br/>
What would you like to know?`;
    }
    
    return `💡 <b>Here are topics I can help with:</b><br/><br/>
🔹 <b>ZCZP Bonds</b> - Learn about Zero Coupon Zero Principal bonds<br/>
🔹 <b>80G Tax Benefits</b> - Understand tax deductions<br/>
🔹 <b>NGO Information</b> - Find verified organizations<br/>
🔹 <b>Getting Started</b> - How to begin investing<br/>
🔹 <b>Green Funds</b> - Climate-positive investments<br/>
🔹 <b>SROI</b> - Social Return on Investment<br/><br/>
What would you like to know more about?`;
  };

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-6 right-6 bg-gradient-to-r from-cyan-500 to-blue-500 text-white p-4 rounded-full shadow-lg hover:shadow-cyan-500/30 transition-all hover:scale-105 z-50 ${isOpen ? 'hidden' : ''}`}
      >
        <MessageSquare className="w-6 h-6" />
      </button>

      {isOpen && (
        <div className="fixed bottom-6 right-6 w-96 bg-slate-900 rounded-2xl shadow-2xl border border-slate-700 flex flex-col z-50 overflow-hidden">
          <div className="bg-gradient-to-r from-cyan-500 to-blue-500 text-white p-4 flex justify-between items-center">
            <div className="flex items-center gap-2 font-medium">
              <Bot className="w-5 h-5" />
              SSE Impact AI
            </div>
            <div className="flex items-center gap-2">
              <button onClick={() => setShowSettings(!showSettings)} className="text-white hover:text-cyan-100">
                <Settings className="w-5 h-5" />
              </button>
              <button onClick={() => setIsOpen(false)} className="text-white hover:text-cyan-100">
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {showSettings && (
            <div className="p-4 bg-slate-800 border-b border-slate-700">
              <div className="flex items-center gap-2 text-cyan-400 text-sm mb-2">
                <Key className="w-4 h-4" />
                Gemini API Key
              </div>
              <input
                type="password"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="Enter your Gemini API key..."
                className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white text-sm placeholder-slate-400 focus:outline-none focus:border-cyan-500"
              />
              <p className="text-xs text-slate-500 mt-2">
                Get free API key from{' '}
                <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noopener noreferrer" className="text-cyan-400 hover:underline">
                  Google AI Studio
                </a>
              </p>
              <button
                onClick={handleSaveApiKey}
                className="w-full mt-3 py-2 bg-cyan-500 hover:bg-cyan-600 text-white rounded-lg text-sm font-medium transition-colors"
              >
                Save API Key
              </button>
            </div>
          )}
          
          <div className="h-80 p-4 overflow-y-auto bg-slate-900 flex flex-col gap-3">
            {messages.map((msg, i) => (
              <div key={i} className={`max-w-[85%] p-3 rounded-lg text-sm ${
                msg.isBot 
                  ? 'bg-slate-800 border border-slate-700 text-slate-200 self-start rounded-tl-none' 
                  : 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white self-end rounded-tr-none'
              }`}>
                {msg.isBot && isLoading && i === messages.length - 1 ? (
                  <span className="flex items-center gap-1">
                    <span className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                    <span className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                    <span className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                  </span>
                ) : (
                  <span dangerouslySetInnerHTML={{ __html: msg.text }} />
                )}
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
          
          <div className="p-3 bg-slate-800 border-t border-slate-700 flex gap-2">
            <input 
              type="text" 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Ask about social investing..."
              className="flex-1 outline-none text-sm px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:border-cyan-500"
            />
            <button 
              onClick={handleSend} 
              disabled={isLoading}
              className="text-cyan-400 hover:text-cyan-300 disabled:opacity-50"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}
    </>
  );
}
