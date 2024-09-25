import { z } from "zod";

const emailValidator = z.string()
.email()

export const signInValidator = z.object({
    email : emailValidator,
    password : z.string().min(8),
})