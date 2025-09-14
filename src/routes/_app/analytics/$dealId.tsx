import { Charts } from "@/components/analytics/charts";
import { Stats } from "@/components/analytics/stats";
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
    <div className="w-full flex gap-2 flex-col max-h-[89.5vh] overflow-auto">
      <Stats dealId={dealId} />
      <Charts dealId={dealId} />
    </div>
  );
}
