import NextAuth from "next-auth"
import Nodemailer from "next-auth/providers/nodemailer"
import { DrizzleAdapter } from "@auth/drizzle-adapter"
import db from "@/db"

export const { handlers, signIn, signOut, auth } = NextAuth({
    session: {
        strategy: "jwt",
    },
    adapter: DrizzleAdapter(db),
    providers: [
        Nodemailer({
            name: "email",
            server: {
                host: process.env.EMAIL_SERVER_HOST,
                port: process.env.EMAIL_SERVER_PORT,
                auth: {
                    user: process.env.EMAIL_SERVER_USER,
                    pass: process.env.EMAIL_SERVER_PASSWORD,
                },
            },
            from: process.env.EMAIL_FROM,
        }),
    ],
})