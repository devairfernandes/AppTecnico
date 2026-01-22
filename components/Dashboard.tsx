
import React, { useState, useEffect } from 'react';
import { 
  Activity, 
  Server, 
  ShieldCheck,
  Wifi,
  ChevronRight,
  Zap,
  Radio,
  Globe,
  Database,
  Lock,
  Clock,
  ArrowUpRight,
  ArrowDownLeft,
  Terminal,
} from 'lucide-react';
import { NetworkMetrics, AppView } from '../types';
import { AreaChart, Area, ResponsiveContainer, YAxis, CartesianGrid } from 'recharts';

interface DashboardProps {
  metrics: NetworkMetrics;
  onNavigate: (view: AppView) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ metrics, onNavigate }) => {
  const [trafficData, setTrafficData] = useState<any[]>([]);
  const [uptime, setUptime] = useState("04:12:33:09");

  // Simula dados de tráfego em tempo real
  useEffect(() => {
    const generateInitialData = () => {
      const data = [];
      for (let i = 0; i < 20; i++) {
        data.push({
          time: i,
          down: Math.floor(Math.random() * 40) + 10,
          up: Math.floor(Math.random() * 15) + 5
        });
      }
      return data;
    };

    setTrafficData(generateInitialData());

    const interval = setInterval(() => {
      setTrafficData(prev => {
        const next = [...prev.slice(1), {
          time: prev[prev.length - 1].time + 1,
          down: Math.floor(Math.random() * 40) + 10,
          up: Math.floor(Math.random() * 15) + 5
        }];
        return next;
      });
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-500 pb-12">
      {/* Header com Status Global */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-white uppercase italic">Central de Operações</h1>
          <div className="flex items-center gap-3 mt-1">
             <span className="text-[10px] font-mono text-blue-500 bg-blue-500/10 px-2 py-0.5 rounded border border-blue-500/20">NODE_SAO_PAULO_01</span>
             <span className="text-[10px] font-mono text-slate-500 tracking-wider">IP_WAN: {metrics.ip}</span>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex flex-col items-end">
            <span className="text-[8px] font-bold text-slate-500 uppercase tracking-widest">Sessão Ativa</span>
            <span className="text-xs font-mono font-bold text-emerald-500">{uptime}</span>
          </div>
          <div className="w-px h-8 bg-white/5" />
          <div className="px-3 py-1.5 glass-panel rounded-lg flex items-center gap-2">
             <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
             <span className="text-[9px] font-black text-slate-300 uppercase tracking-[0.2em]">Live</span>
          </div>
        </div>
      </div>

      {/* Grid Principal: Tráfego e Saúde */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        
        {/* Monitor de Tráfego */}
        <div className="lg:col-span-8 glass-panel rounded-3xl p-6 flex flex-col gap-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-500/10 rounded-lg text-blue-500">
                <Activity size={18} />
              </div>
              <div>
                <h3 className="text-xs font-black text-white uppercase tracking-widest">Vazão de Dados (Mbps)</h3>
                <p className="text-[10px] text-slate-500">Monitoramento I/O em tempo real</p>
              </div>
            </div>
            <div className="flex gap-4">
               <div className="flex items-center gap-2">
                 <div className="w-2 h-2 rounded-full bg-blue-500" />
                 <span className="text-[10px] font-bold text-slate-400">Download</span>
               </div>
               <div className="flex items-center gap-2">
                 <div className="w-2 h-2 rounded-full bg-indigo-500" />
                 <span className="text-[10px] font-bold text-slate-400">Upload</span>
               </div>
            </div>
          </div>
          
          <div className="h-48 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trafficData}>
                <defs>
                  <linearGradient id="colorDown" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorUp" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.03)" />
                <YAxis hide />
                <Area type="monotone" dataKey="down" stroke="#3b82f6" fillOpacity={1} fill="url(#colorDown)" isAnimationActive={false} />
                <Area type="monotone" dataKey="up" stroke="#6366f1" fillOpacity={1} fill="url(#colorUp)" isAnimationActive={false} />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-2 gap-4 pt-2">
             <div className="p-3 bg-white/[0.02] border border-white/5 rounded-xl flex items-center justify-between">
                <div className="flex items-center gap-2">
                   <ArrowDownLeft size={14} className="text-blue-500" />
                   <span className="text-[10px] font-bold text-slate-500 uppercase">Média Down</span>
                </div>
                <span className="text-sm font-black text-white">24.5 Mbps</span>
             </div>
             <div className="p-3 bg-white/[0.02] border border-white/5 rounded-xl flex items-center justify-between">
                <div className="flex items-center gap-2">
                   <ArrowUpRight size={14} className="text-indigo-500" />
                   <span className="text-[10px] font-bold text-slate-500 uppercase">Média Up</span>
                </div>
                <span className="text-sm font-black text-white">8.2 Mbps</span>
             </div>
          </div>
        </div>

        {/* Saúde do Sistema */}
        <div className="lg:col-span-4 glass-panel rounded-3xl p-6 flex flex-col items-center justify-center relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4">
             <Zap size={14} className="text-blue-500/20" />
          </div>
          
          <div className="relative w-36 h-36 mb-6">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="45" className="stroke-white/5" strokeWidth="8" fill="none" />
              <circle cx="50" cy="50" r="45" className="stroke-blue-600 shadow-blue-500" strokeWidth="8" fill="none" strokeDasharray="283" strokeDashoffset="5.6" strokeLinecap="round" />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-[9px] font-black text-blue-500/60 uppercase tracking-[0.2em]">Status</span>
              <span className="text-3xl font-black text-white">98%</span>
            </div>
          </div>

          <div className="text-center">
             <h4 className="text-sm font-black text-white mb-1 uppercase tracking-tight">Rede Estável</h4>
             <p className="text-[10px] text-slate-500 font-medium">Latência média: 12ms</p>
          </div>

          <div className="grid grid-cols-2 gap-3 w-full mt-6">
             <button onClick={() => onNavigate(AppView.SPEEDTEST)} className="p-2 bg-blue-600 rounded-xl text-[9px] font-bold text-white uppercase hover:bg-blue-500 transition-colors">Testar</button>
             <button onClick={() => onNavigate(AppView.AI_ADVISOR)} className="p-2 bg-white/5 border border-white/10 rounded-xl text-[9px] font-bold text-slate-400 uppercase hover:bg-white/10 transition-colors">Arquiteto</button>
          </div>
        </div>
      </div>

      {/* Grid de Métricas Secundárias */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <MiniStat icon={<Clock size={14} />} label="Latência ICMP" value={`${metrics.ping}ms`} color="blue" />
        <MiniStat icon={<Lock size={14} />} label="Firewall IPS" value="Ativo" color="emerald" />
        <MiniStat icon={<Radio size={14} />} label="Ocupação WiFi" value="22%" color="amber" />
        <MiniStat icon={<Database size={14} />} label="Packet Loss" value="0.001%" color="indigo" />
      </div>

      {/* Grid de Informação Densa: Matriz de Segurança e Terminal de Eventos */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        
        {/* Matriz de Segurança */}
        <div className="glass-panel rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-5">
            <ShieldCheck size={18} className="text-emerald-500" />
            <h4 className="text-xs font-bold uppercase tracking-widest text-white">Matriz de Segurança</h4>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
             <SecurityTag label="WPA3" status="Encrypted" />
             <SecurityTag label="SSH" status="Disabled" warning />
             <SecurityTag label="DNS Over HTTPS" status="Active" />
             <SecurityTag label="VPN Tunnel" status="Inactive" />
          </div>
          <div className="mt-4 p-3 bg-emerald-500/5 rounded-xl border border-emerald-500/10">
             <p className="text-[9px] text-emerald-500/80 leading-tight">
               "Nenhuma tentativa de intrusão detectada nas últimas 24 horas."
             </p>
          </div>
        </div>

        {/* Log de Eventos */}
        <div className="glass-panel rounded-2xl p-6 bg-black/20">
          <div className="flex items-center gap-3 mb-5">
            <Terminal size={18} className="text-slate-500" />
            <h4 className="text-xs font-bold uppercase tracking-widest text-white">Terminal de Eventos</h4>
          </div>
          <div className="space-y-3 max-h-[120px] overflow-y-auto pr-2 custom-scrollbar">
             <LogEntry time="14:22:01" msg="iPhone 15 Pro conectado" type="info" />
             <LogEntry time="13:45:10" msg="Novo host adicionado: 8.8.8.8" type="info" />
             <LogEntry time="12:00:00" msg="Backup automático concluído" type="success" />
             <LogEntry time="09:12:33" msg="Latência acima de 150ms detectada" type="warn" />
          </div>
        </div>
      </div>

      {/* ISP e Localização */}
      <div className="glass-panel rounded-2xl p-6 flex flex-col md:flex-row items-center justify-between gap-6 border-blue-500/10">
         <div className="flex items-center gap-6">
            <div className="flex items-center gap-3">
               <Server size={24} className="text-blue-500/50" />
               <div className="flex flex-col">
                  <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">Provedor de Serviço</span>
                  <span className="text-sm font-black text-white">{metrics.isp}</span>
               </div>
            </div>
            <div className="hidden md:block w-px h-8 bg-white/5" />
            <div className="flex items-center gap-3">
               <Globe size={24} className="text-indigo-500/50" />
               <div className="flex flex-col">
                  <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">Ponto de Presença</span>
                  <span className="text-sm font-black text-white">Brasil - Sudeste (SP)</span>
               </div>
            </div>
         </div>
         <div className="flex gap-4">
            <div className="flex flex-col items-end">
               <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">Uso Mensal</span>
               <span className="text-sm font-black text-white">452.8 GB / 1 TB</span>
            </div>
            <div className="w-12 h-12 rounded-full border-2 border-white/5 flex items-center justify-center">
               <span className="text-[10px] font-bold text-slate-400">45%</span>
            </div>
         </div>
      </div>
    </div>
  );
};

const SecurityTag = ({ label, status, warning }: any) => (
  <div className="flex flex-col p-2 bg-white/[0.02] border border-white/5 rounded-lg">
    <span className="text-[8px] font-bold text-slate-500 uppercase">{label}</span>
    <span className={`text-[10px] font-black ${warning ? 'text-amber-500' : 'text-slate-300'}`}>{status}</span>
  </div>
);

const LogEntry = ({ time, msg, type }: any) => (
  <div className="flex items-start gap-3 border-l border-white/5 pl-3 py-1">
    <span className="text-[9px] font-mono text-slate-600 shrink-0">{time}</span>
    <span className={`text-[10px] font-medium leading-tight ${
      type === 'warn' ? 'text-amber-500' : type === 'success' ? 'text-emerald-500' : 'text-slate-400'
    }`}>{msg}</span>
  </div>
);

const MiniStat = ({ icon, label, value, color }: any) => (
  <div className="glass-panel rounded-2xl p-4 flex items-center gap-3 hover:bg-white/[0.03] transition-colors cursor-default">
    <div className={`w-8 h-8 rounded-lg bg-${color}-500/10 flex items-center justify-center text-${color}-400`}>
      {icon}
    </div>
    <div className="flex flex-col">
      <span className="text-[8px] font-bold text-slate-500 uppercase tracking-widest leading-none mb-1">{label}</span>
      <span className="text-sm font-black text-white">{value}</span>
    </div>
  </div>
);

export default Dashboard;
