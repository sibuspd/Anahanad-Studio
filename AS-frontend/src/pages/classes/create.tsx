// Route component responsible for creating a new class through a form
import React from "react";
import { CreateView } from "@/components/refine-ui/views/create-view";
import { Breadcrumb } from "@/components/refine-ui/layout/breadcrumb";
import { Button } from "@/components/ui/button";
import { useBack } from "@refinedev/core";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { sessionSchema } from "@/lib/schema.ts";
// Below are all imports needed for constructing the form for creating a new class
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Loader2 } from "lucide-react";
import UploadWidget from "@/components/upload-widget";

  // Creating Mock Options for Select Subject Dropdown
  // const subjects = [
  //   {
  //     id: 1,
  //     name: "Piano",
  //     code: "PIANO",
  //   },
  //   {
  //     id: 2,
  //     name: "Electronic Keyboard",
  //     code: "EKEY",
  //   },
  //   {
  //     id: 3,
  //     name: "Guitar",
  //     code: "GUITAR",
  //   },
  //   {
  //     id: 4,
  //     name: "Tabla",
  //     code: "TABLA",
  //   },
  //   {
  //     id: 5,
  //     name: "Drums",
  //     code: "DRUMS",
  //   },
  //   {
  //     id: 6,
  //     name: "Western Vocals",
  //     code: "WVOC",
  //   },
  // ];

  // Creating Mock Options for Select Teachers Dropdown
  const teachers = [
    {
      id: 1,
      name: "Anand Sirsat",
    },
    {
      id: 2,
      name: "Sabyasachi Sahani",
    },
    {
      id: 3,
      name: "Prasanna Bhure",
    },
    {
      id: 4,
      name: "Makarand Jadhav",
    },
    {
      id: 5,
      name: "Sangam Coupler",
    },
  ];

  // Creating Mock Options for Select Batches Dropdown
  const batches = [
    {
      id: 1,
      name: "Kids' Batch",
    },
    {
      id: 2,
      name: "Weekend Batch",
    },
    {
      id: 3,
      name: "Evening Batch",
    },
  ];

  // Creating Mock Options for Select Course Dropdown
  const courses = [
    {
      id: 1,
      name: "Beginner Piano 101",
    },
    {
      id: 2,
      name: "Advanced Piano Performance",
    },
    {
      id: 3,
      name: "Tabla Foundation Course",
    },
    {
      id: 4,
      name: "Western Vocals Beginner Course",
    },
  ];

