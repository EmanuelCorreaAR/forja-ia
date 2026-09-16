import {
  NIGHTMARE_BROKEN,
  NIGHTMARE_EXPECTED,
  NIGHTMARE_INITIAL_WORLD,
  TOOLS_MISSIONS,
  cloneWorld,
  getToolDef,
} from '@/data/tools'
import type { EvaluationResult } from '@/domain/types'
import type {
  ExpectedCall,
  PlayerCall,
  ToolId,
  ToolsAction,
  ToolsChallengeState,
  ToolsMetrics,
  ToolsRunResult,
  WorldState,
} from './types'

function emptyMetrics(): ToolsMetrics {
  return {
    toolSelectionHits: 0,
    toolSelectionTotal: 0,
    argumentHits: 0,
    argumentTotal: 0,
    unnecessaryCalls: 0,
    precisionHits: 0,
    precisionTotal: 0,
  }
}

export function getCurrentMission(state: ToolsChallengeState) {
  return TOOLS_MISSIONS[state.missionIndex] ?? null
}

export function createInitialToolsState(startedAt = 0): ToolsChallengeState {
  const mission = TOOLS_MISSIONS[0]
  const world = cloneWorld(mission.initialWorld)
  return {
    mode: 'act',
    missionIndex: 0,
    missionWorld: world,
    world: cloneWorld(world),
    selected: null,
    attempts: 0,
    startedAt,
    actCompleted: false,
    nightmareCompleted: false,
    completed: false,
    lastRun: null,
    metrics: emptyMetrics(),
    nightmareDraft: null,
  }
}

function normalizeArgValue(value: string): string {
  return value.trim()
}

function argsMatch(
  expected: Record<string, string | number>,
  actual: Record<string, string>,
): boolean {
  const expectedKeys = Object.keys(expected)
  if (expectedKeys.length !== Object.keys(actual).length) return false
  return expectedKeys.every((key) => {
    const exp = expected[key]
    const got = actual[key]
    if (got == null) return false
    return String(exp) === normalizeArgValue(got)
  })
}

function applyTool(
  world: WorldState,
  toolId: ToolId,
  args: Record<string, string>,
): { world: WorldState; errorKey?: string; errorParams?: Record<string, string> } {
  const def = getToolDef(toolId)
  const next = cloneWorld(world)

  for (const arg of def.args) {
    if (arg.required && !normalizeArgValue(args[arg.name] ?? '')) {
      return {
        world,
        errorKey: 'levels.tools.feedback.missingArg',
        errorParams: { arg: arg.name },
      }
    }
  }

  switch (toolId) {
    case 'get_order': {
      const id = normalizeArgValue(args.order_id ?? '')
      if (!next.orders[id]) {
        return {
          world,
          errorKey: 'levels.tools.feedback.orderNotFound',
          errorParams: { id },
        }
      }
      return { world: next }
    }
    case 'cancel_order': {
      const id = normalizeArgValue(args.order_id ?? '')
      const order = next.orders[id]
      if (!order) {
        return {
          world,
          errorKey: 'levels.tools.feedback.orderNotFound',
          errorParams: { id },
        }
      }
      next.orders[id] = { ...order, status: 'cancelled' }
      return { world: next }
    }
    case 'refund_order': {
      const id = normalizeArgValue(args.order_id ?? '')
      const order = next.orders[id]
      if (!order) {
        return {
          world,
          errorKey: 'levels.tools.feedback.orderNotFound',
          errorParams: { id },
        }
      }
      next.orders[id] = { ...order, status: 'refunded' }
      return { world: next }
    }
    case 'change_address': {
      const id = normalizeArgValue(args.order_id ?? '')
      const address = normalizeArgValue(args.address ?? '')
      const order = next.orders[id]
      if (!order) {
        return {
          world,
          errorKey: 'levels.tools.feedback.orderNotFound',
          errorParams: { id },
        }
      }
      next.orders[id] = { ...order, address }
      return { world: next }
    }
    case 'search_products': {
      next.lastSearchQuery = normalizeArgValue(args.query ?? '')
      return { world: next }
    }
    case 'get_weather': {
      next.lastWeatherCity = normalizeArgValue(args.city ?? '')
      return { world: next }
    }
    case 'send_email': {
      next.emailsSent.push({
        to: normalizeArgValue(args.to ?? ''),
        subject: normalizeArgValue(args.subject ?? ''),
      })
      return { world: next }
    }
    default:
      return { world }
  }
}

