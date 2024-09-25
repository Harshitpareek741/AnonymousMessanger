import userModel from "@/models/User";
import { NextResponse } from "next/server";

interface usecreate{
    createdAt: Date;
    username : string
}
export async function POST(request : Request){
   try{ 
    const {createdAt , username} = <usecreate> await request.json();
    const result = await userModel.updateOne(
        {username : username},
        { $pull: { messages: { createdAt: createdAt } } } 
    );

    if (result.modifiedCount > 0) {
        return NextResponse.json({
            message: "Message deleted successfully",
            success: true,
        })
      } else {
        return NextResponse.json({
            message: "No message found to delete",
            success: false,
        })
      }
    } catch (error) {
      console.error("Error deleting message:", error);
    }
}