import PlaidLink from "@/components/plaid-link";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_app/plaid/")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div>
      <PlaidLink />
    </div>
  );
}