function detailForSuccess(
  call: PlayerCall,
  world: WorldState,
): string[] {
  if (call.kind === 'no_tool') {
    return ['NO TOOL']
  }
  if (call.toolId === 'get_order') {
    const id = normalizeArgValue(call.args.order_id ?? '')
    const order = world.orders[id]
    if (!order) return []
    return [
      `Order #${order.id}`,
      `Status: ${order.status}`,
      `ETA: ${order.eta}`,
    ]
  }
  if (call.toolId === 'cancel_order') {
    const id = normalizeArgValue(call.args.order_id ?? '')
    return [`Order #${id}`, 'Status: cancelled']
  }
  if (call.toolId === 'change_address') {
    const id = normalizeArgValue(call.args.order_id ?? '')
    const order = world.orders[id]
    return [
      `Order #${id}`,
      `Address: ${order?.address ?? call.args.address}`,
    ]
  }
  if (call.toolId === 'search_products') {
    return [
      `Search: ${world.lastSearchQuery ?? call.args.query}`,
      'Results: auriculares inalámbricos · …',
    ]
  }
  return [`${call.toolId}(${JSON.stringify(call.args)})`]
}

function isDestructiveWrong(
  expected: ExpectedCall,
  call: PlayerCall,
  worldBefore: WorldState,
  worldAfter: WorldState,
): boolean {
  if (call.kind !== 'tool') return false
  if (expected.kind === 'no_tool') return false
  if (call.toolId === expected.toolId && argsMatch(expected.args, call.args)) {
    return false
  }
  const mutating: ToolId[] = [
    'cancel_order',
    'refund_order',
    'change_address',
    'send_email',
  ]
  if (!mutating.includes(call.toolId)) return false
  return JSON.stringify(worldBefore) !== JSON.stringify(worldAfter)
}

export function runPlayerCall(
  world: WorldState,
  expected: ExpectedCall,
  call: PlayerCall,
  options?: { nightmare?: boolean },
): ToolsRunResult {
  if (options?.nightmare) {
    return runNightmareCall(world, call)
  }

  if (expected.kind === 'no_tool') {
    if (call.kind === 'no_tool') {
      return {
        outcome: 'success',
        call,
        worldAfter: cloneWorld(world),
        titleKey: 'levels.tools.feedback.noToolSuccessTitle',
        messageKey: 'levels.tools.feedback.noToolSuccessMessage',
        detailLines: ['NO TOOL'],
        toolSelectionOk: true,
        argumentAccuracyOk: true,
        unnecessary: false,
        precise: true,
      }
    }
    const applied = applyTool(world, call.toolId, call.args)
    return {
      outcome: 'unnecessary_call',
      call,
      worldAfter: applied.world,
      titleKey: 'levels.tools.feedback.unnecessaryTitle',
      messageKey: 'levels.tools.feedback.unnecessaryMessage',
      detailLines: [
        `${call.toolId}(${JSON.stringify(call.args)})`,
      ],
      toolSelectionOk: false,
      argumentAccuracyOk: false,
      unnecessary: true,
      precise: false,
    }
  }

  if (call.kind === 'no_tool') {
    return {
      outcome: 'wrong_tool',
      call,
      worldAfter: cloneWorld(world),
      titleKey: 'levels.tools.feedback.needsToolTitle',
      messageKey: 'levels.tools.feedback.needsToolMessage',
      toolSelectionOk: false,
      argumentAccuracyOk: false,
      unnecessary: false,
      precise: false,
    }
  }

  const applied = applyTool(world, call.toolId, call.args)
  if (applied.errorKey) {
    return {
      outcome: 'tool_error',
      call,
      worldAfter: world,
      titleKey: 'levels.tools.feedback.toolErrorTitle',
      messageKey: applied.errorKey,
      messageParams: applied.errorParams,
      detailLines: [
        `${call.toolId}(${JSON.stringify(call.args)})`,
      ],
      toolSelectionOk: call.toolId === expected.toolId,
      argumentAccuracyOk: false,
      unnecessary: false,
      precise: false,
    }
  }

  const toolOk = call.toolId === expected.toolId
  const argsOk = toolOk && argsMatch(expected.args, call.args)
  const precise = toolOk && argsOk

  if (precise) {
    return {
      outcome: 'success',
      call,
      worldAfter: applied.world,
      titleKey: 'levels.tools.feedback.successTitle',
      messageKey: 'levels.tools.feedback.successMessage',
      detailLines: detailForSuccess(call, applied.world),
      toolSelectionOk: true,
      argumentAccuracyOk: true,
      unnecessary: false,
      precise: true,
    }
  }

  if (isDestructiveWrong(expected, call, world, applied.world)) {
    return {
      outcome: 'action_executed',
      call,
      worldAfter: applied.world,
      titleKey: 'levels.tools.feedback.actionExecutedTitle',
      messageKey: 'levels.tools.feedback.actionExecutedMessage',
      detailLines: detailForSuccess(call, applied.world),
      toolSelectionOk: toolOk,
      argumentAccuracyOk: argsOk,
      unnecessary: false,
      precise: false,
    }
  }

  if (!toolOk) {
    return {
      outcome: 'wrong_tool',
      call,
      worldAfter: applied.world,
      titleKey: 'levels.tools.feedback.wrongToolTitle',
      messageKey: 'levels.tools.feedback.wrongToolMessage',
      detailLines: [
        `${call.toolId}(${JSON.stringify(call.args)})`,
      ],
      toolSelectionOk: false,
      argumentAccuracyOk: false,
      unnecessary: false,
      precise: false,
    }
  }

  return {
    outcome: 'wrong_args',
    call,
    worldAfter: applied.world,
    titleKey: 'levels.tools.feedback.wrongArgsTitle',
    messageKey: 'levels.tools.feedback.wrongArgsMessage',
    detailLines: [
      `${call.toolId}(${JSON.stringify(call.args)})`,
    ],
    toolSelectionOk: true,
    argumentAccuracyOk: false,
    unnecessary: false,
    precise: false,
  }
}

