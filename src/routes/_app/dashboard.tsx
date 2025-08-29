import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_app/dashboard")({
  component: RouteComponent,
  staticData: {
    routeName: "Dashboard",
  },
});

function RouteComponent() {
  return <div>Hello "/_app/dashboard"!</div>;
}
