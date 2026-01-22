
import React, { useState, useRef, useEffect } from 'react';
import { Bot, Send, Sparkles, CheckCircle2, Command } from 'lucide-react';
import { analyzeNetworkProblem } from '../services/geminiService';
import { NetworkMetrics } from '../types';

interface AIArchitectProps {
  currentMetrics: NetworkMetrics;
}

const AIArchitect: React.FC<AIArchitectProps> = ({ currentMetrics }) => {
  const [userInput, setUserInput] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [response, setResponse] = useState<string | null>(null);
  const chatRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [response, isAnalyzing]);

  const handleAnalyze = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userInput.trim()) return;

    setIsAnalyzing(true);
    setResponse(null);
    const advice = await analyzeNetworkProblem(userInput, currentMetrics);
    setResponse(advice);
    setIsAnalyzing(false);
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto py-4">
      <header className="flex flex-col items-center text-center space-y-4 mb-12">
        <div className="relative">
          <div className="absolute inset-0 bg-blue-600 blur-3xl opacity-20 rounded-full" />
          <div className="relative w-20 h-20 glass-panel rounded-3xl flex items-center justify-center border-blue-500/30">
            <Bot size={40} className="text-blue-400 glow-blue" />
          </div>
        </div>
        <div>
          <h2 className="text-4xl font-black text-white tracking-tight">Arquiteto de Infraestrutura IA</h2>
          <p className="text-gray-400 mt-2 text-lg">Soluções preditivas baseadas na inteligência do Gemini</p>
        </div>
      </header>

      <div className="glass-panel rounded-[3rem] overflow-hidden border-t border-white/5 shadow-2xl flex flex-col h-[700px]">
        <div className="px-10 py-6 bg-white/[0.02] border-b border-white/5 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-bold uppercase tracking-widest text-gray-400">Sessão Segura Ativa</span>
          </div>
          <div className="flex items-center gap-2 text-[10px] font-bold text-gray-600 uppercase">
            <Command size={12} /> Shift + Enter para nova linha
          </div>
        </div>

        <div ref={chatRef} className="flex-1 overflow-y-auto p-10 space-y-8 scroll-smooth">
          {!response && !isAnalyzing ? (
            <div className="h-full flex flex-col items-center justify-center space-y-8 opacity-40">
               <div className="grid grid-cols-2 gap-4 w-full max-w-lg">
                 <SuggestionCard text="Wi-Fi lento e instável" onClick={setUserInput} />
                 <SuggestionCard text="Otimizar canais de 5GHz" onClick={setUserInput} />
                 <SuggestionCard text="Problemas de conexão IoT" onClick={setUserInput} />
                 <SuggestionCard text="Auditoria de segurança" onClick={setUserInput} />
               </div>
               <p className="text-sm font-medium">Selecione um diagnóstico rápido ou digite sua dúvida abaixo.</p>
            </div>
          ) : (
            <div className="space-y-10 animate-in slide-in-from-bottom-4 duration-500">
              <div className="flex gap-6 max-w-3xl">
                <div className="w-10 h-10 rounded-2xl bg-blue-600 flex items-center justify-center flex-shrink-0 shadow-lg shadow-blue-500/20">
                  <Bot size={20} className="text-white" />
                </div>
                <div className="space-y-6">
                  {isAnalyzing ? (
                    <div className="flex items-center gap-3 py-2">
                       <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce [animation-delay:-0.3s]" />
                       <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce [animation-delay:-0.15s]" />
                       <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" />
                    </div>
                  ) : (
                    <>
                      <div className="prose prose-invert max-w-none">
                        <div className="text-lg text-gray-200 leading-relaxed whitespace-pre-wrap font-medium">
                          {response}
                        </div>
                      </div>
                      <div className="flex items-center gap-4 pt-6 border-t border-white/5">
                        <div className="flex items-center gap-2 px-4 py-2 bg-emerald-500/10 rounded-xl border border-emerald-500/20">
                           <CheckCircle2 size={16} className="text-emerald-400" />
                           <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">Solução Verificada</span>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="p-10 bg-black/20">
          <form onSubmit={handleAnalyze} className="relative max-w-4xl mx-auto">
            <div className="absolute inset-0 bg-blue-500/5 blur-xl rounded-2xl" />
            <div className="relative flex items-center gap-4 bg-gray-900/50 border border-white/10 p-2 rounded-3xl focus-within:border-blue-500/50 focus-within:ring-4 focus-within:ring-blue-500/10 transition-all">
              <input 
                type="text" 
                placeholder="Pergunte qualquer coisa ao seu arquiteto de rede..."
                className="flex-1 bg-transparent py-4 px-6 focus:outline-none text-white font-medium placeholder-gray-600"
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                disabled={isAnalyzing}
              />
              <button 
                type="submit"
                disabled={isAnalyzing || !userInput.trim()}
                className="p-4 bg-blue-600 rounded-2xl text-white hover:bg-blue-500 active:scale-95 transition-all shadow-lg shadow-blue-500/20 disabled:opacity-30"
              >
                <Send size={24} />
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

const SuggestionCard = ({ text, onClick }: any) => (
  <button 
    onClick={() => onClick(text)}
    className="glass-panel p-6 rounded-3xl border-white/5 hover:border-blue-500/40 hover:bg-white/[0.05] transition-all text-left group"
  >
    <div className="w-10 h-10 bg-blue-500/10 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
      <Sparkles size={18} className="text-blue-400" />
    </div>
    <p className="text-sm font-bold text-gray-300 group-hover:text-white transition-colors">{text}</p>
  </button>
);

export default AIArchitect;
