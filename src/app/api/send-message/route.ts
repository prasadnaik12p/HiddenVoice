import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/User";
import { Message } from "@/models/User";
import { authOptions } from "../auth/[...nextauth]/options";
import { getServerSession } from "next-auth/next";
import {User} from "next-auth";

export async function POST(request: Request) {
    await dbConnect();

    const { username, content } = await request.json();
    try {
        const user = await UserModel.findOne({ username });
        if (!user) {
            return Response.json({ success: false, message: "User not found." }, { status: 404 });
        }

        //is user accepting the messages
        if (!user.isAceeptingMessages) {
            return Response.json({ success: false, message: "User is not accepting messages." }, { status: 403 });
        }

        const newMessage = { content, createdAt: new Date() };
        user.messages.push(newMessage as Message);
        await user.save();

        return Response.json({ success: true, message: "Message sent successfully." }, { status: 200 });
    } catch (error) {
        console.error("Error adding message:", error);
        return Response.json({ success: false, message: "An error occurred while adding the message." }, { status: 500 });
    }
}