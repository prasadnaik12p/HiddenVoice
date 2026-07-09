import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/User";
import bcrypt from "bcrypt";
import { sendVerificationEmail } from "@/helpers/sendVerificationEmail";

export async function POST(request: Request) {
    await dbConnect();

    try {
        const { username, email, password } = await request.json();

        console.log("Received data:", { username, email, password });

        // Check if verified user already exists with the username
        const existingUserVerifiedByUsername = await UserModel.findOne({
            username,
            isVerified: true,
        });

        if (existingUserVerifiedByUsername) {
            return Response.json(
                {
                    success: false,
                    message: "Username is already taken.",
                },
                {
                    status: 400,
                }
            );
        }

        // Check if user exists with the email
        const existingUserByEmail = await UserModel.findOne({ email });

        // Generate a 6-digit verification code
        const verifyCode = Math.floor(
            100000 + Math.random() * 900000
        ).toString();

        if (existingUserByEmail) {
            if (existingUserByEmail.isVerified) {
                return Response.json(
                    {
                        success: false,
                        message: "User already exists with this email.",
                    },
                    {
                        status: 400,
                    }
                );
            }

            // Update unverified user
            const hashedPassword = await bcrypt.hash(password, 10);

            existingUserByEmail.username = username;
            existingUserByEmail.password = hashedPassword;
            existingUserByEmail.verifyCode = verifyCode;
            existingUserByEmail.verifyCodeExpiry = new Date(
                Date.now() + 60 * 60 * 1000
            );

            await existingUserByEmail.save();
        } else {
            // Create new user
            const hashedPassword = await bcrypt.hash(password, 10);

            const expiryDate = new Date();
            expiryDate.setHours(expiryDate.getHours() + 1);

            const newUser = new UserModel({
                username,
                email,
                password: hashedPassword,
                verifyCode: verifyCode,
                verifyCodeExpiry: expiryDate,
                isAcceptingMessages: true,
                isVerified: false,
                messages: [],
            });

            await newUser.save();
        }

        // Send verification email
        const emailResponse = await sendVerificationEmail(
            email,
            username,
            verifyCode
        );

        if (!emailResponse.success) {
            return Response.json(
                {
                    success: false,
                    message: emailResponse.message,
                },
                {
                    status: 500,
                }
            );
        }

        return Response.json(
            {
                success: true,
                message:
                    "User registered successfully. Please verify your email.",
            },
            {
                status: 201,
            }
        );
    } catch (error) {
        console.error("Error in registering user:", error);

        return Response.json(
            {
                success: false,
                message: "Error registering user.",
            },
            {
                status: 500,
            }
        );
    }
}