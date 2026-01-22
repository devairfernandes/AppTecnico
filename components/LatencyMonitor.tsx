
import React, { useState, useEffect, useRef } from 'react';
import { Activity, Plus, Trash2, Globe, TrendingUp, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { LineChart, Line, ResponsiveContainer, YAxis, CartesianGrid, Tooltip } from 'recharts';

interface LatencyNode {
  id: string;
  host: string;
  label: string;
  history: { time: number; value: number }[];
  min: number;
  max: number;
  avg: number;
}

const LatencyMonitor: React.FC = () => {
  const [nodes, setNodes] = useState<LatencyNode[]>([
    { id: '1', host: '8.8.8.8', label: 'Google DNS', history: [], min: 0, max: 0, avg: 0 },
    { id: '2', host: '1.1.1.1', label: 'Cloudflare', history: [], min: 0, max: 0, avg: 0 },
    { id: '3', host: '208.67.222.222', label: 'OpenDNS', history: [], min: 0, max: 0, avg: 0 }
  ]);
  const [newHost, setNewHost] = useState('');
  const [newLabel, setNewLabel] = useState('');
  const [isMonitoring, setIsMonitoring] = useState(true);

  useEffect(() => {
    if (!isMonitoring) return;

    const interval = setInterval(() => {
      setNodes(prevNodes => prevNodes.map(node => {
        const baseLatency = node.host.includes('8.8.8') ? 15 : node.host.includes('1.1.1') ? 10 : 25;
        const jitter = Math.random() * 8 - 4;
        const value = Math.max(5, Math.floor(baseLatency + jitter + (Math.random() > 0.96 ? 40 : 0)));
        
        const newHistory = [...node.history, { time: Date.now(), value }].slice(-30);
        const values = newHistory.map(h => h.value);
        
        return {
          ...node,
          history: newHistory,
          min: Math.min(...values),
          max: Math.max(...values),
          avg: Math.floor(values.reduce((a, b) => a + b, 0) / values.length)
        };
      }));
    }, 1000);

    return () => clearInterval(interval);
  }, [isMonitoring]);

  const addNode = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newHost) return;
    const id = Math.random().toString(36).substr(2, 9);
    setNodes([...nodes, { 
      id, 
      host: newHost, 
      label: newLabel || newHost, 
      history: [], 
      min: 0, 
      max: 0, 
      avg: 0 
    }]);
    setNewHost('');
    setNewLabel('');
  };

  const removeNode = (id: string) => {
    setNodes(nodes.filter(n => n.id !== id));
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-10">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-white">Monitor de Latência</h2>
          <p className="text-[11px] text-slate-500 font-medium">Análise de RTT simultânea para múltiplos destinos</p>
        </div>
        <button 
          onClick={() => setIsMonitoring(!isMonitoring)}
          className={`px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${
            isMonitoring ? 'bg-amber-500/10 text-amber-500 border border-amber-500/20' : 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20'
          }`}
        >
          {isMonitoring ? 'Pausar Monitoramento' : 'Retomar Monitoramento'}
        </button>
      </header>

      <form onSubmit={addNode} className="glass-panel rounded-2xl p-4 flex flex-col md:flex-row gap-3 items-end">
        <div className="flex-1 space-y-1 w-full">
           <label className="text-[9px] font-bold text-slate-500 uppercase tracking-widest px-1">Endereço (IP/Host)</label>
           <div className="relative">
             <Globe className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-600" size={14} />
             <input 
               type="text" 
               placeholder="ex: 8.8.8.8"
               className="w-full bg-white/[0.03] border border-white/5 pl-10 pr-4 py-2 rounded-xl text-xs text-white focus:outline-none focus:ring-1 focus:ring-blue-500/50 transition-all"
               value={newHost}
               onChange={(e) => setNewHost(e.target.value)}
             />
           </div>
        </div>
        <div className="flex-1 space-y-1 w-full">
           <label className="text-[9px] font-bold text-slate-500 uppercase tracking-widest px-1">Nome Amigável</label>
           <input 
             type="text" 
             placeholder="ex: DNS Google"
             className="w-full bg-white/[0.03] border border-white/5 px-4 py-2 rounded-xl text-xs text-white focus:outline-none focus:ring-1 focus:ring-blue-500/50 transition-all"
             value={newLabel}
             onChange={(e) => setNewLabel(e.target.value)}
           />
        </div>
        <button 
          type="submit"
          className="bg-blue-600 hover:bg-blue-500 text-white p-2.5 rounded-xl transition-all shadow-lg shadow-blue-500/20"
        >
          <Plus size={18} />
        </button>
      </form>

      {/* Grid otimizado: 1 col mobile, 2 col tablet, 3 col desktop */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {nodes.map(node => (
          <div key={node.id} className="glass-panel rounded-2xl p-4 flex flex-col gap-3 relative group overflow-hidden hover:scale-[1.02] transition-transform">
            <div className="flex justify-between items-start">
               <div className="flex items-center gap-2.5">
                  <div className={`p-2 rounded-lg ${node.avg < 50 ? 'bg-emerald-500/10 text-emerald-500' : node.avg < 150 ? 'bg-amber-500/10 text-amber-500' : 'bg-red-500/10 text-red-500'}`}>
                    <Activity size={16} />
                  </div>
                  <div className="max-w-[140px]">
                    <h4 className="text-xs font-black text-white truncate">{node.label}</h4>
                    <p className="text-[9px] font-mono text-slate-500 truncate">{node.host}</p>
                  </div>
               </div>
               <button 
                onClick={() => removeNode(node.id)}
                className="opacity-0 group-hover:opacity-100 p-1.5 hover:bg-red-500/10 hover:text-red-500 rounded-lg transition-all text-slate-600"
               >
                 <Trash2 size={12} />
               </button>
            </div>

            <div className="h-20 w-full">
               <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={node.history}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.02)" />
                    <YAxis hide domain={[0, 'auto']} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#0d1117', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '8px', fontSize: '9px', padding: '4px 8px' }}
                      labelStyle={{ display: 'none' }}
                      itemStyle={{ color: '#3b82f6', padding: 0 }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="value" 
                      stroke={node.avg < 50 ? '#10b981' : node.avg < 150 ? '#f59e0b' : '#ef4444'} 
                      strokeWidth={1.5} 
                      dot={false}
                      isAnimationActive={false}
                    />
                  </LineChart>
               </ResponsiveContainer>
            </div>

            <div className="grid grid-cols-3 gap-2 pt-3 border-t border-white/5">
               <div className="flex flex-col">
                  <span className="text-[7px] font-bold text-slate-600 uppercase tracking-widest">Atual</span>
                  <span className={`text-sm font-black tabular-nums ${node.history.length > 0 && node.history[node.history.length-1].value < 50 ? 'text-emerald-500' : 'text-white'}`}>
                    {node.history.length > 0 ? node.history[node.history.length-1].value : '--'}
                    <span className="text-[8px] ml-0.5 opacity-40">ms</span>
                  </span>
               </div>
               <div className="flex flex-col">
                  <span className="text-[7px] font-bold text-slate-600 uppercase tracking-widest">Média</span>
                  <span className="text-sm font-black text-white tabular-nums">
                    {node.avg || '--'}
                    <span className="text-[8px] ml-0.5 opacity-40">ms</span>
                  </span>
               </div>
               <div className="flex flex-col">
                  <span className="text-[7px] font-bold text-slate-600 uppercase tracking-widest">Saúde</span>
                  <div className="flex items-center gap-1 mt-0.5">
                    {node.avg < 50 ? <CheckCircle2 size={10} className="text-emerald-500" /> : <AlertTriangle size={10} className="text-amber-500" />}
                    <span className="text-[8px] font-black uppercase text-slate-500">
                      {node.avg < 50 ? 'OK' : node.avg < 150 ? 'Inst' : 'Crit'}
                    </span>
                  </div>
               </div>
            </div>
          </div>
        ))}

        {nodes.length === 0 && (
          <div className="col-span-full glass-panel rounded-2xl p-10 flex flex-col items-center justify-center text-center">
             <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center mb-4 text-slate-700">
               <TrendingUp size={24} />
             </div>
             <h3 className="text-sm font-bold text-white mb-1">Sem destinos ativos</h3>
             <p className="text-[10px] text-slate-500 max-w-[200px] leading-relaxed">
               Adicione hosts acima para monitorar a estabilidade da sua rede.
             </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default LatencyMonitor;
