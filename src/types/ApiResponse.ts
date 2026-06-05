import { Message } from "@/models/User"  //We are creating this only for type safety

export interface ApiResponse{
  success: boolean;
    message: string;
    isAcceptingMessages?: boolean;
    messages?:Array<Message>;
}

