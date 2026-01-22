
import React, { useState } from 'react';
import { 
  Wifi, 
  Cpu, 
  Zap, 
  Smartphone, 
  Menu, 
  X,
  Terminal,
  Grid,
  Network,
  Calculator,
  Activity,
  ShieldAlert,
  Search,
  Route,
  ClipboardCheck,
  PackageSearch,
  Radar,
  CloudLightning,
  Fingerprint
} from 'lucide-react';
import { AppView, NetworkMetrics } from './types';
import Dashboard from './components/Dashboard';
import SpeedTest from './components/SpeedTest';
import ChannelAnalyzer from './components/ChannelAnalyzer';
import DeviceList from './components/DeviceList';
import NetworkMap from './components/NetworkMap';
import AIArchitect from './components/AIArchitect';
import IPCalculator from './components/IPCalculator';
import LatencyMonitor from './components/LatencyMonitor';
import PortScanner from './components/PortScanner';
import DnsLookup from './components/DnsLookup';
import Traceroute from './components/Traceroute';
import TroubleshootingChecklist from './components/TroubleshootingChecklist';
import SubnetScanner from './components/SubnetScanner';
import ServiceHealth from './components/ServiceHealth';
import MacLookup from './components/MacLookup';

const App: React.FC = () => {
  const [activeView, setActiveView] = useState<AppView>(AppView.DASHBOARD);
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [metrics, setMetrics] = useState<NetworkMetrics>({
    ping: 12,
    download: 245.8,
    upload: 48.2,
    jitter: 2,
    isp: "FiberConnect Pro",
    server: "São Paulo - Level 3",
    ip: "192.168.1.1"
  });

  const navGroups = [
    {
      title: "Monitoramento",
      items: [
        { id: AppView.DASHBOARD, label: 'Painel Geral', icon: Grid },
        { id: AppView.SPEEDTEST, label: 'Desempenho', icon: Zap },
        { id: AppView.SERVICE_HEALTH, label: 'Saúde Cloud', icon: CloudLightning },
        { id: AppView.LATENCY_MONITOR, label: 'Tempo Real', icon: Activity },
      ]
    },
    {
      title: "Diagnóstico Ativo",
      items: [
        { id: AppView.PORT_SCANNER, label: 'Scan de Portas', icon: PackageSearch },
        { id: AppView.SUBNET_SCAN, label: 'Ping Sweep', icon: Radar },
        { id: AppView.TRACEROUTE, label: 'Traceroute', icon: Route },
        { id: AppView.DNS_LOOKUP, label: 'DNS / WHOIS', icon: Search },
      ]
    },
    {
      title: "Infraestrutura",
      items: [
        { id: AppView.NETWORK_MAP, label: 'Topologia', icon: Network },
        { id: AppView.CHANNELS, label: 'Canais WiFi', icon: Wifi },
        { id: AppView.DEVICES, label: 'Inventário', icon: Smartphone },
        { id: AppView.MAC_LOOKUP, label: 'ID de Hardware', icon: Fingerprint },
        { id: AppView.IP_CALCULATOR, label: 'Subnets / IP', icon: Calculator },
      ]
    },
    {
      title: "Inteligência",
      items: [
        { id: AppView.AI_ADVISOR, label: 'Consultor IA', icon: Cpu },
        { id: AppView.CHECKLISTS, label: 'Guias de Erro', icon: ClipboardCheck },
      ]
    }
  ];

  return (
    <div className="flex h-screen overflow-hidden text-slate-300">
      <aside className="hidden md:flex flex-col w-64 border-r border-white/5 bg-[#0d1117]/90 backdrop-blur-xl z-50">
        <div className="p-6 flex items-center gap-3">
          <div className="w-9 h-9 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20">
            <Zap className="text-white fill-white" size={18} />
          </div>
          <div className="flex flex-col">
            <span className="text-lg font-black tracking-tighter text-white leading-none">NetPulse</span>
            <span className="text-[10px] font-bold text-blue-500 uppercase tracking-widest mt-1 italic">Pro Engineer</span>
          </div>
        </div>
        
        <nav className="flex-1 px-4 space-y-6 mt-4 overflow-y-auto pb-8 custom-scrollbar">
          {navGroups.map((group, idx) => (
            <div key={idx} className="space-y-1">
              <h3 className="px-4 text-[9px] font-black uppercase tracking-[0.2em] text-slate-600 mb-2">{group.title}</h3>
              {group.items.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveView(item.id)}
                  className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all duration-200 group ${
                    activeView === item.id 
                      ? 'nav-item-active text-white font-bold' 
                      : 'text-slate-500 hover:text-slate-300 hover:bg-white/[0.03]'
                  }`}
                >
                  <item.icon size={16} className={activeView === item.id ? 'text-blue-500' : 'group-hover:scale-110'} />
                  <span className="text-xs tracking-tight">{item.label}</span>
                </button>
              ))}
            </div>
          ))}
        </nav>

        <div className="p-4 border-t border-white/5">
          <div className="p-4 rounded-xl bg-blue-500/5 border border-blue-500/10">
            <div className="flex items-center gap-2 mb-2">
              <ShieldAlert size={12} className="text-blue-500" />
              <span className="text-[10px] font-bold uppercase tracking-widest text-blue-400">Status WAN</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[10px] text-slate-400">IP Público:</span>
              <span className="text-[10px] font-mono font-bold text-white">45.230.12.8</span>
            </div>
          </div>
        </div>
      </aside>

      <div className="flex-1 flex flex-col h-full relative overflow-hidden bg-[#0d1117]/40">
        <header className="md:hidden flex items-center justify-between p-4 border-b border-white/5 bg-black/40">
          <div className="flex items-center gap-2">
            <Zap className="text-blue-500" size={20} />
            <span className="font-bold text-white tracking-tighter">NetPulse</span>
          </div>
          <button onClick={() => setSidebarOpen(!isSidebarOpen)} className="p-2 glass-panel rounded-lg">
            {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </header>

        <main className="flex-1 overflow-y-auto p-4 md:p-8">
          <div className="max-w-7xl mx-auto h-full">
            {activeView === AppView.DASHBOARD && <Dashboard metrics={metrics} onNavigate={setActiveView} />}
            {activeView === AppView.SPEEDTEST && <SpeedTest onComplete={setMetrics} />}
            {activeView === AppView.CHANNELS && <ChannelAnalyzer />}
            {activeView === AppView.DEVICES && <DeviceList />}
            {activeView === AppView.NETWORK_MAP && <NetworkMap />}
            {activeView === AppView.IP_CALCULATOR && <IPCalculator />}
            {activeView === AppView.LATENCY_MONITOR && <LatencyMonitor />}
            {activeView === AppView.AI_ADVISOR && <AIArchitect currentMetrics={metrics} />}
            {activeView === AppView.PORT_SCANNER && <PortScanner />}
            {activeView === AppView.DNS_LOOKUP && <DnsLookup />}
            {activeView === AppView.TRACEROUTE && <Traceroute />}
            {activeView === AppView.CHECKLISTS && <TroubleshootingChecklist />}
            {activeView === AppView.SUBNET_SCAN && <SubnetScanner />}
            {activeView === AppView.SERVICE_HEALTH && <ServiceHealth />}
            {activeView === AppView.MAC_LOOKUP && <MacLookup />}
          </div>
        </main>

        {isSidebarOpen && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] md:hidden" onClick={() => setSidebarOpen(false)}>
            <div className="absolute left-0 top-0 bottom-0 w-64 bg-[#0d1117] p-6 animate-in slide-in-from-left overflow-y-auto">
               {navGroups.map((group, idx) => (
                <div key={idx} className="mb-6">
                  <p className="text-[9px] font-black uppercase text-slate-600 mb-2 px-2">{group.title}</p>
                  {group.items.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => { setActiveView(item.id); setSidebarOpen(false); }}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl mb-1 ${
                        activeView === item.id ? 'bg-blue-600 text-white' : 'text-slate-400'
                      }`}
                    >
                      <item.icon size={18} />
                      <span className="text-sm font-bold">{item.label}</span>
                    </button>
                  ))}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default App;
