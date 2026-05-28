"use client"

import { SignInButton, SignOutButton, useUser } from "@clerk/nextjs";
import { UserCircle } from "lucide-react"

import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover"

type Date = {
    month: number;
    year: number;
}

const Header = ({date}: {date: Date}) => {
    const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    const { isLoaded, isSignedIn, user } = useUser();

    return (
        <header className="w-full flex items-center justify-between p-4 mb-4">
            <div className="w-1/3">
                <h2 className="text-md font-medium">EMMO App</h2>
            </div>
            <div className="w-1/3 flex flex-col items-center space-y-2">
                <h4 className="text-md">{date.year}</h4>
                <h3 className="text-lg font-semibold bg-[#97d5a5] dark:bg-[#d497c6dd] px-2">{monthNames[date.month]}</h3>
            </div>
            <div className="w-1/3 flex justify-end">
                {isLoaded && isSignedIn && user ? (
                    <Popover>
                        <PopoverTrigger asChild>
                            <img src={user.imageUrl} alt="Profile Image" className="size-8 rounded-full cursor-pointer" />
                        </PopoverTrigger>
                        <PopoverContent className="p-2 m-1 w-30">
                            <SignOutButton>
                                <button className="w-full text-center focus:outline-none">Cerrar sesión</button>
                            </SignOutButton>
                        </PopoverContent>
                    </Popover>
                ) : (
                    <SignInButton mode="modal">
                        <UserCircle className="size-8 rounded-full cursor-pointer" />
                    </SignInButton>
                )}
            </div>
        </header>
    );
}
 
export default Header;