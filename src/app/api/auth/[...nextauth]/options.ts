import CredentialsProvider from "next-auth/providers/credentials";
import dbConnect from "@/lib/dbconnection";
import userModel from "@/models/User";
import bcrypt from "bcrypt";
import { NextAuthOptions } from "next-auth";

export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            id: "credentials",
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "text" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials: any): Promise<any> {
                await dbConnect();
                const user = await userModel.findOne({
                   email: credentials.email,
                });
            
                if (!user) {
                    throw new Error("User not found");
                }

                if (user.isVerified) {
                    const isPasswordValid = await bcrypt.compare(credentials.password, user.password);
                    if (isPasswordValid) {
                        console.log("user signed in successfully");
                        return user;
                    } else {
                        throw new Error("Invalid credentials");
                    }
                } else {
                    throw new Error("User not verified");
                }
            }
        }),
    ],

    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token._id = user._id?.toString();
                token.username = user.username;
                token.email = user.email;
                token.isVerified = user.isVerified;
                token.isAcceptingMessage = user.isAcceptingMessage;
            }
            return token;
        },
        async session({ session, token }) {
            if (token) {
                session.user._id = token._id;
                session.user.username = token.username;
                session.user.isVerified = token.isVerified;
                session.user.isAcceptingMessage = token.isAcceptingMessage;
            }
            return session;
        },
    },

    pages: {
        signIn: '/sign-in',
    },

    session: {
        strategy: "jwt",
    },

    secret: process.env.NEXTAUTH_SECRET,
};
