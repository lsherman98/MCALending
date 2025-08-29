import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_app/deals/$dealId")({
  component: RouteComponent,
  staticData: {
    routeName: "View Deal",
  },
});

function RouteComponent() {
  return <div>Hello "/_app/deals/$dealId"!</div>;
}
