# Changelog

## 0.3.0

- Nivel 4 **Tools**: modo ACT (5 misiones) + NIGHTMARE opcional
- ACT: construir tool call o NO TOOL; RETRY restaura el mundo de la misión
- Misión memorable: unnecessary tool call (“¿Qué es RAG?”)
- NIGHTMARE: reparar call con TOOL MISMATCH + INVALID ARGUMENT TYPE
- Score: Tool selection, Argument accuracy, Unnecessary calls, Precision, Attempts, Time
- Unlock tras completar RAG
- Tooltips de glosario en los términos técnicos de toda la app
- Fuera la tarjeta de compartir y los códigos de desafío: sin backend, las métricas quedan en el nivel

## 0.2.0

- Rediseño jugable de los 3 niveles: decisión difícil, revelar, revancha y score compartible
- N1: temperatura explicada, CHAOS con 4 contextos distintos (sin loop ni farm de clicks)
- N2: intruso léxico + headings más compactos
- N3: ACME + NIGHTMARE con misión clara (contrarreloj)
- Brand: **Forja IA** (nombre en español); home sin header duplicado; marca transparente en `/level`
- README: apoyo vía [Cafecito](https://cafecito.app/emacorreadev) (solo en GitHub)

## 0.1.0

- MVP inicial: Nivel 1 LLM, Nivel 2 Embeddings, Nivel 3 RAG
- Mecánica a ciegas → revelar (N1/N2); configurar → ejecutar (N3)
- Intentos unificados = hipótesis que no cerraron
- N2: mapa vectorial oculto hasta comprobar
- Progreso local, simulaciones deterministas, tests de dominio
- UI/contenido en español (términos técnicos sin traducir)
