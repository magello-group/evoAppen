"use client";

import { dateInterFace } from "@/data/sampleData";
import { ColumnDef } from "@tanstack/react-table";
import {
  ArrowUpDown,
  MoreHorizontal,
  Pencil,
  UserRound,
  Settings,
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
    accessorKey: "created",
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
      const date = new Date(row.getValue("created"));
      const formatted = new Intl.DateTimeFormat("sv-SE", {
        dateStyle: "short",
      }).format(date);

      return <div className="text-center">{formatted}</div>;
    },
  },
  {
    accessorKey: "template",
    header: () => <div className="text-center">Mall</div>,
    cell: ({ row }) => {
      return <div className="text-center">{row.getValue("template")}</div>;
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
      //const payment = row.original

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>{row.getValue("name")}</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <UserRound className="mr-3 size-4" />
              Visa svar
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Settings className="mr-3 size-4" />
              <Link to={`/newfeedbackround/edit/${row.getValue("name")}`}>
                <span className="no-underline hover:underline">
                  Inställningar
                </span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Pencil className="mr-3 size-4" />
              <Link to={`/round/edit/${row.original.editId}`}>
                <span className="no-underline">Lämna feedback</span>
              </Link>
            </DropdownMenuItem>
            {/* <DropdownMenuItem>
              <EyeIcon className="mr-3 size-4" />
              Länk för visning
            </DropdownMenuItem> */}
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
