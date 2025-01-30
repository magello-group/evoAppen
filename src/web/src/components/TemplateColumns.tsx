import { ColumnDef } from "@tanstack/react-table";


import {
  MoreHorizontal,
  Trash,
} from "lucide-react";
import { Button } from "@/shadcnComponents/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/shadcnComponents/ui/dropdown-menu";


import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/shadcnComponents/ui/dialog";
import { useState } from "react";
import { Link } from "react-router-dom";


const DIALOG_STATES = {
  CLOSED: "CLOSED",
  QR: "QR",
  DELETE: "DELETE",
};

interface Template {
  templateName: string;
  id: string;
}

interface TableMeta {
  deleteFunction?: (id: string) => Promise<unknown>;
}

export const TemplateColumns: ColumnDef<Template, TableMeta>[] = [
  {
    accessorKey: "templateName",
    header: () => <div className="text-left">Namn</div>,
    cell: ({ row }) => {
      return <Link to={`template/${row.getValue("id")}`} className="text-left">{row.getValue("templateName")}</Link>;

    },
  },
  {
    accessorKey: "id",
    header: () => <div className="text-left">Id</div>,
    cell: ({ row }) => {
      return <div className="text-left">{row.getValue("id")}</div>;
    },
  },


  {
    id: "actions",
    cell: ({ row, table }) => {

      // eslint-disable-next-line react-hooks/rules-of-hooks
      const [dialogState, setDialogState] = useState(DIALOG_STATES.CLOSED);

      // Function to close the dialog
      const closeDialog = () => {
        setDialogState(DIALOG_STATES.CLOSED);
      };

      const confirmDelete = async () => {
        try {
          const deleteFunction = table.options.meta?.deleteFunction;
          if (deleteFunction) {
            await deleteFunction(row.original.id);
          }
          setDialogState(DIALOG_STATES.CLOSED);
        } catch (error) {
          console.error("Error removing template:", error);
        }
      };

      return (
        <>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">öppna meny</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuLabel>{row.getValue("templateName")}</DropdownMenuLabel>
              <DropdownMenuSeparator />

              <DropdownMenuItem
                onClick={() => setDialogState(DIALOG_STATES.DELETE)}
              >
                <Trash className="mr-3 size-4 text-red-600" />
                <span className="no-underline text-red-600">Ta bort</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {dialogState === DIALOG_STATES.DELETE && (
            <Dialog
              open={dialogState === DIALOG_STATES.DELETE}
              onOpenChange={closeDialog}
            >
              <DialogContent>
                <DialogHeader className="items-center">
                  <DialogTitle>Bekräfta borttagning</DialogTitle>
                  <DialogDescription>
                    Är du säker på att du vill ta bort mallen {' '}
                    <i>{row.getValue("templateName")}</i>
                  </DialogDescription>
                </DialogHeader>
                <Button variant={"destructive"} onClick={confirmDelete}>
                  Ta bort
                </Button>
              </DialogContent>
            </Dialog>
          )}
        </>
      );
    },
  },
]