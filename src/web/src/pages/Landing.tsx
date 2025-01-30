import { Header } from "@/components/Header";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shadcnComponents/ui/tabs"

import { useMsal } from "@azure/msal-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { loginRequest } from "@/misc/authConfig";
import config from "@/config/config";
import { Skeleton } from "@/shadcnComponents/ui/skeleton";
import { RoundsColumns } from "@/components/RoundsColumns";
import { DataTable } from "@/components/data-table";
import { TemplateColumns } from "@/components/TemplateColumns";
import { useSearchParams } from "react-router-dom";

export const Landing = () => {
  const { instance, accounts } = useMsal();
  const queryClient = useQueryClient();

  const [searchParams, setSearchParams] = useSearchParams();
  const defaultTab = searchParams.get("tab") || "rounds";

  const handleTabChange = (value: string) => {
    setSearchParams({ tab: value });
  };

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
      return await fetch(`${config.api.baseUrl}/templates`, options).then(
        (res) => res.json()
      )
    },
  });

  const deleteTemplateMutation = useMutation({
    mutationFn: async (id: string) => {
      const temp = await instance.acquireTokenSilent({
        ...loginRequest,
        account: accounts[0],
      });
      const headers = new Headers();
      const bearer = "Bearer " + temp.accessToken;
      headers.append("Authorization", bearer);
      headers.append("Content-Type", "application/json");

      const response = await fetch(
        `${config.api.baseUrl}/template/${id}`,
        {
          method: "DELETE",
          headers: headers,
        }
      );

      if (!response.ok) {
        throw new Error('Failed to delete template');
      }
      return response.json();
    },
    onSuccess: (data) => {
      // Update the templates cache with the new list
      queryClient.setQueryData(["getTemplates"], data.templates);
    },
  });

  const deleteRoundMutation = useMutation({
    mutationFn: async (id: string) => {
      const temp = await instance.acquireTokenSilent({
        ...loginRequest,
        account: accounts[0],
      });
      const headers = new Headers();
      const bearer = "Bearer " + temp.accessToken;
      headers.append("Authorization", bearer);
      headers.append("Content-Type", "application/json");

      const response = await fetch(
        `${config.api.baseUrl}/round/${id}`,
        {
          method: "DELETE",
          headers: headers,
        }
      );

      if (!response.ok) {
        throw new Error('Failed to delete round');
      }
      return response.json();
    },
    onSuccess: (data) => {
      queryClient.setQueryData(["getRounds"], data.rounds);
    },
  });

  return (
    <>
      <Header
        title="RetroAppen 🕸️"
        titleSize="l"
        description=""
        hideLogin={false}
      />
      <div className="flex items-center w-full">
        <div className="flex flex-col items-start w-full">
          <Tabs
            defaultValue={defaultTab}
            className="w-full"
            onValueChange={handleTabChange}
          >
            <TabsList>
              <TabsTrigger value="rounds">Feedback</TabsTrigger>
              <TabsTrigger value="templates">Mallar</TabsTrigger>
            </TabsList>

            {(isLoadingRounds || isLoadingTemplates)
              ?
              <div className="flex flex-col space-y-4 w-full pr-8 mt-2">
                <Skeleton className="h-6 w-full min-w-full" />
                <Skeleton className="h-[25rem] w-full min-w-full" />
              </div>
              :
              <>
                <TabsContent value="rounds">
                  <div>
                    <p className="text-slate-500">
                      Visar svarsomgångar du har skapat eller har access till
                    </p>
                  </div>
                  <DataTable
                    columns={RoundsColumns}
                    data={rounds}
                    isRounds={true}
                    deleteFunction={(id: string) => deleteRoundMutation.mutateAsync(id)}
                  />
                </TabsContent>
                <TabsContent value="templates">
                  <div>
                    <p className="text-slate-500">
                      Visar mallar
                    </p>
                  </div>
                  <DataTable
                    columns={TemplateColumns}
                    data={templateData ?? []}
                    isRounds={false}
                    deleteFunction={(id: string) => deleteTemplateMutation.mutateAsync(id)}
                  />
                </TabsContent>
              </>
            }
          </Tabs>
        </div >
      </div >
    </>
  );
}