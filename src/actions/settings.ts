"use server";

import * as z from "zod";
import bcrypt from "bcryptjs"

import { unstable_update } from "@/auth"
import { db } from "@/lib/db";
import { SettingsSchema } from "@/schemas";
import { currentUser } from "@/lib/auth";
import { getUserByEmail, getUserById } from "@/data/user";
import { generateVerificationToken } from "@/lib/tokens";
import { sedVerificationEmail } from "@/lib/email";
import { User } from "@prisma/client";


export const settings = async (
    values: z.infer<typeof SettingsSchema>
) => {
    const user = await currentUser();
    
    if (!user?.id) {
        return { error: "Unauthorized"}
    }

    const dbUser = await getUserById(user.id)

    if (!dbUser) {
        return { error: "Unauthorized"}
    }

    if (user.isOAuth) {
        values.email = undefined;
        values.password = undefined;
        values.newPassword = undefined;
        values.isTwoFactorEnabled = undefined;
    }

    // if (values.email && values.email !== user.email) {
    //     const existingUser = await getUserByEmail(values.email)

    //     if (existingUser && existingUser.id !== user.id) {
    //         return { error: "Email already in user!" }
    //     }

    //     const verificationToken = await generateVerificationToken(
    //         values.email
    //     )
    //     await sedVerificationEmail(
    //         verificationToken.email,
    //         verificationToken.token
    //     )

    //     // return { success: "Verification email sent!"}
    // }

    if (values.password && values.newPassword && dbUser.password) {
        const passwordMatch = await bcrypt.compare(
            values.password,
            dbUser.password
        )

        if (!passwordMatch) {
            return { error: "Incorrent password"};
        }

        const hashPassword = await bcrypt.hash(values.newPassword, 10);

        values.password = hashPassword;
        values.newPassword = undefined;
    }

    // const validateFields = SettingsSchema.safeParse(values);

    // if (!validateFields.success) {
    //     return { error: "Invalid fields"}
    // }

    values.email = undefined;
    const updatedUser: User = await db.user.update({
        where: { 
            id: dbUser.id
        },
        data: {
            ...values
        }
    })

    await unstable_update({
        user: {
            ...updatedUser,
            // name: updatedUser.name,
            // email: updatedUser.email,
            // role: updatedUser.role,
            // isTwoFactorEnabled: updatedUser.isTwoFactorEnabled,
        }
    })

    return { success: "Settings updated!"}
}