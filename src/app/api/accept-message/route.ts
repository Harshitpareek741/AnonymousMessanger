import dbConnect from "@/lib/dbconnection";
import userModel from "@/models/User";
import { getServerSession, User } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "../auth/[...nextauth]/options";



dbConnect();

export async function POST(request : Request){
    const session =  await getServerSession(authOptions);
    if(!session || !session.user) {
        return NextResponse.json({
            status : 401,
            message : "Unauthorized"
        });
    }
    const user : User = session?.user as User ; 

    if(!user.isVerified){
        return NextResponse.json({
            status : 403,
            message : "User not verified"
        })
    }
    const {acceptMessage} = await request.json();

    try{
      const updateUser = await userModel.findOneAndUpdate(
        {username : user.username}, 
        {isAcceptingMessage : acceptMessage},
        {new : true}
      );
      if(!updateUser){
        return NextResponse.json({
            status : 404,
            message : "User not found"
        })
      }
      else {
        return NextResponse.json({
            status : 200,
            message : "Message acceptance updated successfully"
        })
      }
    }
    catch(error){
        return NextResponse.json({
            message : error
        });
    }
}

export async function GET(request : Request){
    const session = await getServerSession(authOptions);
    if(!session || !session.user) {
        return NextResponse.json({
            status : 401,
            message : "Unauthorized"
        });
    }
    const user : User = session?.user as User ; 
    if(!user.isVerified){
        return NextResponse.json({
            status : 403,
            message : "User not verified"
        })
    }
    else{
        return NextResponse.json({
            status : 200,
            isAcceptingMessage : user.isAcceptingMessage
        })
    }
}