import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  VisibilityState,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shadcnComponents/ui/table";

import { Button } from "@/shadcnComponents/ui/button";
import React from "react";
import { Input } from "@/shadcnComponents/ui/input";
import { FilePlusIcon } from "@radix-ui/react-icons";
import { Link } from "react-router-dom";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  isRounds: boolean,
}
/**
 * Gör denne generic till både templates och rounds 
 */
export function DataTable<TData, TValue,>({
  columns,
  data,
  isRounds = true,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
    },
  });

  return (
    <div className="flex flex-col justify-start items-start  w-full">
      <div className="mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 relative rounded-md border  w-full">
        <div className="theme-zinc w-full">
          <div className="preview flex  w-full justify-center p-6 md:p-10 items-center">
            <div className="w-full">
              <div className="flex items-center justify-between py-4">
                <Input
                  placeholder="Filtrera svarsomgång"
                  value={
                    (table.getColumn(isRounds ? "name" : "templateName")?.getFilterValue() as string) ?? ""
                  }
                  onChange={(event) =>
                    table.getColumn(isRounds ? "name" : "templateName")?.setFilterValue(event.target.value)
                  }
                  className="max-w-sm"
                />

                <Link to={isRounds ? `/newfeedbackround` : `/newtemplate`}>
                  <Button
                    variant={"outline"}
                    className="no-underline hover:underline"
                  >
                    {isRounds ? `Skapa svarsomgång` : `Skapa mall`}<FilePlusIcon className="ml-1" />
                  </Button>
                </Link>
              </div>
              <div className="rounded-md border">
                <Table className="table-auto">
                  <TableHeader>
                    {table.getHeaderGroups().map((headerGroup) => (
                      <TableRow key={headerGroup.id}>
                        {headerGroup.headers.map((header) => {
                          return (
                            <TableHead key={header.id}>
                              {header.isPlaceholder
                                ? null
                                : flexRender(
                                  header.column.columnDef.header,
                                  header.getContext()
                                )}
                            </TableHead>
                          );
                        })}
                      </TableRow>
                    ))}
                  </TableHeader>
                  <TableBody>
                    {table.getRowModel().rows?.length ? (
                      table.getRowModel().rows.map((row) => (
                        <TableRow
                          key={row.id}
                          data-state={row.getIsSelected() && "selected"}
                        >
                          {row.getVisibleCells().map((cell) => (
                            <TableCell key={cell.id}>
                              {flexRender(
                                cell.column.columnDef.cell,
                                cell.getContext()
                              )}
                            </TableCell>
                          ))}
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell
                          colSpan={columns.length}
                          className="h-24 text-center"
                        >
                          Inga resultat
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
              {table.getRowModel().rows?.length > 0 && (
                <div className="flex items-center justify-end space-x-2 pt-4">
                  <div className="flex-1 text-sm text-muted-foreground">
                    Sida {table.getState().pagination.pageIndex + 1} av{" "}
                    {table.getPageCount()}
                  </div>

                  <div className="space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => table.previousPage()}
                      disabled={!table.getCanPreviousPage()}
                    >
                      Föregående
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => table.nextPage()}
                      disabled={!table.getCanNextPage()}
                    >
                      Nästa
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
