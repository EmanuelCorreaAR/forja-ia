import type {
  Mission,
  NightmareDraft,
  ToolDef,
  ToolId,
  WorldState,
} from '@/domain/levels/tools/types'

export const TOOLS_COMPANY = 'ACME Shop'

function cloneWorld(world: WorldState): WorldState {
  return {
    orders: Object.fromEntries(
      Object.entries(world.orders).map(([id, order]) => [
        id,
        { ...order },
      ]),
    ),
    emailsSent: world.emailsSent.map((e) => ({ ...e })),
    lastSearchQuery: world.lastSearchQuery,
    lastWeatherCity: world.lastWeatherCity,
  }
}

export { cloneWorld }

const BASE_ORDERS: WorldState['orders'] = {
  '4821': {
    id: '4821',
    status: 'shipped',
    eta: '18 de septiembre',
    address: 'Calle Falsa 123, Córdoba',
    productHint: 'Auriculares inalámbricos',
  },
  '8392': {
    id: '8392',
    status: 'processing',
    eta: '22 de septiembre',
    address: 'Av. Siempre Viva 742, Rosario',
    productHint: 'Teclado mecánico',
  },
}

export function makeShopWorld(
  overrides?: Partial<WorldState>,
): WorldState {
  return cloneWorld({
    orders: { ...BASE_ORDERS },
    emailsSent: [],
    lastSearchQuery: null,
    lastWeatherCity: null,
    ...overrides,
  })
}

export const TOOLS_CATALOG: ToolDef[] = [
  {
    id: 'get_order',
    descriptionKey: 'levels.tools.catalog.get_order',
    args: [
      {
        name: 'order_id',
        type: 'string',
        required: true,
        descriptionKey: 'levels.tools.args.order_id',
      },
    ],
  },
  {
    id: 'cancel_order',
    descriptionKey: 'levels.tools.catalog.cancel_order',
    args: [
      {
        name: 'order_id',
        type: 'string',
        required: true,
        descriptionKey: 'levels.tools.args.order_id',
      },
    ],
  },
  {
    id: 'refund_order',
    descriptionKey: 'levels.tools.catalog.refund_order',
    args: [
      {
        name: 'order_id',
        type: 'string',
        required: true,
        descriptionKey: 'levels.tools.args.order_id',
      },
    ],
  },
  {
    id: 'change_address',
    descriptionKey: 'levels.tools.catalog.change_address',
    args: [
      {
        name: 'order_id',
        type: 'string',
        required: true,
        descriptionKey: 'levels.tools.args.order_id',
      },
      {
        name: 'address',
        type: 'string',
        required: true,
        descriptionKey: 'levels.tools.args.address',
      },
    ],
  },
  {
    id: 'search_products',
    descriptionKey: 'levels.tools.catalog.search_products',
    args: [
      {
        name: 'query',
        type: 'string',
        required: true,
        descriptionKey: 'levels.tools.args.query',
      },
    ],
  },
  {
    id: 'get_weather',
    descriptionKey: 'levels.tools.catalog.get_weather',
    args: [
      {
        name: 'city',
        type: 'string',
        required: true,
        descriptionKey: 'levels.tools.args.city',
      },
    ],
  },
  {
    id: 'send_email',
    descriptionKey: 'levels.tools.catalog.send_email',
    args: [
      {
        name: 'to',
        type: 'string',
        required: true,
        descriptionKey: 'levels.tools.args.to',
      },
      {
        name: 'subject',
        type: 'string',
        required: true,
        descriptionKey: 'levels.tools.args.subject',
      },
    ],
  },
]

export function getToolDef(id: ToolId): ToolDef {
  const tool = TOOLS_CATALOG.find((t) => t.id === id)
  if (!tool) throw new Error(`Unknown tool: ${id}`)
  return tool
}

export const TOOLS_MISSIONS: Mission[] = [
  {
    id: 'track_order',
    userMessageKey: 'levels.tools.missions.track_order',
    expected: {
      kind: 'tool',
      toolId: 'get_order',
      args: { order_id: '4821' },
    },
    catalog: [
      'get_order',
      'cancel_order',
      'search_products',
      'get_weather',
    ],
    initialWorld: makeShopWorld(),
  },
  {
    id: 'cancel_order',
    userMessageKey: 'levels.tools.missions.cancel_order',
    expected: {
      kind: 'tool',
      toolId: 'cancel_order',
      args: { order_id: '8392' },
    },
    catalog: [
      'get_order',
      'cancel_order',
      'refund_order',
      'send_email',
    ],
    initialWorld: makeShopWorld(),
  },
  {
    id: 'change_address',
    userMessageKey: 'levels.tools.missions.change_address',
    expected: {
      kind: 'tool',
      toolId: 'change_address',
      args: {
        order_id: '4821',
        address: 'Bv. San Juan 500, Córdoba',
      },
    },
    catalog: [
      'change_address',
      'cancel_order',
      'get_order',
      'send_email',
    ],
    initialWorld: makeShopWorld(),
    addressHint: 'Bv. San Juan 500, Córdoba',
  },
  {
    id: 'what_is_rag',
    userMessageKey: 'levels.tools.missions.what_is_rag',
    expected: { kind: 'no_tool' },
    catalog: [
      'get_order',
      'search_products',
      'get_weather',
      'send_email',
    ],
    initialWorld: makeShopWorld(),
  },
  {
    id: 'search_products',
    userMessageKey: 'levels.tools.missions.search_products',
    expected: {
      kind: 'tool',
      toolId: 'search_products',
      args: { query: 'auriculares inalámbricos' },
    },
    catalog: [
      'search_products',
      'get_order',
      'get_weather',
      'cancel_order',
    ],
    initialWorld: makeShopWorld(),
  },
]

/** User asked for order status; model wrongly tried a typed refund */
export const NIGHTMARE_USER_MESSAGE_KEY =
  'levels.tools.nightmare.userMessage'

export const NIGHTMARE_EXPECTED = {
  kind: 'tool' as const,
  toolId: 'get_order' as const,
  args: { order_id: '4821' as string | number },
}

export const NIGHTMARE_BROKEN: NightmareDraft = {
  toolId: 'refund_order',
  args: { order_id: 4821 },
}

export const NIGHTMARE_CATALOG: ToolId[] = [
  'get_order',
  'cancel_order',
  'refund_order',
  'search_products',
]

export const NIGHTMARE_INITIAL_WORLD = makeShopWorld()
