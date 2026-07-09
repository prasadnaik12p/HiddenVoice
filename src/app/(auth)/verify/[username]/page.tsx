'use client';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { redirect, useParams, useRouter } from 'next/navigation';
import axios, { AxiosError } from 'axios';
import { toast } from 'sonner';
import { ApiResponse } from '@/types/ApiResponse';
import { verifySchema } from '@/schemas/verifySchema';
import { ShieldCheck, MessageSquareText } from 'lucide-react';

export default function VerifyAccount() {
  const router = useRouter();
  const params = useParams<{ username: string }>();

  const form = useForm<z.infer<typeof verifySchema>>({
    resolver: zodResolver(verifySchema),
  });

  const onSubmit = async (data: z.infer<typeof verifySchema>) => {
    try {
      const response = await axios.post<ApiResponse>(`/api/verify-code`, {
        username: params.username,
        code: data.code,
      });
      toast.success(response.data.message);
      router.replace('/sign-in');
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast.error(
        axiosError.response?.data.message ?? 'An error occurred. Please try again.'
      );
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-orange-50 p-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-xl sm:p-10">
        <div className="flex justify-center">
          <span className="flex h-14 w-14 items-center justify-center rounded-full bg-orange-100">
            <ShieldCheck className="h-7 w-7 text-orange-600" strokeWidth={2} />
          </span>
        </div>

        <div className="mt-5 text-center">
          <h1 className="text-2xl font-bold text-gray-900">Verify your account</h1>
          <p className="mt-2 text-sm text-gray-500">
            Enter the verification code sent to your email
            {params?.username && (
              <>
                {' '}for <span className="font-medium text-gray-700">{params.username}</span>
              </>
            )}
            .
          </p>
        </div>

        <form onSubmit={form.handleSubmit(onSubmit)} className="mt-7 space-y-4">
          <div>
            <input
              {...form.register('code')}
              type="text"
              inputMode="numeric"
              placeholder="Enter code"
              maxLength={6}
              className="w-full rounded-xl border border-gray-300 py-3 text-center text-lg tracking-[0.4em] text-gray-900 outline-none transition focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10"
            />
            {form.formState.errors.code && (
              <p className="mt-1.5 text-center text-xs text-red-500">
                {form.formState.errors.code.message}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={form.formState.isSubmitting}
            className="w-full rounded-xl bg-orange-500 py-3 text-sm font-semibold text-white shadow-sm shadow-orange-500/30 transition hover:bg-orange-600 disabled:opacity-60"
          >
            {form.formState.isSubmitting ? 'Verifying...' : 'Verify account'}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-500">
          Didn&apos;t get a code?{' '}
          <button
            type="button"
            onClick={() => {redirect("/resend")}}
            className="font-medium text-orange-600 hover:text-orange-700"
          >
            Resend
          </button>
        </p>

        <div className="mt-6 flex items-center justify-center gap-2 border-t border-gray-100 pt-5 text-xs text-gray-400">
          <MessageSquareText className="h-3.5 w-3.5" />
          HiddenVoice
        </div>
      </div>
    </div>
  );
}