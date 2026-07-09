'use client'
import React from 'react';
import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { Button } from './ui/button';

function Navbar() {
  const { data: session } = useSession();
  const user = session?.user;

  return (
    <nav className="p-4 md:p-6 shadow-md bg-white text-orange-600 border-b border-orange-200">
      <div className="container mx-auto flex flex-col md:flex-row justify-between items-center">
        <a href="#" className="text-xl font-bold mb-4 md:mb-0 text-orange-600">
         HiddenVoice
        </a>
        {session ? (
          <div className="flex flex-col md:flex-row items-center gap-4">
            <span className="text-gray-700">
              Welcome, {user?.username || user?.email}
            </span>
            <Button
              onClick={() => signOut()}
              className="w-full md:w-auto bg-orange-500 hover:bg-orange-600 text-white border-none"
              variant="outline"
            >
              Logout
            </Button>
          </div>
        ) : (
          <Link href="/sign-in">
            <Button className="w-full md:w-auto bg-orange-500 hover:bg-orange-600 text-white border-none" variant={'outline'}>
              Login
            </Button>
          </Link>
        )}
      </div>
    </nav>
  );
}

export default Navbar;