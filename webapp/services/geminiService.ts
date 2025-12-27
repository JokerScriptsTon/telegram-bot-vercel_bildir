
import { GoogleGenAI, Type } from "@google/genai";

export async function generateTeamAlert(teamName: string) {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Lütfen ${teamName} futbol takımı için yaratıcı ve heyecan verici kısa bir bildirim mesajı oluştur. 
      Mesaj bir gol haberi, transfer dedikodusu veya önemli bir kulüp haberi olabilir. 
      Mesaj Türkçe olmalı ve bir emoji içermeli. Maksimum 100 karakter.`,
      config: {
        temperature: 0.8,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            message: { type: Type.STRING },
            type: { 
              type: Type.STRING, 
              enum: ['goal', 'transfer', 'news']
            }
          },
          required: ["message", "type"]
        }
      }
    });
    return JSON.parse(response.text);
  } catch (error) {
    console.error("Gemini Alert Error:", error);
    return { message: `${teamName} bugün antrenmanda hazırlıklarına devam ediyor! ⚽`, type: 'news' };
  }
}

export async function generateTeamAnalysis(teamName: string) {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `${teamName} futbol takımı hakkında ilginç bir bilgi, güncel form analizi veya tarihi bir başarıyı anlatan kısa, etkileyici bir paragraf yaz. Dil Türkçe olsun. Samimi ve heyecanlı bir ton kullan.`,
      config: {
        temperature: 0.7,
      }
    });
    return response.text;
  } catch (error) {
    console.error("Gemini Analysis Error:", error);
    return `${teamName}, köklü tarihi ve tutkulu taraftarıyla futbol dünyasının en önemli markalarından biridir. Takım, sahadaki mücadelesiyle her zaman heyecan vermeye devam ediyor.`;
  }
}

export async function generateLeagueAnalysis(leagueName: string) {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `${leagueName} ligi hakkında güncel durum özeti, şampiyonluk yarışı ve ligin karakteristiği üzerine kısa (3 cümle) bir analiz yaz. Dil Türkçe olsun.`,
      config: {
        temperature: 0.7,
      }
    });
    return response.text;
  } catch (error) {
    console.error("Gemini League Analysis Error:", error);
    return `${leagueName} heyecanı tüm hızıyla devam ediyor! Takımlar şampiyonluk ve Avrupa sıralaması için kıyasıya bir rekabet içinde.`;
  }
}
