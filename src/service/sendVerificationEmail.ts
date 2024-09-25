import VerificationEmail from "../../email/VerificationEmail";
import resend from "@/lib/resend";
import { ApiResponce } from "@/types/ApiResponce";

export async function sendVerificationEmail(email: string, username: string, otp: string): Promise<ApiResponce> {
    try {
        console.log("Sending email to:", email, "with OTP:", otp);
        
        const { data, error } = await resend.emails.send({
          from: 'Acme <onboarding@resend.dev>',
          to: [email],
            subject: 'Verification email',
            react: VerificationEmail({ username, otp }),
        });
        
        if (error) {
            console.error("Error sending email:", error); // Log the error
            return { success: false, message: "Failed to send email." };
        }
        
        return { success: true, message: "Email sent successfully" };
    } catch (error) {
        console.error("An error occurred while sending verification email:", error); // Log the error
        return { success: false, message: "An error occurred while sending the email." };
    }
}
