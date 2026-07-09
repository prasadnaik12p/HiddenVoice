'use client';

import { MessageCard } from '@/components/MessageCard';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { MessageClient } from '@/types/Message';
import { ApiResponse } from '@/types/ApiResponse';
import { zodResolver } from '@hookform/resolvers/zod';
import axios, { AxiosError } from 'axios';
import { Loader2, RefreshCcw, Copy, Link2, Inbox, ShieldCheck } from 'lucide-react';
import { User } from 'next-auth';
import { useSession } from 'next-auth/react';
import React, { useCallback, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { AcceptMessageSchema } from '@/schemas/acceptMessageSchema';

function UserDashboard() {
    const [messages, setMessages] = useState<MessageClient[]>([]);  // was: Message[]
  const [isLoading, setIsLoading] = useState(false);
  const [isSwitchLoading, setIsSwitchLoading] = useState(false);

  const handleDeleteMessage = (messageId: string) => {
    setMessages(messages.filter((message) => message._id !== messageId));
  };

  const { data: session } = useSession();

  const form = useForm({
    resolver: zodResolver(AcceptMessageSchema),
  });

  const { register, watch, setValue } = form;
  const acceptMessages = watch('acceptMessages');

  const fetchAcceptMessages = useCallback(async () => {
  setIsSwitchLoading(true);
  try {
    const response = await axios.get<ApiResponse>('/api/accept-messages');
    setValue('acceptMessages', response.data.isAcceptingMessages ?? false);
  } catch (error) {
    const axiosError = error as AxiosError<ApiResponse>;
    toast.error('Error', {
      description:
        axiosError.response?.data.message ??
        'Failed to fetch message settings',
    });
  } finally {
    setIsSwitchLoading(false);
  }
}, [setValue]);

  const fetchMessages = useCallback(
    async (refresh: boolean = false) => {
      setIsLoading(true);
      setIsSwitchLoading(false);
      try {
        const response = await axios.get<ApiResponse>('/api/get-messages');
        setMessages(response.data.messages || []);
        if (refresh) {
          toast.success('Refreshed Messages', {
            description: 'Showing latest messages',
          });
        }
      } catch (error) {
        const axiosError = error as AxiosError<ApiResponse>;
        toast.error('Error', {
          description:
            axiosError.response?.data.message ?? 'Failed to fetch messages',
        });
      } finally {
        setIsLoading(false);
        setIsSwitchLoading(false);
      }
    },
    [setIsLoading, setMessages]
  );

  // Fetch initial state from the server
  useEffect(() => {
    if (!session || !session.user) return;

    fetchMessages();
    fetchAcceptMessages();
  }, [session, setValue, fetchAcceptMessages, fetchMessages]);

  // Handle switch change
  const handleSwitchChange = async () => {
    try {
      const response = await axios.post<ApiResponse>('/api/accept-messages', {
        acceptMessages: !acceptMessages,
      });
      setValue('acceptMessages', !acceptMessages);
      toast.success(response.data.message);
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast.error('Error', {
        description:
          axiosError.response?.data.message ??
          'Failed to update message settings',
      });
    }
  };

  if (!session || !session.user) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-6 w-6 animate-spin text-orange-500" />
      </div>
    );
  }

  const { username } = session.user as User;

  const baseUrl = `${window.location.protocol}//${window.location.host}`;
  const profileUrl = `${baseUrl}/u/${username}`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(profileUrl);
    toast.success('URL Copied!', {
      description: 'Profile URL has been copied to clipboard.',
    });
  };

  return (
    <div className="my-8 mx-4 md:mx-8 lg:mx-auto p-6 md:p-8 bg-white rounded-2xl shadow-sm border border-orange-100 w-full max-w-6xl">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900">
            Welcome back, <span className="text-orange-600">{username}</span>
          </h1>
          <p className="text-gray-500 mt-1">
            Manage your anonymous inbox and profile link below.
          </p>
        </div>
        <Badge
          variant="outline"
          className={`self-start md:self-auto px-3 py-1.5 text-sm font-medium ${
            acceptMessages
              ? 'border-orange-300 text-orange-600 bg-orange-50'
              : 'border-gray-300 text-gray-500 bg-gray-50'
          }`}
        >
          <ShieldCheck className="w-4 h-4 mr-1.5" />
          {acceptMessages ? 'Accepting Messages' : 'Not Accepting Messages'}
        </Badge>
      </div>

      {/* Profile link card */}
      <Card className="mb-6 border-orange-100 shadow-sm">
        <CardContent className="pt-6">
          <div className="flex items-center gap-2 mb-3">
            <Link2 className="w-5 h-5 text-orange-500" />
            <h2 className="text-lg font-semibold text-gray-800">
              Your Unique Link
            </h2>
          </div>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
            <input
              type="text"
              value={profileUrl}
              disabled
              className="flex-1 rounded-md border border-orange-200 bg-orange-50/50 px-3 py-2 text-sm text-gray-700 focus:outline-none"
            />
            <Button
              onClick={copyToClipboard}
              className="bg-orange-500 hover:bg-orange-600 text-white"
            >
              <Copy className="w-4 h-4 mr-2" />
              Copy Link
            </Button>
          </div>
          <p className="text-xs text-gray-400 mt-2">
            Share this link anywhere to start receiving anonymous feedback.
          </p>
        </CardContent>
      </Card>

      {/* Accept messages toggle */}
      <Card className="mb-6 border-orange-100 shadow-sm">
        <CardContent className="pt-6 flex items-center justify-between">
          <div>
            <h2 className="text-base font-semibold text-gray-800">
              Accept Messages
            </h2>
            <p className="text-sm text-gray-500">
              Turn this off to stop receiving new anonymous messages.
            </p>
          </div>
          <div className="flex items-center gap-3">
            {isSwitchLoading && (
              <Loader2 className="h-4 w-4 animate-spin text-orange-500" />
            )}
            <Switch
              {...register('acceptMessages')}
              checked={acceptMessages}
              onCheckedChange={handleSwitchChange}
              disabled={isSwitchLoading}
              className="data-[state=checked]:bg-orange-500"
            />
          </div>
        </CardContent>
      </Card>

      <Separator className="mb-6 bg-orange-100" />

      {/* Messages header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Inbox className="w-5 h-5 text-orange-500" />
          <h2 className="text-lg font-semibold text-gray-800">
            Your Messages
          </h2>
          <Badge variant="secondary" className="bg-orange-100 text-orange-700 hover:bg-orange-100">
            {messages.length}
          </Badge>
        </div>
        <Button
          variant="outline"
          className="border-orange-300 text-orange-600 hover:bg-orange-50"
          onClick={(e) => {
            e.preventDefault();
            fetchMessages(true);
          }}
        >
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <RefreshCcw className="h-4 w-4" />
          )}
          <span className="ml-2 hidden sm:inline">Refresh</span>
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {messages.length > 0 ? (
          messages.map((message) => (
            <MessageCard
              key={message._id}
              message={message}
              onMessageDelete={handleDeleteMessage}
            />
          ))
        ) : (
          <div className="col-span-full flex flex-col items-center justify-center py-16 text-center border border-dashed border-orange-200 rounded-xl bg-orange-50/30">
            <Inbox className="w-10 h-10 text-orange-300 mb-3" />
            <p className="text-gray-500 font-medium">No messages yet</p>
            <p className="text-sm text-gray-400 mt-1">
              Share your link to start receiving anonymous feedback.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default UserDashboard;