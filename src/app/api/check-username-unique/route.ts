import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/User";
import { z } from "zod";
import {usernameValidation} from "@/schemas/signUpschema";



const UsernameQuerySchema = z.object({
    username: usernameValidation
})


export async function GET(request: Request) {
   if(request.method !== "GET"){
    return Response.json({ success: false, message: "Method not allowed" }, { status: 405 })
   }

    await dbConnect();
    
    try {
        const { searchParams } = new URL(request.url);
        const queryParam = searchParams.get("username");

        if (!queryParam) {
            return Response.json({ success: false, message: "Username is required" }, { status: 400 })
        }

        const result = UsernameQuerySchema.safeParse(queryParam); //it checks if the query parameter is valid according to the usernameValidation schema
        
        if (!result.success) {
            const usernameErrors = result.error.format().username?._errors || ["Invalid username"];
            return Response.json({ success: false, message: usernameErrors.join(", ") }, { status: 400 })
        }

        
        const { username } = result.data;
        
        const existingUser = await UserModel.findOne({ username: username, isVerified: true });
        
        if (existingUser) {
            return Response.json({ success: false, message: "Username is already taken" }, { status: 409 })
        }

        return Response.json({ success: true, message: "Username is available" }, { status: 200 })

    }catch (err) {
        return Response.json({ success: false, message: err instanceof Error ? err.message : String(err) }, { status: 500 })
    }

}