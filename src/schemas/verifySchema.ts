import {z} from 'zod';


export const verifyVelidator = z.object({
    verifycode : z.string().length(6, 'verification code should be 6 characters long')
})