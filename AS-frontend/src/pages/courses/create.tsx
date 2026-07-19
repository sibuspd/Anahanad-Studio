import { useMemo } from "react";
import * as z from "zod";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import {
  CrudFilter,
  useCreate,
  useGo,
  useList,
  useNotification,
} from "@refinedev/core";

import { courseSchema } from "@/lib/schema";

import { Subject } from "@/types";

import {
  CreateView,
  CreateViewHeader,
} from "@/components/refine-ui/views/create-view";

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

  const { mutateAsync: createCourse } = useCreate();

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
      await createCourse({
        resource: "courses",

        values,
      });

      open?.({
        type: "success",

        message: "Course created successfully",
      });

      form.reset();

      go({
        to: "/courses",

        type: "replace",
      });
    } catch (e) {
      let message = "Failed to create course";

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
    <CreateView>
      <CreateViewHeader title="Create Course" />

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
                Create Course
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </CreateView>
  );
};

export default Create;
