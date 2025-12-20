import { useLocation, Link } from 'react-router-dom';
import KshanaxTradePreview from '../components/KshanaxTradePreview';

const SmartBlotter = () => {
  const location = useLocation();
  const { aiData } = location.state || {}; // Get data passed from navigate

  if (!aiData) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <p className="mb-4">No pending trades found.</p>
        <Link to="/" className="text-blue-500 underline">Go back to AI Input</Link>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <header className="flex justify-between items-end mb-12">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Smart Blotter</h1>
          <p className="text-slate-500">Review and execute your AI-staged orders</p>
        </div>
        <Link to="/" className="text-xs text-slate-400 hover:text-white transition-colors">
          + New AI Command
        </Link>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* The Preview Card we built earlier */}
        <KshanaxTradePreview aiData={aiData} />
        
        {/* Placeholder for Market Context / News (Innovation!) */}
        <div className="hidden md:block bg-slate-900/30 border border-slate-800 rounded-2xl p-6">
          <h3 className="text-sm font-bold text-slate-400 uppercase mb-4">Market Context</h3>
          <div className="space-y-4">
            <div className="h-20 bg-slate-800/50 rounded-lg animate-pulse"></div>
            <div className="h-20 bg-slate-800/50 rounded-lg animate-pulse"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SmartBlotter;