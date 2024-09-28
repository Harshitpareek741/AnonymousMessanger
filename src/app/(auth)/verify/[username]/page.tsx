"use client";

import { Button } from "@/components/ui/button";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { verifyVelidator } from "@/schemas/verifySchema";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { signIn } from "next-auth/react";
import { useParams, useSearchParams, useRouter } from "next/navigation"; // Correct import from 'next/navigation'
import React, { useEffect } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { z } from "zod";
import { v4 as uuidv4 } from 'uuid';

const Verify = () => {
  const { toast } = useToast();
  const params = useParams();
  const router = useRouter(); // Use useRouter from next/navigation
  const searchParams = useSearchParams(); // Correct usage from next/navigation

  const username = params.username;
  const email = searchParams.get("email");
  const password = searchParams.get("password");
  
  useEffect(()=>{
    async function directLogin(){
      if(!email)return ; 

      if(email.endsWith("@skit.ac.in")){
        console.log("yeee");
        toast({
          title: "user successfully registered",
        });

        const result = await signIn("credentials", {
          redirect: false,
          email: email,
          password: password,
        });
    
        if (result?.error) {
          toast({
            title: "Error",
            description: result.error,
            variant: "default",
          });
        } else {
          router.push("/"); // Ensure this uses the correct router from next/navigation
        }
      }
    }
      directLogin();
  },[email , password]);

  const onSubmit = async (values: z.infer<typeof verifyVelidator>) => {
    const payload = { ...values, username };
    
    try {
      const response = await axios.post("/api/verify-code", payload);
      if (response.data.status === 200) {
        toast({
          title: "user successfully registered",
        });

        const result = await signIn("credentials", {
          redirect: false,
          email: email,
          password: password,
        });

        if (result?.error) {
          toast({
            title: "Error",
            description: result.error,
            variant: "default",
          });
        } else {
          router.push("/"); // Ensure this uses the correct router from next/navigation
        }
      } else {
        toast({
          title: response.data.message,
        });
      }
    } catch (err) {
      console.error("Error: ", err);
    }
  };

  const form = useForm<z.infer<typeof verifyVelidator>>({
    resolver: zodResolver(verifyVelidator),
    defaultValues: {
      verifycode: "000-000",
    },
  });

  return (
    <div className="flex h-screen w-screen justify-center items-center">
      <div className="text-center">
      <h1>if u loged in Directly wait for few seconds</h1>
        <h1>Welcome {username}</h1>
        <FormProvider {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="verifycode"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Verification Code</FormLabel>
                  <FormControl>
                    <Input placeholder="Verification Code" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit">Submit</Button>
          </form>
        </FormProvider>
      </div>
    </div>
  );
};

export default Verify;
