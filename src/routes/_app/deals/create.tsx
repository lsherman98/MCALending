import { useCreateDeal } from "@/lib/api/mutations";
import { getUserId } from "@/lib/utils";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Loader } from "lucide-react";
import { useEffect } from "react";

export const Route = createFileRoute("/_app/deals/create")({
  component: RouteComponent,
  staticData: {
    routeName: "Create Deal",
  },
});

function RouteComponent() {
  const createDealMutation = useCreateDeal();
  const navigate = useNavigate();

  const createDeal = () => {
    createDealMutation.mutate(
      { user: getUserId() || "" },
      {
        onSuccess: (data) => {
          navigate({
            to: `/deals/${data.id}`,
          });
        },
      }
    );
  };

  useEffect(() => {
    setTimeout(() => {
      createDeal();
    }, 250);
  }, []);

  return (
    <div className="flex h-full w-full items-center justify-center">
      <Loader className="animate-spin" />
    </div>
  );
}
