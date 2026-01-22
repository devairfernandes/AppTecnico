
import { GoogleGenAI, Type } from "@google/genai";

// Instancia logo antes do uso para garantir a chave API mais recente
export const analyzeNetworkProblem = async (problemDescription: string, metrics?: any) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const prompt = `
    Como um engenheiro de rede de classe mundial, analise o seguinte problema de rede e forneça soluções técnicas acionáveis.
    Problema do Usuário: ${problemDescription}
    Dados de Contexto: ${JSON.stringify(metrics || {})}
    
    Responda obrigatoriamente em Português do Brasil.
    Formate a resposta como um conselho profissional claro com seções para "Correções Imediatas", "Otimização de Configuração" e "Recomendações de Hardware".
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        temperature: 0.7,
        topP: 0.95,
      }
    });
    return response.text || "Não foi possível gerar a análise.";
  } catch (error) {
    console.error("Erro na Análise Gemini:", error);
    return "Falha ao analisar o problema de rede. Por favor, verifique sua conexão e tente novamente.";
  }
};

export const getOptimizationAdvice = async (channels: any[]) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Analise estas métricas de canais WiFi e sugira o melhor canal para 2.4GHz e 5GHz para evitar interferência. Responda em Português do Brasil. Dados: ${JSON.stringify(channels)}`,
      config: {
          responseMimeType: "application/json",
          responseSchema: {
              type: Type.OBJECT,
              properties: {
                  recommended24: { type: Type.NUMBER },
                  recommended5: { type: Type.NUMBER },
                  reasoning: { type: Type.STRING }
              },
              required: ["recommended24", "recommended5", "reasoning"]
          }
      }
    });
    return JSON.parse(response.text || '{}');
  } catch (error) {
    console.error("Erro de Otimização Gemini:", error);
    return { recommended24: 1, recommended5: 36, reasoning: "Erro ao conectar com o consultor de IA." };
  }
};
