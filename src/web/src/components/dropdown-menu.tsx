import { Coworkers } from "@/data/sampleData";
import { Button } from "@/shadcnComponents/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/shadcnComponents/ui/dropdown-menu";
import { CaretSortIcon } from "@radix-ui/react-icons";

type DemoDropdownMenuProps = {
  dataCoworkers: Coworkers[];
};

export function DemoDropdownMenu({ dataCoworkers }: DemoDropdownMenuProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">
          Välj medarbetare
          <CaretSortIcon className="ml-2" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuLabel>Magello</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          {dataCoworkers.map((coworker) => (
            <DropdownMenuItem key={coworker.name}>
              {coworker.name}
            </DropdownMenuItem>
          ))}
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
