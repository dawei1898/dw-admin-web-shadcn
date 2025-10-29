import React from 'react';
import {
    ChevronRight, Dock, Folder,
    Settings, ShieldAlert, UserRound
} from "lucide-react";
import {
    SidebarGroup,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarMenuSub,
    SidebarMenuSubButton,
    SidebarMenuSubItem
} from "@/components/ui/sidebar.tsx";
import {
    Collapsible, CollapsibleContent, CollapsibleTrigger
} from "@/components/ui/collapsible.tsx";
import {NavLink} from "react-router";


const menuItems = [
    {
        title: "控制台",
        url: "#",
        icon: <Dock/>,
        items: [
            {
                title: "工作台",
                url: "/dashboard/workbench",
            },
            {
                title: "分析页",
                url: "/dashboard/analysis",
            },
        ],
    },
    {
        title: "系统管理",
        url: "#",
        icon: <Settings/>,
        items: [
            {
                title: "用户管理",
                url: "/system/user",
            },
            {
                title: "角色管理",
                url: "/system/role",
            },
            {
                title: "日志管理",
                url: "/system/log",
            },
        ],
    },
    {
        title: "文件管理",
        url: "#",
        icon: <Folder/>,
        items: [
            {
                title: "图片管理",
                url: "/file/image",
            },
        ],
    },
    {
        title: "个人页",
        url: "#",
        icon: <UserRound/>,
        items: [
            {
                title: "个人中心",
                url: "/person/center",
            },
            {
                title: "个人设置",
                url: "/person/settings",
            },
        ],
    },
    {
        title: "异常页",
        url: "#",
        icon: <ShieldAlert/>,
        items: [
            {
                title: "403",
                url: "/error/403",
            },
            {
                title: "404",
                url: "/error/404",
            },
            {
                title: "500",
                url: "/error/500",
            },
        ],
    },
]


/**
 * 侧边栏菜单
 */
const NavMenus = () => {
    return (<>
        <SidebarGroup>
            <SidebarGroupLabel>

            </SidebarGroupLabel>
            <SidebarMenu>
                {menuItems.map((item) => (
                    <Collapsible
                        key={item.title}
                        asChild
                        className="group/collapsible"
                    >
                        <SidebarMenuItem>
                            <CollapsibleTrigger asChild>
                                <SidebarMenuButton tooltip={item.title}>
                                    {item.icon}
                                    <span>{item.title}</span>
                                    <ChevronRight
                                        className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90"/>
                                </SidebarMenuButton>
                            </CollapsibleTrigger>
                            <CollapsibleContent>
                                <SidebarMenuSub>
                                    {item.items?.map((subItem) => (
                                        <SidebarMenuSubItem key={subItem.title}>
                                            <SidebarMenuSubButton asChild>
                                                <NavLink to={subItem.url}>
                                                    <span>{subItem.title}</span>
                                                </NavLink>
                                            </SidebarMenuSubButton>
                                        </SidebarMenuSubItem>
                                    ))}
                                </SidebarMenuSub>
                            </CollapsibleContent>
                        </SidebarMenuItem>
                    </Collapsible>
                ))}
            </SidebarMenu>
        </SidebarGroup>
    </>);
};

export default NavMenus;