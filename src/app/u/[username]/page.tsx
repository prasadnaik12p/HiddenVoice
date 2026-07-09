'use client';

import React, { useState } from 'react';
import axios, { AxiosError } from 'axios';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Loader2, Send, Sparkles, MessageSquareText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { CardHeader, CardContent, Card } from '@/components/ui/card';
import { useCompletion } from '@ai-sdk/react';
import { toast } from 'sonner';
import * as z from 'zod';
import { ApiResponse } from '@/types/ApiResponse';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { messageSchema } from '@/schemas/messageSchema';

const specialChar = '||';

const parseStringMessages = (messageString: string): string[] => {
  return messageString.split(specialChar);
};

const initialMessageString =
  "What's your favorite movie?||Do you have any pets?||What's your dream job?";

export default function SendMessage() {
  const params = useParams<{ username: string }>();
  const username = params.username;

  const {
    complete,
    completion,
    isLoading: isSuggestLoading,
    error,
  } = useCompletion({
    api: '/api/suggest-messages',
    initialCompletion: initialMessageString,
    streamProtocol: 'text',
  });

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    getValues,
    formState: { errors },
  } = useForm<z.infer<typeof messageSchema>>({
    resolver: zodResolver(messageSchema),
  });

  const messageContent = watch('content');

  const handleMessageClick = (message: string) => {
    setValue('content', message, { shouldValidate: true });
  };

  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = async (data: z.infer<typeof messageSchema>) => {
    setIsLoading(true);
    try {
      const response = await axios.post<ApiResponse>('/api/send-message', {
        ...data,
        username,
      });

      toast.success(response.data.message);
      reset({ ...getValues(), content: '' });
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast.error('Error', {
        description:
          axiosError.response?.data.message ?? 'Failed to sent message',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const fetchSuggestedMessages = async () => {
    try {
      complete('');
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 via-white to-white py-12 px-4">
      <div className="container mx-auto max-w-3xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 bg-orange-100 text-orange-600 px-4 py-1.5 rounded-full text-sm font-medium mb-4">
            <Sparkles className="w-4 h-4" />
            100% Anonymous
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900">
            Send a message to{' '}
            <span className="text-orange-600">@{username}</span>
          </h1>
          <p className="text-gray-500 mt-2">
            Your identity stays completely hidden. Say what you really think.
          </p>
        </div>

        {/* Message form */}
        <Card className="border-orange-100 shadow-sm mb-8">
          <CardContent className="pt-6">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="space-y-2">
                <label
                  htmlFor="content"
                  className="block text-sm font-medium text-gray-700"
                >
                  Your anonymous message
                </label>
                <textarea
                  id="content"
                  placeholder="Write your anonymous message here..."
                  className="w-full resize-none min-h-[120px] rounded-md border border-orange-200 bg-white px-3 py-2 text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-orange-400"
                  {...register('content')}
                />
                {errors.content && (
                  <p className="text-sm text-red-500">
                    {errors.content.message as string}
                  </p>
                )}
              </div>

              <div className="flex justify-center">
                {isLoading ? (
                  <Button disabled className="bg-orange-400 text-white px-8">
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Please wait
                  </Button>
                ) : (
                  <Button
                    type="submit"
                    disabled={isLoading || !messageContent}
                    className="bg-orange-500 hover:bg-orange-600 text-white px-8"
                  >
                    <Send className="mr-2 h-4 w-4" />
                    Send It
                  </Button>
                )}
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Suggested messages */}
        <div className="space-y-4 mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div className="flex items-center gap-2">
              <MessageSquareText className="w-5 h-5 text-orange-500" />
              <h3 className="text-lg font-semibold text-gray-800">
                Need inspiration?
              </h3>
            </div>
            <Button
              onClick={fetchSuggestedMessages}
              disabled={isSuggestLoading}
              variant="outline"
              className="border-orange-300 text-orange-600 hover:bg-orange-50"
            >
              {isSuggestLoading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Sparkles className="mr-2 h-4 w-4" />
              )}
              Suggest Messages
            </Button>
          </div>
          <p className="text-sm text-gray-400">
            Click on any message below to use it.
          </p>

          <Card className="border-orange-100 shadow-sm">
            <CardHeader className="bg-orange-50/60 rounded-t-lg">
              <h3 className="text-base font-semibold text-gray-800">
                Suggested Messages
              </h3>
            </CardHeader>
            <CardContent className="flex flex-col space-y-3 pt-4">
              {error ? (
                <p className="text-red-500 text-sm">{error.message}</p>
              ) : (
                parseStringMessages(completion).map((message, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    className="justify-start text-left h-auto py-3 border-orange-200 text-gray-700 hover:bg-orange-50 hover:border-orange-300 hover:text-orange-700 whitespace-normal"
                    onClick={() => handleMessageClick(message)}
                  >
                    {message}
                  </Button>
                ))
              )}
            </CardContent>
          </Card>
        </div>

        <Separator className="my-8 bg-orange-100" />

        {/* CTA */}
        <div className="text-center bg-orange-500 rounded-2xl py-10 px-6 text-white">
          <h2 className="text-xl md:text-2xl font-bold mb-2">
            Want your own message board?
          </h2>
          <p className="text-orange-50 mb-6">
            Create a free HiddenVoice account and start collecting anonymous feedback.
          </p>
          <Link href={'/sign-up'}>
            <Button className="bg-white text-orange-600 hover:bg-orange-50 px-8">
              Create Your Account
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}