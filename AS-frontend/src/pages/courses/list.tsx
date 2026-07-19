import { Search } from "lucide-react";
import { useMemo, useState } from "react";

import { ColumnDef } from "@tanstack/react-table";
import { useTable } from "@refinedev/react-table";
import { useList } from "@refinedev/core";

import { Subject, Course } from "@/types";

import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { ListView } from "@/components/refine-ui/views/list-view";
import { Breadcrumb } from "@/components/refine-ui/layout/breadcrumb";
import { DataTable } from "@/components/refine-ui/data-table/data-table";

import { CreateButton } from "@/components/refine-ui/buttons/create";
import { EditButton } from "@/components/refine-ui/buttons/edit";

const CoursesList = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("all");
  const [selectedLevel, setSelectedLevel] = useState("all");

  /**
   * Extracting Subjects
   */
  const { query: subjectsQuery } = useList<Subject>({
    resource: "subjects",

    pagination: {
      pageSize: 100,
    },
  });
  const subjects = subjectsQuery.data?.data ?? [];

  /**
   * Defining Filters
   */
  const searchFilters =
    searchQuery === ""
      ? []
      : [
          {
            field: "name",
            operator: "contains" as const,
            value: searchQuery,
          },
        ];

  const subjectFilters =
    selectedSubject === "all"
      ? []
      : [
          {
            field: "subjectId",
            operator: "eq" as const,
            value: Number(selectedSubject),
          },
        ];

  const levelFilters =
    selectedLevel === "all"
      ? []
      : [
          {
            field: "level",
            operator: "eq" as const,
            value: selectedLevel,
          },
        ];

  /**
   * Drawing the Table Columns
   */
  const columns = useMemo<ColumnDef<Course>[]>(
    () => [
      {
        accessorKey: "name",
        header: () => <p className="column-title">Course</p>,
      },
      {
        accessorKey: "subject.name",
        header: () => <p className="column-title">Subject</p>,
        cell: ({ getValue }) => <Badge>{getValue<string>()}</Badge>,
      },
      {
        accessorKey: "level",
        header: () => <p className="column-title">Level</p>,
        cell: ({ getValue }) => (
          <Badge variant="secondary">{getValue<string>()}</Badge>
        ),
      },
      {
        accessorKey: "durationMonths",
        header: () => <p className="column-title">Duration</p>,
        cell: ({ getValue }) => `${getValue<number>()} Months`,
      },
      {
        accessorKey: "feeAmount",
        header: () => <p className="column-title">Fee</p>,
        cell: ({ getValue }) => `₹ ${getValue<string>()}`,
      },
      {
        id: "actions",
        header: () => <p className="column-title">Actions</p>,
        cell: ({ row }) => (
          <div className="flex gap-2">
            <EditButton
              resource="courses"
              recordItemId={row.original.id}
              size="sm"
            />
          </div>
        ),
      },
    ],
    [],
  );

  /**
   * Using the Table Hook
   */
  const table = useTable<Course>({
    columns,

    refineCoreProps: {
      resource: "courses",

      pagination: {
        mode: "server",
        pageSize: 10,
      },

      filters: {
        permanent: [...searchFilters, ...subjectFilters, ...levelFilters],
      },

      sorters: {
        initial: [
          {
            field: "id",
            order: "desc",
          },
        ],
      },
    },
  });

  /**
   * DISPLAY COMPONENT
   */
  return (
    <ListView>
      <Breadcrumb />

      <h1 className="page-title">Courses</h1>

      <div className="intro-row">
        <p>Manage all music courses offered by the academy.</p>

        <div className="actions-row">
          {/* ---------------- SEARCH ---------------- */}
          <div className="search-field">
            <Search className="search-icon" />

            <Input
              type="text"
              placeholder="Search course..."
              className="pl-10 w-full"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* ---------------- FILTERS ---------------- */}
          <div className="flex gap-2 flex-wrap w-full sm:w-auto">
            {/* SUBJECT FILTER */}
            <Select value={selectedSubject} onValueChange={setSelectedSubject}>
              <SelectTrigger className="min-w-[180px]">
                <SelectValue placeholder="Subject" />
              </SelectTrigger>

              <SelectContent>
                <SelectItem value="all">All Subjects</SelectItem>

                {subjects.map((subject) => (
                  <SelectItem key={subject.id} value={subject.id.toString()}>
                    {subject.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* LEVEL FILTER */}
            <Select value={selectedLevel} onValueChange={setSelectedLevel}>
              <SelectTrigger className="min-w-[180px]">
                <SelectValue placeholder="Level" />
              </SelectTrigger>

              <SelectContent>
                <SelectItem value="all">All Levels</SelectItem>

                <SelectItem value="beginner">Beginner</SelectItem>

                <SelectItem value="intermediate">Intermediate</SelectItem>

                <SelectItem value="advanced">Advanced</SelectItem>
              </SelectContent>
            </Select>

            {/* CREATE BUTTON */}
            <CreateButton
              resource="courses"
              meta={{
                to: "/courses/create",
              }}
            />
          </div>
        </div>
      </div>

      {/* ---------------- TABLE ---------------- */}

      <DataTable table={table} />
    </ListView>
  );
};

export default CoursesList