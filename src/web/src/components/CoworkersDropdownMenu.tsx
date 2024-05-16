import { useCoworkersContext } from "@/lib/hooks";
import { DemoDropdownMenu } from "./dropdown-menu";


export default function CoworkersDropdownMenu() {
  const { apiData } = useCoworkersContext();
  
  return (
    <main className="mb-[100px] mt-[60px]">
      <DemoDropdownMenu dataCoworkers={apiData ?? []} />
    </main>
  );
}
