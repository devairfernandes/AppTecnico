
import React, { useState, useEffect, useRef } from 'react';
import { NetworkMetrics } from '../types';
import { 
  Play,
  CheckCircle2
} from 'lucide-react';
import { LineChart, Line, CartesianGrid, ResponsiveContainer } from 'recharts';

interface SpeedTestProps {
  onComplete: (metrics: NetworkMetrics) => void;
}

type TestPhase = 'ocioso' | 'latência' | 'download' | 'upload' | 'concluído';

const SpeedTest: React.FC<SpeedTestProps> = ({ onComplete }) => {
  const [phase, setPhase] = useState<TestPhase>('ocioso');
  const [currentSpeed, setCurrentSpeed] = useState(0);
  const [latencyHistory, setLatencyHistory] = useState<{ time: number; ping: number; jitter: number }[]>([]);
  const [results, setResults] = useState<Partial<NetworkMetrics>>({
    ping: 0, download: 0, upload: 0, jitter: 0
  });

  const intervalRef = useRef<number>();

  const startTest = () => {
    setPhase('latência');
    setLatencyHistory([]);
    setResults({ ping: 0, download: 0, upload: 0, jitter: 0 });
    
    let samples = 0;
    const maxSamples = 12;
    const pingInterval = window.setInterval(() => {
      samples++;
      const newPing = Math.floor(Math.random() * 8) + 8;
      const newJitter = Math.floor(Math.random() * 2) + 1;
      setLatencyHistory(prev => [...prev, { time: samples, ping: newPing, jitter: newJitter }]);
      
      if (samples >= maxSamples) {
        clearInterval(pingInterval);
        setResults(prev => ({ ...prev, ping: newPing, jitter: newJitter }));
        setPhase('download');
        runPhaseAnimation('download', 320);
      }
    }, 150);
  };

  const runPhaseAnimation = (type: 'download' | 'upload', targetSpeed: number) => {
    let frame = 0;
    const duration = 120; 

    intervalRef.current = window.setInterval(() => {
      frame++;
      const p = frame / duration;
      const baseRamp = targetSpeed * (1 - Math.pow(1 - p, 3));
      const jitterVal = (Math.random() * (targetSpeed * 0.05)) - (targetSpeed * 0.025);
      const speed = Math.max(0, baseRamp + jitterVal);
      
      setCurrentSpeed(speed);

      if (frame >= duration) {
        clearInterval(intervalRef.current);
        if (type === 'download') {
          setResults(prev => ({ ...prev, download: Number(speed.toFixed(1)) }));
          setTimeout(() => {
            setPhase('upload');
            runPhaseAnimation('upload', 95);
          }, 800);
        } else {
          setResults(prev => ({ ...prev, upload: Number(speed.toFixed(1)) }));
          setPhase('concluído');
          onComplete({
            ping: results.ping || 12, 
            download: results.download || 320, 
            upload: Number(speed.toFixed(1)),
            jitter: results.jitter || 2, 
            isp: "FiberConnect Pro", 
            server: "São Paulo", 
            ip: "192.168.1.1"
          });
        }
      }
    }, 1000 / 30);
  };

  useEffect(() => () => clearInterval(intervalRef.current), []);

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-black text-white">Diagnóstico de Desempenho</h2>
          <p className="text-[11px] text-slate-500 font-medium">Teste de Precisão v2.5</p>
        </div>
        <div className="flex gap-2">
           <div className={`px-3 py-1 bg-white/5 rounded-lg border border-white/5 text-[10px] font-bold ${phase !== 'ocioso' ? 'text-blue-400' : 'text-slate-600'}`}>
             {phase.toUpperCase()}
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        <div className="lg:col-span-8 glass-panel rounded-3xl p-10 flex flex-col items-center justify-center relative overflow-hidden">
          <div className="relative w-48 h-48 flex items-center justify-center mb-8">
            <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="46" className="stroke-white/5" strokeWidth="2" fill="none" />
              <circle 
                cx="50" cy="50" r="46" 
                className={`transition-all duration-300 ease-out ${phase === 'upload' ? 'stroke-indigo-500' : 'stroke-blue-500'}`}
                strokeWidth="3" fill="none" 
                strokeDasharray="289" 
                strokeDashoffset={289 - (289 * (Math.min(currentSpeed, 400) / 400))}
                strokeLinecap="round"
              />
            </svg>
            <div className="text-center z-10">
              {phase === 'ocioso' ? (
                <button onClick={startTest} className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center hover:scale-105 transition-all">
                  <Play size={24} className="text-white fill-white ml-1" />
                </button>
              ) : (
                <div className="flex flex-col items-center">
                  <span className="text-4xl font-black text-white tracking-tighter tabular-nums">
                    {phase === 'concluído' ? results.download : Math.round(currentSpeed)}
                  </span>
                  <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">Mb / s</span>
                </div>
              )}
            </div>
          </div>

          <div className="w-full h-24 mt-4">
             {phase === 'latência' ? (
               <ResponsiveContainer width="100%" height="100%">
                 <LineChart data={latencyHistory}>
                   <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.03)" />
                   <Line type="monotone" dataKey="ping" stroke="#3b82f6" strokeWidth={1.5} dot={false} />
                   <Line type="monotone" dataKey="jitter" stroke="#818cf8" strokeWidth={1.5} dot={false} />
                 </LineChart>
               </ResponsiveContainer>
             ) : (
               <div className="flex items-center justify-center h-full gap-8">
                  <ResultItem label="PING" value={results.ping} unit="ms" active={phase === 'latência'} />
                  <ResultItem label="DOWNLOAD" value={results.download} unit="Mb/s" active={phase === 'download'} />
                  <ResultItem label="UPLOAD" value={results.upload} unit="Mb/s" active={phase === 'upload'} />
               </div>
             )}
          </div>
        </div>

        <div className="lg:col-span-4 space-y-5">
           <div className="glass-panel rounded-2xl p-6 bg-blue-600/5">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Saúde da Conexão</h3>
              <div className="flex justify-between items-end">
                 <div className="text-3xl font-black text-white">{phase === 'concluído' ? '98' : '--'}</div>
                 <div className="text-[10px] font-bold text-blue-400 uppercase">Ideal</div>
              </div>
              <div className="w-full h-1 bg-white/5 rounded-full mt-3 overflow-hidden">
                 <div className="h-full bg-blue-500 rounded-full" style={{ width: phase === 'concluído' ? '98%' : '0%' }} />
              </div>
           </div>
           <div className="glass-panel rounded-2xl p-6">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Protocolo ao Vivo</h3>
              <div className="space-y-2">
                 <Step label="Sincronização" active={phase !== 'ocioso'} done={phase !== 'latência' && phase !== 'ocioso'} />
                 <Step label="Latência" active={phase === 'latência'} done={phase !== 'latência' && phase !== 'ocioso'} />
                 <Step label="Download" active={phase === 'download'} done={phase === 'upload' || phase === 'concluído'} />
                 <Step label="Upload" active={phase === 'upload'} done={phase === 'concluído'} />
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

const ResultItem = ({ label, value, unit, active }: any) => (
  <div className={`text-center transition-all ${active ? 'scale-110' : 'opacity-40'}`}>
    <div className="text-[8px] font-bold text-slate-500 tracking-[0.2em] mb-1">{label}</div>
    <div className="text-lg font-black text-white">{value || '0'}<span className="text-[9px] font-bold ml-0.5 opacity-50">{unit}</span></div>
  </div>
);

const Step = ({ label, active, done }: any) => (
  <div className="flex items-center justify-between text-[11px] font-medium">
    <div className="flex items-center gap-2">
      <div className={`w-1.5 h-1.5 rounded-full ${done ? 'bg-emerald-500' : active ? 'bg-blue-500 animate-pulse' : 'bg-slate-700'}`} />
      <span className={active || done ? 'text-slate-300' : 'text-slate-600'}>{label}</span>
    </div>
    {done && <CheckCircle2 size={10} className="text-emerald-500" />}
  </div>
);

export default SpeedTest;
