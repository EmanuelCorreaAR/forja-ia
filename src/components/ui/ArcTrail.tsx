import { Fragment } from 'react'
import { Term } from '@/components/ui/Term'

const ARC_STEPS = ['generate', 'find', 'retrieve', 'act'] as const

export function ArcTrail() {
  return (
    <p className="mono muted arc-trail">
      {ARC_STEPS.map((step, index) => (
        <Fragment key={step}>
          {index > 0 ? <span className="arc-trail__sep">→</span> : null}
          <Term id={step} />
        </Fragment>
      ))}
    </p>
  )
}
