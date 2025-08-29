import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_app/deals/")({
  component: RouteComponent,
  staticData: {
    routeName: "Deals",
  },
});

function RouteComponent() {
  return <div>Hello "/_app/deals/"!</div>;
}
