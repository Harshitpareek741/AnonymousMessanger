import dbConnect from "@/lib/dbconnection";
import userModel, { Message } from "@/models/User";
import { NextResponse } from "next/server";




dbConnect();
export async function POST(request : Request){
    const {username , message} = await request.json();
    console.log("anothr" + username , message);
    try{
    const user = await userModel.findOne({username});
    if(!user?.isVerified){
        return NextResponse.json({
            message : "user not verified",
        })
    }
    if(!user?.isAcceptingMessage){
        return NextResponse.json({
            message : "user not accepting messages",
        })
    }
    const messages = {content : message , 
                createdAt : new Date(),
    }
    user?.messages.push(messages as Message);
    await user.save();
    return NextResponse.json({
        message : "Your Message sent successfully"
    })
}
catch(err){
    console.log(err);
    return NextResponse.json({
        message : "failed to save message",
        error : err,
    })
}
}