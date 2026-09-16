export type ArgType = 'string' | 'number'

export type ToolArgDef = {
  name: string
  type: ArgType
  required: boolean
  descriptionKey: string
}

export type ToolId =
  | 'get_order'
  | 'cancel_order'
  | 'refund_order'
  | 'change_address'
  | 'search_products'
  | 'get_weather'
  | 'send_email'

export type ToolDef = {
  id: ToolId
  descriptionKey: string
  args: ToolArgDef[]
}

export type OrderStatus =
  | 'processing'
  | 'shipped'
  | 'delivered'
  | 'cancelled'
  | 'refunded'

export type Order = {
  id: string
  status: OrderStatus
  eta: string
  address: string
  productHint: string
}

export type WorldState = {
  orders: Record<string, Order>
  emailsSent: Array<{ to: string; subject: string }>
  lastSearchQuery: string | null
  lastWeatherCity: string | null
}

export type ExpectedCall =
  | { kind: 'no_tool' }
  | {
      kind: 'tool'
      toolId: ToolId
      args: Record<string, string | number>
    }

export type MissionId =
  | 'track_order'
  | 'cancel_order'
  | 'change_address'
  | 'what_is_rag'
  | 'search_products'

export type Mission = {
  id: MissionId
  userMessageKey: string
  expected: ExpectedCall
  /** Keys into TOOLS_CATALOG — which tools appear for this mission */
  catalog: ToolId[]
  initialWorld: WorldState
  /** Optional address preset for change_address mission */
  addressHint?: string
}

export type ToolsMode = 'act' | 'nightmare'

export type PlayerCall =
  | { kind: 'no_tool' }
  | {
      kind: 'tool'
      toolId: ToolId
      args: Record<string, string>
    }

export type RunOutcomeKind =
  | 'success'
  | 'tool_error'
  | 'action_executed'
  | 'unnecessary_call'
  | 'wrong_tool'
  | 'wrong_args'
  | 'tool_mismatch'
  | 'invalid_arg_type'
  | 'idle'

export type ToolsRunResult = {
  outcome: RunOutcomeKind
  call: PlayerCall | null
  worldAfter: WorldState
  titleKey: string
  messageKey: string
  messageParams?: Record<string, string | number>
  detailLines?: string[]
  toolSelectionOk: boolean
  argumentAccuracyOk: boolean
  unnecessary: boolean
  precise: boolean
  nightmareIssues?: Array<'tool_mismatch' | 'invalid_arg_type'>
}

export type ToolsChallengeState = {
  mode: ToolsMode
  missionIndex: number
  /** Snapshot at mission start — RETRY restores this */
  missionWorld: WorldState
  world: WorldState
  selected: PlayerCall | null
  attempts: number
  startedAt: number
  actCompleted: boolean
  nightmareCompleted: boolean
  completed: boolean
  lastRun: ToolsRunResult | null
  /** Accumulated metrics across ACT missions */
  metrics: ToolsMetrics
  nightmareDraft: NightmareDraft | null
}

export type NightmareDraft = {
  toolId: ToolId
  /** Raw arg values as the broken model emitted them */
  args: Record<string, string | number>
}

export type ToolsMetrics = {
  toolSelectionHits: number
  toolSelectionTotal: number
  argumentHits: number
  argumentTotal: number
  unnecessaryCalls: number
  precisionHits: number
  precisionTotal: number
}

export type ToolsAction =
  | { type: 'SELECT_TOOL'; toolId: ToolId }
  | { type: 'SELECT_NO_TOOL' }
  | { type: 'SET_ARG'; name: string; value: string }
  | { type: 'EXECUTE' }
  | { type: 'RETRY' }
  | { type: 'NEXT_MISSION' }
  | { type: 'ENTER_NIGHTMARE' }
  | { type: 'NIGHTMARE_SET_TOOL'; toolId: ToolId }
  | { type: 'NIGHTMARE_SET_ARG'; name: string; value: string }
  | { type: 'NIGHTMARE_SET_NO_TOOL' }
  | { type: 'RESET' }
