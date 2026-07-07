// Route component responsible for creating a new music class session

import {
  CreateView,
  CreateViewHeader,
} from "@/components/refine-ui/views/create-view";
import { useList, CrudFilter } from "@refinedev/core";
// import { Separator } from "@/components/ui/separator";
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
import { Separator } from "@/components/ui/separator";

const Create = () => {
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

  const selectedSubjectId = useWatch({
    control: form.control,
    name: "subjectId",
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
   * ------------------------------------------------------------------
   * FACULTY
   * ------------------------------------------------------------------
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

  /**
   * ------------------------------------------------------------------
   * LOADING STATES
   * ------------------------------------------------------------------
   */

  const subjectsLoading = subjectsQuery.isLoading;
  const coursesLoading = coursesQuery.isLoading;
  const batchesLoading = batchesQuery.isLoading;
  const teachersLoading = teachersQuery.isLoading;

  /**
   * ------------------------------------------------------------------
   * DEPENDENT FIELD RESETS
   * ------------------------------------------------------------------
   */

  const previousSubjectId = useRef<number | undefined>(undefined);

  useEffect(() => {
    if (previousSubjectId.current == undefined) {
      previousSubjectId.current = selectedSubjectId;
      return;
    }
    if (previousSubjectId.current !== selectedSubjectId) {
      form.setValue("courseId", undefined);

      previousSubjectId.current = selectedSubjectId;
    }
  }, [selectedSubjectId, form]);

  /**
   * ------------------------------------------------------------------
   * SUBMIT
   * ------------------------------------------------------------------
   */

  const onSubmit = form.handleSubmit(async (values) => {
    console.log(values);
  });

  return (
    <CreateView>
      <CreateViewHeader title="Create New Session" />
      <Form {...form}>
        <form onSubmit={onSubmit} className="space-y-6">
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
            </CardContent>
          </Card>
          <Separator/>

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
                      value={field.value? String(field.value) : undefined}
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
          <Separator/>


        </form>
      </Form>
    </CreateView>
  );
};
export default Create;

//   const bannerPublicId = useWatch( {
//     control: form.control,
//     name: "bannerCldPubId",
//   } );

//   // Helper function
//   const setBannerImage = (file: any, field: any) => {
//     if(file){
//       field.onChange(file.url);
//       form.setValue('bannerCldPubId', file.publicId, {
//         shouldValidate: true,
//         shouldDirty: true,
//       });
//     } else {
//       field.onChange('');
//       form.setValue('bannerCldPubId', '', {
//         shouldValidate: true,
//         shouldDirty: true,
//       });
//     }
//   }

//   return (
//     <CreateView className="class-view">
//       <Breadcrumb />
//       <h1 className="page-title">Create a new Class Session</h1>
//       <div className="intro-row">
//         <p>Provide the required information to register a new music class session</p>
//         <Button onClick={() => back()}>Go Back</Button>{" "}
//         {/* Callback function to just go back after registering a new class */}
//       </div>

//       <Separator />

//       <div className="my-4 flex items-center">
//         <Card className="class-form-card">
//           <CardHeader className="relative z-10">
//             <CardTitle className="text-2xl pb-0 font-bold">
//               Session Details
//             </CardTitle>
//           </CardHeader>

//           <Separator />

//           <CardContent className="mt-7 ">
//             <Form {...form}>
//               <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">

//                 <FormField
//                   control= {control}
//                   render={ ( {field} )=> (
//                     <FormItem>
//                       <FormLabel>Banner Image <span className="text-orange-600">*</span></FormLabel>
//                       <FormControl>
//                         <UploadWidget value={ field.value? {
//                           url: field.value,
//                           publicId: bannerPublicId ?? '' }: null }
//                         onChange={ (file: any) =>setBannerImage(file, field)}/>
//                       </FormControl>
//                       <FormMessage />
//                       {errors.bannerCldPubId && !errors.bannerUrl && (
//                         <p className="text-destructive text-sm">{errors.bannerCldPubId.message?.toString()}</p>
//                       )}
//                     </FormItem>
//                   ) }
//                   name="bannerUrl" />

//                 {/* Rendering a form field  - SESSION/CLASS/TOPIC NAME*/}
//                 <FormField
//                   control={control}
//                   name="name"
//                   render={({ field }) => (
//                     <FormItem>
//                       <FormLabel>
//                         Session/Class Name{" "}
//                         <span className="text-orange-600">*</span>
//                       </FormLabel>
//                       <FormControl>
//                         <Input
//                           placeholder="Introduction to 7 Musical Modes"
//                           {...field}
//                         />
//                       </FormControl>
//                       <FormDescription>
//                         This is the lesson name to be taught
//                       </FormDescription>
//                       <FormMessage />
//                     </FormItem>
//                   )}
//                 />

//                 {/* BATCH TYPE */}
//                 <div className="grid sm:grid-cols-2 gap-4">
//                   <FormField
//                     control={control}
//                     name="batchId"
//                     render={({ field }) => (
//                       <FormItem>
//                         <FormLabel>
//                           Batch Name <span className="text-orange-600">*</span>
//                         </FormLabel>
//                         <Select disabled={batchesLoading}
//                           onValueChange={(value) =>
//                             field.onChange(Number(value))
//                           }
//                           value={field?.value?.toString()}
//                         >
//                           <FormControl>
//                             <SelectTrigger className="w-full">
//                               <SelectValue placeholder="Select Batch" />
//                             </SelectTrigger>
//                           </FormControl>

//                           <SelectContent>
//                             {batches.map((batch) => (
//                               <SelectItem
//                                 key={batch.id}
//                                 value={batch.id.toString()}
//                               >
//                                 {batch.name}
//                               </SelectItem>
//                             ))}
//                           </SelectContent>
//                         </Select>

//                         <FormDescription>
//                           The Batch this class is assigned to ** Each batch has
//                           limited capacity **
//                         </FormDescription>
//                         <FormMessage />
//                       </FormItem>
//                     )}
//                   />

//                   {/* SUBJECT NAME */}
//                   <div className="grid sm:grid-cols-2 gap-4">
//                     <FormField
//                     control={control}
//                     name="subjectId"
//                     render={({ field }) => (
//                       <FormItem>
//                         <FormLabel>
//                           Subject Name <span className="text-orange-600">*</span>
//                         </FormLabel>

//                         <Select
//                           onValueChange={(value) =>
//                             field.onChange(Number(value))
//                           }
//                           value={field?.value?.toString()}
//                           disabled={subjectsLoading}
//                         >
//                           <FormControl>
//                             <SelectTrigger className="w-full">
//                               <SelectValue placeholder="Select Subject" />
//                             </SelectTrigger>
//                           </FormControl>

//                           <SelectContent>
//                             {subjects.map((subject) => (
//                               <SelectItem
//                                 key={subject.id}
//                                 value={subject.id.toString()}
//                               >
//                                 {subject.name}
//                               </SelectItem>
//                             ))}
//                           </SelectContent>
//                         </Select>

//                         <FormDescription>
//                           Choose the subject first. Courses will be filtered automatically.
//                         </FormDescription>
//                         <FormMessage />
//                       </FormItem>
//                     )}
//                   />
//                   </div>

//                   {/* COURSE NAME */}

//                 <div className="grid sm:grid-cols-2 gap-4">
//                   {/* TEACHER TO BE ASSIGNED */}
//                   <FormField
//                     control={control}
//                     name="teacherId"
//                     render={({ field }) => (
//                       <FormItem>
//                         <FormLabel>
//                           Teacher to be assigned{" "}
//                           <span className="text-orange-600">*</span>
//                         </FormLabel>
//                         <Select disabled={teachersLoading}
//                           onValueChange={(value) =>
//                             field.onChange(value)
//                           }
//                           value={field?.value?.toString()}
//                         >
//                           <FormControl>
//                             <SelectTrigger className="w-full">
//                               <SelectValue placeholder="Select a teacher" />
//                             </SelectTrigger>
//                           </FormControl>
//                           <SelectContent>
//                             {teachers.map((teacher) => (
//                               <SelectItem
//                                 value={teacher.id}
//                                 key={teacher.id}
//                               >
//                                 {teacher.name}
//                               </SelectItem>
//                             ))}
//                           </SelectContent>
//                         </Select>
//                         <FormDescription>
//                           Allot teacher according to relevant
//                           discipline/expertise
//                         </FormDescription>
//                         <FormMessage />
//                       </FormItem>
//                     )}
//                   />

//                   {/* STATUS OF THE SESSION */}
//                   <FormField
//                     control={control}
//                     name="status"
//                     render={({ field }) => (
//                       <FormItem>
//                         <FormLabel>
//                           Status <span className="text-orange-600">*</span>
//                         </FormLabel>
//                         <Select
//                           onValueChange={field.onChange}
//                           value={field.value}
//                         >
//                           <FormControl>
//                             <SelectTrigger className="w-full">
//                               <SelectValue placeholder="Select status" />
//                             </SelectTrigger>
//                           </FormControl>
//                           <SelectContent>
//                             <SelectItem value="scheduled">Scheduled</SelectItem>
//                             <SelectItem value="completed">Completed</SelectItem>
//                             <SelectItem value="cancelled">Cancelled</SelectItem>
//                           </SelectContent>
//                         </Select>
//                         <FormMessage />
//                       </FormItem>
//                     )}
//                   />
//                 </div>

//                 <div className="grid sm:grid-cols-3 gap-4">
//                   {/* SESSION DATE */}
//                   <FormField
//                     control={control}
//                     name="sessionDate"
//                     render={({ field }) => (
//                       <FormItem>
//                         <FormLabel>Session Date</FormLabel>
//                         <FormControl>
//                           <Input type="date" {...field} />
//                         </FormControl>
//                         <FormMessage />
//                       </FormItem>
//                     )}
//                   />

//                   {/* SESSION START TIME */}
//                   <FormField
//                     control={control}
//                     name="startTime"
//                     render={({ field }) => (
//                       <FormItem>
//                         <FormLabel>Start Time</FormLabel>
//                         <FormControl>
//                           <Input type="time" {...field} />
//                         </FormControl>
//                         <FormMessage />
//                       </FormItem>
//                     )}
//                   />

//                   {/* SESSION END TIME */}
//                   <FormField
//                     control={control}
//                     name="endTime"
//                     render={({ field }) => (
//                       <FormItem>
//                         <FormLabel>End Time</FormLabel>
//                         <FormControl>
//                           <Input type="time" {...field} />
//                         </FormControl>
//                         <FormMessage />
//                       </FormItem>
//                     )}
//                   />
//                 </div>

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

//                 <Separator />

//                 <Button type="submit" size="lg" className="w-full">
//                   {isSubmitting ? (
//                     <div className="flex gap-1">
//                       <span>Creating Class...</span>
//                       <Loader2 className="inline-block ml-2 animate-spin" />
//                     </div>
//                   ) : (
//                     "Create Class"
//                   )}
//                 </Button>
//               </form>
//             </Form>
//           </CardContent>
//         </Card>
//       </div>
//     </CreateView>
//   //   );
// };
