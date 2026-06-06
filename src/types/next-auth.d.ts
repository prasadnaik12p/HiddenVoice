//This file is used to add custom types for next-auth. You can extend the default types provided by next-auth to include additional properties or methods that you need in your application.
import 'next-auth';

declare module 'next-auth' {
    interface User{
        _id?: string;
        isVerified?: boolean;
        isAceeptingMessages?: boolean;
        username:string
    }
    interface Session { 
        user: {
            _id ?: string;
            isVerified?: boolean;
            isAceeptingMessages?: boolean;
            username:string
        } & DefaultSession['user'];
    }
}

declare module 'next-auth/jwt' {
    interface JWT {
        id?: string;
        isVerified?: boolean;
        isAceeptingMessages?: boolean;
        username?: string;
    }
}