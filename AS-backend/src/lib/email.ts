import { HIDE_METADATA } from "better-auth/*";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendVerificationEmail( email: string, verificationUrl: string) {
    await resend.emails.send( {
        from: process.env.EMAIL_FROM!, // I guarantee this value is defined
        to: email,
        subject: "Verify your Anahanad Studio account",
        html: 
        `<div style="
                    font-family: Arial, Helvetica, sans-serif;
                    max-width:600px;
                    margin:auto;
                    padding:32px;
                ">
            <h2>
                Welcome to Anahanad Studio ERP 🎵
            </h2>

            <p>
                Thank you for registering with us. This ERP is developed by Sabyasachi Sahani.
            </p>

            <p>
                Click on the button below to verify your Email.
            </p>

            <a href="${verificationUrl}" style="
                        display:inline-block;
                        padding:12px 24px;
                        background:#111827;
                        color:white;
                        text-decoration:none;
                        border-radius:8px;
                    ">
                Verify Email
            </a>

            <p style="margin-top:24px; color:#666; font-size:14px; ">
                If you didn't create this account, simply ignore this email.
            </p>
        </div>`,
    } );
}