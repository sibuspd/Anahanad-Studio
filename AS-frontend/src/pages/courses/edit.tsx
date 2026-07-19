import { useMemo } from "react";
import * as z from "zod";
import { useEffect } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import {
  CrudFilter,
  useUpdate,
  useGo,
  useList,
  useNotification,
  useOne,
  useParsed,
} from "@refinedev/core";

import { courseSchema } from "@/lib/schema";

import { Subject } from "@/types";

import {
  EditView,
  EditViewHeader,
} from "@/components/refine-ui/views/edit-view";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { Input } from "@/components/ui/input";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Textarea } from "@/components/ui/textarea";

import { Button } from "@/components/ui/button";

import { Loader2 } from "lucide-react";

const Create = () => {
  /**
   * Creating Form
   */
  const form = useForm<z.infer<typeof courseSchema>>({
    resolver: zodResolver(courseSchema),

    defaultValues: {
      level: "beginner",
    },
  });

  const go = useGo();
  const { open } = useNotification();
  const { mutateAsync: updateCourse } = useUpdate();
  const { id } = useParsed();
  const { data } = useOne<Course>({
    resource: "courses",
    id,
  });

  useEffect(() => {
    if (!data?.data) return;

    const course = data.data;

    form.reset({
      name: course.name,
      subjectId: course.subject.id,
      level: course.level,
      durationMonths: course.durationMonths,
      feeAmount: Number(course.feeAmount),
      description: course.description ?? "",
    });
  }, [data, form]);

  /**
   * Loading Subjects
   */
  const dropdownPagination = useMemo(
    () => ({
      pageSize: 100,
    }),
    [],
  );

  const { query: subjectsQuery } = useList<Subject>({
    resource: "subjects",

    pagination: dropdownPagination,
  });

  const subjects = subjectsQuery.data?.data ?? [];

  /**
   * Defining Submit Handler
   */
  const onSubmit = form.handleSubmit(async (values) => {
    try {
      await updateCourse({
        resource: "courses",
        id,
        values,
      });

      open?.({
        type: "success",

        message: "Course updated successfully",
      });

      form.reset();

      go({
        to: "/courses",

        type: "replace",
      });
    } catch (e) {
      let message = "Failed to update course";

      if (e instanceof Error) {
        message = e.message;
      }

      open?.({
        type: "error",

        message,
      });
    }
  });

  /**
   * JSX Part or Display Component
   */
  return (
    <EditView>
      <EditViewHeader title="Edit Course" />

      <Card>
        <CardHeader>
          <CardTitle>Course Information</CardTitle>
        </CardHeader>

        <CardContent>
          <Form {...form}>
            <form onSubmit={onSubmit} className="space-y-6">
              ...
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Course Name</FormLabel>

                    <FormControl>
                      <Input placeholder="Advanced Piano" {...field} />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="subjectId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Subject</FormLabel>

                    <Select
                      value={field.value?.toString()}
                      onValueChange={(value) => field.onChange(Number(value))}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Choose subject" />
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
              <FormField
                control={form.control}
                name="level"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Level</FormLabel>

                    <Select value={field.value} onValueChange={field.onChange}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>

                      <SelectContent>
                        <SelectItem value="beginner">Beginner</SelectItem>

                        <SelectItem value="intermediate">
                          Intermediate
                        </SelectItem>

                        <SelectItem value="advanced">Advanced</SelectItem>
                      </SelectContent>
                    </Select>

                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="durationMonths"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Duration (Months)</FormLabel>

                    <FormControl>
                      <Input type="number" {...field} />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="feeAmount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Fee Amount</FormLabel>

                    <FormControl>
                      <Input type="number" {...field} />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>

                    <FormControl>
                      <Textarea
                        rows={5}
                        placeholder="Course details..."
                        {...field}
                      />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button
                type="submit"
                className="w-full"
                disabled={form.formState.isSubmitting}
              >
                {form.formState.isSubmitting && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                Edit Course
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </EditView>
  );
};

export default Create;
