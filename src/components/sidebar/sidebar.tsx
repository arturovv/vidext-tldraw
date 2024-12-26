'use client'
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { ChevronsLeft, Folder } from "lucide-react";
import React from "react";
import { Button } from "@/components/ui/button";
import { signIn, signOut } from "next-auth/react"
import Link from "next/link";

interface SidebarProps {
  isLoggedIn: boolean
}

export default function Sidebar({ isLoggedIn }: SidebarProps) {
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
    <SheetContent className="flex flex-col">
      <SheetHeader>
        <SheetTitle>Welcome</SheetTitle>
        <SheetDescription>
          Access using your email to save or restore your drawings.
        </SheetDescription>
        <div className="flex flex-col justify-center pt-5 gap-5">
          <Button onClick={() => signIn()}>Access</Button>
          <div className="flex justify-center items-center">
            <div className="flex-1 h-[2px] bg-gray-400 mr-4" />
            or
            <div className="flex-1 h-[2px] bg-gray-400 ml-4" />
          </div>
          <SheetClose asChild>
            <Button type="submit" variant="link">Continue as guest</Button>
          </SheetClose>
        </div>
      </SheetHeader>
      <div className="flex justify-center items-end flex-1 text-sm">
        Videx Technical Test by Arturo Varón
      </div>
    </SheetContent>
  );
}

const UserContent = ({ closeSidebar }: { closeSidebar: () => void }) => {
  const signOutHandler = () => {
    closeSidebar()
    signOut()
  }
  return (
    <SheetContent className="flex flex-col">
      <SheetHeader>
        <SheetTitle>Hello</SheetTitle>
        <SheetDescription>
          <Button variant="link" asChild>
            <Link href="/projects"><Folder />Manage projects</Link>
          </Button>
        </SheetDescription>
      </SheetHeader>
      <div className="flex flex-col justify-end items-center flex-1 text-sm gap-5">
        <Button onClick={signOutHandler}>Sign out</Button>

        Videx Technical Test by Arturo Varón
      </div>
    </SheetContent>
  );
}