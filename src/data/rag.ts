import type { ChunkSize, RagChunk, RagDocument } from '@/domain/levels/rag/types'

export const RAG_COMPANY = 'NovaForge Labs'

export const RAG_QUESTION = "What is the company's refund policy?"

export const RAG_DOCUMENTS: RagDocument[] = [
  {
    id: 'doc-about',
    title: 'About NovaForge Labs',
    body: 'NovaForge Labs builds experimental AI tools for developers. Founded in 2021, the team focuses on interactive learning systems and simulation engines for modern AI architectures.',
  },
  {
    id: 'doc-shipping',
    title: 'Shipping Policy',
    body: 'Digital products are delivered instantly by email. Physical merch ships within 5 business days. International shipping may take up to 20 days depending on customs.',
  },
  {
    id: 'doc-refund',
    title: 'Refund Policy',
    body: 'NovaForge Labs offers a full refund within 30 days of purchase if the product has not been heavily used. Refund requests must be sent to billing@novaforge.example with the order ID. Partial refunds are not available after day 30.',
  },
  {
    id: 'doc-support',
    title: 'Support FAQ',
    body: 'For technical issues open a ticket in the Forge Console. Response time is usually under 24 hours on weekdays. Password resets are handled automatically from the login screen.',
  },
  {
    id: 'doc-careers',
    title: 'Careers',
    body: 'We hire curious builders. Roles include simulation engineer, education designer, and developer advocate. Remote-friendly across most timezones.',
  },
]

/**
 * Chunk catalogs per chunk size.
 * Similarities are hand-tuned so retrieval behavior is deterministic and teachable.
 */
