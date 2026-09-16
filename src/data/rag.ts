import type { ChunkSize, RagChunk, RagDocument } from '@/domain/levels/rag/types'

export const RAG_COMPANY = 'NovaForge Labs'

export const RAG_QUESTION = '¿Cuál es la política de reembolsos de la empresa?'

export const RAG_DOCUMENTS: RagDocument[] = [
  {
    id: 'doc-about',
    title: 'Sobre NovaForge Labs',
    body: 'NovaForge Labs construye herramientas experimentales de IA para developers. Fundada en 2021, el equipo se enfoca en sistemas de aprendizaje interactivo y motores de simulación para arquitecturas modernas de IA.',
  },
  {
    id: 'doc-shipping',
    title: 'Política de envíos',
    body: 'Los productos digitales se entregan al instante por email. El merch físico se envía en 5 días hábiles. Los envíos internacionales pueden demorar hasta 20 días según aduana.',
  },
  {
    id: 'doc-refund',
    title: 'Política de reembolsos',
    body: 'NovaForge Labs ofrece un reembolso completo dentro de los 30 días de la compra si el producto no fue muy usado. Los pedidos de reembolso deben enviarse a billing@novaforge.example con el ID del pedido. No hay reembolsos parciales después del día 30.',
  },
  {
    id: 'doc-support',
    title: 'FAQ de soporte',
    body: 'Para problemas técnicos abrí un ticket en la Forge Console. El tiempo de respuesta suele ser menor a 24 horas en días hábiles. Los resets de contraseña se manejan automáticamente desde la pantalla de login.',
  },
  {
    id: 'doc-careers',
    title: 'Empleos',
    body: 'Contratamos builders curiosos. Roles: simulation engineer, education designer y developer advocate. Remoto-friendly en la mayoría de los husos horarios.',
  },
]

/**
 * Catálogos de chunks por tamaño.
 * Las similitudes están calibradas a mano para que el retrieval sea determinista y enseñable.
 */
