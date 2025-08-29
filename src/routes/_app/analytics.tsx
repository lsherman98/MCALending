import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_app/analytics')({
  component: RouteComponent,
  staticData: {
    routeName: "Analytics",
  },
})

function RouteComponent() {
  return <div>Hello "/_app/analytics"!</div>
}
