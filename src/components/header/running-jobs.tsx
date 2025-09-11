import { CircleCheckBig, CloudAlert, File, ListCheck, LoaderCircle } from "lucide-react";
import type { ExpandStatement } from "@/lib/types";
import { useGetJobs } from "@/lib/api/queries";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Button } from "../ui/button";
import { Separator } from "../ui/separator";

export function RunningJobs({}) {
  const { data: jobs } = useGetJobs();
  const extractionInProgress = jobs?.some((job) => job.status === "PENDING" || job.status === "CLASSIFY");

  return (
    <Popover>
      <PopoverTrigger className="text-xs italic" asChild>
        {extractionInProgress ? (
          <Button variant="outline" size={"icon"} className="">
            <LoaderCircle className="animate-spin text-blue-500" />
          </Button>
        ) : (
          <Button variant="outline" size={"icon"} className="">
            <ListCheck />
          </Button>
        )}
      </PopoverTrigger>
      <PopoverContent align="end" sideOffset={12} alignOffset={-36}>
        <div className="text-xs italic">Extractions</div>
        <Separator className="mt-2 mb-4" />
        {Object.entries(
          jobs?.reduce((groups, job) => {
            const dealId = job.deal;
            if (!groups[dealId]) {
              groups[dealId] = [];
            }
            groups[dealId].push(job);
            return groups;
          }, {} as Record<string, typeof jobs>) || {}
        ).map(([dealId, dealJobs]) => (
          <div key={dealId} className="mb-4">
            <div className="text-xs font-medium text-muted-foreground mb-2">
              {(dealJobs[0].expand as any)?.deal?.title || "Unknown Deal"} - #{dealId}
            </div>
            {dealJobs.map((job) => (
              <div key={job.id} className="flex items-center justify-between mb-2 ml-2">
                <div className="flex items-center gap-2">
                  <File size={12} />
                  <span className="text-xs">{(job.expand as ExpandStatement).statement.filename}</span>
                </div>
                {job.status === "PENDING" && (
                  <div className="flex items-center gap-2">
                    <div className="text-xs italic">Extracting...</div>
                    <LoaderCircle size={18} className="animate-spin text-blue-500" />
                  </div>
                )}
                {job.status === "CLASSIFY" && (
                  <div className="flex items-center gap-2">
                    <div className="text-xs italic">Processing...</div>
                    <LoaderCircle size={18} className="animate-spin text-orange-500" />
                  </div>
                )}
                {job.status === "SUCCESS" && <CircleCheckBig size={18} className="text-green-500" />}
                {job.status === "ERROR" && <CloudAlert size={18} className="text-red-500" />}
              </div>
            ))}
          </div>
        ))}
      </PopoverContent>
    </Popover>
  );
}
