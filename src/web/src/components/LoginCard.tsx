import { Avatar, AvatarFallback } from "@/shadcnComponents/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/shadcnComponents/ui/dropdown-menu";
import { useMsal } from "@azure/msal-react"

import { useMemo, useState } from "react";

export const LoginCard = () => {
    const [hoverActive, setHoverActive] = useState(false)
    const { instance, accounts } = useMsal();
    const profile = accounts?.[0] ?? null;
    const name = profile?.name ?? "";
    const username = profile?.username ?? "";
    const initials = useMemo(() =>
        name.split(" ")
            .map(word => word.charAt(0))
            .join(""), [name])

    const handleLogOut = () => {
        instance.logoutRedirect({
            postLogoutRedirectUri: "/",
        });

    }

    return (
        <div className="">

            <DropdownMenu >
                <DropdownMenuTrigger> <div className="flex"
                    onMouseEnter={() => setHoverActive(true)}
                    onMouseLeave={() => setHoverActive(false)}
                >
                    <Avatar>
                        {/* <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" /> */}
                        <AvatarFallback className={`${hoverActive ? 'bg-slate-200 dark:bg-slate-700' : 'bg-slate-100 dark:bg-slate-800'}`}>{initials}</AvatarFallback>

                    </Avatar>
                    {/* <div className={`pl-4 text-s font-semibold hidden lg:block ${hoverActive ? 'underline' : 'no-underline'}`}> {name}</div> */}
                </div></DropdownMenuTrigger>
                <DropdownMenuContent>
                    <DropdownMenuLabel>{username}</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem >Om RetroAppen</DropdownMenuItem>
                    <DropdownMenuItem onClick={handleLogOut}>Logga ut</DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>

    )
}