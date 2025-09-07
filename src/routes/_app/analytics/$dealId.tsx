import { AnalyticsCards } from "@/components/analytics-cards";
import { Charts } from "@/components/charts";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_app/analytics/$dealId")({
  component: RouteComponent,
  staticData: {
    routeName: "Analytics",
  },
});

function RouteComponent() {
  const { dealId } = Route.useParams();

  return (
    <div className="h-screen w-full overflow-hidden flex flex-col">
      <div className="flex-shrink-0">
        <AnalyticsCards dealId={dealId} />
      </div>
      <div className="flex-1 min-h-0">
        <Charts dealId={dealId} />
      </div>
    </div>
  );
}
