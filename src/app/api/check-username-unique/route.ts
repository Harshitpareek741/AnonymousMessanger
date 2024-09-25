import dbConnect from "@/lib/dbconnection";
import userModel from "@/models/User";
import { userNameValidator } from "@/schemas/signUpSchema";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
    await dbConnect();
    
    try {
        // Read the search parameters directly from the request object
        const url = new URL(request.url);
        const username = url.searchParams.get('username');

        console.log("Username from query params:", username);

        // Validate the username
        const result = userNameValidator.safeParse(username);
        console.log("Validation result:", result.success);

        if (!result.success) {
            const errorMessages = result.error.errors.map(err => err.message);
            return NextResponse.json({
                status: 405,
                message: errorMessages,
            });
        }

        // Check if the user already exists
        const isUserExist = await userModel.findOne({ username });

        if (isUserExist) {
            return NextResponse.json({
                status: 409,
                message: "User already exists",
            });
        } else {
            return NextResponse.json({
                status: 200,
                message: "User is unique",
            });
        }
    } catch (err) {
        console.error("Error:", err);
        return NextResponse.json({
            status: 500,
            message: "Something went wrong",
        });
    }
}
