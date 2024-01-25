"use client"

import { useCurrentRole } from "@/hooks/use-current-role";
import { UserRole } from "@prisma/client";
import { FormError } from "@/components/form-error";

interface RoleGateProps {
    children: React.ReactNode;
    allowedRole: UserRole;
}

export const RoleGate: React.FC<RoleGateProps> = ({
    children,
    allowedRole
}) => {
    const role = useCurrentRole();

    if (role !== allowedRole) {
        return (
            <FormError message="Your do not have premisson to view this content!" />
        )
    }

    return (
        <>
            {children}
        </>
    )
}