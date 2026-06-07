import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/User";
import { User } from "next-auth";
import mongoose from "mongoose";



export async function GET(request: Request) {
    await dbConnect();

    const session = await getServerSession(authOptions);
    const user: User = session?.user as User;

    if (!session || !session?.user) {
        return Response.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const userId = new mongoose.Types.ObjectId(user._id);
    
    try {
        const user = await UserModel.aggregate([
            { $match: { id: userId } },
            { $unwind: "$messages" }, // Unwind the messages array to get individual message documents
            { $sort: { "messages.createdAt": -1 } }, // Sort messages by createdAt in descending order
            { $group: { _id: "$_id", messages: { $push: "$messages" } } }, // Group back to get the user with sorted messages
        ])
        
        if (!user || user.length === 0) {
            return Response.json({ success: false, message: "User not found." }, { status: 404 });
        }
        
        return Response.json({ success: true, messages: user[0].messages }, { status: 200 });
    }catch (error) {
        console.error("Error fetching messages:", error);
        return Response.json({ success: false, message: "An error occurred while fetching messages." }, { status: 500 });
    }


}


