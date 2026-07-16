import React, { useMemo, useState } from "react";
import { ListView } from "@/components/refine-ui/views/list-view";
import { DataTable } from "@/components/refine-ui/data-table/data-table";
import { CreateButton } from "@/components/refine-ui/buttons/create";
import { EditButton } from "@/components/refine-ui/buttons/edit";
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
import { Breadcrumb } from "@/components/refine-ui/layout/breadcrumb";
import { ShowButton } from "@/components/refine-ui/buttons/show";

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
  const columns = useMemo<ColumnDef<ClassSession>[]>(
    () => [
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
      {
        id: "details",
        size: 140,
        header: () => <p className="column-title">Details</p>,
        cell: ({ row }) => (
          <div className="flex gap-2">
            <ShowButton
              resource="classes"
              recordItemId={row.original.id}
              variant="outline"
              size="sm"
            >
              View
            </ShowButton>

            <EditButton
              resource="classes"
              recordItemId={row.original.id}
              variant="secondary"
              size="sm"
            >
              Edit
            </EditButton>
          </div>
        ),
      },
    ],
    [],
  );

  /**---------------------------
   * USE TABLE
   * ---------------------------
   */
  const classTable = useTable<ClassSession>({
    columns,
    refineCoreProps: {
      resource: "classes",
      pagination: {
        pageSize: 10,
        mode: "server",
      },
      filters: {
        permanent: [
          ...searchFilters,
          ...courseFilters,
          ...batchFilters,
          ...teacherFiltersPermanent,
        ],
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

  return (
    <ListView>
      <Breadcrumb />

      <h1 className="page-title">List of Sessions</h1>

      <div className="intro-row">
        <p>Quick access to essential metrics and management tools</p>

        <div className="actions-row">
          {/* Search */}
          <div className="search-field">
            <Search className="search-icon" />

            <Input
              type="text"
              placeholder="Search by Session/Class Name"
              className="pl-10 w-full"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Filters */}
          <div className="flex gap-2 flex-wrap w-full sm:w-auto">
            {/* Course */}
            <Select value={selectedCourse} onValueChange={setSelectedCourse}>
              <SelectTrigger className="min-w-[180px]">
                <SelectValue placeholder="Course" />
              </SelectTrigger>

              <SelectContent>
                <SelectItem value="all">All Courses</SelectItem>

                {courses.map((course) => (
                  <SelectItem key={course.id} value={course.id.toString()}>
                    {course.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Batch */}
            <Select value={selectedBatch} onValueChange={setSelectedBatch}>
              <SelectTrigger className="min-w-[180px]">
                <SelectValue placeholder="Batch" />
              </SelectTrigger>

              <SelectContent>
                <SelectItem value="all">All Batches</SelectItem>
                {batches.map((batch) => (
                  <SelectItem key={batch.id} value={batch.id.toString()}>
                    {batch.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Teacher */}
            <Select value={selectedTeacher} onValueChange={setSelectedTeacher}>
              <SelectTrigger className="min-w-[180px]">
                <SelectValue placeholder="Teacher" />
              </SelectTrigger>

              <SelectContent>
                <SelectItem value="all">All Teachers</SelectItem>

                {teachers.map((teacher) => (
                  <SelectItem key={teacher.id} value={teacher.id}>
                    {teacher.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <CreateButton
              resource="classes"
              meta={{
                to: "/classes/create",
              }}
            />
          </div>
        </div>
      </div>

      {/* Table */}
      <DataTable table={classTable} />
    </ListView>
  );
};

export default SessionsList;
