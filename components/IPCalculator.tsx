
import React, { useState, useEffect } from 'react';
import { Calculator, Binary, Hash, Globe, Info, X } from 'lucide-react';

const IPCalculator: React.FC = () => {
  const [ip, setIp] = useState('192.168.1.1');
  const [cidr, setCidr] = useState('24');
  const [results, setResults] = useState<any>(null);

  const calculate = () => {
    try {
      const parts = ip.split('.').map(Number);
      if (parts.length !== 4 || parts.some(p => p < 0 || p > 255)) throw new Error('IP Inválido');
      
      const maskCidr = parseInt(cidr);
      if (isNaN(maskCidr) || maskCidr < 0 || maskCidr > 32) throw new Error('CIDR Inválido');

      const ipInt = (parts[0] << 24) | (parts[1] << 16) | (parts[2] << 8) | parts[3];
      const maskInt = maskCidr === 0 ? 0 : (~0 << (32 - maskCidr)) >>> 0;
      
      const networkInt = (ipInt & maskInt) >>> 0;
      const broadcastInt = (networkInt | ~maskInt) >>> 0;
      const firstHostInt = networkInt + 1;
      const lastHostInt = broadcastInt - 1;
      const totalHosts = maskCidr >= 31 ? 0 : Math.pow(2, 32 - maskCidr) - 2;

      const toDotted = (num: number) => [
        (num >>> 24) & 255,
        (num >>> 16) & 255,
        (num >>> 8) & 255,
        num & 255
      ].join('.');

      const toBinary = (num: number) => {
        const bin = (num >>> 0).toString(2).padStart(32, '0');
        return bin.match(/.{8}/g)?.join('.') || bin;
      };

      setResults({
        network: toDotted(networkInt),
        broadcast: toDotted(broadcastInt),
        mask: toDotted(maskInt),
        wildcard: toDotted(~maskInt >>> 0),
        firstHost: maskCidr >= 31 ? 'N/A' : toDotted(firstHostInt),
        lastHost: maskCidr >= 31 ? 'N/A' : toDotted(lastHostInt),
        hosts: totalHosts < 0 ? 0 : totalHosts,
        binaryIp: toBinary(ipInt),
        binaryMask: toBinary(maskInt),
        class: parts[0] < 128 ? 'A' : parts[0] < 192 ? 'B' : parts[0] < 224 ? 'C' : 'D/E'
      });
    } catch (e) {
      setResults(null);
    }
  };

  useEffect(() => {
    calculate();
  }, [ip, cidr]);

  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-500 max-w-4xl mx-auto">
      <header className="flex flex-col gap-1">
        <h2 className="text-xl font-black text-white">Inteligência de Sub-rede</h2>
        <p className="text-[11px] text-slate-500 font-medium">Utilitário profissional de endereçamento IPv4</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="glass-panel rounded-2xl p-6 md:col-span-1 space-y-4">
          <div className="flex items-center gap-2 mb-2 text-blue-500">
            <Calculator size={16} />
            <span className="text-[10px] font-black uppercase tracking-widest">Parâmetros</span>
          </div>
          
          <div className="space-y-3">
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest px-1">Endereço IP</label>
              <input 
                type="text" 
                value={ip} 
                onChange={(e) => setIp(e.target.value)}
                className="w-full bg-white/[0.03] border border-white/5 rounded-xl px-4 py-2.5 text-sm font-bold text-white focus:outline-none focus:ring-1 focus:ring-blue-500/50"
                placeholder="192.168.1.1"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest px-1">Prefixo CIDR</label>
              <div className="flex items-center gap-2">
                <span className="text-slate-500 font-bold">/</span>
                <input 
                  type="number" 
                  value={cidr} 
                  onChange={(e) => setCidr(e.target.value)}
                  className="w-full bg-white/[0.03] border border-white/5 rounded-xl px-4 py-2.5 text-sm font-bold text-white focus:outline-none focus:ring-1 focus:ring-blue-500/50"
                  min="0" max="32"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="md:col-span-2 flex flex-col gap-5">
          {results ? (
            <>
              <div className="grid grid-cols-2 gap-4">
                <ResultCard label="Endereço de Rede" value={results.network} icon={<Globe size={12}/>} />
                <ResultCard label="Endereço de Broadcast" value={results.broadcast} icon={<Hash size={12}/>} />
                <ResultCard label="Máscara de Sub-rede" value={results.mask} />
                <ResultCard label="Hosts Disponíveis" value={results.hosts.toLocaleString()} color="text-emerald-500" />
              </div>

              <div className="glass-panel rounded-2xl p-6 space-y-4">
                <div className="flex items-center justify-between">
                   <div className="flex items-center gap-2 text-indigo-400">
                      <Info size={14} />
                      <span className="text-[10px] font-black uppercase tracking-widest">Faixa e Metadados</span>
                   </div>
                   <span className="text-[10px] font-bold px-2 py-0.5 bg-indigo-500/10 text-indigo-400 rounded-full border border-indigo-500/20">Classe {results.class}</span>
                </div>
                
                <div className="grid grid-cols-2 gap-y-4 text-xs">
                   <div className="flex flex-col gap-1">
                      <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">Primeiro Host</span>
                      <span className="text-sm font-black text-white">{results.firstHost}</span>
                   </div>
                   <div className="flex flex-col gap-1">
                      <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">Último Host</span>
                      <span className="text-sm font-black text-white">{results.lastHost}</span>
                   </div>
                   <div className="flex flex-col gap-1">
                      <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">Máscara Wildcard</span>
                      <span className="text-sm font-black text-white">{results.wildcard}</span>
                   </div>
                </div>
              </div>

              <div className="glass-panel rounded-2xl p-6 bg-black/20">
                <div className="flex items-center gap-2 mb-4 text-slate-500">
                  <Binary size={14} />
                  <span className="text-[10px] font-black uppercase tracking-widest">Representação Binária</span>
                </div>
                <div className="space-y-3 font-mono">
                   <div className="flex flex-col gap-1">
                      <span className="text-[8px] font-bold text-slate-600 uppercase">IP Binário</span>
                      <span className="text-[11px] text-blue-400/80 break-all leading-tight">{results.binaryIp}</span>
                   </div>
                   <div className="flex flex-col gap-1">
                      <span className="text-[8px] font-bold text-slate-600 uppercase">Máscara Binária</span>
                      <span className="text-[11px] text-slate-400 break-all leading-tight">{results.binaryMask}</span>
                   </div>
                </div>
              </div>
            </>
          ) : (
            <div className="glass-panel rounded-2xl p-12 flex flex-col items-center justify-center text-center">
              <div className="w-12 h-12 rounded-full bg-red-500/10 flex items-center justify-center text-red-500 mb-4 border border-red-500/20">
                 <X size={20} />
              </div>
              <h3 className="font-bold text-white text-sm mb-1">Erro de Cálculo</h3>
              <p className="text-xs text-slate-500">Por favor, insira um endereço IPv4 e prefixo válidos.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const ResultCard = ({ label, value, icon, color = "text-white" }: any) => (
  <div className="glass-panel rounded-xl p-4 flex flex-col gap-1">
    <div className="flex items-center gap-1.5 opacity-40">
       {icon}
       <span className="text-[8px] font-bold text-slate-400 uppercase tracking-[0.2em]">{label}</span>
    </div>
    <span className={`text-base font-black truncate ${color}`}>{value}</span>
  </div>
);

export default IPCalculator;
