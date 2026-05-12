import express from 'express';
import cors from 'cors';
import { GoogleGenAI } from '@google/genai';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import rateLimit from 'express-rate-limit';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.set('trust proxy', 1);

app.use(cors());
app.use(express.json({ limit: '10mb' }));

const apiKey = process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY;
if (!apiKey) {
  console.error('ERROR: GEMINI_API_KEY no configurada en el servidor.');
}

const ai = new GoogleGenAI({ apiKey });

const responseSchema = {
  type: "object",
  properties: {
    isCannabis: {
      type: "boolean",
      description: "True solo si la imagen contiene clara e inequívocamente cannabis o un derivado (flor, rosin, hachís, extracto)."
    },
    type: {
      type: "string",
      description: "Tipo de producto (Ej: Flor, Dry Sift, Ice-o-Lator, Rosin, BHO)."
    },
    predominance: {
      type: "string",
      description: "Predominancia basada en el aspecto (Ej: Indica, Sativa, Híbrida)."
    },
    strain: {
      type: "string",
      description: "Identificación de la variedad específica basada en rasgos visuales (colores, pistilos, estructura). Ej: Amnesia Haze, Purple Punch, OG Kush. Si no estás seguro, pon 'Variedad Desconocida'."
    },
    thc: {
      type: "integer",
      description: "Estimación visual del % de THC basándote en la densidad de tricomas (0-35)."
    },
    cbd: {
      type: "integer",
      description: "Estimación visual del % de CBD (0-15)."
    },
    terpenes: {
      type: "integer",
      description: "Estimación visual del % de terpenos (1-10)."
    },
    quality: {
      type: "integer",
      description: "Calidad visual general del 1 al 5 estrellas."
    },
    traits: {
      type: "object",
      properties: {
        trichomes: { type: "string", description: "Descripción detallada de la densidad de tricomas. Ej: Alta · 39.2% cobertura" },
        texture: { type: "string", description: "Descripción de textura y densidad física. Ej: Cristalina · rugosidad 54/100" },
        curing: { type: "string", description: "Estado aparente de curación/humedad. Ej: Fresca · brillo 56%" }
      },
      required: ["trichomes", "texture", "curing"]
    },
    interpretation: {
      type: "string",
      description: "Un párrafo profesional, muy específico y técnico interpretando la muestra. NO te limites a decir 'Es una flor híbrida'. Describe los matices de color, estructura del cogollo o extracción, signos de oxidación en tricomas y lo que eso indica sobre los efectos o el estado de curación."
    }
  },
  required: ["isCannabis", "type", "predominance", "strain", "thc", "cbd", "terpenes", "quality", "traits", "interpretation"]
};

const analyzeLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { error: 'Too many requests, please try again after 15 minutes.' },
  standardHeaders: true,
  legacyHeaders: false,
});

app.post('/api/analyze', analyzeLimiter, async (req, res) => {
  try {
    const { image, prompt } = req.body;
    if (!image) return res.status(400).json({ error: 'No image provided' });
    if (!apiKey) return res.status(500).json({ error: 'API Key not configured on server' });

    const base64Data = image.split(',')[1];
    const mimeType = image.match(/data:([a-zA-Z0-9]+\/[a-zA-Z0-9-.+]+).*,.*/)?.[1] || 'image/jpeg';

    const response = await ai.models.generateContent({
      model: 'gemini-3.1-flash-lite',
      contents: {
        role: 'user',
        parts: [
          { text: prompt },
          { inlineData: { data: base64Data, mimeType } }
        ]
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: responseSchema
      }
    });

    const text = response.text;
    if (!text) {
      return res.status(500).json({ error: 'Respuesta vacía del modelo de IA' });
    }

    let parsed;
    try {
      parsed = JSON.parse(text);
    } catch {
      return res.status(500).json({
        error: 'Respuesta inválida del modelo de IA',
        raw: text.slice(0, 500)
      });
    }

    res.json(parsed);
  } catch (error) {
    console.error('Error en el análisis:', error);
    const message = error instanceof Error ? error.message : 'Internal Server Error';
    res.status(500).json({ error: message });
  }
});

app.get('/api/health', (_req, res) => {
  res.json({
    status: 'ok',
    apiKeyConfigured: !!apiKey,
    timestamp: new Date().toISOString()
  });
});

app.use(express.static(path.join(__dirname, 'dist')));

app.get('*', (_req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

const PORT = process.env.PORT || 80;
app.listen(PORT, () => {
  console.log(`TrichAi Server running on port ${PORT}`);
});
