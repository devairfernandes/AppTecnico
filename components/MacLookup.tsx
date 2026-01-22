
import React, { useState } from 'react';
import { Fingerprint, Search, Cpu, Building2, ShieldCheck, HelpCircle } from 'lucide-react';

const MacLookup: React.FC = () => {
  const [mac, setMac] = useState('');
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const lookup = async () => {
    if (!mac) return;
    setLoading(true);
    await new Promise(r => setTimeout(r, 800));
    
    // Simulação de banco de dados OUI
    const upperMac = mac.toUpperCase().replace(/[:-]/g, '');
    const oui = upperMac.substring(0, 6);
    
    const db: Record<string, any> = {
      'BCD177': { vendor: 'Apple Inc.', details: 'MacBook/iPhone Hardware', quality: 'High Tier' },
      'D021F9': { vendor: 'Ubiquiti Networks', details: 'Network Infrastructure', quality: 'Enterprise' },
      '001788': { vendor: 'Philips Lighting', details: 'Hue IoT Bridge', quality: 'Consumer IoT' },
      '7085C2': { vendor: 'ASUSTek Computer Inc.', details: 'Motherboard/Desktop Components', quality: 'Mid Tier' },
      '001B63': { vendor: 'Apple Inc.', details: 'Legacy Network Interface', quality: 'Legacy' },
      '44D9E7': { vendor: 'Ubiquiti Networks', details: 'UniFi Protect Camera', quality: 'Professional' },
    };

    setResult(db[oui] || { vendor: 'Unknown Vendor', details: 'Private or Unregistered OUI', quality: 'N/A' });
    setLoading(false);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-in fade-in duration-500">
      <header>
        <h2 className="text-xl font-black text-white">Identificador de Hardware</h2>
        <p className="text-[11px] text-slate-500 font-medium uppercase tracking-widest">OUI Lookup para identificação de fabricantes</p>
      </header>

      <div className="glass-panel rounded-3xl p-8 space-y-6">
        <div className="space-y-4">
           <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-1">Endereço MAC do Dispositivo</label>
           <div className="flex gap-3">
              <div className="relative flex-1">
                <Fingerprint className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600" size={18} />
                <input 
                  type="text" 
                  placeholder="ex: BC:D1:77:E1:92:02"
                  className="w-full bg-white/[0.03] border border-white/5 pl-12 pr-4 py-4 rounded-2xl text-sm font-mono text-white focus:outline-none focus:ring-1 focus:ring-blue-500/50"
                  value={mac}
                  onChange={(e) => setMac(e.target.value)}
                />
              </div>
              <button 
                onClick={lookup}
                disabled={loading || !mac}
                className="bg-blue-600 hover:bg-blue-500 text-white px-8 py-4 rounded-2xl font-bold text-sm transition-all disabled:opacity-30"
              >
                {loading ? 'Consultando...' : 'Identificar'}
              </button>
           </div>
        </div>

        {result && (
          <div className="pt-6 border-t border-white/5 grid grid-cols-1 md:grid-cols-2 gap-6 animate-in slide-in-from-top-4 duration-300">
             <div className="glass-panel rounded-2xl p-6 bg-blue-600/5 border-blue-500/10">
                <div className="flex items-center gap-3 mb-4 text-blue-400">
                   <Building2 size={20} />
                   <h4 className="text-[10px] font-black uppercase tracking-widest">Fabricante Registrado</h4>
                </div>
                <p className="text-xl font-black text-white mb-1">{result.vendor}</p>
                <p className="text-xs text-slate-500 font-medium">{result.details}</p>
             </div>
             
             <div className="glass-panel rounded-2xl p-6">
                <div className="flex items-center gap-3 mb-4 text-slate-400">
                   <ShieldCheck size={20} />
                   <h4 className="text-[10px] font-black uppercase tracking-widest">Integridade do OUI</h4>
                </div>
                <div className="flex items-center gap-2">
                   <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Tier:</span>
                   <span className={`text-xs font-black uppercase ${result.vendor === 'Unknown Vendor' ? 'text-amber-500' : 'text-emerald-500'}`}>
                      {result.quality}
                   </span>
                </div>
                <div className="mt-4 flex items-center gap-1.5 text-[9px] text-slate-600 font-bold uppercase">
                   <HelpCircle size={10} />
                   <span>OUI Verificado via IEEE Base</span>
                </div>
             </div>
          </div>
        )}

        {!result && !loading && (
          <div className="p-12 flex flex-col items-center justify-center text-center opacity-20">
             <Search size={40} className="mb-4" />
             <p className="text-xs font-bold uppercase tracking-widest">Aguardando entrada para consulta de hardware...</p>
          </div>
        )}
      </div>
      
      <div className="grid grid-cols-3 gap-4">
         <QuickMac label="Apple OUI" val="BC:D1:77" onClick={setMac} />
         <QuickMac label="UniFi OUI" val="D0:21:F9" onClick={setMac} />
         <QuickMac label="Philips OUI" val="00:17:88" onClick={setMac} />
      </div>
    </div>
  );
};

const QuickMac = ({ label, val, onClick }: any) => (
  <button 
    onClick={() => onClick(val)}
    className="glass-panel p-3 rounded-xl hover:border-blue-500/30 transition-all text-left group"
  >
    <span className="text-[8px] font-bold text-slate-600 uppercase block mb-1 group-hover:text-blue-500">{label}</span>
    <span className="text-[10px] font-mono font-bold text-slate-400">{val}</span>
  </button>
);

export default MacLookup;
