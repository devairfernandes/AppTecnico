
import React, { useState } from 'react';
import { Radar, Play, StopCircle, CheckCircle2, XCircle, Search, Monitor, Activity } from 'lucide-react';

interface ScanResult {
  ip: string;
  status: 'online' | 'offline' | 'scanning';
  latency?: number;
}

const SubnetScanner: React.FC = () => {
  const [range, setRange] = useState('192.168.1.0/24');
  const [isScanning, setIsScanning] = useState(false);
  const [results, setResults] = useState<ScanResult[]>([]);

  const startScan = async () => {
    setIsScanning(true);
    const mockIps = Array.from({ length: 254 }, (_, i) => `192.168.1.${i + 1}`);
    setResults(mockIps.map(ip => ({ ip, status: 'scanning' })));

    // Simula scan em lotes
    for (let i = 0; i < mockIps.length; i++) {
      if (!isScanning && i > 0 && i % 10 === 0) await new Promise(r => setTimeout(r, 100));
      
      setResults(prev => {
        const next = [...prev];
        const isOnline = Math.random() > 0.92; // 8% de densidade simulada
        next[i] = { 
          ip: mockIps[i], 
          status: isOnline ? 'online' : 'offline',
          latency: isOnline ? Math.floor(Math.random() * 20) + 1 : undefined
        };
        return next;
      });

      if (i % 20 === 0) await new Promise(r => setTimeout(r, 50));
    }
    setIsScanning(false);
  };

  const onlineCount = results.filter(r => r.status === 'online').length;

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <header className="flex justify-between items-end">
        <div>
          <h2 className="text-xl font-black text-white">Active Ping Sweep</h2>
          <p className="text-[11px] text-slate-500 font-medium uppercase tracking-widest">Varredura de sub-rede para descoberta de hosts silenciosos</p>
        </div>
        <div className="flex gap-4">
           <div className="flex flex-col items-end">
              <span className="text-[8px] font-bold text-slate-500 uppercase tracking-widest">Hosts Ativos</span>
              <span className="text-sm font-black text-emerald-500">{onlineCount}</span>
           </div>
           <div className="flex flex-col items-end">
              <span className="text-[8px] font-bold text-slate-500 uppercase tracking-widest">Varredura</span>
              <span className="text-sm font-black text-white">{Math.round((results.filter(r => r.status !== 'scanning').length / 254) * 100)}%</span>
           </div>
        </div>
      </header>

      <div className="glass-panel rounded-2xl p-4 flex gap-3">
        <div className="relative flex-1">
          <Radar className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-600" size={14} />
          <input 
            type="text" 
            value={range}
            onChange={(e) => setRange(e.target.value)}
            className="w-full bg-white/[0.03] border border-white/5 pl-10 pr-4 py-2.5 rounded-xl text-xs text-white focus:outline-none focus:ring-1 focus:ring-blue-500/50"
            placeholder="Network Range (CIDR)"
          />
        </div>
        <button 
          onClick={() => isScanning ? setIsScanning(false) : startScan()}
          className={`px-6 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 transition-all ${
            isScanning ? 'bg-red-500/10 text-red-500 border border-red-500/20' : 'bg-blue-600 text-white hover:bg-blue-500'
          }`}
        >
          {isScanning ? <StopCircle size={14} /> : <Play size={14} />}
          {isScanning ? 'Parar' : 'Iniciar Sweep'}
        </button>
      </div>

      <div className="glass-panel rounded-2xl p-6 bg-black/20">
         <div className="grid grid-cols-8 md:grid-cols-16 lg:grid-cols-24 gap-1.5">
            {results.map((res, i) => (
               <div 
                 key={i} 
                 title={`${res.ip} - ${res.status}`}
                 className={`aspect-square rounded-sm transition-all duration-300 ${
                    res.status === 'online' ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.4)] scale-110' : 
                    res.status === 'offline' ? 'bg-white/5' : 
                    'bg-blue-500/20 animate-pulse'
                 }`}
               />
            ))}
         </div>
         {results.length === 0 && (
           <div className="h-48 flex flex-col items-center justify-center opacity-30 text-center">
              <Search size={32} className="mb-2" />
              <p className="text-xs uppercase font-bold tracking-widest">Aguardando comando de varredura...</p>
           </div>
         )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
         {results.filter(r => r.status === 'online').map((res, i) => (
           <div key={i} className="glass-panel rounded-xl p-4 flex items-center justify-between border-l-4 border-l-emerald-500">
              <div className="flex items-center gap-3">
                 <div className="p-2 bg-emerald-500/10 rounded-lg text-emerald-500">
                    <Monitor size={14} />
                 </div>
                 <div className="flex flex-col">
                    <span className="text-xs font-mono font-bold text-white">{res.ip}</span>
                    <span className="text-[9px] font-bold text-slate-500 uppercase tracking-tighter">Ativo • Resposta ICMP</span>
                 </div>
              </div>
              <div className="flex flex-col items-end">
                 <span className="text-[8px] font-bold text-slate-500 uppercase">RTT</span>
                 <span className="text-[10px] font-black text-emerald-400">{res.latency}ms</span>
              </div>
           </div>
         ))}
      </div>
    </div>
  );
};

export default SubnetScanner;
