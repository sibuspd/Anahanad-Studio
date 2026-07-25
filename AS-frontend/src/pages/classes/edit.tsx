// Route component responsible for creating a new music class session

import {
  EditView,
  EditViewHeader,
} from "@/components/refine-ui/views/edit-view";

import {
  useList,
  CrudFilter,
  useUpdate,
  useGo,
  useNotification,
  useShow,
} from "@refinedev/core";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { useWatch, useForm } from "react-hook-form";

import { sessionSchema } from "@/lib/schema";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { Input } from "@/components/ui/input";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Textarea } from "@/components/ui/textarea";

import { Loader2 } from "lucide-react";

import {
  User,
  Batch,
  Course,
  Subject,
  UploadWidgetValue,
  ClassDetails,
} from "@/types";

import { useEffect, useMemo, useRef } from "react";

import { Separator } from "@/components/ui/separator";

import UploadWidget from "@/components/upload-widget";

import { Button } from "@/components/ui/button";

const Edit = () => {
  /**
   * ---------------------------------------------
   * ROUTING & NOTIFICATIONS
   * ---------------------------------------------
   */

  const go = useGo();
  const { open } = useNotification();

  /**
   * ---------------------------------------------
   * LOAD A SESSION
   * ---------------------------------------------
   */

  const { query } = useShow<ClassDetails>({
    resource: "classes",
  });

  const classDetails = query.data?.data;

  /**
   * ---------------------------------------------
   * UPDATE MUTATION
   * ---------------------------------------------
   */

  const { mutateAsync: updateSession } = useUpdate();

  /**
   * ---------------------------------------------
   * FORM
   * ---------------------------------------------
   */

  const form = useForm<z.infer<typeof sessionSchema>>({
    resolver: zodResolver(sessionSchema),
    defaultValues: {
      status: "scheduled",
    },
  });

  /**
   * ---------------------------------------------
   * LOAD EXISTING VALUES
   * ---------------------------------------------
   */

  useEffect(() => {
    if (!classDetails) return;

    form.reset({
      name: classDetails.name,
      description: classDetails.description,

      subjectId: classDetails.course.subject.id,
      courseId: classDetails.course.id,
      batchId: classDetails.batch.id,

      teacherId: classDetails.teacher.id,

      sessionDate: classDetails.sessionDate,
      startTime: classDetails.startTime,
      endTime: classDetails.endTime,

      status: classDetails.status,

      bannerUrl: classDetails.bannerUrl ?? "",
      bannerCldPubId: classDetails.bannerCldPubId ?? "",
    });
  }, [classDetails, form]);

  /**
   * ---------------------------------------------
   * WATCHERS
   * ---------------------------------------------
   */

  const selectedSubjectId = useWatch({
    control: form.control,
    name: "subjectId",
  });

  const bannerPublicId = useWatch({
    control: form.control,
    name: "bannerCldPubId",
  });

  /**
   * ---------------------------------------------
   * SHARED PAGINATION
   * ---------------------------------------------
   */

  const dropdownPagination = useMemo(
    () => ({
      pageSize: 100,
    }),
    [],
  );

  /**
   * ---------------------------------------------
   * SUBJECTS
   * ---------------------------------------------
   */

  const { query: subjectsQuery } = useList<Subject>({
    resource: "subjects",
    pagination: dropdownPagination,
  });

  const subjects = subjectsQuery.data?.data ?? [];

  /**
   * ---------------------------------------------
   * COURSES
   * ---------------------------------------------
   */

  const courseFilters = useMemo<CrudFilter[]>(() => {
    if (!selectedSubjectId) return [];

    return [
      {
        field: "subjectId",
        operator: "eq",
        value: selectedSubjectId,
      },
    ];
  }, [selectedSubjectId]);

  const { query: coursesQuery } = useList<Course>({
    resource: "courses",
    filters: courseFilters,
    pagination: dropdownPagination,
  });

  const courses = coursesQuery.data?.data ?? [];

  /**
   * ---------------------------------------------
   * BATCHES
   * ---------------------------------------------
   */

  const { query: batchesQuery } = useList<Batch>({
    resource: "batches",
    pagination: dropdownPagination,
  });

  const batches = batchesQuery.data?.data ?? [];

  /**
   * ---------------------------------------------
   * TEACHERS
   * ---------------------------------------------
   */

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

  const subjectsLoading = subjectsQuery.isLoading;
  const coursesLoading = coursesQuery.isLoading;
  const batchesLoading = batchesQuery.isLoading;
  const teachersLoading = teachersQuery.isLoading;

  /**
   * ---------------------------------------------
   * DEPENDENT RESET
   * ---------------------------------------------
   */

  const previousSubjectId = useRef<number>();

  useEffect(() => {
    if (previousSubjectId.current === undefined) {
      previousSubjectId.current = selectedSubjectId;
      return;
    }

    if (previousSubjectId.current !== selectedSubjectId) {
      form.setValue("courseId", undefined);

      previousSubjectId.current = selectedSubjectId;
    }
  }, [selectedSubjectId, form]);

  /**
   * ---------------------------------------------
   * BANNER
   * ---------------------------------------------
   */

  const handleBannerUpload = (file: UploadWidgetValue | null) => {
    form.setValue("bannerUrl", file?.url ?? "");
    form.setValue("bannerCldPubId", file?.publicId ?? "");
  };

  /**
   * ---------------------------------------------
   * SUBMIT
   * ---------------------------------------------
   */

  const onSubmit = form.handleSubmit(async (values) => {
    try {
      const { subjectId, ...payload } = values;
      if (!classDetails) return;

      await updateSession({
        resource: "class-sessions",
        id: classDetails.id,
        values: payload,
      });

      open?.({
        type: "success",
        message: "Session updated successfully",
      });

      go({
        to: "/classes",
        type: "replace",
      });
    } catch (e) {
      const message =
        e instanceof Error ? e.message : "Failed to update session";

      open?.({
        type: "error",
        message,
      });
    }
  });

  if (query.isLoading) {
  return (
    <EditView>
      <EditViewHeader title="Edit Session" />
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
    </EditView>
  );
}

if (query.isError || !classDetails) {
  return (
    <EditView>
      <EditViewHeader title="Edit Session" />
      <div className="py-12 text-center">
        Failed to load session.
      </div>
    </EditView>
  );
}

  return (
    <EditView>
      <EditViewHeader title="Edit Session" />
      <Form {...form}>
        <form onSubmit={onSubmit} className="space-y-6">
          {/* ------------------------------------------------ */}
          {/* SESSION COVER                                   */}
          {/* ------------------------------------------------ */}

          <Card>
            <CardHeader>
              <CardTitle>Upload Session banner</CardTitle>
            </CardHeader>

            <CardContent>
              <FormField
                control={form.control}
                name="bannerUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Cover Image
                      <span className="text-orange-600">*</span>
                    </FormLabel>

                    <FormControl>
                      <UploadWidget
                        value={
                          field.value
                            ? {
                                url: field.value,
                                publicId: bannerPublicId ?? "",
                              }
                            : null
                        }
                        onChange={handleBannerUpload}
                      />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>
          {/* ---------------------------------------------------------- */}
          {/* BASIC INFORMATION */}
          {/* ---------------------------------------------------------- */}
          <Card>
            <CardHeader>
              <CardTitle>Academic Details</CardTitle>
            </CardHeader>

            <CardContent className="space-y-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Session Name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="e.g. Piano Foundation - Saturday Morning"
                        {...field}
                      />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* SESSION DESCRIPTION */}
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Description
                      <span className="text-orange-600">*</span>
                    </FormLabel>

                    <FormControl>
                      <Textarea
                        placeholder="Briefly describe this class session..."
                        rows={4}
                        {...field}
                      />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>
          <Separator />

          {/* ------------------------------------------------ */}
          {/* COURSE DETAILS                                  */}
          {/* ------------------------------------------------ */}

          <Card>
            <CardHeader>
              <CardTitle>Course Details</CardTitle>
            </CardHeader>

            <CardContent className="grid gap-6 md:grid-cols-2 xl:grid-cols-2">
              {/* Subject to Choose */}
              <FormField
                control={form.control}
                name="subjectId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Subject</FormLabel>
                    <Select
                      value={field.value ? String(field.value) : undefined}
                      onValueChange={(value) => field.onChange(Number(value))}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue
                            placeholder={
                              subjectsLoading ? "Loading" : "Select a subject"
                            }
                          />
                        </SelectTrigger>
                      </FormControl>

                      <SelectContent>
                        {subjects.map((subject) => (
                          <SelectItem
                            key={subject.id}
                            value={subject.id.toString()}
                          >
                            {subject.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Course to Choose */}
              <FormField
                control={form.control}
                name="courseId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Course</FormLabel>
                    <Select
                      disabled={!selectedSubjectId || coursesLoading}
                      value={field.value ? String(field.value) : undefined}
                      onValueChange={(value) => field.onChange(Number(value))}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue
                            placeholder={
                              !selectedSubjectId
                                ? "Select Subject First"
                                : coursesLoading
                                ? "Loading courses..."
                                : "Select Course"
                            }
                          />
                        </SelectTrigger>
                      </FormControl>

                      <SelectContent>
                        {courses.map((course) => (
                          <SelectItem
                            key={course.id}
                            value={course.id.toString()}
                          >
                            {course.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />

              {/* Batch Type */}
              <FormField
                control={form.control}
                name="batchId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Select a batch</FormLabel>

                    <Select
                      value={field.value ? String(field.value) : undefined}
                      onValueChange={(value) => field.onChange(Number(value))}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue
                            placeholder={
                              batchesLoading ? "Loading..." : "Select Batch"
                            }
                          />
                        </SelectTrigger>
                      </FormControl>

                      <SelectContent>
                        {batches.map((batch) => (
                          <SelectItem
                            key={batch.id}
                            value={batch.id.toString()}
                          >
                            {batch.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Teacher to be Assigned */}
              <FormField
                control={form.control}
                name="teacherId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Assigned Teacher</FormLabel>

                    <Select value={field.value} onValueChange={field.onChange}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue
                            placeholder={
                              teachersLoading
                                ? "Loading..."
                                : "Select an Instructor"
                            }
                          />
                        </SelectTrigger>
                      </FormControl>

                      <SelectContent>
                        {teachers.map((teacher) => (
                          <SelectItem key={teacher.id} value={teacher.id}>
                            {teacher.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>
          <Separator />

          {/* ------------------------------------------------ */}
          {/* SESSION SCHEDULE                                */}
          {/* ------------------------------------------------ */}

          <Card>
            <CardHeader>
              <CardTitle>Session Schedule</CardTitle>
            </CardHeader>

            <CardContent className="grid gap-6 md:grid-cols-2">
              {/* Session Date */}

              <FormField
                control={form.control}
                name="sessionDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Session Date</FormLabel>

                    <FormControl>
                      <Input
                        type="date"
                        {...field}
                      />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Status */}

              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status</FormLabel>

                    <Select value={field.value} onValueChange={field.onChange}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>

                      <SelectContent>
                        <SelectItem value="scheduled">Scheduled</SelectItem>

                        <SelectItem value="completed">Completed</SelectItem>

                        <SelectItem value="cancelled">Cancelled</SelectItem>
                      </SelectContent>
                    </Select>

                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Start Time */}

              <FormField
                control={form.control}
                name="startTime"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Start Time</FormLabel>

                    <FormControl>
                      <Input type="time" {...field} />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* End Time */}

              <FormField
                control={form.control}
                name="endTime"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>End Time</FormLabel>

                    <FormControl>
                      <Input type="time" {...field} />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>
          <Separator />

          {/* ------------------------------------------------ */}
          {/* FORM ACTIONS                                    */}
          {/* ------------------------------------------------ */}
          <div className="flex justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() =>
                go({
                  to: "/classes",
                  type: "replace",
                })
              }
              disabled={form.formState.isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={form.formState.isSubmitting}>
              {form.formState.isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Updating Session...
                </>
              ) : (
                "Update Session"
              )}
            </Button>
          </div>
        </form>
      </Form>
    </EditView>
  );
};
export default Edit;

//                 <FormField
//                   control={control}
//                   name="description"
//                   render={({ field }) => (
//                     <FormItem>
//                       <FormLabel>Description</FormLabel>
//                       <FormControl>
//                         <Textarea
//                           placeholder="Brief description about the class"
//                           {...field}
//                         />
//                       </FormControl>
//                       <FormMessage />
//                     </FormItem>
//                   )}
//                 />
