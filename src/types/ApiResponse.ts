import { MessageClient } from '@/types/Message';

export interface ApiResponse {
  success: boolean;
  message: string;
  isAcceptingMessages?: boolean;
  messages?: Array<MessageClient>;
}