
import React, { useState, useEffect } from 'react';
import { CloudLightning, Activity, Globe, CheckCircle2, AlertTriangle, ShieldCheck } from 'lucide-react';

interface ServiceStat {
  name: string;
  provider: string;
  latency: number;
  status: 'optimal' | 'stable' | 'degraded';
}

const ServiceHealth: React.FC = () => {
  const [stats, setStats] = useState<ServiceStat[]>([
    { name: 'AWS (us-east-1)', provider: 'Amazon Web Services', latency: 0, status: 'stable' },
    { name: 'Google Cloud (sa-east-1)', provider: 'Google Cloud', latency: 0, status: 'stable' },
    { name: 'Azure (Brazil South)', provider: 'Microsoft Azure', latency: 0, status: 'stable' },
    { name: 'Cloudflare Edge', provider: 'Cloudflare', latency: 0, status: 'stable' },
    { name: 'Netflix CDN', provider: 'Open Connect', latency: 0, status: 'stable' },
    { name: 'Steam Network', provider: 'Valve Corp', latency: 0, status: 'stable' },
    { name: 'WhatsApp API', provider: 'Meta', latency: 0, status: 'stable' },
    { name: 'PlayStation Network', provider: 'Sony', latency: 0, status: 'stable' },
  ]);

  useEffect(() => {
    const updateStats = () => {
      setStats(prev => prev.map(s => {
        const newLatency = Math.floor(Math.random() * 15) + (s.name.includes('Brazil') || s.name.includes('sa-east') ? 10 : 120);
        return {
          ...s,
          latency: newLatency,
          status: newLatency < 30 ? 'optimal' : newLatency < 150 ? 'stable' : 'degraded'
        };
      }));
    };

    updateStats();
    const interval = setInterval(updateStats, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <header className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-black text-white">Cloud Service Health</h2>
          <p className="text-[11px] text-slate-500 font-medium uppercase tracking-widest">Disponibilidade e latência de backends globais</p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-full">
           <ShieldCheck size={12} className="text-emerald-500" />
           <span className="text-[9px] font-black text-emerald-500 uppercase tracking-widest">Global Status: OK</span>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((service, i) => (
          <div key={i} className="glass-panel rounded-2xl p-5 hover:bg-white/[0.03] transition-all relative overflow-hidden group">
            <div className={`absolute top-0 right-0 w-1 h-full ${
              service.status === 'optimal' ? 'bg-emerald-500' : service.status === 'stable' ? 'bg-blue-500' : 'bg-amber-500'
            }`} />
            
            <div className="flex justify-between items-start mb-4">
               <div className="p-2 bg-white/5 rounded-lg text-slate-400 group-hover:text-white transition-colors">
                  <Globe size={16} />
               </div>
               {service.status === 'optimal' ? <CheckCircle2 size={14} className="text-emerald-500" /> : <Activity size={14} className="text-blue-500" />}
            </div>

            <div className="space-y-1 mb-4">
               <h4 className="text-xs font-black text-white truncate">{service.name}</h4>
               <p className="text-[9px] font-bold text-slate-500 uppercase tracking-tight truncate">{service.provider}</p>
            </div>

            <div className="flex justify-between items-end">
               <div className="flex flex-col">
                  <span className="text-[8px] font-bold text-slate-600 uppercase tracking-widest leading-none mb-1">Latency</span>
                  <span className={`text-lg font-black tabular-nums ${
                    service.status === 'optimal' ? 'text-emerald-500' : 'text-white'
                  }`}>{service.latency}<span className="text-[10px] ml-0.5 opacity-40">ms</span></span>
               </div>
               <span className={`text-[8px] font-black uppercase tracking-widest px-1.5 py-0.5 rounded ${
                 service.status === 'optimal' ? 'bg-emerald-500/10 text-emerald-500' : 
                 service.status === 'stable' ? 'bg-blue-500/10 text-blue-500' : 'bg-amber-500/10 text-amber-500'
               }`}>{service.status}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="glass-panel rounded-2xl p-6 bg-blue-600/5 border-blue-500/10">
         <div className="flex items-start gap-4">
            <div className="p-3 bg-blue-600 rounded-2xl text-white">
               <CloudLightning size={24} />
            </div>
            <div className="flex-1">
               <h3 className="text-sm font-black text-white uppercase tracking-tight mb-1">Análise de Rota Global</h3>
               <p className="text-xs text-slate-400 leading-relaxed max-w-2xl">
                 O tráfego para servidores locais (SP) apresenta latência estável sub-20ms. Servidores internacionais estão sendo roteados via Tier-1 Carriers com overhead de 120ms, dentro dos parâmetros aceitáveis para a região.
               </p>
            </div>
         </div>
      </div>
    </div>
  );
};

export default ServiceHealth;
