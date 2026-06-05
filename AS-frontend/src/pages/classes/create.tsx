// Route component responsible for creating a new class through a form
import React from 'react'
import { CreateView } from '@/components/refine-ui/views/create-view'
import { Breadcrumb } from '@/components/refine-ui/layout/breadcrumb'
import { Button } from '@/components/ui/button'
import { useBack } from '@refinedev/core'
import { Separator } from '@/components/ui/separator'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import * as z from 'zod'
import { zodResolver} from "@hookform/resolvers/zod";
import { useForm } from 'react-hook-form'
import  {sessionSchema}  from '@/lib/schema.ts'
// Below are all imports needed for constructing the form for creating a new class
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel,  FormMessage} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Label } from '@/components/ui/label'
import { Select, SelectTrigger, SelectValue } from '@/components/ui/select'
const Create = () => {

  const back = useBack();

  const form = useForm( { 
    resolver: zodResolver(sessionSchema),
    refineCoreProps: {
      resource: 'classes',
      action: 'create',
    },
    defaultValues: {
      status: "scheduled",
    }
  });

  const { handleSubmit, formState: { isSubmitting, control} } = form;
  
  const onSubmit = (values: z.infer<typeof sessionSchema>)=> {
    // Do something with the form values
    // this will be type-safe and validated
    try{
      console.log(values);
    }catch(e){
      console.log('Error registering the new class', e)
    }
  }

  return (
    <CreateView className='class-view'>
      <Breadcrumb/>
      <h1 className='page-title'>Create a new class</h1>
      <div className='intro-row'>
        <p>Provide the required information to register a new music class</p>
         <Button onClick={ ()=> back }>Go Back</Button> {/* Callback function to just go back after registering a new class */}
      </div>

      <Separator/>

      <div className="my-4 flex items-center">
        <Card className='class-form-card'>
          <CardHeader className='relative z-10'>
            <CardTitle className='text-2xl pb-0 font-bold'>Fill in the form</CardTitle>
          </CardHeader>

          <Separator/>

          <CardContent className='mt-7 '>
            <Form {... form}>
              <form onSubmit={ handleSubmit(onSubmit)} className='space-y-5'>
                <div className="space-y-3">
                  <Label>
                    Banner Image <span className='text-orange-600'>*</span>
                  </Label>

                    <p>Upload Image widget</p>
                </div>
                
                {/* Rendering a form field  - SESSION/CLASS/TOPIC NAME*/}
                <FormField control={control} name='name' render={ ( {field} )=> (
                  <FormItem>
                    <FormLabel>Session Name <span className='text-orange-600'>*</span></FormLabel>
                    <FormControl>
                      <Input placeholder='Introduction to 7 Musical Modes' {... field}/>
                    </FormControl>
                    <FormDescription>
                      This is the lesson name to be taught
                    </FormDescription>
                    <FormMessage/>
                  </FormItem>
                )}/>

                {/* BATCH TYPE */}
              <div className="grid sm:grid-cols-2 gap-4">
                <FormField control={control} name='batchId' render={ ( {field} )=> (
                  <FormItem>
                    <FormLabel>Batch Name <span className='text-orange-600'>*</span></FormLabel>
                    <FormControl>
                      <Input placeholder='Kids Weekend Batch' {... field}/>
                    </FormControl>
                    <FormDescription>
                      The Batch this class is assigned to ** Each batch has limited capacity **
                    </FormDescription>
                    <FormMessage/>
                  </FormItem>
                )}/>
              </div>
              
              {/* COUSE NAME */}
              <div className="grid sm:grid-cols-2 gap-4">
                <FormField control={control} name='courseId' render={ ( {field} )=> (
                  <FormItem>
                    <FormLabel>Course Name <span className='text-orange-600'>*</span></FormLabel>
                    <FormControl>
                      <Input placeholder='Beginner Piano 101' {... field}/>
                    </FormControl>
                    <FormDescription>
                      The course under which the session exists
                    </FormDescription>
                    <FormMessage/>
                  </FormItem>
                )}/>
              </div>

              {/* SUBJECT TYPE */}
              <div className="grid sm:grid-cols-2 gap-4">
                <FormField control={control} name='subjectId' render={ ( {field} )=> (
                  <FormItem>
                    <FormLabel>Subject Name <span className='text-orange-600'>*</span></FormLabel>
                      <Select onValueChange={ (value)=> field.onChange(Number(value))} value={field?.value?.toString()}>
                        <FormControl>
                          <SelectTrigger className='w-full'>
                            <SelectValue placeholder='Select a subject'/>
                          </SelectTrigger>
                        </FormControl>
                      </Select>
                    <FormDescription>
                      The subject under which the session exists
                    </FormDescription>
                    <FormMessage/>
                  </FormItem>
                )}/>
              </div>

              <Button type='submit'>Submit</Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </CreateView>
  )
}

export default Create