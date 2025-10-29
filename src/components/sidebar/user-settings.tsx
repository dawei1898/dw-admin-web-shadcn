import React, {useState} from 'react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem, DropdownMenuSeparator,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import {SidebarMenuButton, useSidebar} from "@/components/ui/sidebar";
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";
import {LogOut, Settings, User} from "lucide-react";


/**
 * 用户消息
 *
 * @param user
 */
const UserSettings = (
    {user, side = 'sidebar'}: { user?: any, side?: 'sidebar' | 'header' }
) => {
    const {open, isMobile} = useSidebar();


    const [settingOpen, setSettingOpen] = useState(false)

    return (<>
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                {side === 'sidebar' ?
                    (<SidebarMenuButton
                        className={'w-30'}
                    >
                        <Avatar className='h-7 w-7'>
                            {<AvatarImage
                                    src={user?.avatarUrl}
                                    alt={user?.username}
                                />}
                            <AvatarFallback className='bg-primary text-background'>
                                <User size={20}/>
                            </AvatarFallback>
                        </Avatar>
                        <span>{user?.username}</span>
                    </SidebarMenuButton>)
                    : (
                        <div>
                            <Avatar className='h-6 w-6 cursor-pointer'>
                                {<AvatarImage
                                    src="https://github.com/shadcn.png"
                                    alt="@shadcn"
                                />}
                                <AvatarFallback className='bg-primary text-background'>
                                    <User size={20}/>
                                </AvatarFallback>
                            </Avatar>
                        </div>
                    )
                }
            </DropdownMenuTrigger>
            <DropdownMenuContent
                className="w-(--radix-dropdown-menu-trigger-width) min-w-40 rounded-lg"
                side="bottom"
                align={side === 'sidebar' ? "start" : "end"}
            >
                <DropdownMenuGroup>
                    <DropdownMenuItem
                        onClick={() => { setSettingOpen(true)}}
                    >
                        <Settings/>
                        设置
                    </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator/>
                <DropdownMenuItem
                    onClick={async () => {
                        //await logout()
                    }}
                >
                    <LogOut/>
                    <span>退出登录</span>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
        </>
    );
};

export default UserSettings;