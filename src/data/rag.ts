import type { ChunkSize, RagChunk, RagDocument } from '@/domain/levels/rag/types'

export const RAG_COMPANY = 'ACME Airlines'

export const RAG_QUESTION =
  'Hola, cancelé mi vuelo. ¿Me reembolsan el pasaje?'

export const RAG_DOCUMENTS: RagDocument[] = [
  {
    id: 'doc-about',
    title: 'Sobre ACME Airlines',
    body: 'ACME Airlines opera rutas regionales desde 1998. Atención al cliente 24/7 por chat y teléfono. Este bot responde con la base de conocimiento interna.',
  },
  {
    id: 'doc-cancel',
    title: 'Cancelaciones de vuelo',
    body: 'Podés cancelar online hasta 24 h antes del despegue. La cancelación no implica reembolso automático: depende de la tarifa y de la política de reembolsos vigente.',
  },
  {
    id: 'doc-refund',
    title: 'Política de reembolsos',
    body: 'ACME Airlines ofrece un reembolso completo dentro de los 30 días de la compra si el producto no fue muy usado. Los pedidos de reembolso deben enviarse a billing@acme-air.example con el ID del pedido. No hay reembolsos parciales después del día 30.',
  },
  {
    id: 'doc-baggage',
    title: 'Equipaje',
    body: 'Equipaje de mano: 8 kg. Bodega: 23 kg en tarifas estándar. Excesos se cobran en mostrador. Objetos prohibidos: baterías sueltas y líquidos >100 ml en cabina.',
  },
  {
    id: 'doc-promo-2019',
    title: 'Promo verano 2019 (archivada)',
    body: 'PROMO HISTÓRICA 2019 — ya no vigente: reembolso instantáneo sin preguntas en tarifas Flash. No usar para respuestas actuales. Solo archivo de marketing.',
  },
  {
    id: 'doc-support',
    title: 'FAQ de soporte',
    body: 'Para problemas técnicos del check-in abrí un ticket en la ACME Console. Respuesta típica < 24 h hábiles. Resets de contraseña desde el login.',
  },
]

/**
 * Catálogos de chunks por tamaño.
 * Similitudes fijas → retrieval determinista.
 * Promo 2019 = distractor léxico fuerte (dice “reembolso”).
 */
