import { Search } from "lucide-react";
import { useMemo, useState } from "react";

import { ColumnDef } from "@tanstack/react-table";
import { useTable } from "@refinedev/react-table";

import { Batch } from "@/types";

import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";

import { ListView } from "@/components/refine-ui/views/list-view";
import { Breadcrumb } from "@/components/refine-ui/layout/breadcrumb";
import { DataTable } from "@/components/refine-ui/data-table/data-table";

import { CreateButton } from "@/components/refine-ui/buttons/create";
import { EditButton } from "@/components/refine-ui/buttons/edit";
import { DeleteButton } from "@/components/refine-ui/buttons/delete";

const ManageBatches = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const searchFilters = searchQuery
    ? [
        {
          field: "name",
          operator: "contains" as const,
          value: searchQuery,
        },
      ]
    : [];

  const columns = useMemo<ColumnDef<Batch>[]>(
    () => [
      {
        accessorKey: "name",
        header: () => <p className="column-title">Batch</p>,
      },
      {
        accessorKey: "capacity",
        header: () => <p className="column-title">Capacity</p>,
      },
      {
        id: "created",
        accessorKey: "createdAt",
        header: () => <p className="column-title">Created</p>,
        cell: ({ getValue }) => {
          const date = new Date(getValue<string>());
          return <span>{date.toLocaleDateString()}</span>;
        },
      },
      {
        id: "schedule",
        header: () => <p className="column-title">Schedule</p>,
        cell: ({ row }) => {
          const schedule = row.original.schedule;
          if (schedule.length === 0)
            return (
              <span className="text-muted-foreground">
                <Badge variant="outline">No Schedule</Badge>
              </span>
            );

          return (
            <div className="flex flex-wrap gap-1">
              {schedule.map((item, index) => (
                <Badge key={index} variant="secondary">
                  {item.day.slice(0, 3)}
                </Badge>
              ))}
              <p className="text-xs text-muted-foreground mt-1">
                {schedule.length} classes/week
              </p>
            </div>
          );
        },
      },
      {
        id: "actions",
        header: () => <p className="column-title">Actions</p>,
        cell: ({ row }) => (
          <div className="flex gap-2">
            <EditButton resource="batches" recordItemId={row.original.id} />

            <DeleteButton resource="batches" recordItemId={row.original.id} />
          </div>
        ),
      },
    ],
    [],
  );

  const table = useTable<Batch>({
    columns,

    refineCoreProps: {
      resource: "batches",

      pagination: {
        mode: "server",
        pageSize: 10,
      },

      filters: {
        permanent: [...searchFilters],
      },

      sorters: {
        initial: [
          {
            field: "createdAt",
            order: "desc",
          },
        ],
      },
    },
  });

  return (
    <ListView>
      <Breadcrumb />

      <h1 className="page-title">Batches</h1>

      <div className="intro-row">
        <p>Manage all teaching batches.</p>

        <div className="actions-row">
          <div className="search-field">
            <Search className="search-icon" />

            <Input
              placeholder="Search Batch by Name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="flex gap-2">
            <CreateButton resource="batches" />
          </div>
        </div>
      </div>

      <DataTable table={table} />
    </ListView>
  );
};

export default ManageBatches;
