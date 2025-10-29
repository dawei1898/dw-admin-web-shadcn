import React from 'react';
import {SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar} from "@/components/ui/sidebar";

import {GithubIcon} from "@/components/icons";


import ThemeToggle from "@/components/sidebar/theme-toggle";

import UserSettings from "@/components/sidebar/user-settings";
import {Link} from "react-router";

const NavFooter = () => {
    const {open, isMobile} = useSidebar();

    return (
        <SidebarMenu>
            <SidebarMenuItem
                className={`flex justify-start ${open ? '' : 'flex-col-reverse gap-2'}`}
            >
                {/* 用户信息 */}
                <UserSettings />

                {/* Github */}
                <SidebarMenuButton className='w-8 ml-auto cursor-pointer'>
                    <Link
                        key='github_link'
                        to='https://github.com/dawei1898/dw-admin'
                        target="_blank"
                    >
                        <GithubIcon/>
                    </Link>
                </SidebarMenuButton>

                {/* 切换亮暗 */}
                <ThemeToggle/>
            </SidebarMenuItem>
        </SidebarMenu>
    );
};

export default NavFooter;