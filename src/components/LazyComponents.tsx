import { Suspense, lazy } from 'react'

const Analytics = lazy(() => import('./premium/Analytics'))
const WorkflowBuilder = lazy(() => import('./premium/WorkflowBuilder'))

interface LazyComponentProps {
  component: 'Analytics' | 'WorkflowBuilder'
  fallback?: React.ReactNode
}

export function LazyComponent({ component, fallback }: LazyComponentProps) {
  const components = {
    Analytics: Analytics,
    WorkflowBuilder: WorkflowBuilder
  }
  
  const Component = components[component]
  
  return (
    <Suspense fallback={fallback ?? <div>Loading...</div>}>
      <Component />
    </Suspense>
  )
}