export const RAG_CHUNKS_BY_SIZE: Record<ChunkSize, RagChunk[]> = {
  50: [
    {
      id: 'c50-1',
      sourceDocId: 'doc-about',
      text: 'NovaForge Labs builds experimental AI tools for developers.',
      similarity: 0.22,
      relevant: false,
    },
    {
      id: 'c50-2',
      sourceDocId: 'doc-shipping',
      text: 'Digital products are delivered instantly by email.',
      similarity: 0.31,
      relevant: false,
    },
    {
      id: 'c50-3',
      sourceDocId: 'doc-refund',
      text: 'NovaForge Labs offers a full refund within 30 days of purchase',
      similarity: 0.91,
      relevant: true,
    },
    {
      id: 'c50-4',
      sourceDocId: 'doc-refund',
      text: 'if the product has not been heavily used.',
      similarity: 0.48,
      relevant: true,
    },
    {
      id: 'c50-5',
      sourceDocId: 'doc-refund',
      text: 'Refund requests must be sent to billing@novaforge.example',
      similarity: 0.72,
      relevant: true,
    },
    {
      id: 'c50-6',
      sourceDocId: 'doc-support',
      text: 'For technical issues open a ticket in the Forge Console.',
      similarity: 0.27,
      relevant: false,
    },
    {
      id: 'c50-7',
      sourceDocId: 'doc-careers',
      text: 'We hire curious builders across most timezones.',
      similarity: 0.11,
      relevant: false,
    },
    {
      id: 'c50-8',
      sourceDocId: 'doc-shipping',
      text: 'Physical merch ships within 5 business days.',
      similarity: 0.29,
      relevant: false,
    },
  ],
  100: [
    {
      id: 'c100-1',
      sourceDocId: 'doc-about',
      text: 'NovaForge Labs builds experimental AI tools for developers. Founded in 2021, the team focuses on interactive learning systems.',
      similarity: 0.24,
      relevant: false,
    },
    {
      id: 'c100-2',
      sourceDocId: 'doc-shipping',
      text: 'Digital products are delivered instantly by email. Physical merch ships within 5 business days.',
      similarity: 0.33,
      relevant: false,
    },
    {
      id: 'c100-3',
      sourceDocId: 'doc-refund',
      text: 'NovaForge Labs offers a full refund within 30 days of purchase if the product has not been heavily used. Refund requests must be sent to billing@novaforge.example with the order ID.',
      similarity: 0.94,
      relevant: true,
    },
    {
      id: 'c100-4',
      sourceDocId: 'doc-refund',
      text: 'Partial refunds are not available after day 30.',
      similarity: 0.61,
      relevant: true,
    },
    {
      id: 'c100-5',
      sourceDocId: 'doc-support',
      text: 'For technical issues open a ticket in the Forge Console. Response time is usually under 24 hours on weekdays.',
      similarity: 0.28,
      relevant: false,
    },
    {
      id: 'c100-6',
      sourceDocId: 'doc-careers',
      text: 'We hire curious builders. Roles include simulation engineer, education designer, and developer advocate.',
      similarity: 0.14,
      relevant: false,
    },
  ],
  200: [
    {
      id: 'c200-1',
      sourceDocId: 'doc-about',
      text: 'NovaForge Labs builds experimental AI tools for developers. Founded in 2021, the team focuses on interactive learning systems and simulation engines for modern AI architectures.',
      similarity: 0.26,
      relevant: false,
    },
    {
      id: 'c200-2',
      sourceDocId: 'doc-shipping',
      text: 'Digital products are delivered instantly by email. Physical merch ships within 5 business days. International shipping may take up to 20 days depending on customs.',
      similarity: 0.35,
      relevant: false,
    },
    {
      id: 'c200-3',
      sourceDocId: 'doc-refund',
      text: 'NovaForge Labs offers a full refund within 30 days of purchase if the product has not been heavily used. Refund requests must be sent to billing@novaforge.example with the order ID. Partial refunds are not available after day 30.',
      similarity: 0.96,
      relevant: true,
    },
    {
      id: 'c200-4',
      sourceDocId: 'doc-support',
      text: 'For technical issues open a ticket in the Forge Console. Response time is usually under 24 hours on weekdays. Password resets are handled automatically from the login screen.',
      similarity: 0.3,
      relevant: false,
    },
    {
      id: 'c200-5',
      sourceDocId: 'doc-careers',
      text: 'We hire curious builders. Roles include simulation engineer, education designer, and developer advocate. Remote-friendly across most timezones.',
      similarity: 0.15,
      relevant: false,
    },
  ],
  400: [
    {
      id: 'c400-1',
      sourceDocId: 'doc-about',
      text: 'NovaForge Labs builds experimental AI tools for developers. Founded in 2021, the team focuses on interactive learning systems and simulation engines for modern AI architectures. Extra corporate boilerplate fills this oversized chunk and dilutes retrieval quality.',
      similarity: 0.41,
      relevant: false,
    },
    {
      id: 'c400-2',
      sourceDocId: 'doc-shipping',
      text: 'Digital products are delivered instantly by email. Physical merch ships within 5 business days. International shipping may take up to 20 days depending on customs. Warehouse notes and courier codes also live here.',
      similarity: 0.44,
      relevant: false,
    },
    {
      id: 'c400-3',
      sourceDocId: 'doc-mixed',
      text: 'Support FAQ mixed with refund hints: open tickets in Forge Console. Somewhere inside: full refund within 30 days… but buried under careers copy, shipping noise, and password reset instructions that confuse the model.',
      similarity: 0.58,
      relevant: false,
    },
    {
      id: 'c400-4',
      sourceDocId: 'doc-careers',
      text: 'We hire curious builders. Roles include simulation engineer, education designer, and developer advocate. Remote-friendly across most timezones. Benefits overview and culture deck excerpts.',
      similarity: 0.21,
      relevant: false,
    },
  ],
}

export const RAG_CHUNK_SIZE_OPTIONS: ChunkSize[] = [50, 100, 200, 400]
export const RAG_TOP_K_OPTIONS = [1, 2, 3, 5] as const

/** Broken defaults — player must fix them */
export const RAG_INITIAL_CONFIG = {
  chunkSize: 400 as ChunkSize,
  topK: 1 as const,
  threshold: 0.7,
}
