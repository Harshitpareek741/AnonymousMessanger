import dbConnect from "@/lib/dbconnection";
import userModel from "@/models/User";
import { sendVerificationEmail } from "@/service/sendVerificationEmail";
import bcrypt from "bcrypt";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
    await dbConnect();
    const verifyCode = Math.floor(100000 + Math.random() * 900000).toString();
    const reqBody = await request.json();
    const { username, email, password } = reqBody;

    try {
        const existingUser = await userModel.findOne({ email });
        if (existingUser) {
            if (existingUser.isVerified) {
                return NextResponse.json({ error: "User already exists" }, { status: 400 });
            } else {
                const hashedPassword = await bcrypt.hash(password, 10);
                existingUser.username = username;
                existingUser.password = hashedPassword;
                existingUser.verifyCode = verifyCode;
                existingUser.verifyCodeExpiry = new Date(Date.now() + 3600000); // 1 hour expiry
                await existingUser.save();
            }
        } else {
            const hashedPassword = await bcrypt.hash(password, 10);
            const newUser = new userModel({
                username,
                email,
                password: hashedPassword,
                verifyCode,
                verifyCodeExpiry: new Date(Date.now() + 3600000),
                isVerified: false,
                isAcceptingMessage: true,
                messages: []
            });
         
        try{  await newUser.save();}
        catch(err){ console.log("error in saving" + err);}
        }
    } catch (error) {
        console.error("Error during user registration:", error);
        return NextResponse.json({ success: false, message: "Error during registration" }, { status: 500 });
    }

    try {
        const response = await sendVerificationEmail(email, username, verifyCode);

        if (!response.success) {
            return NextResponse.json({ success: false, message: response.message }, { status: 500 });
        }

        return NextResponse.json({ success: true, message: "Verification email sent successfully" }, { status: 200 });

    } catch (error) {
        console.error("Error sending verification email:", error);
        return NextResponse.json({ success: false, message: "Failed to send verification email" }, { status: 500 });
    }
}
