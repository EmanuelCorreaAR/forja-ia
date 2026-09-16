export const es = {
  brand: {
    name: 'AI Forge',
    tagline: 'Construí. Rompé. Entendé.',
    blurb:
      'Un laboratorio interactivo para descubrir cómo funcionan los sistemas modernos de IA.',
  },
  nav: {
    home: 'Inicio',
    backHome: 'Volver al laboratorio',
    levels: 'Niveles',
  },
  home: {
    available: 'Niveles disponibles',
    upcoming: 'Próximamente',
    start: 'Entrar',
    continue: 'Continuar',
    completed: 'Completado',
    locked: 'Bloqueado',
    availableStatus: 'Disponible',
    progressLabel: 'Progreso',
    progressValue: '{{done}} / {{total}} completados',
  },
  common: {
    objective: 'Objetivo',
    reset: 'Reiniciar',
    run: 'Ejecutar',
    submit: 'Comprobar',
    attempts: 'Intentos',
    attemptsHint: 'Hipótesis que no cerraron — fallar es parte del juego',
    explanation: 'Qué acabás de aprender',
    simplification:
      'Visualización 2D pedagógica — en la realidad los embeddings viven en cientos o miles de dimensiones.',
    similarity: 'similitud',
  },
  levels: {
    llm: {
      title: 'Nivel 1',
      subtitle: 'LLM — Predice el próximo token',
      cardDescription: 'Aprendé qué hace realmente un modelo de lenguaje.',
      objective:
        'Adiviná el próximo token a ciegas. Después el modelo revela sus probabilidades. Acertá la cadena completa.',
      contextLabel: 'Texto generado',
      optionsLabel: '¿Qué sigue?',
      sequenceLabel: 'Texto generado',
      nextTokenSlot: '¿?',
      pickHint: 'Sin mirar números: ¿qué palabra encaja mejor con el contexto?',
      revealHint: 'Así lo “ve” el modelo — estas son las probabilidades de cada token.',
      scoreLabel: 'Puntos',
      streakLabel: 'Racha',
      continue: 'Siguiente token',
      retry: 'Intentar de nuevo',
      finish: 'Ver resultado',
      explanation:
        'Un LLM no busca una respuesta en una base de datos. Genera texto token por token: calcula qué viene después según el contexto y elige entre opciones más o menos probables.',
      feedback: {
        incompleteTitle: 'Tu turno',
        incompleteMessage:
          'Ronda {{current}}/{{total}}. Leé el contexto y elegí. Las probabilidades se revelan después.',
        wrongTitle: 'El modelo no iba por ahí',
        wrongMessage:
          'Elegiste “{{picked}}” ({{pickedProb}}%). Lo más probable era “{{top}}” ({{topProb}}%).',
        hitTitle: '¡Match con el modelo!',
        hitMessage:
          '“{{token}}” tenía {{prob}}%. Ronda {{current}}/{{total}} lista — seguí la racha.',
        hitLastMessage:
          '“{{token}}” tenía {{prob}}%. Completaste la cadena. ¡Revisá tu score!',
        successTitle: 'Cadena completada',
        successMessage:
          'Predijiste token a token como un LLM. Score {{score}} · mejor racha {{bestStreak}}.',
      },
    },
    embeddings: {
      title: 'Nivel 2',
      subtitle: 'Embeddings — Encontrá significado',
      cardDescription:
        'Descubrí cómo los textos pueden representarse como vectores.',
      objective:
        'Elegí los {{topK}} documentos semánticamente más cercanos a la consulta. Sin ver similitudes: pensá en significado.',
      queryLabel: 'Consulta',
      docsLabel: 'Documentos',
      mapLabel: 'Espacio vectorial (2D)',
      mapHidden:
        'El mapa se revela al comprobar. Primero elegí solo con el significado de los textos.',
      selectedLabel: 'Elegidos',
      scoreLabel: 'Puntos',
      pickHint:
        'Leé la consulta y los textos. Los near-misses engañan: “chocolate” ≠ “receta de postre”.',
      revealHint:
        'Similitud y mapa revelados. Los puntos cercanos representan significado parecido.',
      retry: 'Elegir de nuevo',
      needExact: 'Elegí exactamente {{topK}} documentos',
      topMark: '✓ top',
      explanation:
        'Los embeddings convierten texto en vectores. Textos con significado parecido quedan cerca; por eso podemos buscar por semántica y no solo por palabras exactas.',
      feedback: {
        incompleteTitle: 'Adiviná el vecindario',
        incompleteMessage:
          'Marcá los {{topK}} docs más cercanos en significado. Al comprobar se revelan similitudes y el mapa.',
        missedAllTitle: 'Fuera del cluster',
        missedAllMessage:
          'Ninguno de tus {{topK}} estaba entre los más cercanos. Mirás mapa y scores, y reintentá.',
        partialTitle: 'Casi — cluster incompleto',
        partialMessage:
          'Acertaste {{hits}} de {{topK}}. Sacá los distractores y quedate con los vecinos reales de la consulta.',
        successTitle: 'Vecinos encontrados',
        successMessage:
          'Identificaste los {{topK}} documentos más cercanos. Score {{score}}.',
      },
    },
    rag: {
      title: 'Nivel 3',
      subtitle: 'RAG — Dale conocimiento al modelo',
      cardDescription:
        'Construí un sistema que permita responder usando documentos externos.',
      objective:
        'Ajustá el tamaño de chunk, top K y el umbral de similitud hasta que el LLM responda la política de reembolsos con el contexto correcto.',
      questionLabel: 'Pregunta',
      docsLabel: 'Documentos',
      paramsLabel: 'Parámetros',
      chunkSize: 'Tamaño de chunk',
      topK: 'Top K',
      threshold: 'Umbral de similitud',
      pipelineLabel: 'Pipeline',
      pipeline: {
        documents: 'Documentos',
        chunking: 'Chunking',
        embeddings: 'Embeddings',
        vectorSearch: 'Búsqueda vectorial',
        retrievedContext: 'Contexto recuperado',
        llm: 'LLM',
        answer: 'Respuesta',
      },
      retrievedLabel: 'Búsqueda vectorial',
      contextLabel: 'Contexto recuperado',
      answerLabel: 'Respuesta generada',
      runCta: 'Ejecutar RAG',
      explanation:
        'RAG combina recuperación de información con generación. Primero busca información relevante y después se la entrega al modelo como contexto para generar la respuesta.',
      answers: {
        empty:
          'No encontré contexto útil. No puedo responder la política de reembolsos.',
        wrong:
          'Según el contexto recuperado, NovaForge envía merch en 5 días y responde tickets en 24 horas.',
        incomplete:
          'Parece que hay reembolsos… pero me faltan detalles (plazo, condiciones y contacto).',
        confused:
          'Mezclé envíos, empleos y soporte. Creo que el reembolso es… ¿instantáneo por email?',
        correct:
          'NovaForge Labs ofrece un reembolso completo dentro de los 30 días de la compra si el producto no fue muy usado. Pedilos a billing@novaforge.example con el ID del pedido. Después del día 30 no hay reembolsos parciales.',
      },
      feedback: {
        idleTitle: 'El sistema está roto',
        idleMessage:
          'La configuración inicial no recupera buen contexto. Cambiá parámetros y ejecutá.',
        emptyTitle: 'Sin contexto',
        emptyMessage:
          'Ningún chunk pasó el umbral / top K. Bajá el umbral o ampliá top K.',
        missedTitle: 'Contexto insuficiente',
        missedMessage:
          'El chunk relevante quedó fuera de los resultados. Revisá el tamaño de chunk, top K y el umbral.',
        incompleteTitle: 'Contexto incompleto',
        incompleteMessage:
          'Recuperaste una parte de la política, pero no alcanza para una respuesta completa.',
        noisyTitle: 'Demasiado contexto irrelevante',
        noisyMessage:
          'Recuperaste demasiada información irrelevante. Probá chunks más chicos o un umbral más estricto.',
        successTitle: 'RAG resuelto',
        successMessage:
          'El documento correcto llegó al contexto del modelo y la respuesta es usable.',
      },
    },
    future: {
      locked: 'Nivel futuro — todavía no implementado.',
      tools: { title: 'Tools', subtitle: 'Dar acciones al modelo' },
      mcp: { title: 'MCP', subtitle: 'Conectar herramientas externas' },
      agents: { title: 'Agents', subtitle: 'Planificar y actuar en bucle' },
      context: { title: 'Context', subtitle: 'Qué entra en la ventana' },
      evaluation: { title: 'Evaluation', subtitle: 'Medir calidad' },
      security: { title: 'Security', subtitle: 'Prompt injection y más' },
      cost: { title: 'Cost', subtitle: 'Tokens y presupuesto' },
      latency: { title: 'Latency', subtitle: 'Velocidad del sistema' },
      multiAgent: { title: 'Multi-Agent', subtitle: 'Varios agentes coordinados' },
    },
  },
} as const
