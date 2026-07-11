import React, { useMemo, useState } from "react";
import { ListView } from "@/components/refine-ui/views/list-view";
import { DataTable } from "@/components/refine-ui/data-table/data-table";
import { CreateButton } from "@/components/refine-ui/buttons/create";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search } from "lucide-react";
import { useTable } from "@refinedev/react-table";
import { useList, CrudFilter } from "@refinedev/core";
import { ColumnDef } from "@tanstack/react-table";
import { Batch, Course, User, ClassSession } from "@/types";

//Rendering a list of all class Sessions

const SessionsList = () => {
  /**---------------------------
   * CREATING LOCAL STATES
   * ---------------------------
   */
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCourse, setSelectedCourse] = useState("all");
  const [selectedBatch, setSelectedBatch] = useState("all");
  const [selectedTeacher, setSelectedTeacher] = useState("all");

  /**---------------------------
   * LOADING DROPDOWNS
   * ---------------------------
   */
  const dropdownPagination = useMemo(
    () => ({
      pageSize: 100,
    }),
    [],
  );

  const { query: coursesQuery } = useList<Course>({
    resource: "courses",
    pagination: dropdownPagination,
  });

  const courses = coursesQuery.data?.data ?? [];

  const { query: batchesQuery } = useList<Batch>({
    resource: "batches",
    pagination: dropdownPagination,
  });

  const batches = batchesQuery.data?.data ?? [];

  const teacherFilters = useMemo<CrudFilter[]>(
    () => [
      {
        field: "role",
        operator: "eq",
        value: "teacher",
      },
    ],
    [],
  );

  const { query: teachersQuery } = useList<User>({
    resource: "users",
    filters: teacherFilters,
    pagination: dropdownPagination,
  });

  const teachers = teachersQuery.data?.data ?? [];

  /**---------------------------
   * FILTERS
   * ---------------------------
   */
  const searchFilters = searchQuery
    ? [
        {
          field: "name",
          operator: "contains" as const,
          value: searchQuery,
        },
      ]
    : [];

  const courseFilters =
    selectedCourse === "all"
      ? []
      : [
          {
            field: "courseId",
            operator: "eq" as const,
            value: Number(selectedCourse),
          },
        ];

  const batchFilters =
    selectedBatch === "all"
      ? []
      : [
          {
            field: "batchId",
            operator: "eq" as const,
            value: Number(selectedBatch),
          },
        ];

  const teacherFiltersPermanent =
    selectedTeacher === "all"
      ? []
      : [
          {
            field: "teacherId",
            operator: "eq" as const,
            value: selectedTeacher,
          },
        ];

  /**---------------------------
   * TABLE COLUMNS
   * ---------------------------
   */
  columns: useMemo<ColumnDef<ClassSession>[]>(() => [
    {
      id: "subjectCode",
      accessorKey: "course.subject.code",
      header: () => <p className="column-title">Subject Code</p>,
      cell: ({ getValue }) => <Badge>{getValue<string>()}</Badge>,
    },
    {
      id: "course",
      accessorKey: "course.name",
      header: () => <p className="column-title">Course</p>,
    },

    {
      id: "department",
      accessorKey: "course.subject.department.name",
      header: () => <p className="column-title">Department</p>,
    },

    {
      id: "teacher",
      accessorKey: "teacher.name",
      header: () => <p className="column-title">Teacher</p>,
    },

    {
      id: "batch",
      accessorKey: "batch.name",
      header: () => <p className="column-title">Batch</p>,
    },

    {
      id: "status",
      accessorKey: "status",
      header: () => <p className="column-title">Status</p>,
      cell: ({ getValue }) => (
        <Badge variant="secondary">{getValue<string>()}</Badge>
      ),
    },
  ], []);

  /**---------------------------
   * USE TABLE
   * ---------------------------
   */
  const classTable = useTable<ClassSession>( {
    columns,
    refineCoreProps: {
      resource: "class-sessions",
      pagination: {
        pageSize: 10,
        mode: "server",
      },
      filters: {
        permanent: [
          ...searchFilters,
          ...courseFilters,
          ...batchFilters,
          ...teacherFiltersPermanent
        ],
      },
      sorters: {
        initial: [{
          field: "id",
          order: "desc",
        }],
      },
    },
  } );

  return <div>List of Classes</div>;
};

export default SessionsList;
