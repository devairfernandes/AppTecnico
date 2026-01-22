
import React, { useState } from 'react';
import { Search, Globe, Info, Zap, Database, ShieldCheck } from 'lucide-react';

const DnsLookup: React.FC = () => {
  const [domain, setDomain] = useState('');
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<any>(null);

  const performLookup = async () => {
    if (!domain) return;
    setLoading(true);
    // Simulação de resposta de servidor DNS
    await new Promise(r => setTimeout(r, 1200));
    setData({
      A: ['142.250.191.78'],
      AAAA: ['2607:f8b0:4005:809::200e'],
      MX: ['10 aspmx.l.google.com', '20 alt1.aspmx.l.google.com'],
      TXT: ['v=spf1 include:_spf.google.com ~all'],
      NS: ['ns1.google.com', 'ns2.google.com'],
      TTL: '300s',
      Registrar: 'Google LLC',
      Location: 'Mountain View, CA, US'
    });
    setLoading(false);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <header>
        <h2 className="text-xl font-black text-white">DNS Resolver & WHOIS</h2>
        <p className="text-[11px] text-slate-500 font-medium uppercase tracking-widest">Auditoria de registros de zona e propagação global</p>
      </header>

      <div className="glass-panel rounded-2xl p-4 flex gap-3">
        <div className="relative flex-1">
          <Globe className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-600" size={14} />
          <input 
            type="text" 
            placeholder="Digite o domínio (ex: google.com)"
            className="w-full bg-white/[0.03] border border-white/5 pl-10 pr-4 py-2.5 rounded-xl text-xs text-white focus:outline-none focus:ring-1 focus:ring-blue-500/50"
            value={domain}
            onChange={(e) => setDomain(e.target.value)}
          />
        </div>
        <button 
          onClick={performLookup}
          disabled={loading || !domain}
          className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-2.5 rounded-xl font-bold text-xs transition-all disabled:opacity-30"
        >
          {loading ? 'Consultando...' : 'Pesquisar'}
        </button>
      </div>

      {data && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          <div className="lg:col-span-2 space-y-4">
             <DnsRow label="A Records (IPv4)" values={data.A} icon={<Database size={12}/>} />
             <DnsRow label="MX Records (Mail)" values={data.MX} icon={<Database size={12}/>} />
             <DnsRow label="TXT Records" values={data.TXT} icon={<Info size={12}/>} />
             <DnsRow label="Name Servers" values={data.NS} icon={<Globe size={12}/>} />
          </div>
          
          <div className="space-y-4">
             <div className="glass-panel rounded-2xl p-5 bg-blue-600/5">
                <div className="flex items-center gap-2 text-blue-400 mb-4">
                   <ShieldCheck size={16} />
                   <h4 className="text-[10px] font-black uppercase tracking-widest">Informações de Registro</h4>
                </div>
                <div className="space-y-3">
                   <InfoMeta label="Registrar" value={data.Registrar} />
                   <InfoMeta label="Localização" value={data.Location} />
                   <InfoMeta label="Default TTL" value={data.TTL} />
                </div>
             </div>
             
             <div className="glass-panel rounded-2xl p-5 border-emerald-500/10">
                <div className="flex items-center gap-2 text-emerald-500 mb-2">
                   <Zap size={14} />
                   <h4 className="text-[10px] font-black uppercase tracking-widest">Resumo do Arquiteto IA</h4>
                </div>
                <p className="text-[10px] text-slate-400 leading-relaxed italic">
                  "Os registros MX estão configurados corretamente com redundância de prioridade. Recomendamos ativar o DNSSEC para aumentar a integridade da zona contra ataques de spoofing."
                </p>
             </div>
          </div>
        </div>
      )}
    </div>
  );
};

const DnsRow = ({ label, values, icon }: any) => (
  <div className="glass-panel rounded-2xl p-5">
    <div className="flex items-center gap-2 text-slate-500 mb-3">
       {icon}
       <span className="text-[9px] font-bold uppercase tracking-widest">{label}</span>
    </div>
    <div className="space-y-2">
      {values.map((v: string, i: number) => (
        <div key={i} className="bg-white/[0.02] border border-white/5 p-2.5 rounded-xl font-mono text-[11px] text-blue-300 break-all">
          {v}
        </div>
      ))}
    </div>
  </div>
);

const InfoMeta = ({ label, value }: any) => (
  <div className="flex flex-col gap-0.5">
    <span className="text-[8px] font-bold text-slate-600 uppercase">{label}</span>
    <span className="text-xs font-bold text-white">{value}</span>
  </div>
);

export default DnsLookup;
