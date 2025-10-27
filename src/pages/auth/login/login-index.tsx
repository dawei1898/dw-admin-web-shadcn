import React from 'react';
import {LoginForm} from "@/components/login-form.tsx";

/**
 * 登录页
 */
const LoginIndex = () => {
    return (
        <div className='min-h-svh flex justify-center items-center p-6 md:p-10 bg-slate-50'>
            <div className='w-full max-w-sm'>
                <LoginForm/>
            </div>
        </div>
    );
};

export default LoginIndex;