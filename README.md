# AI Forge

Laboratorio interactivo para aprender cómo funcionan los sistemas modernos de IA.

> **Construí. Rompé. Entendé.**

## MVP

Tres niveles jugables en el navegador (sin backend ni APIs reales):

1. **LLM** — next-token prediction
2. **Embeddings** — similitud semántica en un espacio 2D pedagógico
3. **RAG** — recuperar contexto y responder con documentos

## Stack

- TypeScript + React + Vite
- Vitest para lógica de dominio
- Progreso en `localStorage`

## Scripts

```bash
npm install
npm run dev
npm test
npm run build
```

## Arquitectura

- `src/domain` — reglas, evaluación, simulaciones deterministas
- `src/data` — contenido de niveles
- `src/persistence` — progreso local
- `src/components` / `src/pages` — UI
- `src/i18n` — textos (ES, listo para más idiomas)
