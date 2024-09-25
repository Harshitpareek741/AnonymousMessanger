import { z } from "zod";

export const userNameValidator = z.string()
                          .min(2, "userName must contain at least two characters")
                          .max(20 , "userName only contain twenty characters")
                          .regex(/^[a-zA-Z0-9]+$/
                            ,"username should not contain special characters")


export const signUpValidator = z.object({
    username : userNameValidator,
    password : z.string().min(8, {message: "Please enter at leaset eight characters"}),
    email : z.string().email({message : "Email shoudl be specified"}),
});