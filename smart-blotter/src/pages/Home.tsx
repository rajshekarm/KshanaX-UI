import  { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, ArrowRight, Terminal } from 'lucide-react'; 


import { apiFetch } from '../utils/api'


const Home = () => {
  const navigate = useNavigate();
  const [prompt, setPrompt] = useState("");
  const [isParsing, setIsParsing] = useState(false);

  const handleParse = async () => {
    if (!prompt.trim()) return;
    
    setIsParsing(true);
    try {
      // 1. Call your .NET REST API
      const response = await apiFetch('/api/trade/process-intent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: prompt })
      });

      
      if (!response.ok) {
       const errorText = await response.text();
       console.error("Server Error:", errorText);
       return;
    }
      
      const aiData = await response.json();

      // 2. Navigate to the blotter and pass the data
      // This sends the data to the SmartBlotter page via history state
      navigate('/smart-blotter', { state: { aiData } });
    } catch (error) {
      console.error("AI Parsing failed:", error);
    } finally {
      setIsParsing(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center p-6">
      {/* Kshanax Branding */}
      <div className="mb-12 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 mb-4">
          <Sparkles size={14} className="text-blue-400" />
          <span className="text-[10px] font-bold tracking-widest text-blue-400 uppercase">
            GenAI Investment Management
          </span>
        </div>
        <h1 className="text-5xl font-black text-white tracking-tighter italic">
          KSHANAX<span className="text-blue-600">.AI</span>
        </h1>
      </div>

      {/* Terminal Style Input Area */}
      <div className="w-full max-w-2xl bg-slate-900/50 border border-slate-800 rounded-2xl p-2 shadow-2xl backdrop-blur-sm">
        <div className="flex items-center gap-2 px-4 py-2 border-b border-slate-800 text-slate-500">
          <Terminal size={14} />
          <span className="text-xs font-mono uppercase tracking-tight">Intent Terminal</span>
        </div>
        
        <textarea
          autoFocus
          className="w-full bg-transparent p-6 text-xl text-white placeholder-slate-600 outline-none resize-none h-40 font-medium"
          placeholder="What would you like to execute? e.g. Buy 500 shares of Apple split to my top 5 accounts..."
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
        />

        <div className="flex justify-end p-4">
          <button
            onClick={handleParse}
            disabled={isParsing || !prompt.trim()}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all duration-300 ${
              isParsing 
                ? 'bg-slate-800 text-slate-500 cursor-not-allowed' 
                : 'bg-blue-600 hover:bg-blue-500 text-white shadow-[0_0_20px_rgba(37,99,235,0.4)] hover:scale-105'
            }`}
          >
            {isParsing ? (
              <>
                <div className="w-4 h-4 border-2 border-slate-400 border-t-transparent rounded-full animate-spin"></div>
                Thinking...
              </>
            ) : (
              <>
                Process Trade <ArrowRight size={18} />
              </>
            )}
          </button>
        </div>
      </div>

      {/* Hint Text */}
      <p className="mt-8 text-slate-500 text-sm font-mono">
        TIP: Use natural language for complex allocations and block orders.
      </p>
    </div>
  );
};

export default Home;