import { useCreateDeal } from "@/lib/api/mutations";
import { getUserId } from "@/lib/utils";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
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
      { user: getUserId() || "", title: "New Deal" },
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
    createDeal();
  }, []);

  return;
}
