import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRegister, useLink } from "@refinedev/core";

import * as z from "zod";

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import {
  Form,
  FormField,
  FormItem,
  FormControl,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import InputPassword from "./input-password";

import { USER_ROLES, PUBLIC_ROLE_OPTIONS } from "@/constants";

/**
 * REGISTRATION ZOD VALIDATION SCHEMA
 */
const registerSchema = z.object({
  name: z.string().min(3, "Name is required"),
  email: z.string().email("Invalid Email"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  role: z.enum([USER_ROLES.STUDENT, USER_ROLES.PARENT]),
});

type RegisterValues = z.infer<typeof registerSchema>;

/**
 * MAIN COMPONENT
 */
const SignUpForm = () => {
  //Refine Hooks
  const Link = useLink();
  const { mutate: register, isPending } = useRegister();

  //Form
  const form = useForm<RegisterValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      role: USER_ROLES.STUDENT,
    },
  });

  //Submit
  const onSubmit = (values: RegisterValues) => {
    register(values);
  };

  // Display Component JSX
  return (
    <div className="flex items-center justify-center min-h-screen px-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Create Account</CardTitle>

          <CardDescription>
            Register to access Anahanad Studio ERP
          </CardDescription>
        </CardHeader>

        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
              {/* FULL NAME */}

              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name</FormLabel>

                    <FormControl>
                      <Input placeholder="John Doe" {...field} />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* EMAIL */}

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>

                    <FormControl>
                      <Input
                        type="email"
                        placeholder="john@example.com"
                        {...field}
                      />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* PASSWORD */}

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>

                    <FormControl>
                      <InputPassword
                        placeholder="Create a password"
                        {...field}
                      />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* ROLE DROPDOWN */}

              <FormField
                control={form.control}
                name="role"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Register As</FormLabel>

                    <Select value={field.value} onValueChange={field.onChange}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select role" />
                        </SelectTrigger>
                      </FormControl>

                      <SelectContent>
                        {PUBLIC_ROLE_OPTIONS.map((role) => {
                          const Icon = role.icon;

                          return (
                            <SelectItem key={role.value} value={role.value}>
                              <span className="flex items-center gap-2">
                                <Icon className="h-4 w-4" />
                                {role.label}
                              </span>
                            </SelectItem>
                          );
                        })}
                      </SelectContent>
                    </Select>

                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* SUBMIT */}

              <Button type="submit" className="w-full" disabled={isPending}>
                {isPending ? "Creating Account..." : "Create Account"}
              </Button>
            </form>
          </Form>
        </CardContent>
        {/* FOOTER             */}
        <CardFooter className="justify-center">
          <span className="text-sm">Already have an account?</span>

          <Link to="/login" className="ml-2 text-primary underline">
            Sign In
          </Link>
        </CardFooter>
      </Card>
    </div>
  );

};

export default SignUpForm;
