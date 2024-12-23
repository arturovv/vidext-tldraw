'use client'
import {
    Sheet,
    SheetClose,
    SheetContent,
    SheetDescription,
    SheetFooter,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet"
import { ChevronsLeft } from "lucide-react";
import React from "react";
import { Button } from "@/components/ui/button";
import { signIn, signOut } from "next-auth/react"

interface SidebardProps {
    isLoggedIn?: boolean
}

export default function SidebarComponent({ isLoggedIn = false }: SidebardProps) {
    const [open, setOpen] = React.useState(!isLoggedIn);
    return (
        <Sheet defaultOpen={!isLoggedIn} open={open} onOpenChange={setOpen}>
            <SheetTrigger className="bg-black outline-none"><ChevronsLeft size={40} color="white" /></SheetTrigger>
            {isLoggedIn ? (
                <UserContent closeSidebar={() => setOpen(false)} />
            ) : (
                <GuestContent />
            )}
        </Sheet>
    );
}

const GuestContent = () => {
    return (
        <SheetContent>
            <SheetHeader>
                <SheetTitle>Welcome</SheetTitle>
                <SheetDescription>
                    To save or restore your drawings, you need to access using your email.

                    <Button onClick={() => signIn()}>Access</Button>

                    <SheetClose asChild>
                        <Button type="submit" variant="link">Continue as guest</Button>
                    </SheetClose>
                </SheetDescription>
            </SheetHeader>
        </SheetContent>
    );
}

const UserContent = ({ closeSidebar }: { closeSidebar: () => void }) => {
    const signOutHandler = () => {
        closeSidebar()
        signOut()
        // to-do refresh canvas
    }
    return (
        <SheetContent>
            <SheetHeader>
                <SheetTitle>Hello</SheetTitle>
                <SheetDescription>
                    Your account
                </SheetDescription>
            </SheetHeader>
            <SheetFooter>

                <Button onClick={signOutHandler}>Sign out</Button>
            </SheetFooter>
        </SheetContent>
    );
}