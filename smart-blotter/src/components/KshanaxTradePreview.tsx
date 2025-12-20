import React, { useState } from 'react';
import { motion } from 'framer-motion';

const KshanaxTradePreview = ({ aiData }) => {
  const [isConfirmed, setIsConfirmed] = useState(false);

  // Example data mapping if aiData is null for demo purposes
  const trade = aiData || {
    symbol: "AAPL",
    side: "BUY",
    quantity: 500,
    reasoning: "Allocating 500 shares across top 5 accounts by AUM as requested.",
    allocations: [
      { id: 1, name: "Alpha Fund", qty: 100 },
      { id: 2, name: "Retirement Core", qty: 100 },
      { id: 3, name: "Growth Strategy", qty: 100 },
      { id: 4, name: "Family Trust", qty: 100 },
      { id: 5, name: "Tax-Advantaged", qty: 100 },
    ]
  };

  return (
    <div className="max-w-md mx-auto bg-slate-950 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl font-sans">
      {/* Top Status Bar */}
      <div className="bg-blue-600/10 px-4 py-2 border-b border-blue-500/20 flex justify-between items-center">
        <span className="text-[10px] font-bold tracking-widest text-blue-400 uppercase">AI Intent Captured</span>
        <div className="flex gap-1">
          <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></div>
          <span className="text-[10px] text-slate-400">Ready to Execute</span>
        </div>
      </div>

      <div className="p-6">
        {/* Main Trade Info */}
        <div className="flex justify-between items-start mb-6">
          <div>
            <h1 className="text-4xl font-black text-white tracking-tighter">
              {trade.symbol}
            </h1>
            <p className="text-slate-500 text-sm font-medium">NasdaqGS • USD</p>
          </div>
          <div className={`px-3 py-1 rounded-md text-xs font-bold ${trade.side === 'BUY' ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}>
            {trade.side}
          </div>
        </div>

        {/* AI Reasoning Box */}
        <div className="bg-slate-900/50 rounded-lg p-3 mb-6 border-l-2 border-blue-500">
          <p className="text-xs text-slate-300 italic leading-relaxed">
            "{trade.reasoning}"
          </p>
        </div>

        {/* Allocation List */}
        <div className="space-y-2 mb-8">
          <div className="flex justify-between text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">
            <span>Allocation Target</span>
            <span>Quantity</span>
          </div>
          {trade.allocations.map((acc) => (
            <div key={acc.id} className="flex justify-between items-center py-2 border-b border-slate-900 last:border-0">
              <span className="text-sm text-slate-300">{acc.name}</span>
              <span className="text-sm font-mono text-white font-bold">{acc.qty}</span>
            </div>
          ))}
          <div className="flex justify-between pt-2 mt-2 border-t border-slate-800">
            <span className="text-sm font-bold text-white">Total</span>
            <span className="text-sm font-black text-blue-400">{trade.quantity}</span>
          </div>
        </div>

        {/* The Action Slider */}
        <div className="relative">
          {!isConfirmed ? (
            <div className="h-16 bg-slate-900 rounded-2xl p-1.5 flex items-center relative overflow-hidden border border-slate-800">
              <motion.div
                drag="x"
                dragConstraints={{ left: 0, right: 300 }}
                dragElastic={0.1}
                onDragEnd={(_, info) => {
                   if (info.offset.x > 220) setIsConfirmed(true);
                }}
                className="h-full aspect-square bg-white rounded-xl flex items-center justify-center cursor-grab active:cursor-grabbing z-20 shadow-[0_0_20px_rgba(255,255,255,0.3)]"
              >
                <svg className="w-6 h-6 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="secondary 13l4 4L19 7" />
                </svg>
              </motion.div>
              <div className="absolute inset-0 flex items-center justify-center text-sm font-bold text-slate-500 pointer-events-none tracking-tight">
                SWIPE TO EXECUTE BLOCK
              </div>
            </div>
          ) : (
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="h-16 bg-green-600 rounded-2xl flex items-center justify-center gap-3 shadow-[0_0_30px_rgba(34,197,94,0.4)]"
            >
              <span className="text-white font-black tracking-widest uppercase">Order Sent</span>
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};

export default KshanaxTradePreview;