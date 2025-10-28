import React from 'react';
import {Button} from "@/components/ui/button.tsx";
import {Link} from "react-router";


/**
 * 404 页面
 */
const NotFoundPage = () => {
    return (
        <div className='min-h-svh flex justify-center items-center p-6 md:p-10'>
            <div className='w-full max-w-sm flex flex-col items-center gap-4'>
                <p className='text-xl'>Not Found</p>
                <p className='text-muted-foreground'>
                    您访问的网页不存在！
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

export default NotFoundPage;