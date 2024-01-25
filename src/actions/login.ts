"use server"

import * as z from "zod";
import { LoginSchema } from "@/schemas";
import { signIn } from "@/auth";
import { DEFAULT_LOGIN_REDIRECT } from "@/routes";
import { AuthError } from "next-auth";
import { getUserByEmail } from "@/data/user";
import { generateVerificationToken, generateTwoFactorToken } from "@/lib/tokens";
import { sedVerificationEmail, sendTwoFactorTokenEmail } from "@/lib/email";
import { getTwoFactorTokenByEmail } from "@/data/two-factor-token"; 
import { db } from "@/lib/db";
import { getTwoFactorConfimationByUserId } from "@/data/two-factor-confirmation";

export const login = async (
    values: z.infer<typeof LoginSchema>,
    callbackUrl?: string,
) => {
    const validateFields = LoginSchema.safeParse(values);

    if (!validateFields.success) {
        return { error: "Dados inválidos"}
    }

    const { email, password, code } = validateFields.data;

    const existingUser = await getUserByEmail(email);

    if (!existingUser || !existingUser.email || !existingUser.password) {
        return { error: "Email does not exist!"};
    }

    if (!existingUser.emailVerified) {
        const verificationToken = await generateVerificationToken(existingUser.email);

        await sedVerificationEmail(
            verificationToken.email,
            verificationToken.token
        )

        return { success: "Confirmation email sent!" }
    }

    if (existingUser.isTwoFactorEnabled && existingUser.email) {
        if (code) {
            const twoFactorToken = await getTwoFactorTokenByEmail(existingUser.email)

            if (!twoFactorToken) {
                return { error: "Invalid code!"}
            }

            if (twoFactorToken.token !== code) {
                return { error: "Invalid code!"}
            }

            const hasExpired = new Date(twoFactorToken.expires) < new Date();

            if (hasExpired) {
                return { error: "Code Expired!" }
            }

            await db.twoFactorToken.delete({
                where: {
                    id: twoFactorToken.id
                }
            })

            const existingConfirmation = await getTwoFactorConfimationByUserId(existingUser.id);

            if (existingConfirmation) {
                await db.twoFactorConfimation.delete({
                    where: {
                        id: existingConfirmation.id
                    }
                })
            }

            await db.twoFactorConfimation.create({
                data: {
                    userId: existingUser.id
                }
            })
        } else {
            const twoFDactor = await generateTwoFactorToken(existingUser.email)
            await sendTwoFactorTokenEmail(
                twoFDactor.email,
                twoFDactor.token
            )
    
            return { twoFactor: true }
        }
    }

    try {
        await signIn("credentials", {
            email,
            password,
            redirectTo: callbackUrl || DEFAULT_LOGIN_REDIRECT
        })
    } catch(error) {
        if (error instanceof AuthError) {
            switch (error.type) {
                case "CredentialsSignin":
                    return { error: "Invalid credentials!"}
                default:
                    return { error: "Something went wrong!"}
            }
        }

        throw error;
    }
}