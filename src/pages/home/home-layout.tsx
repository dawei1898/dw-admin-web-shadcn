import React from 'react';
import {SidebarInset, SidebarProvider} from "@/components/ui/sidebar.tsx";
import {AdminSidebar} from "@/components/sidebar/admin-sidebar.tsx";
import Header from "@/components/sidebar/header.tsx";
import {Outlet} from "react-router/internal/react-server-client";


const HomeLayout = () => {

    return (
        <div>
            <SidebarProvider>
                <AdminSidebar/>
                <SidebarInset>
                    <Header/>
                    <div className="p-4 pt-0">
                        <Outlet/>
                    </div>
                </SidebarInset>
            </SidebarProvider>
        </div>
    );
};

export default HomeLayout;