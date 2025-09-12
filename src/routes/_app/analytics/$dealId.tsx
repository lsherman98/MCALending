import { Charts } from "@/components/charts";
import { Stats } from "@/components/stats";
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
    <div className="w-full flex gap-2 flex-col">
      <Stats dealId={dealId} />
      {/* <Charts dealId={dealId} /> */}
    </div>
  );
}
