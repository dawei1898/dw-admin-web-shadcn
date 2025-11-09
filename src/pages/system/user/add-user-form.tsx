import React, {useEffect, useState} from 'react';
import {
    Dialog, DialogClose,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from "@/components/ui/dialog.tsx";
import {
    FieldDescription, FieldError,
    FieldGroup, FieldLabel, FieldSet
} from "@/components/ui/field.tsx";
import {
    Select, SelectContent,
    SelectTrigger, SelectValue
} from "@/components/ui/select.tsx";
import {Button} from "@/components/ui/button.tsx";
import {Input} from "@/components/ui/input.tsx";
import {toast} from "sonner";
import {z} from "zod";
import {useForm} from "@tanstack/react-form";
import type {UserParam} from "@/types/users.ts";
import {saveUserAPI} from "@/apis/user-api.ts";
import {getRoleListAPI, saveUserRoleAPI} from "@/apis/role-api.ts";
import type {RoleParam, RoleVO} from "@/types/roles.ts";
import {Checkbox} from "@/components/ui/checkbox.tsx";


interface AddUserFormProps {
    children: React.ReactNode;
    onFinish?: () => void;
}

/**
 * 添加用户弹框表单
 */
const AddUserForm = (
    {children, onFinish}: AddUserFormProps
) => {

    const [open, setOpen] = useState(false)
    const [roles, setRoles] = useState<RoleVO[]>([])

    const userSchema = z.object({
        name: z.string()
            .min(1, '用户名不能为空')
            .max(20, '用户名最多 20 个字'),
        password: z.string()
            .min(6, '密码至少 6 个字符')
            .max(20, '密码最多 20 个字符'),
        email: z.string(),
        phone: z.string(),
        roleIds: z.array(z.string()),
    });

    const form = useForm({
        defaultValues: {
            name: "",
            password: "",
            email: "",
            phone: "",
            roleIds: [] as string[],
        },
        validators: {
            onSubmit: userSchema,
        },
        onSubmit: async ({value}) => {
            console.log('提交表单 value: ', JSON.stringify(value))
            // 构建角色列表
            const selectedRoles: RoleParam[] = value.roleIds?.map(roleId => {
                const role = roles.find(r => r.roleCode === roleId);
                return role ? {
                    roleCode: role.roleCode!,
                    roleName: role.roleName!
                } : { roleCode: roleId, roleName: '' };
            }) || [];

            // 调添加用户接口
            await handleAddUser({
                name: value.name,
                password: value.password,
                email: value.email || undefined,
                phone: value.phone || undefined,
                roles: selectedRoles,
            })
        }
    });

    useEffect(() => {
        // 关闭弹框则重置表单
        !open && form.reset()
    }, [open]);

    useEffect(() => {
        // 获取角色列表
        if (open) {
            loadRoles()
        }
    }, [open]);

    /**
     * 加载角色列表
     */
    const loadRoles = async () => {
        try {
            const resp = await getRoleListAPI({
                pageNum: 1,
                pageSize: 1000, // 获取所有角色
                status: '1' // 只获取启用的角色
            });
            if (resp.code === 200) {
                setRoles(resp.data.list || []);
            }
        } catch (error) {
            console.error('获取角色列表失败:', error);
        }
    }

    /**
     * 添加用户
     */
    const handleAddUser = async (user: UserParam) => {
        if (user) {
            // 新增用户
            const resp = await saveUserAPI(user);
            if (resp.code !== 200) {
                toast.error(resp.message);
                return
            }
            // 保存角色
            const roles = user.roles?.map(role => {
                return {
                    roleCode: role.roleCode,
                    roleName: role.roleName
                }
            });
            const resp2 = await saveUserRoleAPI({
                userId: resp.data,
                roles: roles || [],
            });
            if (resp2.code !== 200) {
                toast.error(resp2.message);
                return
            }
            toast.success('添加成功')

            // 回调完成方法
            onFinish?.()
            // 关闭弹框
            setOpen(false)
        }
    }

    
    return (
        <Dialog
            open={open}
            onOpenChange={setOpen}
        >
            <DialogTrigger asChild>
                {children}
            </DialogTrigger>
            <DialogContent >
                <DialogHeader>
                    <DialogTitle>添加用户</DialogTitle>
                </DialogHeader>
                <form
                    id='add-user-form'
                    onSubmit={async (e) => {
                        e.preventDefault()
                        await form.handleSubmit()
                    }}
                >
                    <div className="flex flex-col gap-4 m-4 h-100">
                        <FieldSet>
                            <FieldGroup>
                                <form.Field
                                    name='name'
                                    children={(field) => {
                                        const isInvalid = field.state.meta.isTouched
                                            && !field.state.meta.isValid
                                        return (
                                            <div className="flex items-center gap-4">
                                                <div className="w-24 flex-shrink-0">
                                                    <FieldLabel htmlFor={field.name} className="flex items-center gap-1">
                                                        <span className='text-red-500'>*</span>
                                                        用户名
                                                    </FieldLabel>
                                                </div>
                                                <div className="flex-1">
                                                    <Input
                                                        id={field.name}
                                                        value={field.state.value}
                                                        onChange={(e) => {
                                                            field.handleChange(e.target.value)
                                                        }}
                                                        aria-invalid={isInvalid}
                                                        placeholder='请输入用户名...'
                                                    />
                                                    <FieldDescription>
                                                        用户名用于登录系统
                                                    </FieldDescription>
                                                    {isInvalid &&
                                                        <FieldError errors={field.state.meta.errors}/>}
                                                </div>
                                            </div>
                                        )
                                    }}
                                />

                                <form.Field
                                    name='password'
                                    children={(field) => {
                                        const isInvalid = field.state.meta.isTouched
                                            && !field.state.meta.isValid
                                        return (
                                            <div className="flex items-center gap-4">
                                                <div className="w-24 flex-shrink-0">
                                                    <FieldLabel htmlFor={field.name} className="flex items-center gap-1">
                                                        <span className='text-red-500'>*</span>
                                                        密码
                                                    </FieldLabel>
                                                </div>
                                                <div className="flex-1">
                                                    <Input
                                                        id={field.name}
                                                        type="password"
                                                        value={field.state.value}
                                                        onChange={(e) => {
                                                            field.handleChange(e.target.value)
                                                        }}
                                                        aria-invalid={isInvalid}
                                                        placeholder='请输入密码...'
                                                    />
                                                    <FieldDescription>
                                                        密码至少 6 个字符，最多 20 个字符
                                                    </FieldDescription>
                                                    {isInvalid &&
                                                        <FieldError errors={field.state.meta.errors}/>}
                                                </div>
                                            </div>
                                        )
                                    }}
                                />

                                <form.Field
                                    name='email'
                                    children={(field) => {
                                        const isInvalid = field.state.meta.isTouched
                                            && !field.state.meta.isValid
                                        return (
                                            <div className="flex items-center gap-4">
                                                <div className="w-24 flex-shrink-0">
                                                    <FieldLabel htmlFor={field.name}>
                                                        邮箱
                                                    </FieldLabel>
                                                </div>
                                                <div className="flex-1">
                                                    <Input
                                                        id={field.name}
                                                        value={field.state.value}
                                                        onChange={(e) => {
                                                            field.handleChange(e.target.value)
                                                        }}
                                                        aria-invalid={isInvalid}
                                                        placeholder='请输入邮箱地址...'
                                                    />
                                                    <FieldDescription>
                                                        邮箱用于找回密码
                                                    </FieldDescription>
                                                    {isInvalid &&
                                                        <FieldError errors={field.state.meta.errors}/>}
                                                </div>
                                            </div>
                                        )
                                    }}
                                />

                                <form.Field
                                    name='phone'
                                    children={(field) => {
                                        const isInvalid = field.state.meta.isTouched
                                            && !field.state.meta.isValid
                                        return (
                                            <div className="flex items-center gap-4">
                                                <div className="w-24 flex-shrink-0">
                                                    <FieldLabel htmlFor={field.name}>
                                                        手机号
                                                    </FieldLabel>
                                                </div>
                                                <div className="flex-1">
                                                    <Input
                                                        id={field.name}
                                                        value={field.state.value}
                                                        onChange={(e) => {
                                                            field.handleChange(e.target.value)
                                                        }}
                                                        aria-invalid={isInvalid}
                                                        placeholder='请输入手机号...'
                                                    />
                                                    <FieldDescription>
                                                        手机号用于短信验证
                                                    </FieldDescription>
                                                    {isInvalid &&
                                                        <FieldError errors={field.state.meta.errors}/>}
                                                </div>
                                            </div>
                                        )
                                    }}
                                />

                                <form.Field
                                    name='roleIds'
                                    children={(field) => {
                                        const selectedRoles = roles.filter(role =>
                                            field.state.value?.includes(role.roleCode || '')
                                        );

                                        const handleRoleToggle = (roleCode: string) => {
                                            const currentValues = field.state.value || [];
                                            if (currentValues.includes(roleCode)) {
                                                field.handleChange(currentValues.filter(id => id !== roleCode));
                                            } else {
                                                field.handleChange([...currentValues, roleCode]);
                                            }
                                        };

                                        return (
                                            <div className="flex items-start gap-4">
                                                <div className="w-24 flex-shrink-0 pt-2">
                                                    <FieldLabel>
                                                        用户角色
                                                    </FieldLabel>
                                                </div>
                                                <div className="flex-1">
                                                    <Select
                                                        value={field.state.value?.[0] || ""}
                                                        onValueChange={(value) => {
                                                            if (value && !field.state.value?.includes(value)) {
                                                                handleRoleToggle(value);
                                                            }
                                                        }}
                                                    >
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="请选择角色（可多选）">
                                                                {selectedRoles.length > 0 ? (
                                                                    <span className="text-sm">
                                                                        已选择 {selectedRoles.length} 个角色
                                                                    </span>
                                                                ) : (
                                                                    "请选择角色（可多选）"
                                                                )}
                                                            </SelectValue>
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            {roles.map((role) => (
                                                                <div key={role.id} className="px-2 py-1">
                                                                    <div className="flex items-center space-x-2 cursor-pointer hover:bg-accent rounded p-1">
                                                                        <Checkbox
                                                                            checked={field.state.value?.includes(role.roleCode || '') || false}
                                                                            onCheckedChange={() => handleRoleToggle(role.roleCode!)}
                                                                        />
                                                                        <span
                                                                            className="text-sm flex-1"
                                                                            onClick={() => handleRoleToggle(role.roleCode!)}
                                                                        >
                                                                            {role.roleName}
                                                                        </span>
                                                                    </div>
                                                                </div>
                                                            ))}
                                                        </SelectContent>
                                                    </Select>

                                                    {selectedRoles.length > 0 && (
                                                        <div className="mt-2 flex flex-wrap gap-1">
                                                            {selectedRoles.map((role) => (
                                                                <span
                                                                    key={role.id}
                                                                    className="inline-flex items-center gap-1 px-2 py-1 bg-primary/10 text-primary text-xs rounded-md"
                                                                >
                                                                    {role.roleName}
                                                                    <button
                                                                        type="button"
                                                                        onClick={() => handleRoleToggle(role.roleCode!)}
                                                                        className="ml-1 hover:text-primary/70"
                                                                    >
                                                                        ×
                                                                    </button>
                                                                </span>
                                                            ))}
                                                        </div>
                                                    )}

                                                    <FieldDescription>
                                                        选择用户拥有的角色权限（可多选）
                                                    </FieldDescription>
                                                </div>
                                            </div>
                                        )
                                    }}
                                />
                            </FieldGroup>
                        </FieldSet>
                    </div>
                </form>
                <DialogFooter>
                    <DialogClose asChild>
                        <Button variant="outline" className='cursor-pointer'>
                            取消
                        </Button>
                    </DialogClose>
                    <Button
                        type="submit"
                        form='add-user-form'
                        className='cursor-pointer'
                        disabled={form.state.isSubmitting}
                    >
                        添加
                    </Button>
                </DialogFooter>
            </DialogContent>

        </Dialog>
    );
}

export default AddUserForm;