import React, {useEffect, useState} from 'react';
import {uploadFileAPI} from "@/apis/file-api.ts";
import {getLoginUserAPI, updateUserAPI} from "@/apis/user-api.ts";
import {toast} from "sonner";
import type {UserParam} from "@/types/users.ts";
import {z} from "zod";
import {useForm} from "@tanstack/react-form";
import {Card, CardContent, CardFooter, CardHeader, CardTitle} from "@/components/ui/card.tsx";
import {Field, FieldError, FieldGroup, FieldLabel, FieldSet} from "@/components/ui/field.tsx";
import {Input} from "@/components/ui/input.tsx";
import {Button} from "@/components/ui/button.tsx";
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar.tsx";
import {Upload} from "lucide-react";


/**
 * 个人设置页
 */
const PersonSettings = () => {

    const [loading, setLoading] = useState(false)
    const [avatarUrl, setAvatarUrl] = useState('')

    const userSchema = z.object({
        id: z.string(),
        name: z.string()
            .min(1, '用户名不能为空')
            .max(20, '用户名最多 20 个字'),
        email: z.string()
            .regex(/^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/, '邮箱格式不正确'),
        phone: z.string(),
            //.regex(/^1[3456789]\d{8}$/, '手机格式不正确'),
        avatarUrl: z.string(),
    });

    const form = useForm({
        defaultValues: {
            id: "",
            name: "",
            email: "",
            phone: "",
            avatarUrl: "",
        },
        validators: {
            onSubmit: userSchema,
        },
        onSubmit: async ({value}) => {
            console.log('提交表单 value: ', JSON.stringify(value))

            // 调更新用户接口
            await handleUpdateUser(value)
        }
    });


    useEffect(() => {
        handleGetUserInfo()
    }, []);

    // 获取用户信息
    const handleGetUserInfo = async () => {
        getLoginUserAPI()
            .then(resp => {
                if (resp.code !== 200) {
                    toast.error(resp.message);
                    return
                }
                const user = resp.data;
                form.setFieldValue('id', user.id || "");
                form.setFieldValue('name', user.name || "");
                form.setFieldValue('email', user.email || "");
                form.setFieldValue('phone', user.phone || "");
                form.setFieldValue('avatarUrl', user.avatarUrl || "");

                setAvatarUrl(resp.data.avatarUrl!)
            }).catch(error => {
            toast.error(error.message);
        });
    }

    // 更新用户
    const handleUpdateUser = async (user: UserParam) => {
        if (user) {
            const resp = await updateUserAPI(user);
            if (resp.code !== 200) {
                toast.error(resp.message);
                return
            }
            toast.success('更新成功')
            await handleGetUserInfo()
        }
    }

    // 上传文件
    const handleUploadChange = async (uploadFile: File) => {
        if (uploadFile) {
            setLoading(true)
            const file = uploadFile as File;
            uploadFileAPI(file)
                .then(resp => {
                    if (resp.code !== 200) {
                        toast.error(resp.message);
                    } else {
                        const fileUrl = resp.data.url;
                        if (fileUrl) {
                            console.log('上传成功, url:', fileUrl)
                            form.setFieldValue('avatarUrl', fileUrl);
                            setAvatarUrl(fileUrl)
                        }
                    }
                }).catch(error => {
                toast.error(error.message);
            }).finally(() => {
                setLoading(false)
            });
        }
    };

    /**
     * 上传展示头像
     */
    const AvatarUpload = () => {
        return (
            <div className="flex flex-col justify-center items-start gap-6 my-4">
                <Avatar className='h-30 w-30'>
                    <AvatarImage src={avatarUrl}/>
                    <AvatarFallback>Dw</AvatarFallback>
                </Avatar>
                <div className='relative'>
                    <Button
                        type={'button'}
                        className='border-dashed hover:border-primary cursor-pointer '
                        variant='outline'
                        size='sm'
                        disabled={loading}
                    >
                        <Upload/>
                        更换头像
                    </Button>
                    <Input
                        className='absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed'
                        type='file'
                        accept='image/*'
                        onChange={async (e) => {
                            await handleUploadChange(e.target.files![0])
                        }}
                    />
                </div>
            </div>
        )
    }

    return (
        <div className='flex justify-start p-4'>
            <div className='w-full max-w-md'>
                <Card>
                    <CardHeader>
                        <CardTitle>个人基本信息</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form
                            id='person-settings-form'
                            onSubmit={(e) => {
                                e.preventDefault();
                                form.handleSubmit();
                            }}
                        >
                            <FieldSet>
                                <FieldGroup>
                                    <Field>
                                        <FieldLabel>头像</FieldLabel>
                                        <AvatarUpload/>
                                    </Field>
                                    <form.Field
                                        name='name'
                                        children={(field) => {
                                            return (
                                                <Field>
                                                    <FieldLabel htmlFor={field.name}>
                                                        <span className='text-red-500'>*</span>
                                                        账号
                                                    </FieldLabel>
                                                    <Input
                                                        id={field.name}
                                                        value={field.state.value}
                                                        disabled
                                                    />
                                                </Field>
                                            )
                                        }}
                                    />
                                    <form.Field
                                        name='email'
                                        children={(field) => {
                                            const isInvalid = field.state.meta.isTouched
                                                && !field.state.meta.isValid
                                            return (
                                                <Field>
                                                    <FieldLabel htmlFor={field.name}>
                                                        邮箱
                                                    </FieldLabel>
                                                    <Input
                                                        id={field.name}
                                                        value={field.state.value}
                                                        onChange={(e) => {
                                                            field.handleChange(e.target.value)
                                                        }}
                                                        aria-invalid={isInvalid}
                                                        placeholder='请输入邮箱地址...'
                                                    />
                                                    {isInvalid
                                                        && <FieldError errors={field.state.meta.errors}/>}
                                                </Field>
                                            )
                                        }}
                                    />
                                    <form.Field
                                        name='phone'
                                        children={(field) => {
                                            const isInvalid = field.state.meta.isTouched
                                                && !field.state.meta.isValid
                                            return (
                                                <Field>
                                                    <FieldLabel htmlFor={field.name}>
                                                        手机
                                                    </FieldLabel>
                                                    <Input
                                                        id={field.name}
                                                        value={field.state.value}
                                                        onChange={(e) => {
                                                            field.handleChange(e.target.value)
                                                        }}
                                                        aria-invalid={isInvalid}
                                                        placeholder='请输入手机号...'
                                                    />
                                                </Field>
                                            )
                                        }}
                                    />
                                </FieldGroup>
                                <Field>
                                    <Button
                                        className='cursor-pointer'
                                        type='submit'
                                        form='person-settings-form'
                                    >
                                        更新基本信息
                                    </Button>
                                </Field>
                            </FieldSet>
                        </form>
                    </CardContent>
                </Card>
            </div>

        </div>
    );
};

export default PersonSettings;