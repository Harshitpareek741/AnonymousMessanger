import dbConnect from "@/lib/dbconnection";
import userModel, { Message } from "@/models/User";
import { getServerSession, User } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import { NextResponse } from "next/server";

dbConnect(); // Ensure database connection

export async function GET() {
    // Retrieve the session using next-auth
    const session = await getServerSession(authOptions);

    if (!session || !session?.user) {
        // Return a response if the user is not found in the session
        return NextResponse.json({
            message: "User not found",
        }, { status: 401 });
    }

    // Get the username from the session
    const usert = session?.user as User;
    const username = usert.username;

    // Query the database for the user by username
    const user = await userModel.findOne({ username });
    
    if (!user || !user.messages) {
        // Return a response if the user or their messages are not found
        return NextResponse.json({
            message: "No messages found for the user",
        }, { status: 404 });
    }

    // Retrieve messages and return them as a JSON response
    const messages = user.messages as Message[];
    return NextResponse.json({
        messages: messages,
    });
}
