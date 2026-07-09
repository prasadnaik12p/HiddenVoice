'use client';
import { Button } from '@/components/ui/button';
import { Mail, ShieldCheck, Sparkles, MessageCircleHeart } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Autoplay from 'embla-carousel-autoplay';
import { useMemo } from 'react';
import Link from 'next/link';
import messages from '@/messages.json';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';

interface MessageItem {
  title: string;
  content: string;
  received: string;
}

export default function Home() {
  const plugins = useMemo(() => [Autoplay({ delay: 2000 })], []);
  const typedMessages = messages as MessageItem[];

  return (
    <>
      {/* Hero Section */}
      <main className="flex-grow flex flex-col items-center justify-center px-4 md:px-24 py-16 bg-gradient-to-b from-orange-50 via-white to-white text-gray-900">
        <section className="text-center mb-10 md:mb-14 max-w-2xl">
          <div className="inline-flex items-center gap-2 bg-orange-100 text-orange-600 px-4 py-1.5 rounded-full text-sm font-medium mb-6">
            <Sparkles className="w-4 h-4" />
            100% Anonymous. Always.
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight">
            Say It. <span className="text-orange-600">Freely.</span>
          </h1>
          <p className="mt-4 md:mt-6 text-base md:text-lg text-gray-600">
            HiddenVoice lets people send you honest, anonymous feedback —
            no names, no judgment, just real thoughts.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/sign-up">
              <Button className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-6 text-base w-full sm:w-auto">
                Get Your Link — It is Free
              </Button>
            </Link>
            <Link href="/sign-in">
              <Button variant="outline" className="border-orange-300 text-orange-600 hover:bg-orange-50 px-8 py-6 text-base w-full sm:w-auto">
                I Already Have an Account
              </Button>
            </Link>
          </div>
        </section>

        {/* Feature strip */}
        <section className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6 w-full max-w-4xl mb-14">
          <div className="flex flex-col items-center text-center p-5 rounded-xl bg-white border border-orange-100 shadow-sm">
            <ShieldCheck className="w-8 h-8 text-orange-500 mb-2" />
            <h3 className="font-semibold">Truly Anonymous</h3>
            <p className="text-sm text-gray-500 mt-1">
              Senders are never identified. Not even to you.
            </p>
          </div>
          <div className="flex flex-col items-center text-center p-5 rounded-xl bg-white border border-orange-100 shadow-sm">
            <MessageCircleHeart className="w-8 h-8 text-orange-500 mb-2" />
            <h3 className="font-semibold">Honest Feedback</h3>
            <p className="text-sm text-gray-500 mt-1">
              Get the real opinions people are afraid to say out loud.
            </p>
          </div>
          <div className="flex flex-col items-center text-center p-5 rounded-xl bg-white border border-orange-100 shadow-sm">
            <Sparkles className="w-8 h-8 text-orange-500 mb-2" />
            <h3 className="font-semibold">Share in Seconds</h3>
            <p className="text-sm text-gray-500 mt-1">
              One link. Post it anywhere. Start receiving messages instantly.
            </p>
          </div>
        </section>

        {/* Carousel for Messages */}
        <section className="w-full max-w-lg md:max-w-xl">
          <h2 className="text-center text-xl md:text-2xl font-bold mb-6 text-gray-800">
            Real Messages, <span className="text-orange-600">Real Voices</span>
          </h2>
          <Carousel plugins={plugins} className="w-full">
            <CarouselContent>
              {typedMessages.map((message, index) => (
                <CarouselItem key={index} className="p-4">
                  <Card className="border-orange-200 shadow-md hover:shadow-lg transition-shadow">
                    <CardHeader className="bg-orange-50 rounded-t-lg">
                      <CardTitle className="text-orange-600">{message.title}</CardTitle>
                    </CardHeader>
                    <CardContent className="flex flex-col md:flex-row items-start space-y-2 md:space-y-0 md:space-x-4 pt-4">
                      <Mail className="flex-shrink-0 text-orange-500" />
                      <div>
                        <p className="text-gray-800">{message.content}</p>
                        <p className="text-xs text-gray-400">
                          {message.received}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="text-orange-500 border-orange-300" />
            <CarouselNext className="text-orange-500 border-orange-300" />
          </Carousel>
        </section>

        {/* CTA banner */}
        <section className="mt-16 w-full max-w-3xl text-center bg-orange-500 rounded-2xl py-10 px-6 text-white">
          <h2 className="text-2xl md:text-3xl font-bold mb-3">
            Ready to hear what people really think?
          </h2>
          <p className="text-orange-50 mb-6">
            Create your free HiddenVoice profile and start collecting anonymous feedback today.
          </p>
          <Link href="/sign-up">
            <Button className="bg-white text-orange-600 hover:bg-orange-50 px-8 py-6 text-base">
              Create My Account
            </Button>
          </Link>
        </section>
      </main>

      {/* Footer */}
      <footer className="text-center p-4 md:p-6 bg-orange-600 text-white">
        © {new Date().getFullYear()} HiddenVoice. All rights reserved.
      </footer>
    </>
  );
}