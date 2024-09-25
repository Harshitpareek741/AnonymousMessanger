import { Message } from "@/models/User";

export interface ApiResponce {
    success: boolean;
    message: string;
    isAccepted ?: boolean;
    messages ?: Array<Message>
}