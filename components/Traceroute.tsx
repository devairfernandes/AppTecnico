
import React, { useState } from 'react';
import { Route, Play, MapPin, Activity } from 'lucide-react';

interface Hop {
  number: number;
  ip: string;
  latency: number;
  location: string;
}

const Traceroute: React.FC = () => {
  const [target, setTarget] = useState('');
  const [isTracing, setIsTracing] = useState(false);
  const [hops, setHops] = useState<Hop[]>([]);

  const runTrace = async () => {
    if (!target) return;
    setIsTracing(true);
    setHops([]);

    const mockHops = [
      { ip: '192.168.1.1', loc: 'Local Gateway' },
      { ip: '10.0.0.1', loc: 'ISP Core' },
      { ip: '187.12.33.1', loc: 'Regional Hub - SP' },
      { ip: '64.233.175.21', loc: 'Google Backbone' },
      { ip: '142.250.191.78', loc: 'Destination Node' },
    ];

    for (let i = 0; i < mockHops.length; i++) {
      await new Promise(r => setTimeout(r, 600));
      const newHop = {
        number: i + 1,
        ip: mockHops[i].ip,
        latency: Math.floor(Math.random() * 5 + (i * 12)),
        location: mockHops[i].loc
      };
      setHops(prev => [...prev, newHop]);
    }
    setIsTracing(false);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <header>
        <h2 className="text-xl font-black text-white">Visual Traceroute</h2>
        <p className="text-[11px] text-slate-500 font-medium uppercase tracking-widest">Rastreamento de saltos e identificação de latência de trânsito</p>
      </header>

      <div className="glass-panel rounded-2xl p-4 flex gap-3">
        <div className="relative flex-1">
          <Route className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-600" size={14} />
          <input 
            type="text" 
            placeholder="IP ou Domínio para rastrear"
            className="w-full bg-white/[0.03] border border-white/5 pl-10 pr-4 py-2.5 rounded-xl text-xs text-white focus:outline-none focus:ring-1 focus:ring-blue-500/50"
            value={target}
            onChange={(e) => setTarget(e.target.value)}
          />
        </div>
        <button 
          onClick={runTrace}
          disabled={isTracing || !target}
          className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-2.5 rounded-xl font-bold text-xs transition-all flex items-center gap-2"
        >
          {isTracing ? <Activity className="animate-spin" size={14} /> : <Play size={14} />}
          {isTracing ? 'Rastreando...' : 'Rastrear'}
        </button>
      </div>

      <div className="relative space-y-4 py-4">
        {hops.length > 0 && (
          <div className="absolute left-[27px] top-0 bottom-0 w-0.5 bg-blue-500/10 -z-10" />
        )}
        
        {hops.map((hop, i) => (
          <div key={i} className="flex gap-6 items-center group">
             <div className="w-14 h-14 rounded-2xl glass-panel flex flex-col items-center justify-center border-white/5 shrink-0 group-hover:border-blue-500/30 transition-all">
                <span className="text-[8px] font-black text-slate-500 uppercase">Hop</span>
                <span className="text-lg font-black text-white">{hop.number}</span>
             </div>
             
             <div className="flex-1 glass-panel rounded-2xl p-4 flex items-center justify-between hover:bg-white/[0.02] transition-all">
                <div className="flex flex-col gap-1">
                   <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-bold text-blue-400">{hop.ip}</span>
                      <span className="text-[9px] font-bold text-slate-500 bg-white/5 px-2 py-0.5 rounded uppercase">{hop.location}</span>
                   </div>
                   <div className="flex items-center gap-2 text-[10px] text-slate-500">
                      <MapPin size={10} />
                      <span>Backbone Operadora</span>
                   </div>
                </div>
                
                <div className="flex flex-col items-end">
                   <span className="text-[8px] font-bold text-slate-500 uppercase tracking-widest">Rount-trip</span>
                   <span className={`text-sm font-black tabular-nums ${hop.latency > 100 ? 'text-amber-500' : 'text-emerald-500'}`}>{hop.latency}ms</span>
                </div>
             </div>
          </div>
        ))}

        {!isTracing && hops.length === 0 && (
          <div className="glass-panel rounded-2xl p-20 flex flex-col items-center justify-center text-center opacity-40 italic">
            <Route size={40} className="mb-4 text-slate-600" />
            <p className="text-xs">Inicie um rastreamento para visualizar os saltos de rede.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Traceroute;
