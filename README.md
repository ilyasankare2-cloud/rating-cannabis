# TrichAi 🌱

Analizador inteligente de derivados del cannabis impulsado por **Gemini Vision AI**. Sube una imagen y obtén análisis visual detallado: tipo de producto, cannabinoides estimados, perfil de terpenos y evaluación de calidad.

**Status:** ✅ Production Ready | **Modelo:** Gemini 2.5 Flash | **Stack:** React 19 + Express + TypeScript

---

## 🚀 Características

✅ **Análisis Visual AI** - Detecta cannabis, estima THC/CBD, identifica variedades
✅ **Soporte Cámara Móvil** - Captura directa con `capture="environment"`
✅ **Historial Persistente** - Almacena análisis previos con imágenes originales
✅ **Interfaz Bilingüe** - Español e Inglés
✅ **Compartir en Redes** - Genera posters 1080x1080 para redes sociales
✅ **Seguridad Reforzada** - CORS restringido, rate limiting, validación JSON
✅ **Timeout Inteligente** - AbortController con 60s para evitar cuelgues
✅ **Docker Optimizado** - Multi-stage, eficiente en tamaño
✅ **SEO Friendly** - Meta tags OG/Twitter, robots.txt

---

## 📋 Guía de Instalación

### Requisitos
- Node.js 20+
- API Key de Google Gemini (gratis)

### 1️⃣ Clonar Repositorio
```bash
git clone https://github.com/ilyasankare2-cloud/rating-cannabis.git
cd rating-cannabis
```

### 2️⃣ Instalar Dependencias
```bash
npm install
```

### 3️⃣ Configurar API Key

Copia `.env.example` a `.env` y añade tu clave:
```bash
cp .env.example .env
```

Edita `.env`:
```env
GEMINI_API_KEY=tu_clave_real_aqui
PORT=80
ALLOWED_ORIGINS=http://localhost:5173,http://localhost:4173
NODE_ENV=development
```

**Obtén tu API Key gratis aquí:** https://aistudio.google.com/app/apikey

### 4️⃣ Ejecutar Proyecto

**Desarrollo:**
```bash
npm run dev
```
Abre: http://localhost:5173

**Compilar para Producción:**
```bash
npm run build
```

**Ejecutar Servidor Producción:**
```bash
npm start
```

---

## 🐳 Docker

### Build & Run
```bash
docker-compose up --build
```

Accede en: http://localhost:5173

### Variables de Entorno
Define en `.env`:
```env
GEMINI_API_KEY=tu_clave
PORT=80
ALLOWED_ORIGINS=https://tudominio.com
NODE_ENV=production
```

---

## 📁 Estructura del Proyecto

```
rating-cannabis/
├── src/
│   ├── App.tsx              # Componente principal React
│   ├── main.tsx             # Punto de entrada
│   └── index.css            # Tailwind + temas
├── server.js                # Express backend + proxy Gemini
├── Dockerfile               # Multi-stage optimizado
├── docker-compose.yml       # Orquestación
├── vite.config.ts          # Config Vite
├── tsconfig.json           # TypeScript
├── package.json            # Dependencias
└── .env.example            # Template variables
```

---

## 🔧 Endpoints API

### `POST /api/analyze`
Analiza una imagen de cannabis.

**Request:**
```json
{
  "image": "data:image/jpeg;base64,...",
  "prompt": "Texto del prompt en español/inglés"
}
```

**Response:**
```json
{
  "isCannabis": true,
  "type": "Flor",
  "predominance": "Híbrida",
  "strain": "OG Kush",
  "thc": 22,
  "cbd": 2,
  "terpenes": 3,
  "quality": 4,
  "traits": {
    "trichomes": "Alta · 38% cobertura",
    "texture": "Densa · rugosidad 72/100",
    "curing": "Óptima · brillo 45%"
  },
  "interpretation": "..."
}
```

### `GET /api/health`
Verifica estado del servidor.

**Response:**
```json
{
  "status": "ok",
  "apiKeyConfigured": true,
  "timestamp": "2026-05-12T10:30:00Z"
}
```

---

## 🛡️ Seguridad

✅ **API Key protegida** - Nunca llega al navegador (proxy en servidor)
✅ **CORS restringido** - Solo orígenes configurados
✅ **Rate limiting** - 10 requests / 15 minutos por IP
✅ **Validación JSON** - Try-catch en respuestas Gemini
✅ **Timeout inteligente** - 60s AbortController
✅ **localStorage validado** - Manejo seguro de datos locales
✅ **TypeScript strict** - Sin tipos `any`

---

## 🔄 Cambios Recientes (Auditoría & Fixes)

### Bugs Críticos Arreglados
- ✅ Modelo Gemini inválido `gemini-3.1-flash-lite` → `gemini-2.5-flash`
- ✅ SDK v2 API mal usado → Estructura correcta `{ role, parts }`
- ✅ Timeout infinito en fetch → AbortController 60s
- ✅ Historial cargaba thumbnail → Ahora usa imagen original
- ✅ Botón cámara no funcionaba → Implementado `capture="environment"`
- ✅ TypeScript `any` type → Cambiado a `unknown`

### Mejoras de Seguridad
- ✅ CORS abierto → Restringido a `ALLOWED_ORIGINS`
- ✅ Sin validación JSON → Try-catch en Gemini response
- ✅ Rate limit 5 → Aumentado a 10 requests/15min
- ✅ localStorage sin validación → Ahora con try-catch

### Mejoras Generales
- ✅ Endpoint `/api/health` para monitoreo
- ✅ OG/Twitter meta tags para social sharing
- ✅ robots.txt para SEO
- ✅ Dockerfile optimizado (multi-stage, USER node)
- ✅ .env.example mejorado con documentación

---

## 🧪 Testing

```bash
# Lint
npm run lint

# Build
npm run build

# Dev server
npm run dev
```

---

## 📜 Licencia

MIT - Libre para uso personal y comercial

---

## 👤 Autor

Creado con ❤️ para análisis visual inteligente de cannabis.

---

## 📞 Soporte

- GitHub Issues: https://github.com/ilyasankare2-cloud/rating-cannabis/issues
- API Key: https://aistudio.google.com/app/apikey
- Gemini Docs: https://ai.google.dev/

---

## ⚠️ Disclaimer

**Este análisis es puramente informativo** y basado en inteligencia visual. No sustituye un análisis de laboratorio profesional. Las estimaciones pueden variar significativamente de los valores reales. Úsalo responsablemente.
