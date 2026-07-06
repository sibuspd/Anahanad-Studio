// Route component responsible for creating a new music class session

import { CreateView } from "@/components/refine-ui/views/create-view";
import { Breadcrumb } from "@/components/refine-ui/layout/breadcrumb";
import { Button } from "@/components/ui/button";
import { useBack, useList, CrudFilter } from "@refinedev/core";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
// import { useForm } from "@refinedev/react-hook-form";
import { useWatch, useForm } from "react-hook-form";
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
import { User, Batch, Course, Subject } from "@/types";
import { useEffect, useMemo, useRef } from "react";


// Main Component  
const Create = () => {

  // console.log("Create Render");
  // const back = useBack();

  // const form = useForm({
  //   resolver: zodResolver(sessionSchema),
  //   refineCoreProps: {
  //     resource: "class-sessions",
  //     action: "create",
  //   },
  //   // defaultValues: {
  //   //   status: "scheduled",
  //   // },
  // });

    const form = useForm({
    resolver: zodResolver(sessionSchema),
  });

const previousForm = useRef(form);

previousForm.current = form;
  
  const selectedSubjectId = useWatch( {
    control: form.control,
    name: "subjectId",
  } );

  useEffect( () =>{
    console.log("Use Effect is called here.");
    form.resetField('courseId');
  }, [selectedSubjectId, form]); // exhaustive-deps rule of React Hook

  const courseFilters = useMemo<CrudFilter[]>( () => {
    if(!selectedSubjectId) return [];
    

    return [{
      field: "subjectId",
      operator: "eq",
      value: selectedSubjectId,
    }];
  }, [selectedSubjectId]);

  const dropdownPagination = useMemo( () => ({
    pageSize: 100,
  }), []);

  /** DYNAMIC COURSE FETCHING */
  const { query: coursesQuery} = useList<Course>( {
    resource: "courses",
    filters: courseFilters,
    pagination: dropdownPagination,
  } );

  /** READING THE RETURNED COURSE */
  // const courses = coursesQuery.data?.data ?? [];
  // const coursesLoading = coursesQuery.isLoading;

  const {
    handleSubmit,
    formState: { isSubmitting, errors },
    control
  } = form;

  const onSubmit =  async (values: z.infer<typeof sessionSchema>) => {
    // Do something with the form values
    // this will be type-safe and validated
    try {
      // await onFinish(values);
      console.log(values);
    } catch (e) {
      console.log("Error registering the new class", e);
    }
  };

const batches = [];
const teachers = [];
// const subjects = [];
const courses = [];

const batchesLoading = false;
const teachersLoading = false;
// const subjectsLoading = false;
const coursesLoading = false;

  // console.log("batches useList");
  // // Fetching data from neon db 
  // const { query: batchesQuery } = useList<Batch>( {
  //   resource: 'batches',
  //   pagination: dropdownPagination,
  // });  

  // console.log("teachers useList");
  // const { query: teachersQuery } = useList<User>( {
  //   resource: 'users',
  //   filters: [ { field: 'role', operator: 'eq', value: 'teacher'}],
  //   pagination: dropdownPagination,
  // });

console.count("subjects hook");
  console.log("Subject useList");
  /**SUBJECT WILL BE CHOSEN AND WILL DECIDE THE COURSES THAT APPEARS IN DROPDOWN */
  const { query: subjectsQuery } = useList<Subject>( {
    resource: 'subjects',
    pagination: dropdownPagination,
  });

  
  // Access the batches and users/teachers from the actual query
  // const batches = batchesQuery.data?.data ?? [];
  // const batchesLoading = batchesQuery.isLoading;
  
  // const teachers = teachersQuery.data?.data ?? [];
  // const teachersLoading = teachersQuery.isLoading;
  
  const subjects = subjectsQuery.data?.data ?? [];
  const subjectsLoading = subjectsQuery.isLoading; 

  const bannerPublicId = useWatch( {
    control: form.control,
    name: "bannerCldPubId",
  } );

  // Helper function
  const setBannerImage = (file: any, field: any) => {
    if(file){
      field.onChange(file.url);
      form.setValue('bannerCldPubId', file.publicId, {
        shouldValidate: true,
        shouldDirty: true,
      });
    } else {
      field.onChange('');
      form.setValue('bannerCldPubId', '', {
        shouldValidate: true,
        shouldDirty: true,
      });
    }
  }

  return (
    <CreateView className="class-view">
      <Breadcrumb />
      <h1 className="page-title">Create a new Class Session</h1>
      <div className="intro-row">
        <p>Provide the required information to register a new music class session</p>
        <Button onClick={() => back()}>Go Back</Button>{" "}
        {/* Callback function to just go back after registering a new class */}
      </div>

      <Separator />

      <div className="my-4 flex items-center">
        <Card className="class-form-card">
          <CardHeader className="relative z-10">
            <CardTitle className="text-2xl pb-0 font-bold">
              Session Details
            </CardTitle>
          </CardHeader>

          <Separator />

          <CardContent className="mt-7 ">
            <Form {...form}>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                
                <FormField 
                  control= {control}
                  render={ ( {field} )=> (
                    <FormItem>
                      <FormLabel>Banner Image <span className="text-orange-600">*</span></FormLabel>
                      <FormControl>
                        <UploadWidget value={ field.value? {
                          url: field.value,
                          publicId: bannerPublicId ?? '' }: null }
                        onChange={ (file: any) =>setBannerImage(file, field)}/>
                      </FormControl>
                      <FormMessage />
                      {errors.bannerCldPubId && !errors.bannerUrl && (
                        <p className="text-destructive text-sm">{errors.bannerCldPubId.message?.toString()}</p>
                      )}
                    </FormItem>
                  ) }
                  name="bannerUrl" />

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
                        <Select disabled={batchesLoading}
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

                  {/* SUBJECT NAME */}
                  <div className="grid sm:grid-cols-2 gap-4">
                    <FormField
                    control={control}
                    name="subjectId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Subject Name <span className="text-orange-600">*</span>
                        </FormLabel>

                        <Select
                          onValueChange={(value) =>
                            field.onChange(Number(value))
                          }
                          value={field?.value?.toString()}
                          disabled={subjectsLoading}
                        >
                          <FormControl>
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="Select Subject" />
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

                        <FormDescription>
                          Choose the subject first. Courses will be filtered automatically.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  </div>

                  {/* COURSE NAME */}
                  <FormField
                    control={control}
                    name="courseId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Course Name <span className="text-orange-600">*</span>
                        </FormLabel>
                        {/* DISABLING COURSE DROPDOWN UNTIL SUBJECT IS CHOSEN */}
                        <Select disabled={!selectedSubjectId || coursesLoading}
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
                          Choose a course under the selected subject.
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
                        <Select disabled={teachersLoading}
                          onValueChange={(value) =>
                            field.onChange(value)
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
                                value={teacher.id}
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
