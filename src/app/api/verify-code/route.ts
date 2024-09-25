import dbConnect from "@/lib/dbconnection";
import userModel from "@/models/User";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    await dbConnect();
    
    const reqBody = await request.json();
    const { username, verifycode } = reqBody;

    const decodedusername = decodeURIComponent(username);
    const user = await userModel.findOne({ username: decodedusername });

    if (!user) {
        return NextResponse.json({
            status: 404,
            message: "User not found",
        }, { status: 404 });
    }

    if (user.isVerified) {
        return NextResponse.json({
            status: 200,
            message: "User already verified",
        });
    }

    const isVerificationCodeValid = (verifycode === user.verifyCode);
    const isVerificationCodeNotExpired = new Date(user.verifyCodeExpiry) > new Date();

    if (isVerificationCodeValid && isVerificationCodeNotExpired) {
        user.isVerified = true; 
        await user.save();
        return NextResponse.json({
            status: 200,
            message: "Verification successful",
        });
    } else if (!isVerificationCodeNotExpired) {
        return NextResponse.json({
            status: 403,
            message: "Verification code expired",
        });
    } else {
        return NextResponse.json({
            status: 402,
            message: "Invalid Verification code",
        });
    }
}
