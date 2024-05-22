
import { columns } from "./columns";
import { DataTable } from "./data-table";
import { useMsal } from "@azure/msal-react";
import { useQuery } from "@tanstack/react-query";
import { loginRequest } from "@/misc/authConfig";
import config from "@/config/config";

export default function Feedbackrounds() {
  const { instance, accounts, } = useMsal();

  const { data, isLoading } = useQuery({
    queryKey: ['getRounds'],
    queryFn: async () => {
      const temp = await instance.acquireTokenSilent({
        ...loginRequest,
        account: accounts[0]
      })
      const headers = new Headers();
      const bearer = "Bearer " + temp.accessToken;
      headers.append("Authorization", bearer);
      const options = {
        method: "GET",
        headers: headers
      };
      return fetch(config.api.baseUrl + `/rounds`, options).then((res) =>
        res.json(),
      )
    },
  })


  if (isLoading)
    return (<div>Loading</div>)

  return (
    <DataTable columns={columns} data={data} />
  );
}
