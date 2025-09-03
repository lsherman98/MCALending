import { Charts } from "@/components/charts";
import { SectionCards } from "@/components/section-cards";
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
        <SectionCards dealId={dealId} />
      </div>
      <div className="flex-1 min-h-0">
        <Charts dealId={dealId} />
      </div>
    </div>
  );
}
