
import React, { useState } from 'react';
// Added Zap icon to imports
import { ClipboardCheck, CheckCircle2, Circle, Wifi, Globe, ShieldAlert, Cpu, Zap } from 'lucide-react';

const TroubleshootingChecklist: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'wifi' | 'connectivity' | 'performance'>('wifi');
  
  const guides = {
    wifi: {
      title: "Interferência e Sinal WiFi",
      steps: [
        "Verificar sobreposição de canais (Usar Analyzer)",
        "Checar nível de ruído (Noise Floor < -90dBm)",
        "Validar potência de TX (Transmit Power) do AP",
        "Confirmar autenticação WPA3/WPA2 compatível",
        "Reiniciar rádios se DFS estiver bloqueado"
      ]
    },
    connectivity: {
      title: "Falhas de Conectividade L3",
      steps: [
        "Ping no Gateway Local (192.168.1.1)",
        "Resolver domínio via DNS Externo (8.8.8.8)",
        "Verificar tabelas de roteamento (Route Table)",
        "Validar concessão de IP via DHCP",
        "Checar regras de Firewall e NAT"
      ]
    },
    performance: {
      title: "Latência e Packet Loss",
      steps: [
        "Testar cabo (Layer 1) para descartar CRC errors",
        "Monitorar carga de CPU no Gateway principal",
        "Identificar picos de tráfego (Throughput Monitor)",
        "Verificar MTU e fragmentação de pacotes",
        "Confirmar QoS/Traffic Shaping configurado"
      ]
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <header>
        <h2 className="text-xl font-black text-white">Guia de Troubleshooting</h2>
        <p className="text-[11px] text-slate-500 font-medium uppercase tracking-widest">Protocolos de diagnóstico para engenharia de campo</p>
      </header>

      <div className="flex border-b border-white/5 gap-6">
        <TabButton active={activeTab === 'wifi'} onClick={() => setActiveTab('wifi')} label="Wireless" icon={<Wifi size={14}/>} />
        <TabButton active={activeTab === 'connectivity'} onClick={() => setActiveTab('connectivity')} label="Conectividade" icon={<Globe size={14}/>} />
        {/* Zap is now correctly imported */}
        <TabButton active={activeTab === 'performance'} onClick={() => setActiveTab('performance')} label="Performance" icon={<Zap size={14}/>} />
      </div>

      <div className="glass-panel rounded-3xl p-8 space-y-6">
        <div className="flex items-center gap-3">
           <div className="p-3 bg-blue-600/10 rounded-2xl text-blue-500">
              <ClipboardCheck size={20} />
           </div>
           <h3 className="text-lg font-black text-white tracking-tight">{guides[activeTab].title}</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
           {guides[activeTab].steps.map((step, i) => (
             <CheckItem key={i} text={step} />
           ))}
        </div>

        <div className="mt-8 p-4 bg-amber-500/5 border border-amber-500/10 rounded-2xl flex items-start gap-4">
           <ShieldAlert className="text-amber-500 shrink-0 mt-0.5" size={16} />
           <div className="space-y-1">
              <p className="text-[10px] font-black uppercase text-amber-500 tracking-widest">Dica Profissional</p>
              <p className="text-xs text-slate-400 italic">
                Sempre execute um 'SpeedTest' antes e depois de cada alteração de hardware para validar o ganho real de throughput.
              </p>
           </div>
        </div>
      </div>
    </div>
  );
};

const TabButton = ({ active, onClick, label, icon }: any) => (
  <button 
    onClick={onClick}
    className={`flex items-center gap-2 pb-4 px-2 border-b-2 transition-all ${
      active ? 'border-blue-500 text-white font-bold' : 'border-transparent text-slate-500 hover:text-slate-300'
    }`}
  >
    {icon}
    <span className="text-xs uppercase tracking-widest">{label}</span>
  </button>
);

const CheckItem = ({ text }: any) => {
  const [checked, setChecked] = useState(false);
  return (
    <button 
      onClick={() => setChecked(!checked)}
      className={`flex items-center gap-4 p-4 rounded-2xl border transition-all text-left ${
        checked ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-500' : 'bg-white/[0.02] border-white/5 text-slate-400 hover:border-white/10'
      }`}
    >
      {checked ? <CheckCircle2 size={18} /> : <Circle size={18} className="opacity-20" />}
      <span className="text-xs font-medium">{text}</span>
    </button>
  );
};

export default TroubleshootingChecklist;
