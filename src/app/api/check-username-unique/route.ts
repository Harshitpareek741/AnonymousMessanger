import dbConnect from "@/lib/dbconnection";
import userModel from "@/models/User";
import { userNameValidator } from "@/schemas/signUpSchema";
import { NextResponse } from "next/server";

dbConnect();

export async function GET(request : Request){
   
   try{
    const {searchParams} = new URL(request.url);
    const queryParams = {
        username : searchParams.get('username'),
    }
    console.log(queryParams);
   const result = userNameValidator.safeParse(queryParams.username);
   console.log("result" + result.success);
   if(!result.success){
    const errorMessages = result.error.errors.map(err => err.message);
     return NextResponse.json({
        status : 405 , 
        message : errorMessages,
     });
   }
   const username = queryParams.username ; 
   console.log(username);
   
   const isUserExist = await userModel.findOne({username});
   
   if(isUserExist){
     return NextResponse.json({
        status : 409 , 
        message : "User already exist",
     });
   }
   else{
    return NextResponse.json({
        status : 200 , 
        message : "User is Unique",
     });
   }
}
catch(err){
    console.log(err);
    return NextResponse.json({
        status : 500 , 
        message : "Something went wrong",
    });
}

}