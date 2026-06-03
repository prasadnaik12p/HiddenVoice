import { z } from 'zod';

export const username = z.string()
    

export const password = z.string()
    .min(6, "Password must be at least 6 characters long")

export const signInSchema = z.object({
    identifier: username,
    password: password
});