import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_app/")({
  component: RouteComponent,
});

function RouteComponent() {
  const navigate = Route.useNavigate();
  navigate({ to: "/deals" });
  return <div></div>;
}
