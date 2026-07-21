import * as z from "zod";

import { useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { useGo, useNotification, useOne, useUpdate } from "@refinedev/core";

import { batchSchema } from "@/lib/schema";
import { Batch } from "@/types";
import { useEffect } from "react";
import {
EditView,
EditViewHeader,
}
from "@/components/refine-ui/views/edit-view";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";

import { Input } from "@/components/ui/input";

import { Button } from "@/components/ui/button";

import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";

import { Loader2 } from "lucide-react";

const EditBatch = () => {
  /**
   * FORM
   */

  const form = useForm<z.infer<typeof batchSchema>>({
    resolver: zodResolver(batchSchema),

    defaultValues: {
      name: "",

      capacity: 30,

      schedule: [
        {
          day: "Monday",
          startTime: "09:00",
          endTime: "10:00",
        },
      ],
    },
  });

  /**
   * DYNAMIC SCHEDULE
   */
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "schedule",
  });

  /**
   * REFINE HOOKS
   */
  const { mutateAsync: updateBatch } = useUpdate();
  const go = useGo();
  const { open } = useNotification();

  const { query } = useOne<Batch>({
    resource: "batches",
  });

  useEffect(() => {
    if (query.data?.data) {
      form.reset(query.data.data);
    }
  }, [query.data, form]);

  /**
   * SUBMIT
   */
  const onSubmit = form.handleSubmit(async (values) => {
    try {
      await updateBatch({
        resource: "batches",

        id: query.data?.data.id,

        values,
      });

      open?.({
        type: "success",

        message: "Batch updated successfully",
      });

      go({
        to: "/batches/manage",

        type: "replace",
      });
    } catch {
      open?.({
        type: "error",

        message: "Failed to update batch",
      });
    }
  });

  /**
   * LOADING STATE
   */
  if (query.isLoading) {
    return <div className="p-8">Loading...</div>;
  }

  /**
   * JSX DISPLAY COMPONENT
   */
  return (
    <EditView>
      <EditViewHeader resource="batches" title="Edit Batch" />

      <Form {...form}>
        <form onSubmit={onSubmit}>
          <Card>
            <CardHeader>
              <CardTitle>Batch Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* BATCH NAME */}
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Batch Name</FormLabel>

                    <FormControl>
                      <Input placeholder="Weekend Guitar Batch" {...field} />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* CAPACITY */}
              <FormField
                control={form.control}
                name="capacity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Capacity</FormLabel>

                    <FormControl>
                      <Input type="number" {...field} />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* WEEKLY SCHEDULE BUILDER */}
              <Card>
                <CardHeader>
                  <CardTitle>Weekly Schedule</CardTitle>
                </CardHeader>

                <CardContent className="space-y-4">
                  {fields.map((field, index) => (
                    <div
                      key={field.id}
                      className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end"
                    >
                      <FormField
                        control={form.control}
                        name={`schedule.${index}.day`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Day</FormLabel>

                            <Select
                              value={field.value}
                              onValueChange={field.onChange}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                              </FormControl>

                              <SelectContent>
                                <SelectItem value="Monday">Monday</SelectItem>
                                <SelectItem value="Tuesday">Tuesday</SelectItem>
                                <SelectItem value="Wednesday">
                                  Wednesday
                                </SelectItem>
                                <SelectItem value="Thursday">
                                  Thursday
                                </SelectItem>
                                <SelectItem value="Friday">Friday</SelectItem>
                                <SelectItem value="Saturday">
                                  Saturday
                                </SelectItem>
                                <SelectItem value="Sunday">Sunday</SelectItem>
                              </SelectContent>
                            </Select>

                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name={`schedule.${index}.startTime`}
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

                      <FormField
                        control={form.control}
                        name={`schedule.${index}.endTime`}
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

                      <div>
                        <Button
                          type="button"
                          variant="destructive"
                          onClick={() => remove(index)}
                          disabled={fields.length === 1}
                        >
                          Remove
                        </Button>
                      </div>
                    </div>
                  ))}
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={() =>
                      append({
                        day: "Monday",
                        startTime: "09:00",
                        endTime: "10:00",
                      })
                    }
                  >
                    Add Schedule
                  </Button>
                </CardContent>
              </Card>

              <div className="flex justify-end">
                <Button type="submit" disabled={form.formState.isSubmitting}>
                  {form.formState.isSubmitting && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  Update Batch
                </Button>
              </div>
            </CardContent>
          </Card>
        </form>
      </Form>
    </EditView>
  );
};

export default EditBatch;
