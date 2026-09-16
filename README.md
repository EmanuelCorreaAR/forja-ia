# Forja IA

Laboratorio interactivo para aprender cómo funcionan los sistemas modernos de IA.

> **Construí. Rompé. Entendé.**

## Arco del MVP

**LLM → Embeddings → RAG → Tools**

> Generar → Representar → Recuperar → Actuar

1. **LLM** — predicí el próximo token a ciegas; las probabilidades se revelan después
2. **Embeddings** — elegí vecinos semánticos sin scores; mapa y similitud al comprobar
3. **RAG** — repará un pipeline mal configurado hasta recuperar el contexto correcto
4. **Tools** — construí la acción del modelo (o elegí NO TOOL); las tools tienen consecuencias reversibles

Todo corre en el navegador: simulaciones deterministas, sin APIs reales ni backend.

**Intentos** = hipótesis que no cerraron (fallar es parte del juego).

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

## Apoyar el proyecto

Si Forja IA te sirve, podés invitarme un cafecito: [cafecito.app/emacorreadev](https://cafecito.app/emacorreadev)
