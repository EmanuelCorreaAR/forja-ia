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
    missionLabel: 'Misión',
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
  share: {
    title: 'AI Forge Score',
    score: 'Score',
    cta: '¿Podés superar esto? Copiá el desafío y mandáselo a alguien.',
    copy: 'Copiar desafío',
    copied: '¡Copiado!',
    time: 'Tiempo',
  },
  levels: {
    llm: {
      title: 'Nivel 1',
      subtitle: 'LLM — ¿Podés pensar como el modelo?',
      cardDescription: 'Adiviná el próximo token. El contexto lo cambia todo.',
      mission:
        'Elegí el próximo token a ciegas. Después mirás cómo el contexto mueve las probabilidades.',
      chaosMission:
        'CHAOS MODE: conseguí la respuesta más absurda posible. Subí la temperatura y rompé la heladera de la realidad.',
      contextLabel: 'Contexto',
      optionsLabel: '¿Qué sigue?',
      nextTokenSlot: '¿?',
      pickHint: 'Sin números. ¿Qué diría el modelo?',
      revealHint: 'Así lo ve el modelo con la temperatura actual.',
      scoreLabel: 'Puntos',
      streakLabel: 'Racha',
      chaosScoreLabel: 'Caos',
      tempLabel: 'Temperatura',
      tempLow: 'predecible',
      tempHigh: 'loca',
      continue: 'Siguiente ronda',
      retry: 'Intentar de nuevo',
      chaosAgain: 'Otro caos',
      enterChaos: 'Entrar a CHAOS MODE',
      skipChaos: 'Terminar acá',
      finishChaos: 'Cerrar chaos y compartir',
      explanation:
        'Un LLM genera texto token a token. El contexto mueve las probs; la temperatura decide cuánto se pelea el top-1 con las opciones raras.',
      feedback: {
        incompleteTitle: 'Tu turno',
        incompleteMessage:
          'Ronda {{current}}/{{total}}. El contexto manda — elegí a ciegas.',
        wrongTitle: 'El modelo no iba por ahí',
        wrongMessage:
          'Elegiste “{{picked}}” ({{pickedProb}}%). Lo más probable era “{{top}}” ({{topProb}}%).',
        hitTitle: '¡Match!',
        hitMessage:
          '“{{token}}” tenía {{prob}}%. Ronda {{current}}/{{total}}. ¿Viste cómo el contexto cambia todo?',
        predictDoneTitle: 'Rondas completadas',
        predictDoneMessage:
          'Desbloqueaste temperatura y CHAOS MODE. ¿Querés romper el modelo un rato?',
        chaosTitle: 'CHAOS MODE',
        chaosMessage:
          'Subí la temperatura y elegí lo más absurdo. Cada pick suma caos.',
        chaosHitTitle: 'Absurdo registrado',
        chaosHitMessage: 'Caos acumulado: {{chaosScore}}. ¿Otra pasada o cerrás?',
        successTitle: 'Partida cerrada',
        successMessage:
          'Score {{score}} · racha {{bestStreak}} · caos {{chaosScore}}.',
      },
    },
    embeddings: {
      title: 'Nivel 2',
      subtitle: 'Embeddings — Encontrá el intruso',
      cardDescription:
        'Retrieval semántico: elegí vecinos reales y esquivá el tramposo léxico.',
      mission:
        'Elegí exactamente {{topK}} documentos cercanos en significado. Cuidado: uno habla de “desayuno”… pero no es comida.',
      queryLabel: 'Consulta',
      docsLabel: 'Documentos',
      mapQueryLabel: 'Q',
      mapLabel: 'Espacio vectorial (2D)',
      mapBlindHint:
        'Cada punto es un documento. Q es la consulta. Todavía no sabés qué punto es qué texto — elegí por significado.',
      mapRevealHint:
        'Ahora sí: letras + similitudes. El intruso léxico queda marcado.',
      selectedLabel: 'Elegidos',
      scoreLabel: 'Puntos',
      pickHint:
        'Leé los textos. Palabras parecidas no alcanzan: buscá comida de verdad para el desayuno.',
      revealHint:
        'Similitud revelada. Las letras del mapa coinciden con los documentos.',
      retry: 'Elegir de nuevo',
      needExact: 'Elegí exactamente {{topK}} documentos',
      topMark: '✓ top',
      trapMark: '⚠ intruso',
      explanation:
        'Los embeddings miden significado, no solo palabras. “Mesa de desayuno” comparte léxico con la consulta, pero vive lejos en el espacio semántico.',
      feedback: {
        incompleteTitle: 'Adiviná el vecindario',
        incompleteMessage:
          'Marcá los {{topK}} docs más cercanos en significado. El mapa muestra el espacio, pero sin delatar identidades.',
        missedAllTitle: 'Fuera del cluster',
        missedAllMessage:
          'Ninguno de tus {{topK}} estaba entre los más cercanos. Mirás las letras en el mapa y reintentá.',
        partialTitle: 'Casi — cluster incompleto',
        partialMessage:
          'Acertaste {{hits}} de {{topK}}. Sacá los distractores y quedate con los vecinos reales de la consulta.',
        trapTitle: '¡Caíste en el intruso!',
        trapMessage:
          'Ese texto tiene “desayuno”… pero es un mueble. El embedding no se deja engañar por palabras sueltas.',
        successTitle: 'Vecinos encontrados',
        successMessage:
          'Identificaste los {{topK}} documentos reales. Score {{score}} · sim {{avgSim}}.',
      },
    },
    rag: {
      title: 'Nivel 3',
      subtitle: 'RAG — Tu IA está rota',
      cardDescription:
        'El bot de ACME Airlines inventa reembolsos. Arreglá el retrieval.',
      mission:
        'El bot ya respondió mal. Ajustá pedazo / cuántos / umbral hasta que entre la política real de reembolsos — y no la promo de 2019.',
      nightmareMission:
        'RAG NIGHTMARE: chunk 400, topK 1, umbral alto y distractor fuerte. Tenés 60 segundos.',
      repairBadge: 'Reparar bot',
      nightmareBadge: 'NIGHTMARE',
      questionLabel: 'Pregunta del cliente',
      botBrokenLabel: 'Respuesta actual del bot (rota)',
      docsToggleShow: 'Ver títulos',
      docsToggleHide: 'Ocultar',
      docsLabel: 'Biblioteca ACME',
      docsHint:
        'La respuesta está en “Política de reembolsos”. Cuidado con la promo 2019 archivada.',
      paramsLabel: 'Controles del buscador',
      chunkSize: 'Tamaño de pedazo',
      chunkSizeHelp:
        '¿En cuán grandes trozos cortamos los documentos? Muy grande = mezcla temas. Muy chico = falta detalle.',
      chunkSizeOptions: {
        50: 'Muy chicos (50)',
        100: 'Chicos (100)',
        200: 'Medianos (200)',
        400: 'Enormes (400) — rotos',
      },
      topK: 'Cuántos pedazos le das al LLM',
      topKHelp: 'Top K: cuántos resultados de la búsqueda entran al contexto.',
      threshold: 'Qué tan parecido debe ser',
      thresholdHelp:
        'Umbral: si es muy alto, no entra nada. Si es muy bajo, entra basura (incluida la promo 2019).',
      thresholdLow: 'permisivo',
      thresholdHigh: 'estricto',
      storyLabel: 'Qué le llega al LLM',
      pipelineLabel: 'Flujo',
      pipeline: {
        documents: 'Docs',
        chunking: 'Cortar',
        embeddings: 'Embeddings',
        vectorSearch: 'Buscar',
        retrievedContext: 'Contexto',
        llm: 'LLM',
        answer: 'Respuesta',
      },
      retrievedLabel: 'Pedazos recuperados',
      contextLabel: 'Contexto que ve el modelo',
      answerLabel: 'Respuesta del LLM',
      runCta: 'Probar esta configuración',
      enterNightmare: 'Entrar a RAG NIGHTMARE (60s)',
      retryNightmare: 'Reintentar NIGHTMARE',
      scoreLabel: 'Puntos',
      tokensLabel: 'Tokens contexto',
      included: 'entra al LLM',
      excluded: 'queda afuera',
      explanation:
        'RAG no reemplaza al LLM: primero busca pedazos relevantes y se los entrega como contexto. Si el contexto es malo (o es una promo vieja), el bot inventa con cara de seguro.',
      answers: {
        empty:
          'No encontré nada útil en el contexto. No puedo hablar de reembolsos.',
        wrong:
          'Según lo que me diste, ACME habla de equipaje y check-in… no veo una política de reembolsos clara.',
        incomplete:
          'Vi algo de reembolsos, pero me faltan detalles (plazo, condiciones o contacto).',
        confused:
          'Mezclé cancelaciones, promo 2019 y equipaje. ¿El reembolso es… instantáneo sin preguntas? No estoy seguro.',
        promoTrap:
          '¡Claro! Reembolso instantáneo sin preguntas — oferta Flash de 2019. (El bot inventó con cara de seguro.)',
        correct:
          'ACME Airlines ofrece un reembolso completo dentro de los 30 días de la compra si el producto no fue muy usado. Pedilos a billing@acme-air.example con el ID del pedido. Después del día 30 no hay reembolsos parciales.',
      },
      feedback: {
        idleTitle: 'Empezá a experimentar',
        idleMessage: 'Mové un control y probá de nuevo.',
        emptyTitle: 'No le llegó nada al LLM',
        emptyMessage:
          'Nadie pasó el filtro. Probá: pedazos más chicos/medianos, más cantidad, o un umbral menos estricto.',
        missedTitle: 'Buscó… pero no la política',
        missedMessage:
          'Entraron pedazos que no hablan de reembolsos vigentes. Cambiá el tamaño de pedazo: los enormes mezclan temas.',
        incompleteTitle: 'Le faltó pedazo',
        incompleteMessage:
          'Tocó el tema, pero incompleto. Subí “cuántos pedazos” o usá pedazos un poco más grandes (100–200).',
        noisyTitle: 'Le diste demasiada basura',
        noisyMessage:
          'El LLM se mareó con info irrelevante. Pedazos más chicos o un umbral un poco más estricto.',
        promoTitle: '¡Mordió la promo 2019!',
        promoMessage:
          'Entró el archivo de marketing. Sacá ruido o subí el umbral / bajá el top-K hasta que gane la política real.',
        timeoutTitle: 'Se acabó el tiempo',
        timeoutMessage:
          'NIGHTMARE no perdona. Reintentá: pedazos medianos, top-K sensato, umbral que deje pasar el refund.',
        successTitle: '¡El bot dejó de inventar!',
        successMessage:
          'El pedazo de reembolsos entró al LLM y la respuesta es usable. Eso es RAG.',
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
