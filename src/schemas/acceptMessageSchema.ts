import {z} from 'zod';


const isAcceptingMessageValidator = z.boolean();

export const acceptMessageSchema = z.object({
    isAcceptingMessage : isAcceptingMessageValidator
});

