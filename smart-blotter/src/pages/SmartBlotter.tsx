import { useLocation, Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import KshanaxTradePreview from '../components/KshanaxTradePreview';

const SmartBlotter = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isConfirming, setIsConfirming] = useState(false);
  
  // Get AI parsed data passed from the Home/Terminal page
  const { aiData } = location.state || {}; 

  const handleConfirm = async (orderId: string) => {
    setIsConfirming(true);
    try {
      // 1. Call the backend confirmation endpoint
      const response = await fetch(`/api/orders/confirm/${orderId}`, {
        method: 'POST',
      });
      
      if (response.ok) {
        // 2. Visual Feedback: Show success and redirect or refresh
        alert("Trade Confirmed! Order has been sent to the execution venue.");
        navigate('/'); // Go back to terminal for the next command
      } else {
        const errorData = await response.json();
        alert(`Execution failed: ${errorData.error}`);
      }
    } catch (error) {
      console.error("Confirmation failed:", error);
      alert("Network error: Could not connect to Kshanax Backend.");
    } finally {
      setIsConfirming(false);
    }
  };

  if (!aiData) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-black text-white">
        <p className="mb-4 text-slate-400">No pending trades found in staging.</p>
        <Link to="/" className="px-6 py-2 bg-blue-600 rounded-lg font-bold">
          Go back to AI Input
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <div className="max-w-6xl mx-auto">
        <header className="flex justify-between items-end mb-12">
          <div>
            <div className="text-blue-500 text-xs font-bold tracking-widest uppercase mb-2">Execution Pipeline</div>
            <h1 className="text-4xl font-black tracking-tighter italic">SMART<span className="text-blue-600">BLOTTER</span></h1>
            <p className="text-slate-500 mt-2">Review AI-proposed allocations across institutional accounts.</p>
          </div>
          <Link to="/" className="text-xs text-slate-400 hover:text-blue-400 transition-colors font-mono">
            + NEW_INTENT_SIGNAL
          </Link>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Preview Column */}
          <div className="lg:col-span-2">
            <KshanaxTradePreview 
              aiData={aiData} 
              onConfirm={() => handleConfirm(aiData.id)} 
              isConfirming={isConfirming}
            />
          </div>
          
          {/* Market Context Sidebar */}
          <div className="hidden lg:block space-y-6">
            <div className="bg-slate-900/40 border border-slate-800/50 rounded-2xl p-6 backdrop-blur-md">
              <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-6 flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                Live Market Context
              </h3>
              
              <div className="space-y-4">
                <div className="p-4 bg-slate-800/30 rounded-xl border border-slate-700/30">
                  <div className="text-[10px] text-blue-400 font-mono mb-1">VOLATILITY_ALERT</div>
                  <div className="text-sm text-slate-300 font-medium">NVDA showing high relative strength vs SPY in pre-market.</div>
                </div>
                <div className="p-4 bg-slate-800/30 rounded-xl border border-slate-700/30">
                  <div className="text-[10px] text-slate-500 font-mono mb-1">LIQUIDITY_REPORT</div>
                  <div className="text-sm text-slate-300 font-medium">Sufficient depth found in Dark Pools for block execution.</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SmartBlotter;