function runNightmareCall(
  world: WorldState,
  call: PlayerCall,
): ToolsRunResult {
  const expected = NIGHTMARE_EXPECTED
  const issues: Array<'tool_mismatch' | 'invalid_arg_type'> = []

  if (call.kind === 'no_tool') {
    return {
      outcome: 'wrong_tool',
      call,
      worldAfter: cloneWorld(world),
      titleKey: 'levels.tools.feedback.needsToolTitle',
      messageKey: 'levels.tools.feedback.needsToolMessage',
      toolSelectionOk: false,
      argumentAccuracyOk: false,
      unnecessary: false,
      precise: false,
      nightmareIssues: ['tool_mismatch'],
    }
  }

  // Detect leftover type issues if still using number-looking values incorrectly
  // In our UI args are strings; nightmare draft starts with number — conversion
  // via SET_ARG stores strings. We still validate expected string semantics.

  if (call.toolId !== expected.toolId) {
    issues.push('tool_mismatch')
  }

  const orderIdRaw = call.args.order_id
  // If player somehow kept a numeric-only representation without quotes in draft,
  // we treat non-string-looking empty as invalid. For nightmare repair UI,
  // args are strings; type fix = ensuring value is the string "4821".
  const typeOk =
    orderIdRaw != null &&
    typeof orderIdRaw === 'string' &&
    normalizeArgValue(orderIdRaw) === '4821'

  // Invalid type: if draft still has number in nightmareDraft before string coerce —
  // when executing from PlayerCall all args are strings. We mark invalid_arg_type
  // when order_id is missing or not exactly "4821" while tool is get_order path,
  // OR when tool is still refund with wrong type semantics from draft execution.

  const applied = applyTool(world, call.toolId, call.args)

  if (call.toolId === 'refund_order' || call.toolId !== expected.toolId) {
    if (!issues.includes('tool_mismatch')) issues.push('tool_mismatch')
  }

  if (!typeOk) {
    issues.push('invalid_arg_type')
  }

  if (issues.length > 0) {
    const primary =
      issues[0] === 'tool_mismatch' ? 'tool_mismatch' : 'invalid_arg_type'
    return {
      outcome: primary,
      call,
      worldAfter: applied.errorKey ? world : applied.world,
      titleKey:
        issues.length > 1
          ? 'levels.tools.feedback.nightmareDualTitle'
          : primary === 'tool_mismatch'
            ? 'levels.tools.feedback.toolMismatchTitle'
            : 'levels.tools.feedback.invalidTypeTitle',
      messageKey:
        issues.length > 1
          ? 'levels.tools.feedback.nightmareDualMessage'
          : primary === 'tool_mismatch'
            ? 'levels.tools.feedback.toolMismatchMessage'
            : 'levels.tools.feedback.invalidTypeMessage',
      detailLines: [
        `${call.toolId}(${JSON.stringify(call.args)})`,
        ...issues.map((i) =>
          i === 'tool_mismatch' ? 'TOOL MISMATCH' : 'INVALID ARGUMENT TYPE',
        ),
      ],
      toolSelectionOk: !issues.includes('tool_mismatch'),
      argumentAccuracyOk: !issues.includes('invalid_arg_type'),
      unnecessary: false,
      precise: false,
      nightmareIssues: issues,
    }
  }

  if (applied.errorKey) {
    return {
      outcome: 'tool_error',
      call,
      worldAfter: world,
      titleKey: 'levels.tools.feedback.toolErrorTitle',
      messageKey: applied.errorKey,
      messageParams: applied.errorParams,
      toolSelectionOk: true,
      argumentAccuracyOk: false,
      unnecessary: false,
      precise: false,
    }
  }

  const precise =
    call.toolId === expected.toolId &&
    argsMatch(expected.args, call.args)

  if (!precise) {
    return {
      outcome: 'wrong_args',
      call,
      worldAfter: applied.world,
      titleKey: 'levels.tools.feedback.wrongArgsTitle',
      messageKey: 'levels.tools.feedback.wrongArgsMessage',
      toolSelectionOk: call.toolId === expected.toolId,
      argumentAccuracyOk: false,
      unnecessary: false,
      precise: false,
    }
  }

  return {
    outcome: 'success',
    call,
    worldAfter: applied.world,
    titleKey: 'levels.tools.feedback.nightmareSuccessTitle',
    messageKey: 'levels.tools.feedback.nightmareSuccessMessage',
    detailLines: detailForSuccess(call, applied.world),
    toolSelectionOk: true,
    argumentAccuracyOk: true,
    unnecessary: false,
    precise: true,
  }
}

