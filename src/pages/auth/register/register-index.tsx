import React from 'react';
import {LoginForm} from "@/components/auth/login-form.tsx";
import {RegisterForm} from "@/components/auth/register-form.tsx";

/**
 * 注册页
 */
const LoginIndex = () => {
    return (
        <div className='min-h-svh flex justify-center items-center p-6 md:p-10 bg-secondary'>
            <div className='w-full max-w-sm'>
                <RegisterForm/>
            </div>
        </div>
    );
};

export default LoginIndex;