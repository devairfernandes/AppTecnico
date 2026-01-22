
import React, { useMemo } from 'react';
import { 
  Laptop, 
  Smartphone, 
  Tv, 
  Cpu, 
  Activity, 
  ShieldCheck,
  Zap,
  Radio,
  Monitor,
  Printer,
  Speaker,
  Camera
} from 'lucide-react';
import { Device } from '../types';

const NetworkMap: React.FC = () => {
  const devices: Device[] = [
    { id: '5', name: 'Gateway Principal', type: 'router', ip: '192.168.1.1', mac: 'D0:21:F9:67:8B:12', status: 'online', signalStrength: -20 },
    { id: '1', name: 'MacBook Pro', type: 'laptop', ip: '192.168.1.102', mac: 'BC:D1:77:E1:92:02', status: 'online', signalStrength: -42 },
    { id: '2', name: 'iPhone 15 Pro', type: 'phone', ip: '192.168.1.105', mac: 'F4:0F:24:99:A1:88', status: 'online', signalStrength: -58 },
    { id: '3', name: 'TV Sala de Estar', type: 'tv', ip: '192.168.1.120', mac: '00:80:41:AE:FD:7E', status: 'offline', signalStrength: -85 },
    { id: '4', name: 'Hue Bridge', type: 'iot', ip: '192.168.1.50', mac: '00:17:88:6D:9A:21', status: 'online', signalStrength: -38 },
    { id: '6', name: 'Desktop Trabalho', type: 'desktop', ip: '192.168.1.110', mac: '70:85:C2:54:33:F1', status: 'online', signalStrength: -45 },
    { id: '7', name: 'Impressora', type: 'printer', ip: '192.168.1.200', mac: '00:1B:63:84:45:E2', status: 'online', signalStrength: -62 },
    { id: '8', name: 'Smart Speaker', type: 'smart_speaker', ip: '192.168.1.155', mac: 'A4:77:33:99:CC:11', status: 'online', signalStrength: -55 },
    { id: '9', name: 'Câmera Segurança', type: 'camera', ip: '192.168.1.180', mac: '44:D9:E7:F1:22:90', status: 'online', signalStrength: -68 },
  ];

  const gateway = devices.find(d => d.type === 'router')!;
  const nodes = devices.filter(d => d.id !== gateway.id);

  const getIcon = (type: Device['type'], size = 20) => {
    switch (type) {
      case 'laptop': return <Laptop size={size} />;
      case 'phone': return <Smartphone size={size} />;
      case 'tv': return <Tv size={size} />;
      case 'iot': return <Cpu size={size} />;
      case 'router': return <Activity size={size} />;
      case 'desktop': return <Monitor size={size} />;
      case 'printer': return <Printer size={size} />;
      case 'smart_speaker': return <Speaker size={size} />;
      case 'camera': return <Camera size={size} />;
      default: return <Smartphone size={size} />;
    }
  };

  const nodePositions = useMemo(() => {
    const centerX = 50;
    const centerY = 50;
    return nodes.map((node, i) => {
      const angle = (i / nodes.length) * (2 * Math.PI);
      return {
        ...node,
        x: centerX + Math.cos(angle) * 40,
        y: centerY + Math.sin(angle) * 40,
      };
    });
  }, [nodes]);

  return (
    <div className="h-full flex flex-col gap-6 animate-in fade-in duration-700">
      <header className="flex flex-col gap-1">
        <h2 className="text-xl font-black text-white">Topologia da Infraestrutura</h2>
        <p className="text-[11px] text-slate-500 font-medium">Visualizador espectral de nós de rede ativos</p>
      </header>

      <div className="flex-1 glass-panel rounded-3xl relative overflow-hidden bg-black/20 min-h-[500px]">
        <div className="absolute inset-0 opacity-[0.03]" style={{ 
          backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)',
          backgroundSize: '40px 40px' 
        }} />

        <svg className="absolute inset-0 w-full h-full pointer-events-none">
          {nodePositions.map((node) => (
            <g key={`conn-${node.id}`}>
              <line 
                x1="50%" y1="50%" 
                x2={`${node.x}%`} y2={`${node.y}%`} 
                stroke="rgba(59, 130, 246, 0.15)" 
                strokeWidth="1.5" 
                strokeDasharray={node.status === 'offline' ? '5,5' : '0'}
              />
              {node.status === 'online' && (
                <circle r="2" fill="#3b82f6">
                  <animate attributeName="cx" from="50%" to={`${node.x}%`} dur="2s" repeatCount="indefinite" />
                  <animate attributeName="cy" from="50%" to={`${node.y}%`} dur="2s" repeatCount="indefinite" />
                </circle>
              )}
            </g>
          ))}
        </svg>

        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20">
          <div className="relative group text-center">
            <div className="w-20 h-20 bg-blue-600 rounded-2xl flex flex-col items-center justify-center border-4 border-[#0d1117]">
              <Activity className="text-white mb-1" size={24} />
              <span className="text-[8px] font-black uppercase text-blue-100">Gateway</span>
            </div>
            <div className="absolute top-full mt-3 left-1/2 -translate-x-1/2 w-32">
               <p className="text-[10px] font-bold text-white uppercase">{gateway.name}</p>
            </div>
          </div>
        </div>

        {nodePositions.map((node) => (
          <div key={node.id} className="absolute z-10 -translate-x-1/2 -translate-y-1/2 group" style={{ left: `${node.x}%`, top: `${node.y}%` }}>
            <div className={`w-12 h-12 rounded-xl border border-white/10 flex items-center justify-center transition-all ${node.status === 'online' ? 'bg-white/[0.05] text-blue-400' : 'bg-black/40 text-slate-600 grayscale'}`}>
              {getIcon(node.type, 18)}
            </div>
            <div className="absolute top-full mt-2 left-1/2 -translate-x-1/2 text-center opacity-0 group-hover:opacity-100 transition-opacity w-24">
               <p className="text-[9px] font-bold text-white uppercase">{node.name}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <MapStat label="Total de Nós" value={devices.length.toString()} icon={<Zap size={14} />} />
        <MapStat label="Uplinks Ativos" value={devices.filter(d => d.status === 'online').length.toString()} icon={<ShieldCheck size={14} />} color="text-emerald-500" />
        <MapStat label="Carga da Banda" value="12%" icon={<Radio size={14} />} color="text-blue-500" />
        <div className="glass-panel rounded-2xl p-4 flex items-center justify-center bg-blue-600/10 border-blue-500/20 cursor-pointer">
          <span className="text-[10px] font-black uppercase tracking-widest text-blue-400">Escanear novos nós</span>
        </div>
      </div>
    </div>
  );
};

const MapStat = ({ label, value, icon, color = "text-slate-500" }: any) => (
  <div className="glass-panel rounded-2xl p-4 flex items-center gap-3">
    <div className={`w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center ${color}`}>
      {icon}
    </div>
    <div className="flex flex-col">
      <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">{label}</span>
      <span className="text-sm font-black text-white">{value}</span>
    </div>
  </div>
);

export default NetworkMap;
