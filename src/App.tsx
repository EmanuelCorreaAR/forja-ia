import { Navigate, Route, Routes } from 'react-router-dom'
import { AppShell } from '@/components/layout/AppShell'
import { HomePage } from '@/pages/HomePage'
import { Level1LLMPage } from '@/pages/Level1LLMPage'
import { Level2EmbeddingsPage } from '@/pages/Level2EmbeddingsPage'
import { Level3RAGPage } from '@/pages/Level3RAGPage'
import { useProgress } from '@/context/ProgressContext'

function GuardedLevel({
  id,
  children,
}: {
  id: string
  children: React.ReactNode
}) {
  const { statusOf } = useProgress()
  const status = statusOf(id)
  if (status === 'locked') return <Navigate to="/" replace />
  return children
}

export default function App() {
  return (
    <AppShell>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route
          path="/level/llm"
          element={
            <GuardedLevel id="llm">
              <Level1LLMPage />
            </GuardedLevel>
          }
        />
        <Route
          path="/level/embeddings"
          element={
            <GuardedLevel id="embeddings">
              <Level2EmbeddingsPage />
            </GuardedLevel>
          }
        />
        <Route
          path="/level/rag"
          element={
            <GuardedLevel id="rag">
              <Level3RAGPage />
            </GuardedLevel>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AppShell>
  )
}
