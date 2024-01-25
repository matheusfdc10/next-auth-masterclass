"use client";

// import { signOut } from "next-auth/react";
import { logout } from "@/actions/logout";

interface LogoutButtonProps {
    children?: React.ReactNode
}

export const LogoutButton: React.FC<LogoutButtonProps> = ({
    children
}) => {
    const onClick = () => {
        logout()
    }
    
    return (
        <span onClick={onClick} className="cursor-pointer">
            {children}
        </span>
    )
}