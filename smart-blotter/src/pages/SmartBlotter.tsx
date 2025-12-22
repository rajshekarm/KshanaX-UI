import { useLocation, Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import KshanaxTradePreview from '../components/KshanaxTradePreview';
import { 
  CheckCircle, 
  Plus, 
  ReceiptText, 
  Activity, 
  ChevronRight, 
  ExternalLink 
} from 'lucide-react';

// --- Types ---
interface Order {
  id: string;
  symbol: string;
  qty: number;
  status: 'FILLED' | 'PENDING' | 'REJECTED';
  time: string;
  price?: string;
}

const SmartBlotter = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  // State for handling the execution flow
  const [isConfirming, setIsConfirming] = useState(false);
  const [isExecuted, setIsExecuted] = useState(false);
  const [executedOrders, setExecutedOrders] = useState<Order[]>([]);

  // Get AI parsed data passed from the Terminal page
  const { aiData } = location.state || {}; 

  const handleConfirm = async (orderId: string) => {
    setIsConfirming(true);
    try {
      // Simulate API call to Kshanax Backend
      const response = await fetch(`/api/trade/confirm`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ blockOrderId: orderId })
      });

      if (response.ok) {
        const newOrder: Order = {
          id: orderId,
          symbol: aiData.symbol || 'AAPL',
          qty: aiData.totalQty || 500,
          status: 'FILLED',
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
          price: "214.12" // Mock execution price
        };
        
        setIsExecuted(true);
        setExecutedOrders(prev => [newOrder, ...prev]);
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

  // Guard Clause: If no data is present, show the Empty State
  if (!aiData) return <NoDataView />;

  return (
    <div className="min-h-screen bg-black text-white font-sans selection:bg-blue-500/30">
      <div className="max-w-[1600px] mx-auto p-6">
        
        {/* --- HEADER --- */}
        <header className="flex justify-between items-center mb-8 border-b border-slate-800/50 pb-6">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center font-black italic text-xl">K</div>
            <div>
              <div className="text-blue-500 text-[10px] font-black tracking-[0.3em] uppercase leading-none mb-1">
                Execution Pipeline
              </div>
              <h1 className="text-3xl font-black tracking-tighter italic leading-none">
                SMART<span className="text-blue-600">BLOTTER</span>
              </h1>
            </div>
          </div>

          <button 
            onClick={() => navigate('/')}
            className="group flex items-center gap-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-500 rounded-full font-bold text-sm transition-all shadow-lg shadow-blue-900/40 active:scale-95"
          >
            <Plus size={18} className="group-hover:rotate-90 transition-transform" /> 
            NEW_INTENT_SIGNAL
          </button>
        </header>

        <div className="grid grid-cols-12 gap-8">
          
          {/* --- LEFT COLUMN: MAIN ACTION AREA (8/12) --- */}
          <main className="col-span-12 lg:col-span-8">
            {isExecuted ? (
              <div className="bg-slate-900/10 border border-green-500/20 rounded-3xl p-16 text-center backdrop-blur-xl flex flex-col items-center justify-center min-h-[550px] animate-in fade-in zoom-in-95 duration-500">
                <div className="w-24 h-24 bg-green-500/10 rounded-full flex items-center justify-center mb-8 border border-green-500/20 shadow-[0_0_50px_-12px_rgba(34,197,94,0.3)]">
                  <CheckCircle className="text-green-500" size={48} />
                </div>
                <h2 className="text-4xl font-black mb-4 tracking-tight">Order Dispatched</h2>
                <p className="text-slate-400 max-w-md mx-auto mb-10 text-lg leading-relaxed">
                  Your block order for <span className="text-white font-mono font-bold">{aiData.symbol}</span> has been successfully routed to dark pools and institutional venues.
                </p>
                <div className="flex gap-4">
                  <button 
                    onClick={() => navigate('/')} 
                    className="px-10 py-4 bg-white text-black rounded-2xl font-bold hover:bg-slate-200 transition-all active:scale-95 shadow-xl"
                  >
                    Enter New Intent
                  </button>
                  <button 
                    onClick={() => setIsExecuted(false)} 
                    className="px-10 py-4 bg-slate-800 text-white rounded-2xl font-bold hover:bg-slate-700 transition-all active:scale-95 border border-slate-700"
                  >
                    Review Allocation
                  </button>
                </div>
              </div>
            ) : (
              <KshanaxTradePreview 
                aiData={aiData} 
                onConfirm={() => handleConfirm(aiData.id)} 
                isConfirming={isConfirming}
              />
            )}
          </main>
          
          {/* --- RIGHT COLUMN: CONTEXT & BLOTTER (4/12) --- */}
          <aside className="col-span-12 lg:col-span-4 space-y-6">
            
            {/* 1. MARKET CONTEXT WIDGET */}
            <section className="bg-slate-900/40 border border-slate-800/50 rounded-2xl p-6 backdrop-blur-md">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                  <Activity size={14} className="text-green-500" />
                  Live Market Context
                </h3>
                <span className="text-[10px] text-green-500 font-mono flex items-center gap-1">
                  <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" /> LIVE
                </span>
              </div>
              
              <div className="space-y-4">
                <div className="p-4 bg-slate-800/30 rounded-xl border border-slate-700/30 hover:border-slate-600 transition-colors cursor-default">
                  <div className="text-[9px] text-blue-400 font-black font-mono mb-1 tracking-tighter">VOLATILITY_ALERT</div>
                  <div className="text-sm text-slate-300 font-medium leading-snug">NVDA showing high relative strength vs SPY in pre-market.</div>
                </div>
                <div className="p-4 bg-slate-800/30 rounded-xl border border-slate-700/30 hover:border-slate-600 transition-colors cursor-default">
                  <div className="text-[9px] text-slate-500 font-black font-mono mb-1 tracking-tighter">LIQUIDITY_REPORT</div>
                  <div className="text-sm text-slate-300 font-medium leading-snug">Sufficient depth found in Dark Pools for block execution.</div>
                </div>
              </div>
            </section>

            {/* 2. LIVE ORDER BLOTTER WIDGET */}
            <section className="bg-slate-900/40 border border-slate-800/50 rounded-2xl p-6 backdrop-blur-md flex flex-col min-h-[400px]">
              <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-6 flex items-center gap-2">
                <ReceiptText size={14} className="text-blue-500" />
                Live Order Blotter
              </h3>

              <div className="flex-1 space-y-3">
                {executedOrders.length > 0 ? (
                  executedOrders.map((order, idx) => (
                    <div 
                      key={order.id + idx} 
                      className="group p-4 bg-blue-500/5 border border-blue-500/20 rounded-xl animate-in slide-in-from-right-4 duration-300"
                    >
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-mono text-[10px] text-blue-400 font-bold uppercase tracking-tighter">
                          ORD_{order.id.slice(0,8)}
                        </span>
                        <div className="flex items-center gap-1.5">
                          <span className="text-[9px] bg-green-500/20 text-green-400 px-2 py-0.5 rounded-md font-black uppercase">
                            {order.status}
                          </span>
                          <ExternalLink size={10} className="text-slate-600 group-hover:text-white transition-colors cursor-pointer" />
                        </div>
                      </div>
                      <div className="flex justify-between items-end">
                        <div>
                          <span className="text-xl font-black italic">{order.symbol}</span>
                          <p className="text-[10px] text-slate-500 font-medium">{order.time}</p>
                        </div>
                        <div className="text-right">
                          <span className="block text-xs font-bold text-slate-200">Qty: {order.qty.toLocaleString()}</span>
                          <span className="text-[10px] text-slate-500 font-mono">${order.price}</span>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="flex flex-col items-center justify-center h-full text-center py-12 border-2 border-dashed border-slate-800/50 rounded-2xl">
                    <div className="w-12 h-12 bg-slate-900 rounded-full flex items-center justify-center mb-4">
                      <ReceiptText size={20} className="text-slate-700" />
                    </div>
                    <p className="text-[11px] text-slate-600 font-bold uppercase tracking-widest">
                      Awaiting Execution...
                    </p>
                  </div>
                )}
              </div>
            </section>

          </aside>
        </div>
      </div>
    </div>
  );
};

// --- Sub-Component: Empty State ---
const NoDataView = () => (
  <div className="flex flex-col items-center justify-center h-screen bg-black text-white p-6 text-center">
    <div className="w-20 h-20 bg-slate-900 rounded-3xl flex items-center justify-center mb-8 border border-slate-800 shadow-2xl">
      <div className="w-3 h-3 bg-blue-600 rounded-full animate-pulse shadow-[0_0_15px_rgba(37,99,235,0.6)]" />
    </div>
    
    <h2 className="text-2xl font-bold mb-2">No Active Intent Found</h2>
    <p className="mb-10 text-slate-500 max-w-sm">
      We couldn't find a pending trade in your staging area. Please return to the terminal to parse a new natural language intent.
    </p>
    
    <Link 
      to="/" 
      className="group flex items-center gap-3 px-8 py-4 bg-blue-600 hover:bg-blue-500 rounded-2xl font-bold transition-all active:scale-95 shadow-lg shadow-blue-900/40"
    >
      Go to AI Terminal <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
    </Link>
  </div>
);

export default SmartBlotter;