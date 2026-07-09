import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/User";
import { sendVerificationEmail } from "@/helpers/sendVerificationEmail";

export async function POST(request: Request) {
    await dbConnect();

    try {
        const { email } = await request.json();

        if (!email) {
            return Response.json(
                {
                    success: false,
                    message: "Email is required.",
                },
                { status: 400 }
            );
        }

        const user = await UserModel.findOne({ email });

        if (!user) {
            return Response.json(
                {
                    success: false,
                    message: "No account found with this email.",
                },
                { status: 404 }
            );
        }

        if (user.isVerified) {
            return Response.json(
                {
                    success: false,
                    message: "This account is already verified. Please sign in.",
                },
                { status: 400 }
            );
        }

        // Generate a fresh 6-digit verification code
        const verifyCode = Math.floor(
            100000 + Math.random() * 900000
        ).toString();

        user.verifyCode = verifyCode;
        user.verifyCodeExpiry = new Date(Date.now() + 60 * 60 * 1000);

        await user.save();

        const emailResponse = await sendVerificationEmail(
            user.email,
            user.username,
            verifyCode
        );

        if (!emailResponse.success) {
            return Response.json(
                {
                    success: false,
                    message: emailResponse.message,
                },
                { status: 500 }
            );
        }

        return Response.json(
            {
                success: true,
                message: "Verification code resent successfully. Please check your email.",
                username: user.username,
            },
            { status: 200 }
        );
    } catch (error) {
        console.error("Error in resending verification code:", error);

        return Response.json(
            {
                success: false,
                message: "Error resending verification code.",
            },
            { status: 500 }
        );
    }
}