export const RAG_CHUNKS_BY_SIZE: Record<ChunkSize, RagChunk[]> = {
  50: [
    {
      id: 'c50-1',
      sourceDocId: 'doc-about',
      text: 'NovaForge Labs construye herramientas experimentales de IA para developers.',
      similarity: 0.22,
      relevant: false,
    },
    {
      id: 'c50-2',
      sourceDocId: 'doc-shipping',
      text: 'Los productos digitales se entregan al instante por email.',
      similarity: 0.31,
      relevant: false,
    },
    {
      id: 'c50-3',
      sourceDocId: 'doc-refund',
      text: 'NovaForge Labs ofrece un reembolso completo dentro de los 30 días de la compra',
      similarity: 0.91,
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
      text: 'Los pedidos de reembolso deben enviarse a billing@novaforge.example',
      similarity: 0.72,
      relevant: true,
    },
    {
      id: 'c50-6',
      sourceDocId: 'doc-support',
      text: 'Para problemas técnicos abrí un ticket en la Forge Console.',
      similarity: 0.27,
      relevant: false,
    },
    {
      id: 'c50-7',
      sourceDocId: 'doc-careers',
      text: 'Contratamos builders curiosos en la mayoría de los husos horarios.',
      similarity: 0.11,
      relevant: false,
    },
    {
      id: 'c50-8',
      sourceDocId: 'doc-shipping',
      text: 'El merch físico se envía en 5 días hábiles.',
      similarity: 0.29,
      relevant: false,
    },
  ],
  100: [
    {
      id: 'c100-1',
      sourceDocId: 'doc-about',
      text: 'NovaForge Labs construye herramientas experimentales de IA para developers. Fundada en 2021, el equipo se enfoca en sistemas de aprendizaje interactivo.',
      similarity: 0.24,
      relevant: false,
    },
    {
      id: 'c100-2',
      sourceDocId: 'doc-shipping',
      text: 'Los productos digitales se entregan al instante por email. El merch físico se envía en 5 días hábiles.',
      similarity: 0.33,
      relevant: false,
    },
    {
      id: 'c100-3',
      sourceDocId: 'doc-refund',
      text: 'NovaForge Labs ofrece un reembolso completo dentro de los 30 días de la compra si el producto no fue muy usado. Los pedidos de reembolso deben enviarse a billing@novaforge.example con el ID del pedido.',
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
      sourceDocId: 'doc-support',
      text: 'Para problemas técnicos abrí un ticket en la Forge Console. El tiempo de respuesta suele ser menor a 24 horas en días hábiles.',
      similarity: 0.28,
      relevant: false,
    },
    {
      id: 'c100-6',
      sourceDocId: 'doc-careers',
      text: 'Contratamos builders curiosos. Roles: simulation engineer, education designer y developer advocate.',
      similarity: 0.14,
      relevant: false,
    },
  ],
  200: [
    {
      id: 'c200-1',
      sourceDocId: 'doc-about',
      text: 'NovaForge Labs construye herramientas experimentales de IA para developers. Fundada en 2021, el equipo se enfoca en sistemas de aprendizaje interactivo y motores de simulación para arquitecturas modernas de IA.',
      similarity: 0.26,
      relevant: false,
    },
    {
      id: 'c200-2',
      sourceDocId: 'doc-shipping',
      text: 'Los productos digitales se entregan al instante por email. El merch físico se envía en 5 días hábiles. Los envíos internacionales pueden demorar hasta 20 días según aduana.',
      similarity: 0.35,
      relevant: false,
    },
    {
      id: 'c200-3',
      sourceDocId: 'doc-refund',
      text: 'NovaForge Labs ofrece un reembolso completo dentro de los 30 días de la compra si el producto no fue muy usado. Los pedidos de reembolso deben enviarse a billing@novaforge.example con el ID del pedido. No hay reembolsos parciales después del día 30.',
      similarity: 0.96,
      relevant: true,
    },
    {
      id: 'c200-4',
      sourceDocId: 'doc-support',
      text: 'Para problemas técnicos abrí un ticket en la Forge Console. El tiempo de respuesta suele ser menor a 24 horas en días hábiles. Los resets de contraseña se manejan automáticamente desde la pantalla de login.',
      similarity: 0.3,
      relevant: false,
    },
    {
      id: 'c200-5',
      sourceDocId: 'doc-careers',
      text: 'Contratamos builders curiosos. Roles: simulation engineer, education designer y developer advocate. Remoto-friendly en la mayoría de los husos horarios.',
      similarity: 0.15,
      relevant: false,
    },
  ],
  400: [
    {
      id: 'c400-1',
      sourceDocId: 'doc-about',
      text: 'NovaForge Labs construye herramientas experimentales de IA para developers. Fundada en 2021, el equipo se enfoca en sistemas de aprendizaje interactivo y motores de simulación. Este chunk sobredimensionado diluye la calidad del retrieval con texto corporativo extra.',
      similarity: 0.41,
      relevant: false,
    },
    {
      id: 'c400-2',
      sourceDocId: 'doc-shipping',
      text: 'Los productos digitales se entregan al instante por email. El merch físico se envía en 5 días hábiles. Los envíos internacionales pueden demorar hasta 20 días. Notas de depósito y códigos de courier también viven acá.',
      similarity: 0.44,
      relevant: false,
    },
    {
      id: 'c400-3',
      sourceDocId: 'doc-mixed',
      text: 'FAQ de soporte mezclado con pistas de reembolso: abrí tickets en Forge Console. En algún lado: reembolso completo dentro de los 30 días… pero enterrado bajo texto de empleos, ruido de envíos e instrucciones de reset que confunden al modelo.',
      similarity: 0.58,
      relevant: false,
    },
    {
      id: 'c400-4',
      sourceDocId: 'doc-careers',
      text: 'Contratamos builders curiosos. Roles: simulation engineer, education designer y developer advocate. Remoto-friendly. Resumen de beneficios y extractos de culture deck.',
      similarity: 0.21,
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
