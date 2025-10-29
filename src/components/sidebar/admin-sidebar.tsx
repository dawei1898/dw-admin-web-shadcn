import * as React from "react"
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuItem,
    SidebarRail,
} from "@/components/ui/sidebar"
import Logo from "@/components/sidebar/logo.tsx";
import NavFooter from "@/components/sidebar/nav-footer.tsx";
import NavMenus from "@/components/sidebar/nav-menus.tsx";



/**
 * 侧边栏
 */
export function AdminSidebar({...props}: React.ComponentProps<typeof Sidebar>) {

    return (
        <Sidebar
            variant='sidebar' // 侧边栏形状
            collapsible="icon"
            {...props}  >
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        {/* Logo & Title */}
                        <Logo/>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                {/* 菜单 */}
                <NavMenus/>
            </SidebarContent>

            <SidebarFooter>
                <NavFooter/>
            </SidebarFooter>

            {/* 控制侧边栏右侧分割线实现收起、展开 */}
            <SidebarRail/>
        </Sidebar>
    )
}
