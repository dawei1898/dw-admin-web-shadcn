import {createBrowserRouter, useRouteError} from "react-router";
import App from "../App.tsx";
import TestIndex from "@/pages/test/test.tsx";
import HomeLayout from "@/pages/home/home-layout.tsx";



/**
 * 根据错误类型跳转到对应的页面
 */
/*function GeneralErrorBoundary() {
    const error: any = useRouteError();
    if (error.status === 403) {
        return <NotAuthorizedPage/>;
    } else if (error.status === 404) {
        return <NotFoundPage/>;
    } else {
        return <ErrorPage/>;
    }
}*/

/**
 * 页面路由
 */
const Router = createBrowserRouter([
    {
        path: "/",
        Component: HomeLayout,
        //errorElement: <GeneralErrorBoundary/>,
        children: [
            /*{
                index: true,
                Component: HomeIndex,
            },*/


        ]
    },
    {
        path: "/home",
        element: <App/>,
    },
    {
        path: "/test",
        Component: TestIndex,
    }

])

export default Router