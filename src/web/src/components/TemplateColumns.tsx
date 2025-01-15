import { dateInterFace } from "@/data/sampleData";
import { ColumnDef } from "@tanstack/react-table";


import {

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
import { Input } from "@/shadcnComponents/ui/input";

const DIALOG_STATES = {
  CLOSED: "CLOSED",
  QR: "QR",
  DELETE: "DELETE",
};
// SAMMA NAMN VISA INTE FLERA GÅNGER
export const TemplateColumns: ColumnDef<dateInterFace>[] = [
  {
    accessorKey: "templateName",
    header: () => <div className="text-left">Namn</div>,
    cell: ({ row }) => {
      return <div className="text-left">{row.getValue("templateName")}</div>;
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
    cell: ({ row }) => {
      // eslint-disable-next-line react-hooks/rules-of-hooks
      const [dialogState, setDialogState] = useState(DIALOG_STATES.CLOSED);

      // Function to close the dialog
      const closeDialog = () => {
        setDialogState(DIALOG_STATES.CLOSED);
      };

      // eslint-disable-next-line react-hooks/rules-of-hooks
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

      // eslint-disable-next-line react-hooks/rules-of-hooks
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
          {dialogState === DIALOG_STATES.QR && (
            <Dialog
              open={dialogState === DIALOG_STATES.QR}
              onOpenChange={closeDialog}
            >
              <DialogContent>
                <DialogHeader className="items-center">
                  <DialogTitle>Dela länk</DialogTitle>
                  <Input id="link" value={`${window.location.href}round/edit/${row.original.editId}`}
                  />
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