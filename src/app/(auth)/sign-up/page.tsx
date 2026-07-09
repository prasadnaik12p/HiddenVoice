'use client'
import React, { useState } from 'react'
import { useRouter } from 'next/navigation';
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import Link from "next/link";
import { toast } from "sonner"
import { useDebounceValue } from 'usehooks-ts';
import axios, { AxiosError } from 'axios';
import { signUpSchema } from '@/schemas/signUpschema';
import { ApiResponse } from "@/types/ApiResponse"
import { User, Mail, Lock, Eye, EyeOff, CheckCircle2, XCircle, MessageSquareText } from 'lucide-react';

function Page() {
  const [username, setUsername] = useState("");
  const [usernameMessage, setUsernameMessage] = useState("");
  const [isCheckingUsername, setIsCheckingUsername] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [debounceUsername] = useDebounceValue(username, 300);
  const router = useRouter();

  const form = useForm<z.infer<typeof signUpSchema>>({
    resolver: zodResolver(signUpSchema),
    defaultValues: { username: "", email: "", password: "" }
  });

  React.useEffect(() => {
    const checkUsernameUnique = async () => {
      if (!debounceUsername) return;
      setIsCheckingUsername(true);
      setUsernameMessage("");
      try {
        const response = await axios.get<ApiResponse>(`/api/check-username-unique?username=${debounceUsername}`);
        setUsernameMessage(response.data.message);
      } catch (error) {
        const axiosError = error as AxiosError<ApiResponse>;
        setUsernameMessage(
          (axiosError.response?.data.message as string) ??
            "An error occurred while checking the username."
        );
      } finally {
        setIsCheckingUsername(false);
      }
    }
    checkUsernameUnique();
  }, [debounceUsername]);

  const onSubmit = async (data: z.infer<typeof signUpSchema>) => {
    setIsSubmitting(true);
    try {
      const response = await axios.post<ApiResponse>("/api/sign-up", data);
      toast.success(response.data.message);
      router.push(`/verify/${data.username}`);
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      const errorMessage = Array.isArray(axiosError.response?.data.messages)
        ? axiosError.response?.data.messages
            .map((msg) => (typeof msg === "string" ? msg : JSON.stringify(msg)))
            .join(", ")
        : axiosError.response?.data.message ?? "An error occurred during registration.";
      toast.error(errorMessage as string);
    } finally {
      setIsSubmitting(false);
    }
  }

  const isAvailable = usernameMessage.toLowerCase().includes("available");

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
            <h2 className="text-2xl font-bold leading-snug">
              Honest feedback, without the awkward conversation.
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-orange-50">
              Share what you really think — and hear what others really think of you — completely anonymously.
            </p>

            <div className="mt-8 space-y-3">
              {["No names attached, ever", "Free to get started", "Takes less than a minute"].map((item) => (
                <div key={item} className="flex items-center gap-2.5 text-sm">
                  <CheckCircle2 className="h-4 w-4 flex-shrink-0" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
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

          <h1 className="text-2xl font-bold text-gray-900">Create your account</h1>
          <p className="mt-1.5 text-sm text-gray-500">Takes less than a minute to get started.</p>

          <form onSubmit={form.handleSubmit(onSubmit)} className="mt-7 space-y-4">
            <div>
              <Controller
                name="username"
                control={form.control}
                render={({ field, fieldState }) => (
                  <>
                    <div className="relative">
                      <User className="pointer-events-none absolute left-3.5 top-1/2 h-4.5 w-4.5 -translate-y-1/2 text-gray-400" />
                      <input
                        {...field}
                        type="text"
                        placeholder="Username"
                        onChange={(e) => {
                          field.onChange(e);
                          setUsername(e.target.value);
                        }}
                        className="w-full rounded-xl border border-gray-300 py-2.5 pl-11 pr-10 text-sm text-gray-900 outline-none transition focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10"
                      />
                      {!isCheckingUsername && usernameMessage && (
                        isAvailable
                          ? <CheckCircle2 className="absolute right-3.5 top-1/2 h-4.5 w-4.5 -translate-y-1/2 text-green-500" />
                          : <XCircle className="absolute right-3.5 top-1/2 h-4.5 w-4.5 -translate-y-1/2 text-red-500" />
                      )}
                    </div>
                    {isCheckingUsername && (
                      <p className="mt-1.5 text-xs text-gray-400">Checking availability...</p>
                    )}
                    {!isCheckingUsername && usernameMessage && (
                      <p className={`mt-1.5 text-xs ${isAvailable ? "text-green-600" : "text-red-500"}`}>
                        {usernameMessage}
                      </p>
                    )}
                    {fieldState.error && (
                      <p className="mt-1.5 text-xs text-red-500">{fieldState.error.message}</p>
                    )}
                  </>
                )}
              />
            </div>

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

            <div>
              <Controller
                name="password"
                control={form.control}
                render={({ field, fieldState }) => (
                  <>
                    <div className="relative">
                      <Lock className="pointer-events-none absolute left-3.5 top-1/2 h-4.5 w-4.5 -translate-y-1/2 text-gray-400" />
                      <input
                        {...field}
                        type={showPassword ? "text" : "password"}
                        placeholder="Password"
                        className="w-full rounded-xl border border-gray-300 py-2.5 pl-11 pr-11 text-sm text-gray-900 outline-none transition focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword((v) => !v)}
                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        tabIndex={-1}
                      >
                        {showPassword ? <EyeOff className="h-4.5 w-4.5" /> : <Eye className="h-4.5 w-4.5" />}
                      </button>
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
              className="w-full rounded-xl bg-orange-500 py-2.5 text-sm font-semibold text-white shadow-sm shadow-orange-500/30 transition hover:bg-orange-600 disabled:opacity-60"
            >
              {isSubmitting ? "Creating account..." : "Create account"}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-500">
            Already have an account?{" "}
            <Link href="/sign-in" className="font-medium text-orange-600 hover:text-orange-700">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default Page