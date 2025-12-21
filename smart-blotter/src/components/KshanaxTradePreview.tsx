import React from 'react';
import { motion } from 'framer-motion';

// 1. Define interfaces that match your C# DTOs (using camelCase for JS)
interface AllocationLineItem {
  accountId: string;    // Guid in C#
  accountName: string;  // AccountName string
  quantity: number;     // decimal in C#
}

interface TradePreviewData {
  symbol: string;
  totalQuantity: number;
  side: 'BUY' | 'SELL';
  aiReasoning: string;
  allocationMethod: string;
  allocations: AllocationLineItem[];
}

interface TradePreviewProps {
  aiData: TradePreviewData;
  onConfirm: () => Promise<void>; 
  isConfirming: boolean;
}

const KshanaxTradePreview = ({ aiData, onConfirm, isConfirming }: TradePreviewProps) => {
  // Defensive check to prevent crashes if data hasn't arrived yet
  if (!aiData) return null;

  return (
    <div className="max-w-md mx-auto bg-slate-950 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl font-sans">
      {/* Top Status Bar */}
      <div className="bg-blue-600/10 px-4 py-2 border-b border-blue-500/20 flex justify-between items-center">
        <span className="text-[10px] font-bold tracking-widest text-blue-400 uppercase">AI Intent Captured</span>
        <div className="flex gap-1">
          <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></div>
          <span className="text-[10px] text-slate-400">Validated Structure</span>
        </div>
      </div>

      <div className="p-6">
        {/* Header Section */}
        <div className="flex justify-between items-start mb-6">
          <div>
            <h1 className="text-4xl font-black text-white tracking-tighter">
              {aiData.symbol.toUpperCase()}
            </h1>
            <p className="text-slate-500 text-[10px] font-mono uppercase tracking-tighter">
                Strategy: {aiData.allocationMethod}
            </p>
          </div>
          <div className={`px-3 py-1 rounded-md text-xs font-bold ${aiData.side === 'BUY' ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}>
            {aiData.side}
          </div>
        </div>

        {/* AI Reasoning Box */}
        <div className="bg-slate-900/50 rounded-lg p-3 mb-6 border-l-2 border-blue-500">
          <p className="text-xs text-slate-300 italic leading-relaxed">
            "{aiData.aiReasoning}"
          </p>
        </div>

        {/* Dynamic Allocation Table (The calculation results from Backend) */}
        <div className="space-y-2 mb-8">
          <div className="flex justify-between text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">
            <span>Allocation Target</span>
            <span>Quantity</span>
          </div>
          
          {aiData.allocations?.map((acc) => (
            <div key={acc.accountId} className="flex justify-between items-center py-2 border-b border-slate-900 last:border-0">
              <span className="text-sm text-slate-300">{acc.accountName}</span>
              <span className="text-sm font-mono text-white font-bold">
                {acc.quantity.toLocaleString()}
              </span>
            </div>
          ))}

          <div className="flex justify-between pt-2 mt-2 border-t border-slate-800">
            <span className="text-sm font-bold text-white uppercase tracking-tighter">Total Block Size</span>
            <span className="text-sm font-black text-blue-400">
                {aiData.totalQuantity.toLocaleString()}
            </span>
          </div>
        </div>

        {/* THE CRUCIAL ACTION SLIDER */}
        <div className="relative">
          {!isConfirming ? (
            <div className="h-16 bg-slate-900 rounded-2xl p-1.5 flex items-center relative overflow-hidden border border-slate-800">
              <motion.div
                drag="x"
                dragConstraints={{ left: 0, right: 280 }} // Adjusted for container width
                dragElastic={0.1}
                onDragEnd={(_, info) => {
                   // Logic: If swiped more than 200px, trigger execution
                   if (info.offset.x > 200) onConfirm();
                }}
                className="h-full aspect-square bg-white rounded-xl flex items-center justify-center cursor-grab active:cursor-grabbing z-20 shadow-[0_0_20px_rgba(255,255,255,0.3)]"
              >
                <svg className="w-6 h-6 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
                </svg>
              </motion.div>
              <div className="absolute inset-0 flex items-center justify-center text-[10px] font-bold text-slate-500 pointer-events-none tracking-[0.2em]">
                SWIPE TO EXECUTE BLOCK
              </div>
            </div>
          ) : (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="h-16 bg-blue-600 rounded-2xl flex items-center justify-center gap-3 shadow-[0_0_30px_rgba(37,99,235,0.4)]"
            >
              <span className="text-white font-black tracking-widest uppercase text-sm">Transmitting to Venue...</span>
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};

export default KshanaxTradePreview; 