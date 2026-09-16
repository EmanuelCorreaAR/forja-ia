export const es = {
  brand: {
    name: 'Forja IA',
    tagline: 'Construí. Rompé. Entendé.',
    blurb:
      'Un laboratorio interactivo para descubrir cómo funcionan los sistemas modernos de IA.',
  },
  nav: {
    backHome: 'Volver al laboratorio',
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
    time: 'Tiempo',
    explanation: 'Qué acabás de aprender',
    simplification:
      'Visualización 2D pedagógica — en la realidad los embeddings viven en cientos o miles de dimensiones.',
    similarity: 'similitud',
  },
  glossary: {
    generate: {
      term: 'GENERATE',
      definition:
        'El modelo produce texto token a token: en cada paso estima qué sigue según el contexto.',
    },
    find: {
      term: 'FIND',
      definition:
        'Con embeddings, buscar deja de ser match de palabras: se compara significado en un espacio vectorial.',
    },
    retrieve: {
      term: 'RETRIEVE',
      definition:
        'Antes de responder, el sistema recupera pedazos de tus documentos y los inyecta como contexto.',
    },
    act: {
      term: 'ACT',
      definition:
        'Con tools, el modelo elige una acción y el runtime la ejecuta: deja de solo hablar.',
    },
    llm: {
      term: 'LLM',
      definition:
        'Large Language Model: predice el próximo token a partir del contexto. No “sabe” cosas, estima probabilidades.',
    },
    embeddings: {
      term: 'Embeddings',
      definition:
        'Vectores que representan significado. Dos textos parecidos quedan cerca aunque no compartan palabras.',
    },
    rag: {
      term: 'RAG',
      definition:
        'Retrieval-Augmented Generation: primero buscás pedazos relevantes en tus documentos, después el LLM responde con eso como contexto.',
    },
    tools: {
      term: 'Tools',
      definition:
        'Function calling: el modelo elige una herramienta y sus argumentos, y el runtime ejecuta la acción.',
    },
    mcp: {
      term: 'MCP',
      definition:
        'Model Context Protocol: estándar para que un modelo descubra y use herramientas externas sin hardcodearlas.',
    },
    agents: {
      term: 'Agents',
      definition:
        'Un modelo que planifica, ejecuta tools y revisa resultados en bucle hasta cerrar la tarea.',
    },
    context: {
      term: 'Context',
      definition:
        'La ventana de contexto (context window): todo lo que el modelo ve en una llamada — instrucciones, historial y documentos.',
    },
    evaluation: {
      term: 'Evaluation',
      definition:
        'Medir calidad con casos y métricas repetibles en vez de impresiones sueltas.',
    },
    security: {
      term: 'Security',
      definition:
        'Prompt injection y compañía: entradas que secuestran las instrucciones o filtran datos.',
    },
    cost: {
      term: 'Cost',
      definition:
        'Cada llamada se paga en tokens de entrada y de salida: el contexto largo cuesta.',
    },
    latency: {
      term: 'Latency',
      definition:
        'Cuánto tarda el sistema completo: modelo, retrieval y tools suman tiempo.',
    },
    'multi-agent': {
      term: 'Multi-Agent',
      definition:
        'Varios agentes especializados que se coordinan y se pasan trabajo entre sí.',
    },
    token: {
      term: 'token',
      definition:
        'Un token es la unidad que maneja el modelo: un pedazo de palabra, no una letra ni siempre una palabra entera.',
    },
    temperature: {
      term: 'Temperatura',
      definition:
        'Cuánto se achata o se abre la distribución: baja se aferra al favorito, alta da chance a los tokens raros.',
    },
    chunk: {
      term: 'chunk',
      definition:
        'El pedazo (chunk) en que cortás un documento antes de indexarlo. Muy grande mezcla temas; muy chico pierde detalle.',
    },
    topK: {
      term: 'top-K',
      definition:
        'El top-K: cuántos resultados de la búsqueda entran al contexto del modelo.',
    },
    threshold: {
      term: 'threshold',
      definition:
        'El threshold es el umbral de similitud mínima para aceptar un resultado. Muy alto no entra nada; muy bajo entra basura.',
    },
    vectorSpace: {
      term: 'embedding space',
      definition:
        'El espacio vectorial (embedding space) donde viven los embeddings. Acá se dibuja en 2D; en la realidad son cientos o miles de dimensiones.',
    },
    similarity: {
      term: 'similarity',
      definition:
        'La similarity mide qué tan cerca están dos vectores. Es lo que se usa para rankear resultados.',
    },
    toolCall: {
      term: 'Tool call',
      definition:
        'Lo que emite el modelo: nombre de la tool + argumentos. El runtime es quien la ejecuta.',
    },
    noTool: {
      term: 'NO TOOL',
      definition:
        'Responder en texto sin llamar ninguna herramienta. Tener tools disponibles no obliga a usarlas.',
    },
    args: {
      term: 'Arguments',
      definition:
        'Los parámetros de la tool. El schema define nombres y tipos: si no coinciden, la llamada falla.',
    },
    precision: {
      term: 'Precision',
      definition:
        '¿Hiciste exactamente la acción necesaria? Un agente no debería llamar herramientas de más.',
    },
    toolSelection: {
      term: 'Tool selection',
      definition: '¿Elegiste la tool que matchea la intención del usuario?',
    },
    argumentAccuracy: {
      term: 'Argument accuracy',
      definition: '¿Los argumentos eran correctos en nombre, tipo y valor?',
    },
    unnecessaryCalls: {
      term: 'Unnecessary calls',
      definition:
        'Llamadas que no hacían falta: el modelo podía responder directo en texto.',
    },
    attempts: {
      term: 'Intentos',
      definition:
        'Hipótesis que no cerraron — fallar es parte del juego.',
    },
  },
  levels: {
    llm: {
      title: 'LLM',
      levelLabel: 'Nivel 1',
      subtitle: '¿Podés pensar como el modelo?',
      cardDescription: 'Adiviná el próximo token. El contexto lo cambia todo.',
      mission:
        'Elegí el próximo token a ciegas. Después mirás cómo el contexto mueve las probabilidades.',
      chaosMission:
        'CHAOS MODE: 4 contextos absurdos. Elegí lo más raro en cada uno — no es el mismo loop.',
      contextLabel: 'Contexto',
      optionsLabel: '¿Qué sigue?',
      nextTokenSlot: '¿?',
      pickHint: 'Sin números. ¿Qué diría el modelo?',
      revealHint:
        'Barras = chance de cada token. Mové Temperatura: baja aplasta al favorito, alta abre lo raro.',
      revealHintEarly:
        'Así lo ve el modelo: las barras son la chance de cada token. Más adelante vas a poder jugar con la temperatura.',
      scoreLabel: 'Puntos',
      streakLabel: 'Racha',
      chaosScoreLabel: 'Caos',
      tempLabel: 'Temperatura',
      tempLow: 'segura',
      tempHigh: 'loca',
      tempHelp:
        'Baja: el modelo se aferra al favorito. Alta: reparte chance a tokens raros. Mové el slider y mirá cómo cambian las barras.',
      tempHelpBlind:
        'Elegí un token: al revelar vas a poder mover la temperatura y ver cómo se aplastan o se abren las probabilidades.',
      continue: 'Siguiente ronda',
      retry: 'Intentar de nuevo',
      chaosAgain: 'Otro caos',
      chaosNext: 'Siguiente caos',
      enterChaos: 'Entrar a CHAOS MODE',
      skipChaos: 'Terminar acá',
      finishChaos: 'Cerrar chaos y ver resultado',
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
          'Caos {{current}}/{{total}}. Subí la temperatura y elegí lo más absurdo.',
        chaosHitTitle: 'Absurdo registrado',
        chaosHitMessage:
          'Caos {{current}}/{{total}} · acumulado {{chaosScore}}. Siguiente contexto distinto.',
        chaosLastMessage:
          'Último caos · acumulado {{chaosScore}}. Cerrá y mirá tus métricas.',
        successTitle: 'Partida cerrada',
        successMessage:
          'Score {{score}} · racha {{bestStreak}} · caos {{chaosScore}}.',
      },
    },
    embeddings: {
      title: 'Embeddings',
      levelLabel: 'Nivel 2',
      subtitle: 'Encontrá el intruso',
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
      title: 'RAG',
      levelLabel: 'Nivel 3',
      subtitle: 'Tu IA está rota',
      cardDescription:
        'El bot de ACME Airlines inventa reembolsos. Arreglá el retrieval.',
      mission:
        'El bot ya respondió mal. Ajustá pedazo / cuántos / umbral hasta que entre la política real de reembolsos — y no la promo de 2019.',
      nightmareMission:
        'Desafío extra: el bot volvió a romperse peor, y el reloj corre. Objetivo: que responda bien el reembolso antes de que llegue a 0. Si se te acaba el tiempo, perdés esta ronda.',
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
      enterNightmare: 'Desafío NIGHTMARE: ¿lo arreglás en 60s?',
      retryNightmare: 'Reintentar NIGHTMARE',
      scoreLabel: 'Puntos',
      tokensLabel: 'Tokens contexto',
      included: 'entra al LLM',
      excluded: 'queda afuera',
      explanation:
        'RAG no reemplaza al LLM: primero busca pedazos relevantes y se los entrega como contexto. Si el contexto es malo (o es una promo vieja), el bot inventa con cara de seguro.',
      nightmareExplanation:
        'NIGHTMARE es la revancha contrarreloj: misma idea (arreglar el retrieval), pero empezás más roto y con 60s. Sirve para poner a prueba si entendiste los controles, no para “aprender algo nuevo”.',
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
          'No llegaste a arreglar el bot a tiempo. El fin de NIGHTMARE era simple: respuesta correcta de reembolso antes del 0. Reintentá.',
        successTitle: '¡El bot dejó de inventar!',
        successMessage:
          'El pedazo de reembolsos entró al LLM y la respuesta es usable. Eso es RAG.',
        nightmareSuccessTitle: 'NIGHTMARE superado',
        nightmareSuccessMessage:
          'Lo arreglaste contrarreloj. Mismo truco: contexto bueno → respuesta buena.',
      },
    },
    tools: {
      title: 'Tools',
      levelLabel: 'Nivel 4',
      subtitle: 'Dar acciones al modelo',
      cardDescription:
        'Construí la tool call correcta o decidí que no hace falta ninguna.',
      hook: 'El modelo sabe hablar. Ahora enseñale a hacer cosas.',
      mission:
        'Leé el pedido del usuario. Elegí una tool del catálogo (o NO TOOL), completá los args y ejecutá. Si te equivocás, Reintentar vuelve el mundo a como estaba.',
      nightmareMission:
        'El modelo ya armó una tool call rota. Encontrá el mismatch y el tipo inválido; reparala y ejecutá.',
      userLabel: 'Usuario',
      catalogLabel: 'Catálogo',
      builderLabel: 'Acción',
      noTool: 'NO TOOL',
      execute: 'Ejecutar',
      retry: 'Reintentar',
      nextMission: 'Siguiente misión',
      finishAct: 'Cerrar ACT y ver métricas',
      enterNightmare: 'Entrar a NIGHTMARE',
      skipNightmare: 'Terminar acá',
      nightmareBadge: 'NIGHTMARE',
      missionProgress: 'Misión {{current}} / {{total}}',
      argsLabel: 'Arguments',
      brokenCallLabel: 'Tool call del modelo',
      resultLabel: 'Resultado',
      metrics: {
        score: 'Puntos',
        toolSelection: 'Tool selection',
        argumentAccuracy: 'Argument accuracy',
        unnecessaryCalls: 'Unnecessary calls',
        precision: 'Precision',
        attempts: 'Attempts',
        time: 'Time',
      },
      catalog: {
        get_order: 'Obtiene información de un pedido',
        cancel_order: 'Cancela un pedido',
        refund_order: 'Reembolsa un pedido',
        change_address: 'Cambia la dirección de envío',
        search_products: 'Busca productos en el catálogo',
        get_weather: 'Consulta el clima de una ciudad',
        send_email: 'Envía un email',
      },
      args: {
        order_id: 'ID del pedido',
        address: 'Nueva dirección',
        query: 'Texto de búsqueda',
        city: 'Ciudad',
        to: 'Destinatario',
        subject: 'Asunto',
      },
      missions: {
        track_order: '¿Cuándo llega mi pedido #4821?',
        cancel_order: 'Cancelá mi pedido #8392.',
        change_address:
          'Cambiá la dirección del pedido #4821 a Bv. San Juan 500, Córdoba.',
        what_is_rag: '¿Qué es RAG?',
        search_products: '¿Tenés auriculares inalámbricos?',
      },
      nightmare: {
        userMessage: '¿Cuándo llega mi pedido #4821?',
      },
      explanation:
        'Un modelo con tools no “hace” cosas solo: elige una acción y el runtime la ejecuta. Tener herramientas no obliga a usarlas — Precision > spam de calls.',
      nightmareExplanation:
        'Debugging de tool calling: mismatch de intención + tipos de args. Así se rompen los agentes en producción.',
      feedback: {
        idleTitle: 'Armá la acción',
        idleMessage:
          'Elegí una tool del catálogo o NO TOOL, completá los argumentos y pulsá Ejecutar.',
        successTitle: 'SUCCESS',
        successMessage: 'La acción correcta se ejecutó en el mundo simulado.',
        noToolSuccessTitle: 'SUCCESS — NO TOOL',
        noToolSuccessMessage:
          'Respondés en texto. No hacía falta tocar ninguna herramienta.',
        unnecessaryTitle: 'UNNECESSARY TOOL CALL',
        unnecessaryMessage:
          'El usuario pidió información que el modelo puede responder directo. Tener una herramienta disponible no significa que haya que usarla.',
        needsToolTitle: 'Hacía falta una acción',
        needsToolMessage:
          'Acá el modelo no puede cumplir solo con texto. Elegí una tool del catálogo.',
        wrongToolTitle: 'TOOL MISMATCH',
        wrongToolMessage:
          'Esa tool no matchea la intención del usuario. Revisá el catálogo.',
        wrongArgsTitle: 'ARGUMENT ERROR',
        wrongArgsMessage:
          'La tool era razonable, pero los argumentos no. Ajustá IDs, nombres y valores.',
        toolErrorTitle: 'TOOL ERROR',
        missingArg: 'Falta el argumento requerido: {{arg}}',
        orderNotFound: 'No existe el pedido #{{id}}',
        actionExecutedTitle: 'ACTION EXECUTED',
        actionExecutedMessage:
          'La acción corrió… y cambió el mundo. No era lo que pedía el usuario. Usá Reintentar para volver al estado inicial de la misión.',
        toolMismatchTitle: 'TOOL MISMATCH',
        toolMismatchMessage:
          'refund_order no corresponde a lo que pidió el usuario.',
        invalidTypeTitle: 'INVALID ARGUMENT TYPE',
        invalidTypeMessage:
          'order_id debe ser string (p. ej. "4821"), no number.',
        nightmareDualTitle: 'TOOL MISMATCH + INVALID ARGUMENT TYPE',
        nightmareDualMessage:
          'Dos bugs a la vez: la tool no matchea la intención, y order_id tiene el tipo incorrecto.',
        nightmareSuccessTitle: 'NIGHTMARE superado',
        nightmareSuccessMessage:
          'Reparaste la call: tool correcta + tipo string. Así se debuggea un agente.',
      },
    },
    future: {
      locked: 'Nivel futuro — todavía no implementado.',
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
