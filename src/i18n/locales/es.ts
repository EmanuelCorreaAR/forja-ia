export const es = {
  brand: {
    name: 'AI Forge',
    tagline: 'Construí. Rompé. Entendé.',
    blurb:
      'Un laboratorio interactivo para descubrir cómo funcionan los sistemas modernos de IA.',
  },
  nav: {
    home: 'Home',
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
    explanation: 'Qué acabás de aprender',
    simplification:
      'Visualización 2D pedagógica — en la realidad los embeddings viven en cientos o miles de dimensiones.',
  },
  levels: {
    llm: {
      title: 'Level 1',
      subtitle: 'LLM — Predict the next token',
      cardDescription: 'Aprendé qué hace realmente un modelo de lenguaje.',
      objective:
        'Construí la secuencia objetivo eligiendo el siguiente token más coherente en cada paso.',
      contextLabel: 'Contexto',
      optionsLabel: 'Próximos tokens posibles',
      sequenceLabel: 'Secuencia resultante',
      pickHint: 'Elegí un token para continuar la predicción.',
      explanation:
        'Un LLM no "busca" directamente una respuesta en una base de datos. Genera texto token por token, usando el contexto disponible para calcular qué tokens son más probables.',
      feedback: {
        incompleteTitle: 'Seguí prediciendo',
        incompleteMessage:
          'Paso {{current}} de {{total}}. Objetivo: {{target}}',
        wrongTitle: 'Token poco probable para esta ruta',
        wrongMessage:
          'Ese token es posible, pero no construye la secuencia objetivo. Probá otra opción.',
        successTitle: 'Secuencia construida',
        successMessage:
          'Predijiste el next token paso a paso y armaste la frase objetivo.',
      },
    },
    embeddings: {
      title: 'Level 2',
      subtitle: 'Embeddings — Find meaning',
      cardDescription:
        'Descubrí cómo los textos pueden representarse como vectores.',
      objective:
        'Seleccioná los documentos semánticamente más cercanos a la query.',
      queryLabel: 'Query',
      docsLabel: 'Documentos',
      mapLabel: 'Espacio vectorial (2D)',
      selectedLabel: 'Seleccionados',
      explanation:
        'Embeddings permiten representar significado de forma que podamos comparar qué contenido está relacionado con otro.',
      feedback: {
        incompleteTitle: 'Explorá el espacio',
        incompleteMessage:
          'Mirás similitud, elegís los documentos cercanos a la query y comprobás.',
        missingTitle: 'Falta un documento cercano',
        missingMessage:
          'Hay al menos un documento de chocolate cake que todavía no seleccionaste.',
        extraTitle: 'Hay documentos lejanos',
        extraMessage:
          'Incluiste contenido semánticamente lejos de la query. Sacá lo que no pertenece al cluster de cake.',
        wrongTitle: 'Selección incorrecta',
        wrongMessage: 'Revisá distancias y similarity scores, y volvé a intentar.',
        successTitle: 'Cluster encontrado',
        successMessage:
          'Identificaste los documentos más cercanos a la query en el espacio vectorial.',
      },
    },
    rag: {
      title: 'Level 3',
      subtitle: 'RAG — Give the model knowledge',
      cardDescription:
        'Construí un sistema que permita responder usando documentos externos.',
      objective:
        'Ajustá chunk size, top K y similarity threshold hasta que el LLM responda la política de refunds con el contexto correcto.',
      questionLabel: 'Pregunta',
      docsLabel: 'Documents',
      paramsLabel: 'Parámetros',
      chunkSize: 'Chunk size',
      topK: 'Top K',
      threshold: 'Similarity threshold',
      pipelineLabel: 'Pipeline',
      retrievedLabel: 'Vector Search',
      contextLabel: 'Retrieved Context',
      answerLabel: 'Generated Answer',
      runCta: 'Ejecutar RAG',
      explanation:
        'RAG combina recuperación de información con generación. Primero busca información relevante y después se la entrega al modelo como contexto para generar la respuesta.',
      answers: {
        empty:
          'No encontré contexto útil. No puedo responder la política de refunds.',
        wrong:
          'Según el contexto recuperado, NovaForge envía merch en 5 días y responde tickets en 24 horas.',
        incomplete:
          'Parece que hay refunds… pero me faltan detalles (plazo, condiciones y contacto).',
        confused:
          'Mezclé shipping, careers y soporte. Creo que el refund es… ¿instantáneo por email?',
        correct:
          'NovaForge Labs ofrece un reembolso completo dentro de los 30 días de la compra si el producto no fue muy usado. Pedilos a billing@novaforge.example con el order ID. Después del día 30 no hay reembolsos parciales.',
      },
      feedback: {
        idleTitle: 'El sistema está roto',
        idleMessage:
          'La configuración inicial no recupera buen contexto. Cambiá parámetros y ejecutá.',
        emptyTitle: 'Sin contexto',
        emptyMessage:
          'Ningún chunk pasó el threshold / top K. Bajá el threshold o ampliá top K.',
        missedTitle: 'Not enough context',
        missedMessage:
          'El chunk relevante quedó fuera de los resultados. Revisá chunk size, top K y threshold.',
        incompleteTitle: 'Contexto incompleto',
        incompleteMessage:
          'Recuperaste una parte de la política, pero no alcanza para una respuesta completa.',
        noisyTitle: 'Too much irrelevant context',
        noisyMessage:
          'Recuperaste demasiada información irrelevante. Probá chunks más chicos o un threshold más estricto.',
        successTitle: 'RAG solved',
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
