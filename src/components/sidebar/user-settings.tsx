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
import {useAuth} from "@/providers/auth-provider.tsx";
import {useNavigate} from "react-router";


/**
 * 用户消息
 *
 * @param user
 */
const UserSettings = (
    {side = 'sidebar'}: { side?: 'sidebar' | 'header' }
) => {

    const {user, logout} = useAuth();
    const navigate = useNavigate();
    const {open, isMobile} = useSidebar();
    const [settingOpen, setSettingOpen] = useState(false)

    return (<>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    {open && !isMobile ? (
                        <SidebarMenuButton
                            className={'w-30'}
                        >
                            <Avatar className='h-7 w-7 cursor-pointer'>
                                {<AvatarImage
                                    src={user?.avatarUrl}
                                    alt={user?.name}
                                />}
                                <AvatarFallback className='bg-primary text-background'>
                                    <User size={20}/>
                                </AvatarFallback>
                            </Avatar>
                            <span>{user?.name}</span>
                        </SidebarMenuButton>
                    ) : (
                        <Avatar className='h-7 w-7 cursor-pointer'>
                            {<AvatarImage
                                src={user?.avatarUrl}
                                alt={user?.name}
                            />}
                            <AvatarFallback className='bg-primary text-background'>
                                <User size={20}/>
                            </AvatarFallback>
                        </Avatar>
                    )}

                </DropdownMenuTrigger>
                <DropdownMenuContent
                    className="w-(--radix-dropdown-menu-trigger-width) min-w-40 rounded-lg"
                    side="bottom"
                    align="start"
                >
                    <DropdownMenuGroup>
                        <DropdownMenuItem
                            onClick={() => {
                                setSettingOpen(true)
                                navigate('/person/settings')
                            }}
                        >
                            <Settings/>
                            个人设置
                        </DropdownMenuItem>
                    </DropdownMenuGroup>
                    <DropdownMenuSeparator/>
                    <DropdownMenuItem
                        onClick={async () => {
                            await logout();
                            navigate('/login')
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