import React from "react";
import {createBrowserRouter, useRouteError} from "react-router";
import App from "../App.tsx";
import TestIndex from "@/pages/test/test.tsx";
import HomeLayout from "@/pages/home/home-layout.tsx";
import LoginIndex from "@/pages/auth/login/login-index.tsx";
import ErrorPage from "@/pages/error/500/error.tsx";
import NotFoundPage from "@/pages/error/404/not-found.tsx";
import RegisterIndex from "@/pages/auth/register/register-index.tsx";
import WorkbenchIndex from "@/pages/dashboard/workbench/workbench-index.tsx";
import AnalysisIndex from "@/pages/dashboard/analysis/analysis-index.tsx";


/**
 * 根据错误类型跳转到对应的页面
 */
function GeneralErrorBoundary() {
    const error: any = useRouteError();
    if (error.status === 403) {
        //return <NotAuthorizedPage/>;
    } else if (error.status === 404) {
        return <NotFoundPage/>;
    } else {
        return <ErrorPage/>;
    }
}

/**
 * 页面路由
 */
const Router = createBrowserRouter([
    {
        path: "/",
        Component: HomeLayout,
        errorElement: <GeneralErrorBoundary/>,
        children: [
            /*{
                index: true,
                Component: HomeIndex,
            },*/
            {
                path: "dashboard",
                handle: {breadcrumb: "控制台"},
                children: [
                    {
                        path: "workbench",
                        Component: WorkbenchIndex,
                        handle: {breadcrumb: "工作台"},
                    },
                    {
                        path: "analysis",
                        Component: AnalysisIndex,
                        handle: {breadcrumb: "分析页"},
                    },
                ]
            },


        ]
    },
    {
        path: "/home",
        element: <App/>,
    },
    {
        path: "/login",
        Component: LoginIndex,
    },
    {
        path: "/register",
        Component: RegisterIndex,
    },
    {
        path: "/error",
        children: [
            {
                path: "404",
                Component: NotFoundPage,
            },
            {
                path: "500",
                Component: ErrorPage,
            }
        ]
    },
    {
        path: "/test",
        Component: TestIndex,
    }

])

export default Router