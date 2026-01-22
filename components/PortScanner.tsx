
import React, { useState } from 'react';
// Added Activity icon to imports
import { PackageSearch, Play, AlertCircle, CheckCircle2, ShieldOff, Terminal, Activity } from 'lucide-react';

interface PortStatus {
  port: number;
  service: string;
  status: 'scanning' | 'open' | 'closed' | 'filtered';
}

const PortScanner: React.FC = () => {
  const [target, setTarget] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const [results, setResults] = useState<PortStatus[]>([]);

  const commonPorts = [
    { port: 21, service: 'FTP' },
    { port: 22, service: 'SSH' },
    { port: 23, service: 'Telnet' },
    { port: 25, service: 'SMTP' },
    { port: 53, service: 'DNS' },
    { port: 80, service: 'HTTP' },
    { port: 110, service: 'POP3' },
    { port: 443, service: 'HTTPS' },
    { port: 445, service: 'SMB' },
    { port: 3306, service: 'MySQL' },
    { port: 3389, service: 'RDP' },
    { port: 8080, service: 'HTTP-Alt' },
  ];

  const startScan = async () => {
    if (!target) return;
    setIsScanning(true);
    setResults(commonPorts.map(p => ({ ...p, status: 'scanning' })));

    for (let i = 0; i < commonPorts.length; i++) {
      await new Promise(r => setTimeout(r, Math.random() * 400 + 100));
      setResults(prev => {
        const next = [...prev];
        // Simulação baseada em lógica "probabilística" para interface
        const roll = Math.random();
        next[i].status = roll > 0.8 ? 'open' : roll > 0.4 ? 'closed' : 'filtered';
        return next;
      });
    }
    setIsScanning(false);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <header>
        <h2 className="text-xl font-black text-white">Scanner de Portas TCP</h2>
        <p className="text-[11px] text-slate-500 font-medium uppercase tracking-widest">Identificação de serviços e vulnerabilidades em nós</p>
      </header>

      <div className="glass-panel rounded-2xl p-4 flex flex-col md:flex-row gap-4 items-end">
        <div className="flex-1 space-y-1 w-full">
           <label className="text-[9px] font-bold text-slate-500 uppercase tracking-widest px-1">Endereço Destino</label>
           <div className="relative">
             <Terminal className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-600" size={14} />
             <input 
               type="text" 
               placeholder="ex: 192.168.1.1 ou google.com"
               className="w-full bg-white/[0.03] border border-white/5 pl-10 pr-4 py-2.5 rounded-xl text-xs text-white focus:outline-none focus:ring-1 focus:ring-blue-500/50"
               value={target}
               onChange={(e) => setTarget(e.target.value)}
             />
           </div>
        </div>
        <button 
          onClick={startScan}
          disabled={isScanning || !target}
          className="bg-blue-600 hover:bg-blue-500 disabled:opacity-30 text-white px-6 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 transition-all"
        >
          {/* Activity is now correctly imported */}
          {isScanning ? <Activity className="animate-spin" size={14} /> : <Play size={14} />}
          {isScanning ? 'Escanerndo...' : 'Iniciar Scan'}
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {results.map((res) => (
          <div key={res.port} className={`glass-panel rounded-2xl p-4 border-l-4 ${
            res.status === 'open' ? 'border-l-emerald-500' : 
            res.status === 'closed' ? 'border-l-slate-700' : 
            res.status === 'filtered' ? 'border-l-amber-500' : 'border-l-blue-500/20'
          }`}>
            <div className="flex justify-between items-start mb-2">
               <span className="text-lg font-black text-white">{res.port}</span>
               {res.status === 'open' ? <CheckCircle2 size={14} className="text-emerald-500" /> : 
                res.status === 'filtered' ? <ShieldOff size={14} className="text-amber-500" /> : 
                res.status === 'closed' ? <AlertCircle size={14} className="text-slate-600" /> : 
                <div className="w-3 h-3 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />}
            </div>
            <div className="flex flex-col">
               <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">{res.service}</span>
               <span className={`text-[10px] font-black uppercase mt-1 ${
                 res.status === 'open' ? 'text-emerald-500' : 'text-slate-400'
               }`}>{res.status}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PortScanner;
