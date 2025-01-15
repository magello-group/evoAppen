import { RoundsColumns } from "./RoundsColumns";
import { DataTable } from "./data-table";
import { useMsal } from "@azure/msal-react";
import { useQuery } from "@tanstack/react-query";
import { loginRequest } from "@/misc/authConfig";
import config from "@/config/config";
import { Skeleton } from "@/shadcnComponents/ui/skeleton";

export default function Feedbackrounds() {
  const { instance, accounts } = useMsal();

  const { data, isLoading } = useQuery({
    queryKey: ["getRounds"],
    queryFn: async () => {
      const temp = await instance.acquireTokenSilent({
        ...loginRequest,
        account: accounts[0],
      });
      const headers = new Headers();
      const bearer = "Bearer " + temp.accessToken;
      headers.append("Authorization", bearer);
      const options = {
        method: "GET",
        headers: headers,
      };
      return fetch(config.api.baseUrl + `/rounds`, options).then((res) =>
        res.json()
      );
    },
  });

  if (isLoading)
    return (
      <div className="flex flex-col space-y-4 w-full pr-8 ">
        <Skeleton className="h-6 w-full min-w-full" />
        <Skeleton className="h-[25rem] w-full min-w-full" />
      </div>
    );

  return <>
    <div>
      <p className="text-slate-500">
        Visar svarsomgångar du har skapat eller har access till
      </p>
    </div>
    <DataTable columns={RoundsColumns} data={data} isRounds={true} />;
  </>
}