// Main Component  
const Create = () => {
  const back = useBack();

  const form = useForm({
    resolver: zodResolver(sessionSchema),
    refineCoreProps: {
      resource: "classes",
      action: "create",
    },
    defaultValues: {
      status: "scheduled",
    },
  });

  const {
    handleSubmit,
    formState: { isSubmitting, control },
  } = form;

  const onSubmit = (values: z.infer<typeof sessionSchema>) => {
    // Do something with the form values
    // this will be type-safe and validated
    try {
      console.log(values);
    } catch (e) {
      console.log("Error registering the new class", e);
    }
  };

  return (
    <CreateView className="class-view">
      <Breadcrumb />
      <h1 className="page-title">Create a new class</h1>
      <div className="intro-row">
        <p>Provide the required information to register a new music class</p>
        <Button onClick={() => back()}>Go Back</Button>{" "}
        {/* Callback function to just go back after registering a new class */}
      </div>

      <Separator />

      <div className="my-4 flex items-center">
        <Card className="class-form-card">
          <CardHeader className="relative z-10">
            <CardTitle className="text-2xl pb-0 font-bold">
              Fill in the form
            </CardTitle>
          </CardHeader>

          <Separator />

          <CardContent className="mt-7 ">
            <Form {...form}>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                <div className="space-y-3">
                  <Label>
                    Banner Image <span className="text-orange-600">*</span>
                  </Label>

                  <UploadWidget/>
                </div>

                {/* Rendering a form field  - SESSION/CLASS/TOPIC NAME*/}
                <FormField
                  control={control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Session/Class Name{" "}
                        <span className="text-orange-600">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Introduction to 7 Musical Modes"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        This is the lesson name to be taught
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* BATCH TYPE */}
                <div className="grid sm:grid-cols-2 gap-4">
                  <FormField
                    control={control}
                    name="batchId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Batch Name <span className="text-orange-600">*</span>
                        </FormLabel>
                        <Select
                          onValueChange={(value) =>
                            field.onChange(Number(value))
                          }
                          value={field?.value?.toString()}
                        >
                          <FormControl>
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="Select Batch" />
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

                        <FormDescription>
                          The Batch this class is assigned to ** Each batch has
                          limited capacity **
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* COUSE NAME */}
                  <FormField
                    control={control}
                    name="courseId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Course Name <span className="text-orange-600">*</span>
                        </FormLabel>

                        <Select
                          onValueChange={(value) =>
                            field.onChange(Number(value))
                          }
                          value={field?.value?.toString()}
                        >
                          <FormControl>
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="Select Course" />
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

                        <FormDescription>
                          The course under which the session belongs
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  {/* TEACHER TO BE ASSIGNED */}
                  <FormField
                    control={control}
                    name="teacherId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Teacher to be assigned{" "}
                          <span className="text-orange-600">*</span>
                        </FormLabel>
                        <Select
                          onValueChange={(value) =>
                            field.onChange(Number(value))
                          }
                          value={field?.value?.toString()}
                        >
                          <FormControl>
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="Select a teacher" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {teachers.map((teacher) => (
                              <SelectItem
                                value={teacher.id.toString()}
                                key={teacher.id}
                              >
                                {teacher.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormDescription>
                          Allot teacher according to relevant
                          discipline/expertise
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* STATUS OF THE SESSION */}
                  <FormField
                    control={control}
                    name="status"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Status <span className="text-orange-600">*</span>
                        </FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                        >
                          <FormControl>
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="Select status" />
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
                </div>

                {/* SUBJECT TYPE */}
                {/* <div className="grid sm:grid-cols-2 gap-4">
                <FormField control={control} name='subjectId' render={ ( {field} )=> (
                  <FormItem>
                    <FormLabel>Subject Name <span className='text-orange-600'>*</span></FormLabel>
                      <Select onValueChange={ (value)=> field.onChange(Number(value))} value={field?.value?.toString()}>
                        <FormControl>
                          <SelectTrigger className='w-full'>
                            <SelectValue placeholder='Select a subject'/>
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {subjects.map( (subject)=> (
                            <SelectItem value={subject.id.toString()} key={subject.id}>
                              {subject.name} ({subject.code})
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    <FormDescription>
                      The subject under which the session exists
                    </FormDescription>
                    <FormMessage/>
                  </FormItem>
                )}/>
                </div> */}

                {/* CAPACITY LIMIT */}
                {/* <div className="grid sm:grid-cols-2 gap-4">
                  <FormField
                                        control={control}
                                        name="capacity"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Batch Capacity</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        type="number"
                                                        placeholder="30"
                                                        onChange={(e) => {
                                                            const value = e.target.value;
                                                            field.onChange(value ? Number(value) : undefined);
                                                        }}
                                                        value={(field.value as number | undefined) ?? ""}
                                                        name={field.name}
                                                        ref={field.ref}
                                                        onBlur={field.onBlur}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                </div> */}

                <div className="grid sm:grid-cols-3 gap-4">
                  {/* SESSION DATE */}
                  <FormField
                    control={control}
                    name="sessionDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Session Date</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* SESSION START TIME */}
                  <FormField
                    control={control}
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

                  {/* SESSION END TIME */}
                  <FormField
                    control={control}
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
                </div>

                <FormField
                  control={control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Brief description about the class"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Separator />

                <Button type="submit" size="lg" className="w-full">
                  {isSubmitting ? (
                    <div className="flex gap-1">
                      <span>Creating Class...</span>
                      <Loader2 className="inline-block ml-2 animate-spin" />
                    </div>
                  ) : (
                    "Create Class"
                  )}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </CreateView>
  );
};

export default Create;
