import { dateInterFace } from "@/data/sampleData";
import { ColumnDef } from "@tanstack/react-table";
import {
  ArrowUpDown,
  MoreHorizontal,
  Pencil,
  UserRound,
  Settings,
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
import { Checkbox } from "@/shadcnComponents/ui/checkbox";
import { Link } from "react-router-dom";
import { TokensIcon } from "@radix-ui/react-icons";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/shadcnComponents/ui/dialog";
import { useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import { useMutation } from "@tanstack/react-query";
import { useMsal } from "@azure/msal-react";
import { loginRequest } from "../misc/authConfig";
import config from "../config/config";

const DIALOG_STATES = {
  CLOSED: "CLOSED",
  QR: "QR",
  DELETE: "DELETE",
};

export const columns: ColumnDef<dateInterFace>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "name",
    header: () => <div className="text-left">Namn</div>,
    cell: ({ row }) => {
      return (
        <Link to={`/round/view/${row.original._id}`}>
          <span className="no-underline hover:underline">
            {row.getValue("name")}
          </span>
        </Link>
      );
    },
  },
  {
    accessorKey: "createdDate",
    header: ({ column }) => {
      return (
        <div className="text-center">
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Skapad Datum
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        </div>
      );
    },
    cell: ({ row }) => {
      const date = new Date(row.getValue("createdDate"));
      const formatted = new Intl.DateTimeFormat("sv-SE", {
        dateStyle: "short",
      }).format(date);

      return <div className="text-center">{formatted}</div>;
    },
  },
  {
    accessorKey: "templateName",
    header: () => <div className="text-center">Mall</div>,
    cell: ({ row }) => {
      return <div className="text-center">{row.getValue("templateName")}</div>;
    },
  },
  {
    accessorKey: "numberOfRespondents",
    header: () => <div className="text-center">Antal svar</div>,
    cell: ({ row }) => {
      return (
        <div className="text-center">{row.getValue("numberOfRespondents")}</div>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const [dialogState, setDialogState] = useState(DIALOG_STATES.CLOSED);

      // Function to close the dialog
      const closeDialog = () => {
        setDialogState(DIALOG_STATES.CLOSED);
      };

      const { instance, accounts } = useMsal();
      const handleErrorResponse = async (response: Response) => {
        const contentType = response.headers.get("content-type");
        if (contentType && contentType.includes("application/json")) {
          const errorData = await response.json();
          throw new Error(errorData.message || "An error occurred");
        } else {
          const text = await response.text();
          throw new Error(`Unexpected response: ${text}`);
        }
      };

      const deleteRoundMutation = useMutation({
        mutationFn: async (roundId: string) => {
          const temp = await instance.acquireTokenSilent({
            ...loginRequest,
            account: accounts[0],
          });

          const headers = new Headers();
          const bearer = "Bearer " + temp.accessToken;
          headers.append("Authorization", bearer);
          headers.append("Content-Type", "application/json");
          console.log(`${config.api.baseUrl}/round/${roundId}`);
          const response = await fetch(
            `${config.api.baseUrl}/rounds/${roundId}`,
            {
              method: "DELETE",
              headers: headers,
            }
          );

          if (!response.ok) {
            await handleErrorResponse(response);
          }
          return response.json();
        },
      });

      const confirmDelete = async () => {
        console.log();

        try {
          await deleteRoundMutation.mutateAsync(row.original._id);
          setDialogState(DIALOG_STATES.CLOSED);
          window.location.reload();
        } catch (error) {
          console.error("Error removing round:", error);
        }
      };

      return (
        <>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuLabel>{row.getValue("name")}</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <UserRound className="mr-3 size-4" />
                Visa svar
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Settings className="mr-3 size-4" />
                <Link to={`/newfeedbackround/edit/${row.getValue("name")}`}>
                  <span className="no-underline hover:underline">Ändra</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Pencil className="mr-3 size-4" />
                <Link to={`/round/edit/${row.original.editId}`}>
                  <span className="no-underline">Lämna feedback</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <div
                  className="flex"
                  onClick={() => {
                    setDialogState(DIALOG_STATES.QR);
                  }}
                >
                  <TokensIcon className="mr-3 size-4" />
                  <span>QR-kod</span>
                </div>
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => setDialogState(DIALOG_STATES.DELETE)}
              >
                <Trash className="mr-3 size-4 text-red-600" />
                <span className="no-underline text-red-600">Ta bort</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          {dialogState === DIALOG_STATES.QR && (
            <Dialog
              open={dialogState === DIALOG_STATES.QR}
              onOpenChange={closeDialog}
            >
              <DialogContent>
                <DialogHeader className="items-center">
                  <DialogTitle>QR-kod</DialogTitle>
                  <DialogDescription>
                    <QRCodeSVG
                      size={400}
                      value={`${window.location.href}round/edit/${row.original.editId}`}
                    />
                  </DialogDescription>
                </DialogHeader>
              </DialogContent>
            </Dialog>
          )}
          {dialogState === DIALOG_STATES.DELETE && (
            <Dialog
              open={dialogState === DIALOG_STATES.DELETE}
              onOpenChange={closeDialog}
            >
              <DialogContent>
                <DialogHeader className="items-center">
                  <DialogTitle>Bekräfta borttagning</DialogTitle>
                  <DialogDescription>
                    Är du säker på att du vill ta bort{" "}
                    <i>{row.getValue("name")}</i>
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
];
