import { describe, expect, it } from 'vitest'
import { TOOLS_MISSIONS } from '@/data/tools'
import {
  createInitialToolsState,
  reduceToolsState,
  runPlayerCall,
} from '@/domain/levels/tools/evaluate'

describe('Tools ACT', () => {
  it('succeeds get_order for track mission', () => {
    const mission = TOOLS_MISSIONS[0]
    const run = runPlayerCall(mission.initialWorld, mission.expected, {
      kind: 'tool',
      toolId: 'get_order',
      args: { order_id: '4821' },
    })
    expect(run.precise).toBe(true)
    expect(run.outcome).toBe('success')
  })

  it('flags unnecessary tool on what_is_rag', () => {
    const mission = TOOLS_MISSIONS[3]
    const run = runPlayerCall(mission.initialWorld, mission.expected, {
      kind: 'tool',
      toolId: 'get_weather',
      args: { city: 'Córdoba' },
    })
    expect(run.outcome).toBe('unnecessary_call')
    expect(run.unnecessary).toBe(true)
    expect(run.titleKey).toContain('unnecessary')
  })

  it('accepts NO TOOL on what_is_rag', () => {
    const mission = TOOLS_MISSIONS[3]
    const run = runPlayerCall(mission.initialWorld, mission.expected, {
      kind: 'no_tool',
    })
    expect(run.precise).toBe(true)
  })

  it('shows action_executed on wrong cancel and RETRY restores world', () => {
    let state = createInitialToolsState()
    // Jump to change_address mission (index 2)
    state = {
      ...state,
      missionIndex: 2,
      missionWorld: TOOLS_MISSIONS[2].initialWorld,
      world: structuredClone(TOOLS_MISSIONS[2].initialWorld),
    }
    state = reduceToolsState(state, {
      type: 'SELECT_TOOL',
      toolId: 'cancel_order',
    })
    state = reduceToolsState(state, {
      type: 'SET_ARG',
      name: 'order_id',
      value: '4821',
    })
    state = reduceToolsState(state, { type: 'EXECUTE' })
    expect(state.lastRun?.outcome).toBe('action_executed')
    expect(state.world.orders['4821'].status).toBe('cancelled')

    state = reduceToolsState(state, { type: 'RETRY' })
    expect(state.world.orders['4821'].status).toBe('shipped')
    expect(state.lastRun).toBeNull()
  })

  it('completes ACT after five precise missions', () => {
    let state = createInitialToolsState()
    const answers = [
      {
        kind: 'tool' as const,
        toolId: 'get_order' as const,
        args: { order_id: '4821' },
      },
      {
        kind: 'tool' as const,
        toolId: 'cancel_order' as const,
        args: { order_id: '8392' },
      },
      {
        kind: 'tool' as const,
        toolId: 'change_address' as const,
        args: {
          order_id: '4821',
          address: 'Bv. San Juan 500, Córdoba',
        },
      },
      { kind: 'no_tool' as const },
      {
        kind: 'tool' as const,
        toolId: 'search_products' as const,
        args: { query: 'auriculares inalámbricos' },
      },
    ]

    for (const answer of answers) {
      if (answer.kind === 'no_tool') {
        state = reduceToolsState(state, { type: 'SELECT_NO_TOOL' })
      } else {
        state = reduceToolsState(state, {
          type: 'SELECT_TOOL',
          toolId: answer.toolId,
        })
        for (const [name, value] of Object.entries(answer.args)) {
          state = reduceToolsState(state, {
            type: 'SET_ARG',
            name,
            value,
          })
        }
      }
      state = reduceToolsState(state, { type: 'EXECUTE' })
      expect(state.lastRun?.precise).toBe(true)
      state = reduceToolsState(state, { type: 'NEXT_MISSION' })
    }

    expect(state.actCompleted).toBe(true)
    expect(state.completed).toBe(true)
  })
})

describe('Tools NIGHTMARE', () => {
  it('reports dual issues on broken refund draft', () => {
    let state = createInitialToolsState()
    // Force act completed
    state = { ...state, actCompleted: true, completed: true }
    state = reduceToolsState(state, { type: 'ENTER_NIGHTMARE' })
    expect(state.mode).toBe('nightmare')
    expect(state.nightmareDraft?.toolId).toBe('refund_order')
    expect(typeof state.nightmareDraft?.args.order_id).toBe('number')

    state = reduceToolsState(state, { type: 'EXECUTE' })
    expect(state.lastRun?.precise).toBe(false)
    expect(state.lastRun?.nightmareIssues).toEqual([
      'tool_mismatch',
      'invalid_arg_type',
    ])
  })

  it('succeeds after fixing tool and type', () => {
    let state = createInitialToolsState()
    state = { ...state, actCompleted: true, completed: true }
    state = reduceToolsState(state, { type: 'ENTER_NIGHTMARE' })
    state = reduceToolsState(state, {
      type: 'NIGHTMARE_SET_TOOL',
      toolId: 'get_order',
    })
    state = reduceToolsState(state, {
      type: 'NIGHTMARE_SET_ARG',
      name: 'order_id',
      value: '4821',
    })
    state = reduceToolsState(state, { type: 'EXECUTE' })
    expect(state.lastRun?.precise).toBe(true)
    expect(state.nightmareCompleted).toBe(true)
  })
})
