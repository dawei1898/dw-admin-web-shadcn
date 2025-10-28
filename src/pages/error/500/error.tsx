import React from 'react';
import {Button} from "@/components/ui/button.tsx";
import {Link} from "react-router";


/**
 * 500 错误页面
 */
const ErrorPage = () => {
    return (
        <div className='min-h-svh flex justify-center items-center p-6 md:p-10'>
            <div className='w-full max-w-sm flex flex-col items-center gap-4'>
                <p className='text-xl'>Error</p>
                <p className='text-muted-foreground'>
                    服务器正在开小差，请耐心等候....
                </p>
                <Link to={'/'}>
                    <Button className={'mt-4 cursor-pointer'}>
                        返回首页
                    </Button>
                </Link>
            </div>
        </div>
    );
};

export default ErrorPage;