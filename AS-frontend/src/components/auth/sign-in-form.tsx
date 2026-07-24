import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useLogin, useLink } from "@refinedev/core";

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
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import InputPassword from "./input-password";

/**
 * ZOD SCHEMA
 */
const signInSchema = z.object({
  email: z.string().email("Please enter a valid email"),
  password: z.string().min(1, "Password is required"),
});

type SignInValues = z.infer<typeof signInSchema>;

/**
 * Main COMPONENT
 */
const SignInForm = () => {
  //Refine Hooks
  const Link = useLink();
  const { mutate: login, isPending } = useLogin();

  //Form
  const form = useForm<SignInValues>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  //Submit Handler
  const onSubmit = (values: SignInValues) => {
    login({
      email: values.email,
      password: values.password,
    });
  };

  /**
   * DISPLAY COMPONENT/ JSX
   */
  return (
    <div className="w-full">
      <Card className="w-full max-w-lg">
        <CardHeader>
          <CardTitle>Sign In</CardTitle>
          <CardDescription>Welcome to Anahanad Studio ERP</CardDescription>
        </CardHeader>

        <CardContent>
          {/* CARD WRAPPER */}
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
              {/* Email Field */}
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        {...field}
                        placeholder="varun12@gmail.com"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Password Field */}
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <InputPassword {...field} placeholder="Enter password" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Submit Button */}
              <Button type="submit" disabled={isPending} className="w-full">
                {isPending ? "Signing In...." : "Sign In"}
              </Button>
            </form>
          </Form>
        </CardContent>

        {/* Footer */}
        <CardFooter className="justify-center">
          <span>Don't have an account?</span>

          <Link to="/register" className="ml-2 underline">
            Register
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
};

export default SignInForm;