function recordMetrics(
  metrics: ToolsMetrics,
  run: ToolsRunResult,
): ToolsMetrics {
  const next = { ...metrics }
  next.toolSelectionTotal += 1
  if (run.toolSelectionOk) next.toolSelectionHits += 1
  next.argumentTotal += 1
  if (run.argumentAccuracyOk) next.argumentHits += 1
  next.precisionTotal += 1
  if (run.precise) next.precisionHits += 1
  if (run.unnecessary) next.unnecessaryCalls += 1
  return next
}

function emptyArgsForTool(toolId: ToolId): Record<string, string> {
  const def = getToolDef(toolId)
  return Object.fromEntries(def.args.map((a) => [a.name, '']))
}

export function reduceToolsState(
  state: ToolsChallengeState,
  action: ToolsAction,
): ToolsChallengeState {
  switch (action.type) {
    case 'RESET':
      return createInitialToolsState(state.startedAt)

    case 'SELECT_TOOL': {
      if (state.completed || state.lastRun?.precise) return state
      if (state.mode !== 'act') return state
      return {
        ...state,
        selected: {
          kind: 'tool',
          toolId: action.toolId,
          args: emptyArgsForTool(action.toolId),
        },
        lastRun: null,
      }
    }

    case 'SELECT_NO_TOOL': {
      if (state.completed || state.lastRun?.precise) return state
      if (state.mode !== 'act') return state
      return {
        ...state,
        selected: { kind: 'no_tool' },
        lastRun: null,
      }
    }

    case 'SET_ARG': {
      if (state.completed || state.lastRun?.precise) return state
      if (state.mode !== 'act') return state
      if (!state.selected || state.selected.kind !== 'tool') return state
      return {
        ...state,
        selected: {
          ...state.selected,
          args: {
            ...state.selected.args,
            [action.name]: action.value,
          },
        },
        lastRun: null,
      }
    }

    case 'EXECUTE': {
      if (state.completed) return state
      if (state.mode === 'nightmare') {
        return executeNightmare(state)
      }
      if (!state.selected) return state
      const mission = getCurrentMission(state)
      if (!mission) return state
      const run = runPlayerCall(
        state.world,
        mission.expected,
        state.selected,
      )
      const success = run.precise
      return {
        ...state,
        world: run.worldAfter,
        attempts: success ? state.attempts : state.attempts + 1,
        lastRun: run,
        metrics: recordMetrics(state.metrics, run),
      }
    }

    case 'RETRY': {
      if (state.completed) return state
      if (state.mode === 'nightmare') {
        return {
          ...state,
          world: cloneWorld(NIGHTMARE_INITIAL_WORLD),
          missionWorld: cloneWorld(NIGHTMARE_INITIAL_WORLD),
          lastRun: null,
          nightmareDraft: {
            toolId: NIGHTMARE_BROKEN.toolId,
            args: { ...NIGHTMARE_BROKEN.args },
          },
          selected: null,
        }
      }
      return {
        ...state,
        world: cloneWorld(state.missionWorld),
        lastRun: null,
        selected: null,
      }
    }

    case 'NEXT_MISSION': {
      if (state.mode !== 'act') return state
      if (!state.lastRun?.precise) return state
      const nextIndex = state.missionIndex + 1
      if (nextIndex >= TOOLS_MISSIONS.length) {
        return {
          ...state,
          actCompleted: true,
          completed: true,
        }
      }
      const mission = TOOLS_MISSIONS[nextIndex]
      const world = cloneWorld(mission.initialWorld)
      return {
        ...state,
        missionIndex: nextIndex,
        missionWorld: world,
        world: cloneWorld(world),
        selected: null,
        lastRun: null,
      }
    }

    case 'ENTER_NIGHTMARE': {
      if (!state.actCompleted || state.nightmareCompleted) return state
      const world = cloneWorld(NIGHTMARE_INITIAL_WORLD)
      return {
        ...state,
        mode: 'nightmare',
        completed: false,
        world,
        missionWorld: cloneWorld(world),
        selected: null,
        lastRun: null,
        attempts: 0,
        nightmareDraft: {
          toolId: NIGHTMARE_BROKEN.toolId,
          args: { ...NIGHTMARE_BROKEN.args },
        },
      }
    }

    case 'NIGHTMARE_SET_TOOL': {
      if (state.mode !== 'nightmare' || state.completed) return state
      if (!state.nightmareDraft) return state
      return {
        ...state,
        nightmareDraft: {
          toolId: action.toolId,
          args: {
            ...emptyArgsForTool(action.toolId),
            ...Object.fromEntries(
              Object.entries(state.nightmareDraft.args).filter(([k]) =>
                getToolDef(action.toolId).args.some((a) => a.name === k),
              ),
            ),
          },
        },
        lastRun: null,
      }
    }

    case 'NIGHTMARE_SET_ARG': {
      if (state.mode !== 'nightmare' || state.completed) return state
      if (!state.nightmareDraft) return state
      return {
        ...state,
        nightmareDraft: {
          ...state.nightmareDraft,
          args: {
            ...state.nightmareDraft.args,
            [action.name]: action.value,
          },
        },
        lastRun: null,
      }
    }

    case 'NIGHTMARE_SET_NO_TOOL': {
      if (state.mode !== 'nightmare' || state.completed) return state
      return {
        ...state,
        nightmareDraft: null,
        selected: { kind: 'no_tool' },
        lastRun: null,
      }
    }

    default:
      return state
  }
}

