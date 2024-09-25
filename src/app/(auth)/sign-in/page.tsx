"use client";

import React, { useState } from "react"; // Removed unused useEffect import
import { useDebounceValue } from "usehooks-ts";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {  FormProvider, useForm } from "react-hook-form";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { signInValidator } from "@/schemas/signInSchema";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { toast } from "@/hooks/use-toast";
import Loader from "@/components/ui/Loader";
// Removed unused NextResponse import

const SignIn = () => { // Capitalized the component name for convention
  const router = useRouter();
  const [username, setUsername] = useState(""); // Removed unused isUserNameUnique state
  const [isLogedIn , setisLogedIn] = useState(true);

  const form = useForm<z.infer<typeof signInValidator>>({
    resolver: zodResolver(signInValidator),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof signInValidator>) => {
    setisLogedIn(false);
    const result = await signIn("credentials", {
      redirect: false,
      email: values.email,
      password: values.password,
    });
    if (result?.error) {
      toast({
        title: "Error",
        description: result.error,
        variant: "default",
      });
    } else {
      router.push("/"); // Redirect only if no error
    }
    setisLogedIn(true);
  };

  return (
    <div className="bg-slate-400 h-screen w-screen flex justify-center items-center">
      <div className="bg-white rounded-xl shadow-xl lg:w-2/5 w-full p-8">
        <h1 className="text-3xl font-bold text-gray-800 text-center mb-6">
          Sign In
        </h1>
        <FormProvider {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-700">Email</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter your email"
                      className="border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-700">Password</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter your password"
                      type="password"
                      className="border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex flex-row justify-evenly">
              <p>Not Registered yet</p>
              <Link href="/sign-up">
                <div className="text-red-600 hover:text-black">Sign Up</div>
              </Link>
            </div>
            {
              isLogedIn ? 
              ( <div className="flex justify-center items-center">
                <Button type="submit">Sign-in</Button>
              </div>) :
              <Loader/>
            }
           
          </form>
        </FormProvider>
      </div>
    </div>
  );
};

export default SignIn; // Exported as default
