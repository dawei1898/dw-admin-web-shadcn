import React from 'react';
import {SidebarTrigger} from "@/components/ui/sidebar.tsx";
import {Separator} from "@/components/ui/separator.tsx";
import Breadcrumbs from "@/components/sidebar/breadcrumbs.tsx";

const Header = () => {
    return (<>
        <header
            className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
            <div className="flex items-center gap-2 px-4">
                <SidebarTrigger className="-ml-1 cursor-pointer"/>
                <Separator
                    orientation="vertical"
                    className="mr-2 data-[orientation=vertical]:h-4"
                />
                {/* 面包屑 */}
                <Breadcrumbs/>
            </div>
        </header>
    </>);
};

export default Header;