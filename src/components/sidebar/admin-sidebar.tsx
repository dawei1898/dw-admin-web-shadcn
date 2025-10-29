"use client"

import * as React from "react"
import {
    AudioWaveform,
    BookOpen,
    Bot,
    Command,
    Frame,
    GalleryVerticalEnd,
    Map,
    PieChart,
    Settings2,
    SquareTerminal,
} from "lucide-react"

import {NavMain} from "@/components/test/nav-main.tsx"
import {NavProjects} from "@/components/test/nav-projects.tsx"
import {NavUser} from "@/components/test/nav-user.tsx"
import {TeamSwitcher} from "@/components/test/team-switcher.tsx"
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader, SidebarMenu, SidebarMenuItem,
    SidebarRail, useSidebar,
} from "@/components/ui/sidebar"
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar.tsx";
import {NavLink} from "react-router";
import Logo from "@/components/sidebar/logo.tsx";
import NavFooter from "@/components/sidebar/nav-footer.tsx";


/**
 * 侧边栏
 */
export function AdminSidebar({...props}: React.ComponentProps<typeof Sidebar>) {
    const {open} = useSidebar();

    return (
        <Sidebar collapsible="icon" {...props}>
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        {/* Logo & Title */}
                        <Logo/>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>

            </SidebarContent>

            <SidebarFooter>
                <NavFooter/>
            </SidebarFooter>

            {/* 控制侧边栏右侧分割线实现收起、展开 */}
            <SidebarRail/>
        </Sidebar>
    )
}
