"use client"

import { UserButton } from "@/components/auth/user-button";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import Link from "next/link";
import { usePathname } from "next/navigation"
import { FcMenu } from "react-icons/fc";

export const Navbar = () => {
    const pathname = usePathname();

    return (
        <nav className="bg-secondary flex justify-between items-center p-4 rounded-xl max-w-[600px] w-full shadow-sm gap-2">
            <div className="sm:hidden">
                <DropdownMenu>
                    <DropdownMenuTrigger>
                        <FcMenu className="h-8 w-8"/>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-40 sm:hidden space-y-1" align="start">
                        <DropdownMenuItem asChild>
                            <Button
                                asChild
                                variant={pathname === "/server" ? "default" : "outline"}
                                className="w-full justify-start"
                            >
                                <Link href="/server">
                                    Server
                                </Link>
                            </Button>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                            <Button
                                asChild
                                variant={pathname === "/client" ? "default" : "outline"}
                                className="w-full justify-start"
                            >
                                <Link href="/client">
                                    Client
                                </Link>
                            </Button>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                            <Button
                                asChild
                                variant={pathname === "/admin" ? "default" : "outline"}
                                className="w-full justify-start"
                            >
                                <Link href="/admin">
                                    Admin
                                </Link>
                            </Button>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                            <Button
                                asChild
                                variant={pathname === "/settings" ? "default" : "outline"}
                                className="w-full justify-start"
                            >
                                <Link href="/settings">
                                    Settings
                                </Link>
                            </Button>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
            
        
            <div className="hidden sm:block">
                <div className="flex gap-x-2">
                    <Button
                        asChild
                        variant={pathname === "/server" ? "default" : "outline"}
                    >
                        <Link href="/server">
                            Server
                        </Link>
                    </Button>
                    <Button
                        asChild
                        variant={pathname === "/client" ? "default" : "outline"}
                    >
                        <Link href="/client">
                            Client
                        </Link>
                    </Button>
                    <Button
                        asChild
                        variant={pathname === "/admin" ? "default" : "outline"}
                    >
                        <Link href="/admin">
                            Admin
                        </Link>
                    </Button>
                    <Button
                        asChild
                        variant={pathname === "/settings" ? "default" : "outline"}
                    >
                        <Link href="/settings">
                            Settings
                        </Link>
                    </Button>
                </div>
            </div>
            <UserButton />
        </nav>
    )
}