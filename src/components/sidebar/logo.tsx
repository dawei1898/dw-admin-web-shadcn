import React from 'react';
import {NavLink} from "react-router";
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar.tsx";
import {useSidebar} from "@/components/ui/sidebar.tsx";
import {cn} from "@/lib/utils.ts";


/**
 * Logo & Title
 */
const Logo = () => {
    const {open} = useSidebar();

    return (
        <>
            <NavLink to='/'>
                <div className={cn('flex justify-start items-center gap-3', open ? 'pl-4' : '')}>
                    <Avatar>
                        <AvatarImage src='/logo.svg' alt="DW"/>
                        <AvatarFallback>DW</AvatarFallback>
                    </Avatar>
                    {open && <span className='text-blue-500 text-xl font-bold '>DW Admin</span>}
                </div>
            </NavLink>
        </>
    );
};

export default Logo;