function executeNightmare(state: ToolsChallengeState): ToolsChallengeState {
  if (state.selected?.kind === 'no_tool') {
    const run = runPlayerCall(
      state.world,
      NIGHTMARE_EXPECTED,
      { kind: 'no_tool' },
      { nightmare: true },
    )
    return {
      ...state,
      world: run.worldAfter,
      attempts: state.attempts + 1,
      lastRun: run,
    }
  }

  const draft = state.nightmareDraft
  if (!draft) return state

  const issues: Array<'tool_mismatch' | 'invalid_arg_type'> = []
  if (draft.toolId !== NIGHTMARE_EXPECTED.toolId) {
    issues.push('tool_mismatch')
  }
  const orderId = draft.args.order_id
  const typeOk = typeof orderId === 'string' && orderId.trim() === '4821'
  if (!typeOk) {
    issues.push('invalid_arg_type')
  }

  if (issues.length > 0) {
    const run: ToolsRunResult = {
      outcome:
        issues.length > 1
          ? 'tool_mismatch'
          : issues[0] === 'tool_mismatch'
            ? 'tool_mismatch'
            : 'invalid_arg_type',
      call: {
        kind: 'tool',
        toolId: draft.toolId,
        args: Object.fromEntries(
          Object.entries(draft.args).map(([k, v]) => [k, String(v)]),
        ),
      },
      worldAfter: cloneWorld(state.world),
      titleKey:
        issues.length > 1
          ? 'levels.tools.feedback.nightmareDualTitle'
          : issues[0] === 'tool_mismatch'
            ? 'levels.tools.feedback.toolMismatchTitle'
            : 'levels.tools.feedback.invalidTypeTitle',
      messageKey:
        issues.length > 1
          ? 'levels.tools.feedback.nightmareDualMessage'
          : issues[0] === 'tool_mismatch'
            ? 'levels.tools.feedback.toolMismatchMessage'
            : 'levels.tools.feedback.invalidTypeMessage',
      detailLines: [
        `${draft.toolId}(${JSON.stringify(draft.args)})`,
        ...issues.map((i) =>
          i === 'tool_mismatch' ? 'TOOL MISMATCH' : 'INVALID ARGUMENT TYPE',
        ),
      ],
      toolSelectionOk: !issues.includes('tool_mismatch'),
      argumentAccuracyOk: !issues.includes('invalid_arg_type'),
      unnecessary: false,
      precise: false,
      nightmareIssues: issues,
    }
    return {
      ...state,
      attempts: state.attempts + 1,
      lastRun: run,
    }
  }

  const call: PlayerCall = {
    kind: 'tool',
    toolId: draft.toolId,
    args: Object.fromEntries(
      Object.entries(draft.args).map(([k, v]) => [k, String(v)]),
    ),
  }
  const run = runPlayerCall(state.world, NIGHTMARE_EXPECTED, call, {
    nightmare: true,
  })
  const success = run.precise
  return {
    ...state,
    world: run.worldAfter,
    attempts: success ? state.attempts : state.attempts + 1,
    lastRun: run,
    completed: success,
    nightmareCompleted: success ? true : state.nightmareCompleted,
  }
}

