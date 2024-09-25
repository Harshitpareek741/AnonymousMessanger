"use client";

import React, { useEffect, useState } from "react";
import { useDebounceValue } from "usehooks-ts";
import axios from "axios";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormProvider, useForm } from "react-hook-form";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { signUpValidator } from "@/schemas/signUpSchema";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Loader from "@/components/ui/Loader";




const SignUp = () => {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [isUserNameUnique, setIsUserNameUnique] = useState(false);
  const [debouncedValue, setValue] = useDebounceValue(username, 500);
  const [isUserNameUniqueMessage, setIsUserNameUniqueMessage] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSignedup , setisSignedup] = useState(false);
  const form = useForm<z.infer<typeof signUpValidator>>({
    resolver: zodResolver(signUpValidator),
    defaultValues: {
      username: "",
      email: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof signUpValidator>) => {
    setisSignedup(false);
    const response = await axios.post("/api/sign-up", values);
    const url = `/verify/${username}?email=${encodeURIComponent(email)}&password=${encodeURIComponent(password)}`;

    // Redirect to the verification page with query parameters
    router.push(url);
    setisSignedup(true);
  };

  useEffect(() => {
    const checkUserName = async () => {
      try {
        const response = await axios.get(
          `/api/check-username-unique?username=${debouncedValue}`
        );
        setIsUserNameUnique(response.data.status === 200 ? true : false);
        setIsUserNameUniqueMessage(response.data.message);
      } catch (error) {
        console.error("Error:", error);
      }
    };
    checkUserName();
  }, [debouncedValue]);

  return (
    <div className="bg-slate-400 h-screen w-screen flex justify-center items-center">
      <div className="bg-white rounded-xl shadow-xl lg:w-2/5 w-full p-8">
        <h1 className="text-3xl font-bold text-gray-800 text-center mb-6">
          Sign Up
        </h1>
        <FormProvider {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-700">Username</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter your username"
                      className="border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200"
                      {...field}
                      onChange={(e) => {
                        field.onChange(e.target.value);
                        setUsername(e.target.value);
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {isUserNameUnique ? (
              <p className="text-green-600 text-sm">
                {isUserNameUniqueMessage}
              </p>
            ) : (
              <p className="text-red-600 text-sm">{isUserNameUniqueMessage}</p>
            )}

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
                      onChange={(e) => {
                        field.onChange(e.target.value);
                        setEmail(e.target.value);
                      }}
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
                      onChange={(e) => {
                        field.onChange(e.target.value);
                        setPassword(e.target.value);
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex flex-row justify-evenly">
              <p>Already a member</p>
              <div>
              <Link href="/sign-in">
                <div className="text-red-600 hover:text-black">Sign In</div>
              </Link>
              </div>
            </div>
            <div className="flex justify-center items-center">
              {!isUserNameUnique ? (
               <Button type="submit" disabled>Submit</Button>
              ) : (
                
                  (isSignedup)? 
                    (<Button type="submit">Submit</Button>)
                  : (<Loader/>)
                
              )}
            </div>
          </form>
        </FormProvider>
      </div>
    </div>
  );
};

export default SignUp;
