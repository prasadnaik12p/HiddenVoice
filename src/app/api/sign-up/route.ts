import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/User";
import bcrypt from 'bcrypt';
import { sendVerificationEmail } from "@/helpers/sendVerificationEmail";
import { success } from "zod";
import { verify } from "crypto";



export async function POST(request: Request) {
    await dbConnect();
    try {
        const { username, email, password } = await request.json();
        const existingUserVerifiedByUsername = await UserModel.findOne({ username, isVerified: true });
        
        if (existingUserVerifiedByUsername) {
            return Response.json({
                success: false,
                message: "Username is already taken."
            }, {
                status: 400
            });
        }

        const exsitingUserByEmail = await UserModel.findOne({ email });
        const verifycode = Math.floor(Math.random()*90000).toString()

        if (exsitingUserByEmail) {
            if (exsitingUserByEmail.isVerified) {
                return Response.json({
                    success: false,
                    message:"User already exsits with this email"
                }, {
                    status:400
                })
            }
            else {
                const hashedPassword = await bcrypt.hash(password, 10)
                exsitingUserByEmail.password = hashedPassword;
                exsitingUserByEmail.verifyCode = verifycode;
                exsitingUserByEmail.verifyCodeExpiry = new Date(Date.now() + 360000)

                await exsitingUserByEmail.save();
            }
        }
        else {
            const hashedPassword = await bcrypt.hash(password, 10)
            const expiriyDate = new Date()
            expiriyDate.setHours(expiriyDate.getHours() + 1)

            const newUser = await new UserModel({
                name: username,
                email: email,
                password: hashedPassword,
                verifyCode: verifycode,
                verifyCodeExpiry: expiriyDate,
                isAceeptingMessages: true,
                isVerified: false,
                messages: []
            });

            await newUser.save()
        }

        //Send verification email
       const emailResponse = await sendVerificationEmail(email, username, verifycode)
        
        if (!emailResponse.success) {
            return Response.json({
                success: false,
                message: emailResponse.message
            }, {
                status:500
            })
        }

        return Response.json({
            success: true,
            message:"User registered Sucessfully , Please verify your email"
        }, {
            status:201
        })
        
    } catch (error) {
        console.log(error)
        console.error("Error in registering use:", error);
        return Response.json({
            success: false,
            message:"Error registering User"
        },
            {
            status:500
        })
    }
}