import { Header } from "@/components/Header";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shadcnComponents/ui/tabs"


import { useMsal } from "@azure/msal-react";
import { useQuery } from "@tanstack/react-query";
import { loginRequest } from "@/misc/authConfig";
import config from "@/config/config";
import { Skeleton } from "@/shadcnComponents/ui/skeleton";
import { RoundsColumns } from "@/components/RoundsColumns";
import { DataTable } from "@/components/data-table";
import { TemplateColumns } from "@/components/TemplateColumns";
export default function List() {

  const { instance, accounts } = useMsal();

  const { data: rounds, isLoading: isLoadingRounds } = useQuery({
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



  const { data: templateData, isLoading: isLoadingTemplates } = useQuery({
    queryKey: ["getTemplates"],
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
      return await fetch(`${config.api.baseUrl}/newfeedbackround/templates`, options).then(
        (res) => res.json()
      )
    },
  });

  if (isLoadingRounds || isLoadingTemplates)
    return (
      <div className="flex flex-col space-y-4 w-full pr-8 ">
        <Skeleton className="h-6 w-full min-w-full" />
        <Skeleton className="h-[25rem] w-full min-w-full" />
      </div>
    );
  return (
    <>
      <Header
        title="EvoAppen 🕸️"
        titleSize="l"
        description=""
        hideLogin={false}
      />
      <div className="flex items-center w-full">
        <div className="flex flex-col items-start w-full">
          <Tabs defaultValue="rounds" className="w-full">
            <TabsList>
              <TabsTrigger value="rounds">Feedback</TabsTrigger>
              <TabsTrigger value="templates">Mallar</TabsTrigger>
            </TabsList>
            <TabsContent value="rounds">
              <div>
                <p className="text-slate-500">
                  Visar svarsomgångar du har skapat eller har access till
                </p>
              </div>
              <DataTable columns={RoundsColumns} data={rounds} isRounds={true} />
            </TabsContent>
            <TabsContent value="templates" >
              <div>
                <p className="text-slate-500">
                  Visar mallar
                </p>
              </div>
              <DataTable columns={TemplateColumns} data={templateData ?? []} isRounds={false} />
            </TabsContent>
          </Tabs>
        </div >
      </div >
    </>
  );
}