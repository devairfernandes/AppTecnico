
import React, { useState, useEffect, useMemo } from 'react';
import { Wifi, Zap, RefreshCw, Info, Sparkles, AlertCircle } from 'lucide-react';
import { getOptimizationAdvice } from '../services/geminiService';

interface AP {
  id: string;
  ssid: string;
  channel: number;
  width: 20 | 40 | 80 | 160;
  signal: number; // dBm
  isMine: boolean;
  color: string;
}

const ChannelAnalyzer: React.FC = () => {
  const [band, setBand] = useState<'2.4' | '5'>('2.4');
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [aiAdvice, setAiAdvice] = useState<any>(null);
  const [scanData, setScanData] = useState<AP[]>([]);

  const neighborColors = ['#4b5563', '#64748b', '#94a3b8', '#334155'];

  useEffect(() => {
    const generateInitialData = (): AP[] => {
      if (band === '2.4') {
        return [
          { id: '1', ssid: 'MINHA_REDE_PRO', channel: 6, width: 20, signal: -42, isMine: true, color: '#3b82f6' },
          { id: '2', ssid: 'Vizinho_A', channel: 1, width: 20, signal: -78, isMine: false, color: neighborColors[0] },
          { id: '3', ssid: 'Vizinho_B', channel: 6, width: 20, signal: -82, isMine: false, color: neighborColors[1] },
          { id: '4', ssid: 'Roteador_Antigo', channel: 11, width: 20, signal: -65, isMine: false, color: neighborColors[2] },
          { id: '5', ssid: 'Ponto_Acesso_X', channel: 6, width: 20, signal: -88, isMine: false, color: neighborColors[3] },
          { id: '6', ssid: 'Guest_WiFi', channel: 1, width: 20, signal: -85, isMine: false, color: neighborColors[0] },
        ];
      } else {
        return [
          { id: '10', ssid: 'MINHA_REDE_5G', channel: 36, width: 80, signal: -48, isMine: true, color: '#3b82f6' },
          { id: '11', ssid: 'Vizinho_5G_Fast', channel: 44, width: 40, signal: -72, isMine: false, color: neighborColors[0] },
          { id: '12', ssid: 'Office_Guest', channel: 36, width: 80, signal: -85, isMine: false, color: neighborColors[1] },
          { id: '13', ssid: 'Backhaul_Node', channel: 161, width: 20, signal: -60, isMine: false, color: neighborColors[2] },
          { id: '14', ssid: 'Conference_Room', channel: 36, width: 40, signal: -78, isMine: false, color: neighborColors[3] },
        ];
      }
    };

    setScanData(generateInitialData());

    const interval = setInterval(() => {
      setScanData(prev => prev.map(ap => ({
        ...ap,
        signal: ap.signal + (Math.random() * 0.6 - 0.3) // Suavizado para evitar "pulos" nos nomes
      })));
    }, 1500);

    return () => clearInterval(interval);
  }, [band]);

  const runAiOptimization = async () => {
    setIsOptimizing(true);
    try {
      const advice = await getOptimizationAdvice(scanData);
      setAiAdvice(advice);
    } catch (error) {
      console.error(error);
    } finally {
      setIsOptimizing(false);
    }
  };

  const getChannelRange = (band: '2.4' | '5') => {
    return band === '2.4' ? [1, 14] : [32, 165];
  };

  const apDensityMap = useMemo(() => {
    const sorted = [...scanData].sort((a, b) => b.signal - a.signal);
    const countMap: Record<number, number> = {};
    const densityMap: Record<string, number> = {};
    
    sorted.forEach(ap => {
      const ch = Math.round(ap.channel);
      densityMap[ap.id] = countMap[ch] || 0;
      countMap[ch] = (countMap[ch] || 0) + 1;
    });
    return densityMap;
  }, [scanData]);

  const renderSpectralView = () => {
    const [start, end] = getChannelRange(band);
    const range = end - start;
    
    return (
      <div className="relative h-72 w-full border-b border-white/5 mt-8 mb-4 bg-black/10 rounded-xl overflow-hidden">
        {/* Grid lines */}
        <div className="absolute inset-0 flex justify-between pointer-events-none px-6">
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={i} className="h-full w-px bg-white/[0.02]" />
          ))}
        </div>

        <svg className="absolute inset-0 w-full h-full overflow-visible px-6" viewBox="0 0 1000 100" preserveAspectRatio="none">
          {scanData.map((ap) => {
            const centerPos = ((ap.channel - start) / range) * 1000;
            const widthScale = band === '2.4' ? 22 : 160;
            const widthPx = (ap.width / widthScale) * 250;
            const height = 100 + ap.signal; // RSSI range typically -100 to -30
            const densityIdx = apDensityMap[ap.id];
            const labelY = 100 - height - 12 - (densityIdx * 14);
            
            return (
              <g key={ap.id} className="transition-all duration-1000">
                {/* Area Curve */}
                <path
                  d={`M ${centerPos - widthPx/2} 100 Q ${centerPos} ${100 - height} ${centerPos + widthPx/2} 100`}
                  fill={ap.isMine ? 'rgba(59, 130, 246, 0.15)' : 'rgba(148, 163, 184, 0.05)'}
                  stroke={ap.isMine ? '#3b82f6' : '#475569'}
                  strokeWidth={ap.isMine ? "2.5" : "1"}
                  className={ap.isMine ? "glow-blue" : ""}
                />
                
                {/* Connector line for stacked labels */}
                {densityIdx > 0 && (
                   <line 
                     x1={centerPos} y1={100 - height} 
                     x2={centerPos} y2={labelY + 4} 
                     stroke={ap.isMine ? "#3b82f644" : "#47556944"} 
                     strokeWidth="1" 
                     strokeDasharray="2,2" 
                   />
                )}

                {/* Label Group */}
                <g transform={`translate(${centerPos}, ${labelY})`}>
                  <rect 
                    x={-(ap.ssid.length * 3.2)} 
                    y="-9" 
                    width={ap.ssid.length * 6.4} 
                    height="13" 
                    rx="3" 
                    fill={ap.isMine ? "rgba(59, 130, 246, 0.9)" : "rgba(15, 23, 42, 0.8)"}
                  />
                  <text 
                    textAnchor="middle" 
                    fill={ap.isMine ? "#fff" : "#cbd5e1"} 
                    fontSize="9" 
                    fontWeight="800"
                    className="pointer-events-none"
                  >
                    {ap.ssid}
                  </text>
                </g>
              </g>
            );
          })}
        </svg>

        {/* X-Axis labels */}
        <div className="absolute -bottom-6 left-0 right-0 flex justify-between px-6">
           {band === '2.4' ? [1, 3, 6, 9, 11, 13].map(c => (
             <span key={c} className="text-[10px] font-black text-slate-600 uppercase">CH {c}</span>
           )) : [36, 48, 64, 100, 120, 149, 161].map(c => (
             <span key={c} className="text-[9px] font-black text-slate-600">{c}</span>
           ))}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
             <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
             <h2 className="text-xl font-black text-white italic tracking-tighter uppercase">RF Spectrum Analysis</h2>
          </div>
          <p className="text-[11px] text-slate-500 font-bold uppercase tracking-widest pl-4 border-l border-blue-500/30">Diagnóstico de Camada Física (PHY)</p>
        </div>
        <div className="flex bg-white/[0.03] border border-white/5 p-1 rounded-xl shadow-inner">
          <button 
            onClick={() => { setBand('2.4'); setAiAdvice(null); }}
            className={`px-5 py-2 rounded-lg text-[10px] font-black uppercase transition-all ${band === '2.4' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}
          >
            2.4 GHz
          </button>
          <button 
            onClick={() => { setBand('5'); setAiAdvice(null); }}
            className={`px-5 py-2 rounded-lg text-[10px] font-black uppercase transition-all ${band === '5' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}
          >
            5 GHz
          </button>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8 glass-panel rounded-[2rem] p-8 overflow-hidden flex flex-col min-h-[480px]">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-blue-600/10 rounded-xl text-blue-500 border border-blue-500/20">
                <Wifi size={20} />
              </div>
              <div>
                <h3 className="text-xs font-black text-white uppercase tracking-widest">Espectro de Ar</h3>
                <span className="text-[9px] font-bold text-slate-500 uppercase tracking-tighter">Largura de Banda: {band === '2.4' ? '22MHz' : '80/160MHz'}</span>
              </div>
            </div>
            <div className="flex gap-4">
               <div className="flex items-center gap-2 bg-blue-500/5 px-3 py-1 rounded-full border border-blue-500/10">
                 <div className="w-2 h-2 rounded-full bg-blue-500 shadow-[0_0_8px_#3b82f6]" />
                 <span className="text-[9px] font-black text-slate-300 uppercase">Gateway Ativo</span>
               </div>
               <div className="flex items-center gap-2 bg-slate-500/5 px-3 py-1 rounded-full border border-slate-500/10">
                 <div className="w-2 h-2 rounded-full bg-slate-600" />
                 <span className="text-[9px] font-black text-slate-400 uppercase">Interferentes</span>
               </div>
            </div>
          </div>
          
          <div className="flex-1 flex flex-col justify-center">
            {renderSpectralView()}
          </div>

          <div className="mt-12 flex items-start gap-3 p-4 bg-white/[0.02] border border-white/5 rounded-2xl">
            <Info size={16} className="text-blue-400 shrink-0 mt-0.5" />
            <p className="text-[10px] text-slate-400 leading-relaxed font-medium">
              A visualização espectral mostra o "Airtime" ocupado. Nomes empilhados verticalmente indicam redes disputando o mesmo canal central. Evite canais com alta densidade de etiquetas.
            </p>
          </div>
        </div>

        <div className="lg:col-span-4 space-y-6">
           <div className="glass-panel rounded-[2rem] p-7 border-blue-500/20 bg-gradient-to-br from-blue-600/[0.03] to-transparent">
              <div className="flex items-center gap-2 text-blue-400 mb-6">
                 <Sparkles size={18} />
                 <h4 className="text-[11px] font-black uppercase tracking-widest">Engenheiro Gemini AI</h4>
              </div>

              {!aiAdvice ? (
                <div className="space-y-4">
                   <p className="text-xs text-slate-400 leading-relaxed">O consultor de IA analisará o ruído de fundo e a densidade de redes vizinhas para projetar o plano de canal ideal.</p>
                   <button 
                     onClick={runAiOptimization}
                     disabled={isOptimizing}
                     className="w-full py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl font-black text-[10px] uppercase tracking-[0.15em] transition-all flex items-center justify-center gap-2 shadow-xl shadow-blue-500/20 active:scale-95"
                   >
                     {isOptimizing ? <RefreshCw size={16} className="animate-spin" /> : <Zap size={16} />}
                     {isOptimizing ? 'Decifrando Ondas...' : 'Calcular Plano de Canais'}
                   </button>
                </div>
              ) : (
                <div className="space-y-5 animate-in slide-in-from-top-4 duration-500">
                   <div className="grid grid-cols-2 gap-3">
                      <div className="p-4 bg-blue-600/10 border border-blue-500/20 rounded-2xl text-center">
                         <span className="text-[8px] font-bold text-slate-500 uppercase block mb-1">Recomendado 2.4</span>
                         <span className="text-2xl font-black text-white">{aiAdvice.recommended24}</span>
                      </div>
                      <div className="p-4 bg-indigo-600/10 border border-indigo-500/20 rounded-2xl text-center">
                         <span className="text-[8px] font-bold text-slate-500 uppercase block mb-1">Recomendado 5.0</span>
                         <span className="text-2xl font-black text-white">{aiAdvice.recommended5}</span>
                      </div>
                   </div>
                   <div className="p-4 bg-white/5 rounded-2xl">
                      <p className="text-[11px] text-slate-300 leading-relaxed italic border-l-2 border-blue-500 pl-4 py-1">
                        "{aiAdvice.reasoning}"
                      </p>
                   </div>
                   <button onClick={() => setAiAdvice(null)} className="w-full text-[9px] font-black text-slate-500 uppercase hover:text-white transition-colors tracking-widest">Nova Consultoria</button>
                </div>
              )}
           </div>

           <div className="glass-panel rounded-[2rem] p-7 flex flex-col h-full overflow-hidden">
              <div className="flex items-center justify-between mb-6">
                 <h4 className="text-[11px] font-black uppercase tracking-widest text-slate-400">Inventory Monitor</h4>
                 <div className="px-2 py-0.5 bg-blue-500/10 rounded text-[9px] font-black text-blue-500">{scanData.length} APs</div>
              </div>
              <div className="space-y-3 overflow-y-auto pr-2 custom-scrollbar flex-1 max-h-[280px]">
                 {scanData.sort((a,b) => b.signal - a.signal).map(ap => (
                   <div key={ap.id} className={`p-4 rounded-2xl border transition-all hover:translate-x-1 ${ap.isMine ? 'bg-blue-600/10 border-blue-500/30' : 'bg-white/[0.02] border-white/5'}`}>
                      <div className="flex justify-between items-center">
                         <div className="flex flex-col gap-0.5">
                            <span className={`text-[11px] font-black truncate max-w-[140px] ${ap.isMine ? 'text-white' : 'text-slate-300'}`}>{ap.ssid}</span>
                            <span className="text-[9px] font-bold text-slate-600 uppercase">CH {ap.channel} • {ap.width}MHz • PHY</span>
                         </div>
                         <div className="text-right">
                            <span className={`text-xs font-black tabular-nums ${ap.signal > -55 ? 'text-emerald-500' : ap.signal > -75 ? 'text-amber-500' : 'text-red-500'}`}>
                               {Math.round(ap.signal)} <span className="text-[8px] opacity-40">dBm</span>
                            </span>
                         </div>
                      </div>
                   </div>
                 ))}
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default ChannelAnalyzer;
