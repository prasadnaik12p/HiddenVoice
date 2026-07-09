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

  if (!session || !session.user) {
    return Response.json(
      {
        success: false,
        message: "Unauthorized",
      },
      {
        status: 401,
      }
    );
  }

  try {
    if (!user._id) {
      return Response.json(
        {
          success: false,
          message: "User ID not found in session.",
        },
        {
          status: 400,
        }
      );
    }

    const userId = new mongoose.Types.ObjectId(user._id);

    console.log("Fetching messages for user ID:", userId);

    // Check if user exists
    const existingUser = await UserModel.findById(userId);

    if (!existingUser) {
      return Response.json(
        {
          success: false,
          message: "User not found.",
        },
        {
          status: 404,
        }
      );
    }

    const result = await UserModel.aggregate([
      {
        $match: {
          _id: userId,
        },
      },
      {
        $unwind: {
          path: "$messages",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $sort: {
          "messages.createdAt": -1,
        },
      },
      {
        $group: {
          _id: "$_id",
          messages: {
            $push: "$messages",
          },
        },
      },
    ]);

    console.log("Aggregation result:", result);

    // If user has no messages
    if (
      result.length === 0 ||
      (result[0].messages.length === 1 && result[0].messages[0] == null)
    ) {
      return Response.json(
        {
          success: true,
          messages: [],
        },
        {
          status: 200,
        }
      );
    }

    return Response.json(
      {
        success: true,
        messages: result[0].messages,
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error("Error fetching messages:", error);

    return Response.json(
      {
        success: false,
        message: "An error occurred while fetching messages.",
      },
      {
        status: 500,
      }
    );
  }
}