export function computeToolsScore(
  metrics: ToolsMetrics,
  attempts: number,
  elapsedMs: number,
): number {
  const toolSel =
    metrics.toolSelectionTotal === 0
      ? 1
      : metrics.toolSelectionHits / metrics.toolSelectionTotal
  const argAcc =
    metrics.argumentTotal === 0
      ? 1
      : metrics.argumentHits / metrics.argumentTotal
  const precision =
    metrics.precisionTotal === 0
      ? 1
      : metrics.precisionHits / metrics.precisionTotal

  const base = 10000
  const precisionWeight = Math.round(precision * 5000)
  const selectionWeight = Math.round(toolSel * 2000)
  const argWeight = Math.round(argAcc * 2000)
  const unnecessaryPenalty = metrics.unnecessaryCalls * 800
  const attemptPenalty = Math.max(0, attempts - 5) * 120
  const timePenalty = Math.min(800, Math.floor(elapsedMs / 1000) * 8)

  return Math.max(
    1200,
    base -
      (5000 - precisionWeight) -
      (2000 - selectionWeight) -
      (2000 - argWeight) -
      unnecessaryPenalty -
      attemptPenalty -
      timePenalty,
  )
}

export function percent(hits: number, total: number): number {
  if (total === 0) return 100
  return Math.round((hits / total) * 100)
}

export function evaluateTools(state: ToolsChallengeState): EvaluationResult {
  if (state.lastRun) {
    const toneStatus = state.lastRun.precise
      ? 'success'
      : state.lastRun.outcome === 'idle'
        ? 'incomplete'
        : 'failed'
    return {
      status: toneStatus,
      titleKey: state.lastRun.titleKey,
      messageKey: state.lastRun.messageKey,
      messageParams: state.lastRun.messageParams,
      metrics: {
        attempts: state.attempts,
        elapsedMs: 0,
        score: computeToolsScore(state.metrics, state.attempts, 0),
      },
    }
  }

  return {
    status: 'incomplete',
    titleKey: 'levels.tools.feedback.idleTitle',
    messageKey: 'levels.tools.feedback.idleMessage',
  }
}
