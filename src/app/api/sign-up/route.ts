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
            // Update the existing user details
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
            // Create a new user
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

            await newUser.save();
            
        }

        // Set the user as verified if the email ends with '@skit.ac.in'
        if (email.endsWith("@skit.ac.in")) {
            const userToVerify = await userModel.findOne({ email });
            if (userToVerify) {
                userToVerify.isVerified = true;
                console.log(userToVerify.isVerified);
                console.log("User saved");
                await userToVerify.save();
                return NextResponse.json({
                    success: true,
                    message: "User registered successfully, email verification required"
                })
            }
        }

        // Send the verification email
        const response = await sendVerificationEmail(email, username, verifyCode);
        if (!response.success) {
            return NextResponse.json({ success: false, message: response.message }, { status: 500 });
        }

        return NextResponse.json({ success: true, message: "User registered successfully, verification email sent" }, { status: 200 });

    } catch (error) {
        console.error("Error during user registration:", error);
        return NextResponse.json({ success: false, message: "Error during registration" }, { status: 500 });
    }
}
