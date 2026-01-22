
import React, { useState, useEffect } from 'react';
import { 
  Laptop, 
  Smartphone, 
  Tv, 
  Cpu, 
  Search, 
  ChevronRight,
  Activity,
  Printer,
  Speaker,
  Camera,
  Monitor
} from 'lucide-react';
import { Device } from '../types';

const TrafficBars: React.FC<{ active: boolean }> = ({ active }) => {
  const [heights, setHeights] = useState([40, 70, 45, 90, 60]);

  useEffect(() => {
    if (!active) return;
    const interval = setInterval(() => {
      setHeights(prev => prev.map(() => Math.floor(Math.random() * 60) + 15));
    }, 200);
    return () => clearInterval(interval);
  }, [active]);

  return (
    <div className="flex items-end gap-0.5 h-2.5 px-2 border-l border-white/10 ml-2">
      {heights.map((h, i) => (
        <div 
          key={i} 
          className="w-0.5 bg-blue-500/80 rounded-full transition-all duration-200"
          style={{ height: active ? `${h}%` : '20%' }}
        />
      ))}
    </div>
  );
};

const DeviceList: React.FC = () => {
  const [search, setSearch] = useState('');

  const devices: Device[] = [
    { id: '1', name: 'MacBook Pro 14"', type: 'laptop', ip: '192.168.1.102', mac: 'BC:D1:77:E1:92:02', status: 'online', signalStrength: -42 },
    { id: '2', name: 'iPhone 15 Pro', type: 'phone', ip: '192.168.1.105', mac: 'F4:0F:24:99:A1:88', status: 'online', signalStrength: -58 },
    { id: '3', name: 'TV Sala de Estar', type: 'tv', ip: '192.168.1.120', mac: '00:80:41:AE:FD:7E', status: 'offline', signalStrength: -85 },
    { id: '4', name: 'Philips Hue Bridge', type: 'iot', ip: '192.168.1.50', mac: '00:17:88:6D:9A:21', status: 'online', signalStrength: -38 },
    { id: '5', name: 'Unifi Dream Machine', type: 'router', ip: '192.168.1.1', mac: 'D0:21:F9:67:8B:12', status: 'online', signalStrength: -20 },
    { id: '6', name: 'Work Desktop', type: 'desktop', ip: '192.168.1.110', mac: '70:85:C2:54:33:F1', status: 'online', signalStrength: -45 },
    { id: '7', name: 'Impressora Escritório', type: 'printer', ip: '192.168.1.200', mac: '00:1B:63:84:45:E2', status: 'online', signalStrength: -62 },
    { id: '8', name: 'Caixa de Som Studio', type: 'smart_speaker', ip: '192.168.1.155', mac: 'A4:77:33:99:CC:11', status: 'online', signalStrength: -55 },
    { id: '9', name: 'Câmera Porta Frontal', type: 'camera', ip: '192.168.1.180', mac: '44:D9:E7:F1:22:90', status: 'online', signalStrength: -68 },
  ];

  const filteredDevices = devices.filter(d => 
    d.name.toLowerCase().includes(search.toLowerCase()) || 
    d.ip.includes(search)
  );

  const getIcon = (type: Device['type']) => {
    switch (type) {
      case 'laptop': return <Laptop size={16} />;
      case 'phone': return <Smartphone size={16} />;
      case 'tv': return <Tv size={16} />;
      case 'iot': return <Cpu size={16} />;
      case 'router': return <Activity size={16} />;
      case 'desktop': return <Monitor size={16} />;
      case 'printer': return <Printer size={16} />;
      case 'smart_speaker': return <Speaker size={16} />;
      case 'camera': return <Camera size={16} />;
      default: return <Smartphone size={16} />;
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-white">Nós da Rede</h2>
          <p className="text-[11px] text-slate-500 font-medium">Inventário em tempo real de dispositivos autenticados</p>
        </div>
        <div className="flex gap-2">
           <div className="relative">
             <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-600" size={14} />
             <input 
               type="text" 
               placeholder="Buscar..."
               className="bg-white/[0.03] border border-white/5 pl-9 pr-4 py-1.5 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500/50 text-xs w-48 transition-all"
               value={search}
               onChange={(e) => setSearch(e.target.value)}
             />
           </div>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filteredDevices.map(device => (
          <div key={device.id} className="glass-panel rounded-2xl p-5 hover:border-blue-500/20 group cursor-pointer relative overflow-hidden">
            <div className="flex justify-between items-start mb-4">
              <div className={`p-2.5 rounded-lg ${device.status === 'online' ? 'bg-blue-500/10 text-blue-400' : 'bg-slate-800 text-slate-500 opacity-50'}`}>
                {getIcon(device.type)}
              </div>
              <div className="flex items-center gap-1.5 px-2 py-0.5 bg-white/5 rounded-full border border-white/5">
                <div className={`w-1 h-1 rounded-full ${device.status === 'online' ? 'bg-emerald-500 shadow-[0_0_5px_rgba(16,185,129,0.5)]' : 'bg-slate-600'}`} />
                <span className={`text-[8px] font-black uppercase tracking-widest ${device.status === 'online' ? 'text-emerald-500' : 'text-slate-500'}`}>
                  {device.status === 'online' ? 'Online' : 'Offline'}
                </span>
                {device.status === 'online' && <TrafficBars active={true} />}
              </div>
            </div>

            <div className="mb-4">
              <h4 className="font-bold text-sm text-white truncate">{device.name}</h4>
              <p className="text-[10px] font-mono text-slate-500 mt-0.5">{device.ip}</p>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-white/5">
              <div className="flex flex-col">
                <span className="text-[8px] font-bold text-slate-600 uppercase tracking-widest">Sinal</span>
                <span className={`text-[11px] font-black ${device.signalStrength > -50 ? 'text-emerald-500' : 'text-amber-500'}`}>
                  {device.signalStrength} dBm
                </span>
              </div>
              <ChevronRight size={14} className="text-slate-700 group-hover:text-white transition-colors" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DeviceList;
