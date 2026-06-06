import {NextAuthOptions} from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';
import dbConnect from '@/lib/dbConnect';
import UserModel from '@/models/User';
import { ErrorBoundary } from 'next/dist/client/components/error-boundary';


export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            id: "credentials",
            name: "Credentials",
            credentials: {
               username: { label: "Email", type: "text"},
               password: { label: "Password", type: "password" }
            },
            async authorize(credentials: Record<string, string> | undefined) {
                await dbConnect()
                try {
                    const user = await UserModel.findOne({
                        $or: [
                            { email: credentials?.username },
                            { username: credentials?.username }
                        ]
                    });

                    if (!user) {
                        throw new Error("No user found with this email")
                    }
                    
                    if (!user.isVerified) {
                        throw new Error("Please verify your account before login")
                    }

                    if (!credentials?.password) {
                        throw new Error("Password is required")
                    }

                    const isPasswordCorrect = await bcrypt.compare(credentials.password, user.password)
                    
                    if (isPasswordCorrect) {
                        return {
                                id: user._id.toString(),
                                username: user.username,
                                email: user.email,
                                isVerified: user.isVerified,
                                isAceeptingMessages: user.isAceeptingMessages,
                            }
                    } else {
                        throw new Error("Passwords are not matched");
                    }

                } catch (err) {
                    throw new Error(err instanceof Error ? err.message : String(err))

                }
            }
        })
    ],
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.id = user._id?.toString();
                token.isVerified = user.isVerified;
                token.isAceeptingMessages = user.isAceeptingMessages;
                token.username = user.username;
                token.email = user.email;
            }
            return token  
        
        },
        async session({ session, token }) {
            if (token) {
                session.user._id = token._id
                session.user.isVerified = token.isVerified;
                session.user.isAceeptingMessages = token.isAceeptingMessages;
                session.user.username = token.username;
                session.user.email = token.email;
            }
            return session
        },
      
    },
    pages: {
        signIn: "/sign-in",

    },

    session: {
        strategy: "jwt"
    },
    secret: process.env.NEXTAUTH_SECRET
}








