'use client'
import React from 'react';
import axios, { AxiosError } from 'axios';
import dayjs from 'dayjs';
import { X, Mail } from 'lucide-react';
import { toast } from 'sonner';
import { MessageClient } from '@/types/Message';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Button } from './ui/button';
import { ApiResponse } from '@/types/ApiResponse';
import { Types } from 'mongoose';

type MessageCardProps = {
  message: MessageClient;   
  onMessageDelete: (messageId: string) => void;
};

export function MessageCard({ message, onMessageDelete }: MessageCardProps) {
  const handleDeleteConfirm = async () => {
    try {
      const response = await axios.delete<ApiResponse>(
        `/api/delete-message/${message._id}`
      );
      toast.success(response.data.message);
      onMessageDelete(message._id);
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast.error('Error', {
        description:
          axiosError.response?.data.message ?? 'Failed to delete message',
      });
    }
  };

  return (
    <Card className="border-orange-100 shadow-sm hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start gap-3">
          <div className="flex items-start gap-2">
            <Mail className="w-4 h-4 text-orange-500 mt-1 shrink-0" />
            <CardTitle className="text-base font-semibold text-gray-800 leading-snug">
              {message.content}
            </CardTitle>
          </div>

          <AlertDialog>
            <AlertDialogTrigger
              render={
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 shrink-0 text-gray-400 hover:text-red-500 hover:bg-red-50"
                />
              }
            >
              <X className="w-4 h-4" />
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete
                  this message.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  className="bg-red-500 hover:bg-red-600 focus:ring-red-500"
                  onClick={handleDeleteConfirm}
                >
                  Continue
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
        <div className="flex items-center gap-2 mt-1">
          <span className="text-xs font-medium text-orange-600 bg-orange-50 px-2 py-0.5 rounded-full">
            Anonymous
          </span>
          <span className="text-xs text-gray-400">
            {dayjs(message.createdAt).format('MMM D, YYYY h:mm A')}
          </span>
        </div>
      </CardHeader>
      <CardContent></CardContent>
    </Card>
  );
}