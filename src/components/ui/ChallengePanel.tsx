type ChallengePanelProps = {
  children: React.ReactNode
  className?: string
}

export function ChallengePanel({ children, className }: ChallengePanelProps) {
  return <div className={`challenge-panel ${className ?? ''}`}>{children}</div>
}
