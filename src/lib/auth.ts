import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "./prisma";
import nodemailer from 'nodemailer'

const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false, // Use true for port 465, false for port 587
    auth: {
        user: process.env.APP_USER,
        pass: process.env.APP_PASS,
    },
});

export const auth = betterAuth({
    database: prismaAdapter(prisma, {
        provider: "postgresql", // or "mysql", "postgresql", ...etc
    }),
    trustedOrigins: [process.env.APP_URL!],
    user: {
        additionalFields: {
            role: {
                type: "string",
                defaultValue: "USER",
                required: false
            },
            phone: {
                type: "string",
                required: false
            },
            status: {
                type: "string",
                defaultValue: "ACTIVE",
                required: false
            }
        }
    },
    emailAndPassword: {
        enabled: true,
        autoSignIn: false,
        requireEmailVerification: true,
    },
    emailVerification: {
        sendOnSignUp: true,
        autoSignInAfterVerification: true,
        sendVerificationEmail: async ({ user, url, token }, request) => {
            //   console.log('verification email send: ==============>')
            try {
                const verificationUrl = `${process.env.APP_URL}/verify-email?token=${token}`
                const info = await transporter.sendMail({
                    from: `"Prisma Blog" <prismablog@ph.com>`,
                    to: user?.email,
                    subject: "Verify Your Email ✔",
                    html: `
                        <!DOCTYPE html>
                        <html lang="en">
                        <head>
                        <meta charset="UTF-8" />
                        <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
                        <title>Email Verification</title>
                        </head>
                        <body style="margin:0; padding:0; background-color:#f4f6f8; font-family:Arial, sans-serif;">
                        <table width="100%" cellpadding="0" cellspacing="0">
                            <tr>
                            <td align="center" style="padding:40px 0;">
                                <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff; border-radius:8px; overflow:hidden;">
                                
                                <!-- Header -->
                                <tr>
                                    <td style="background:#317371; padding:20px; text-align:center;">
                                    <h1 style="color:#ffffff; margin:0;">Prisma Blog</h1>
                                    </td>
                                </tr>

                                <!-- Content -->
                                <tr>
                                    <td style="padding:30px;">
                                    <h2 style="color:#333;">Verify your email</h2>
                                    <p style="color:#555; line-height:1.6;">
                                        Hi <strong>${user.name || "there"}</strong>,
                                    </p>
                                    <p style="color:#555; line-height:1.6;">
                                        Thank you for signing up for <strong>Prisma Blog</strong>.
                                        Please confirm your email address by clicking the button below.
                                    </p>

                                    <!-- Button -->
                                    <div style="text-align:center; margin:30px 0;">
                                        <a href="${verificationUrl}"
                                        style="
                                            background:#F67E04;
                                            color:#ffffff;
                                            padding:14px 28px;
                                            text-decoration:none;
                                            border-radius:6px;
                                            font-weight:bold;
                                            display:inline-block;
                                        ">
                                        Verify Email
                                        </a>
                                    </div>

                                    <p style="color:#555; line-height:1.6;">
                                        Or copy and paste this link into your browser:
                                    </p>

                                    <p style="word-break:break-all; color:#317371;">
                                        ${url}
                                    </p>

                                    <p style="color:#999; font-size:14px; margin-top:30px;">
                                        If you didn’t create an account, you can safely ignore this email.
                                    </p>
                                    </td>
                                </tr>

                                <!-- Footer -->
                                <tr>
                                    <td style="background:#f1f1f1; padding:15px; text-align:center; font-size:13px; color:#777;">
                                    © ${new Date().getFullYear()} Prisma Blog. All rights reserved.
                                    </td>
                                </tr>

                                </table>
                            </td>
                            </tr>
                        </table>
                        </body>
                        </html>
                        `, // HTML version of the message
                });

                console.log('Message Sent: ==>', info.messageId)
            } catch (error) {
                console.log('error catch email verification', error);
                throw error;
            }
        },
    },
    socialProviders: {
        google: { 
            prompt: "select_account consent",
            accessType:"offline",
            clientId: process.env.GOOGLE_CLIENT_ID as string, 
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string, 
        }, 
    },

});