export const RAG_CHUNKS_BY_SIZE: Record<ChunkSize, RagChunk[]> = {
  50: [
    {
      id: 'c50-1',
      sourceDocId: 'doc-about',
      text: 'ACME Airlines opera rutas regionales desde 1998.',
      similarity: 0.22,
      relevant: false,
    },
    {
      id: 'c50-2',
      sourceDocId: 'doc-cancel',
      text: 'Podés cancelar online hasta 24 h antes del despegue.',
      similarity: 0.41,
      relevant: false,
    },
    {
      id: 'c50-3',
      sourceDocId: 'doc-refund',
      text: 'ACME Airlines ofrece un reembolso completo dentro de los 30 días de la compra',
      similarity: 0.88,
      relevant: true,
    },
    {
      id: 'c50-4',
      sourceDocId: 'doc-refund',
      text: 'si el producto no fue muy usado.',
      similarity: 0.48,
      relevant: true,
    },
    {
      id: 'c50-5',
      sourceDocId: 'doc-refund',
      text: 'Los pedidos de reembolso deben enviarse a billing@acme-air.example',
      similarity: 0.72,
      relevant: true,
    },
    {
      id: 'c50-6',
      sourceDocId: 'doc-promo-2019',
      text: 'PROMO 2019: reembolso instantáneo sin preguntas en tarifas Flash.',
      similarity: 0.93,
      relevant: false,
    },
    {
      id: 'c50-7',
      sourceDocId: 'doc-baggage',
      text: 'Equipaje de mano: 8 kg. Bodega: 23 kg en tarifas estándar.',
      similarity: 0.19,
      relevant: false,
    },
    {
      id: 'c50-8',
      sourceDocId: 'doc-support',
      text: 'Para problemas técnicos del check-in abrí un ticket en la ACME Console.',
      similarity: 0.27,
      relevant: false,
    },
  ],
  100: [
    {
      id: 'c100-1',
      sourceDocId: 'doc-about',
      text: 'ACME Airlines opera rutas regionales desde 1998. Atención al cliente 24/7 por chat y teléfono.',
      similarity: 0.24,
      relevant: false,
    },
    {
      id: 'c100-2',
      sourceDocId: 'doc-cancel',
      text: 'Podés cancelar online hasta 24 h antes del despegue. La cancelación no implica reembolso automático.',
      similarity: 0.46,
      relevant: false,
    },
    {
      id: 'c100-3',
      sourceDocId: 'doc-refund',
      text: 'ACME Airlines ofrece un reembolso completo dentro de los 30 días de la compra si el producto no fue muy usado. Los pedidos de reembolso deben enviarse a billing@acme-air.example con el ID del pedido.',
      similarity: 0.94,
      relevant: true,
    },
    {
      id: 'c100-4',
      sourceDocId: 'doc-refund',
      text: 'No hay reembolsos parciales después del día 30.',
      similarity: 0.61,
      relevant: true,
    },
    {
      id: 'c100-5',
      sourceDocId: 'doc-promo-2019',
      text: 'PROMO HISTÓRICA 2019 — ya no vigente: reembolso instantáneo sin preguntas en tarifas Flash. No usar para respuestas actuales.',
      similarity: 0.82,
      relevant: false,
    },
    {
      id: 'c100-6',
      sourceDocId: 'doc-baggage',
      text: 'Equipaje de mano: 8 kg. Bodega: 23 kg en tarifas estándar. Excesos se cobran en mostrador.',
      similarity: 0.2,
      relevant: false,
    },
  ],
  200: [
    {
      id: 'c200-1',
      sourceDocId: 'doc-about',
      text: 'ACME Airlines opera rutas regionales desde 1998. Atención al cliente 24/7 por chat y teléfono. Este bot responde con la base de conocimiento interna.',
      similarity: 0.26,
      relevant: false,
    },
    {
      id: 'c200-2',
      sourceDocId: 'doc-cancel',
      text: 'Podés cancelar online hasta 24 h antes del despegue. La cancelación no implica reembolso automático: depende de la tarifa y de la política de reembolsos vigente.',
      similarity: 0.48,
      relevant: false,
    },
    {
      id: 'c200-3',
      sourceDocId: 'doc-refund',
      text: 'ACME Airlines ofrece un reembolso completo dentro de los 30 días de la compra si el producto no fue muy usado. Los pedidos de reembolso deben enviarse a billing@acme-air.example con el ID del pedido. No hay reembolsos parciales después del día 30.',
      similarity: 0.96,
      relevant: true,
    },
    {
      id: 'c200-4',
      sourceDocId: 'doc-promo-2019',
      text: 'PROMO HISTÓRICA 2019 — ya no vigente: reembolso instantáneo sin preguntas en tarifas Flash. No usar para respuestas actuales. Solo archivo de marketing.',
      similarity: 0.79,
      relevant: false,
    },
    {
      id: 'c200-5',
      sourceDocId: 'doc-baggage',
      text: 'Equipaje de mano: 8 kg. Bodega: 23 kg en tarifas estándar. Excesos se cobran en mostrador. Objetos prohibidos: baterías sueltas y líquidos >100 ml en cabina.',
      similarity: 0.21,
      relevant: false,
    },
  ],
  400: [
    {
      id: 'c400-1',
      sourceDocId: 'doc-about',
      text: 'ACME Airlines opera rutas regionales desde 1998. Atención al cliente 24/7. Chunk enorme con ruido corporativo que diluye el retrieval.',
      similarity: 0.41,
      relevant: false,
    },
    {
      id: 'c400-2',
      sourceDocId: 'doc-promo-2019',
      text: 'PROMO 2019 archivada: reembolso instantáneo sin preguntas. Mezclado con cancelaciones, equipaje y FAQ. El modelo inventa con cara de seguro si solo ve esto.',
      similarity: 0.66,
      relevant: false,
    },
    {
      id: 'c400-3',
      sourceDocId: 'doc-mixed',
      text: 'Soporte + pistas de reembolso enterradas: abrí tickets en ACME Console. En algún lado: reembolso completo dentro de los 30 días… bajo ruido de promo 2019 y equipaje.',
      similarity: 0.58,
      relevant: false,
    },
    {
      id: 'c400-4',
      sourceDocId: 'doc-baggage',
      text: 'Equipaje de mano 8 kg, bodega 23 kg, excesos en mostrador. Beneficios y culture deck de ACME mezclados al pedazo.',
      similarity: 0.24,
      relevant: false,
    },
  ],
}

export const RAG_CHUNK_SIZE_OPTIONS: ChunkSize[] = [50, 100, 200, 400]
export const RAG_TOP_K_OPTIONS = [1, 2, 3, 5] as const

/** Defaults rotos — el jugador debe arreglarlos */
export const RAG_INITIAL_CONFIG = {
  chunkSize: 400 as ChunkSize,
  topK: 1 as const,
  threshold: 0.7,
}

/** Nightmare: varios fallos a la vez */
export const RAG_NIGHTMARE_CONFIG = {
  chunkSize: 400 as ChunkSize,
  topK: 1 as const,
  threshold: 0.85,
}

export const RAG_NIGHTMARE_MS = 60_000
