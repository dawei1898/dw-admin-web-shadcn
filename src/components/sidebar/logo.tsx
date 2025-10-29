import React from 'react';
import {NavLink} from "react-router";
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar.tsx";
import {useSidebar} from "@/components/ui/sidebar.tsx";


/**
 * Logo & Title
 */
const Logo = () => {
    const {open} = useSidebar();

    return (
        <>
            <NavLink to='/'>
                <div className='flex justify-center items-center gap-3'>
                    <Avatar>
                        <AvatarImage src='logo.svg' alt="DW"/>
                        <AvatarFallback>DW</AvatarFallback>
                    </Avatar>
                    {open && <span className='text-blue-500 text-xl font-bold '>DW Admin</span>}
                </div>
            </NavLink>
        </>
    );
};

export default Logo;