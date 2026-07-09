'use client'
import React, { useState } from 'react'
import { useRouter } from 'next/navigation';
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import Link from "next/link";
import { toast } from "sonner"
import axios, { AxiosError } from 'axios';
import { ApiResponse } from "@/types/ApiResponse"
import { Mail, MessageSquareText, Loader2, MailCheck } from 'lucide-react';

const resendCodeSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
});

function Page() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const form = useForm<z.infer<typeof resendCodeSchema>>({
    resolver: zodResolver(resendCodeSchema),
    defaultValues: { email: "" }
  });

  const onSubmit = async (data: z.infer<typeof resendCodeSchema>) => {
    setIsSubmitting(true);
    try {
      const response = await axios.post<ApiResponse>("/api/resend-code", data);
      toast.success(response.data.message);
      router.push(`/verify/${response.data.username}`);
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      const errorMessage = Array.isArray(axiosError.response?.data.messages)
        ? axiosError.response?.data.messages
            .map((msg) => (typeof msg === "string" ? msg : JSON.stringify(msg)))
            .join(", ")
        : axiosError.response?.data.message ?? "An error occurred while resending the code.";
      toast.error(errorMessage as string);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-orange-50 p-4">
      <div className="flex w-full max-w-4xl overflow-hidden rounded-2xl bg-white shadow-xl">

        {/* Left: brand panel */}
        <div className="relative hidden w-[45%] flex-col justify-between bg-gradient-to-br from-orange-500 to-orange-600 px-10 py-12 text-white lg:flex">
          <div className="flex items-center gap-2.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/15">
              <MessageSquareText className="h-5 w-5" strokeWidth={2} />
            </span>
            <span className="text-lg font-semibold tracking-tight">HiddenVoice</span>
          </div>

          <div>
            <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/15">
              <MailCheck className="h-6 w-6" strokeWidth={2} />
            </span>
            <h2 className="mt-6 text-2xl font-bold leading-snug">
              Didn't get your code?
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-orange-50">
              No problem — enter your username and we'll send a fresh verification code straight to your inbox.
            </p>
          </div>

          <p className="text-xs text-orange-100">© {new Date().getFullYear()} HiddenVoice, Inc.</p>
        </div>

        {/* Right: form */}
        <div className="w-full px-6 py-10 sm:px-10 lg:w-[55%] lg:px-12">
          <div className="mb-6 flex items-center gap-2.5 lg:hidden">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-orange-500">
              <MessageSquareText className="h-4 w-4 text-white" strokeWidth={2} />
            </span>
            <span className="text-base font-semibold tracking-tight text-gray-900">HiddenVoice</span>
          </div>

          <h1 className="text-2xl font-bold text-gray-900">Resend verification code</h1>
          <p className="mt-1.5 text-sm text-gray-500">
            Enter the email you signed up with and we'll send a new code.
          </p>

          <form onSubmit={form.handleSubmit(onSubmit)} className="mt-7 space-y-4">
            <div>
              <Controller
                name="email"
                control={form.control}
                render={({ field, fieldState }) => (
                  <>
                    <div className="relative">
                      <Mail className="pointer-events-none absolute left-3.5 top-1/2 h-4.5 w-4.5 -translate-y-1/2 text-gray-400" />
                      <input
                        {...field}
                        type="email"
                        placeholder="Email"
                        autoFocus
                        className="w-full rounded-xl border border-gray-300 py-2.5 pl-11 pr-4 text-sm text-gray-900 outline-none transition focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10"
                      />
                    </div>
                    {fieldState.error && (
                      <p className="mt-1.5 text-xs text-red-500">{fieldState.error.message}</p>
                    )}
                  </>
                )}
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-orange-500 py-2.5 text-sm font-semibold text-white shadow-sm shadow-orange-500/30 transition hover:bg-orange-600 disabled:opacity-60"
            >
              {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
              {isSubmitting ? "Sending code..." : "Resend code"}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-500">
            Remembered your code?{" "}
            <Link href="/sign-in" className="font-medium text-orange-600 hover:text-orange-700">
              Back to sign in
            </Link>
          </p>
          <p className="mt-2 text-center text-sm text-gray-500">
            Don't have an account?{" "}
            <Link href="/sign-up" className="font-medium text-orange-600 hover:text-orange-700">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default Page