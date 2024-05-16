import { useFeedbackRoundsContext } from "@/lib/hooks";
import { columns } from "./columns";
import { DataTable } from "./data-table";


export default function Feedbackrounds() {
  const { apiData } = useFeedbackRoundsContext();

  return (
    <div className="flex justify-center items-center">
      <DataTable columns={columns} data={apiData} />
    </div>
  );
}
