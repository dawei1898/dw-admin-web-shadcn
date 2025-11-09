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
import {Button} from "@/components/ui/button.tsx";
import {Input} from "@/components/ui/input.tsx";
import {toast} from "sonner";
import {z} from "zod";
import {useForm} from "@tanstack/react-form";
import type {UserParam} from "@/types/users.ts";
import {saveUserAPI, updateUserAPI} from "@/apis/user-api.ts";
import {
    getRoleListAPI, getUserRoleListAPI, saveUserRoleAPI
} from "@/apis/role-api.ts";
import type {RoleParam, RoleVO} from "@/types/roles.ts";
import {
    Select, SelectContent,
    SelectTrigger, SelectValue
} from "@/components/ui/select.tsx";
import {Checkbox} from "@/components/ui/checkbox.tsx";


interface EditUserFormProps {
    children: React.ReactNode;
    record: UserParam | null;
    onFinish?: () => void;
}

/**
 * 编辑用户弹框表单
 */
const EditUserForm = (
    {children, record, onFinish}: EditUserFormProps
) => {

    const [open, setOpen] = useState(false)
    const [roles, setRoles] = useState<RoleVO[]>([])

    const userSchema = z.object({
        id: z.string(),
        name: z.string()
            .min(1, '用户名不能为空')
            .max(20, '用户名最多 20 个字'),
        email: z.string(),
        phone: z.string(),
        roleIds: z.array(z.string()),
    });

    const form = useForm({
        defaultValues: {
            id: record?.id || "",
            name: record?.name || "",
            email: record?.email || "",
            phone: record?.phone || "",
            roleIds: record?.roles?.map(role => role.roleCode!) || [],
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
                } : {roleCode: roleId, roleName: ''};
            }) || [];

            // 调更新用户接口
            await handleEditUser({
                id: value.id,
                name: value.name,
                email: value.email || undefined,
                phone: value.phone || undefined,
                roles: selectedRoles,
            })
        }
    });

    useEffect(() => {
        console.log("初始化编辑用户框")
        if (open) {
            // 打开弹框
            console.log("EditUserForm init record:", record)
            // 设置基本字段初始值
            if (record) {
                form.setFieldValue('id', record.id || '');
                form.setFieldValue('name', record.name || '');
                form.setFieldValue('email', record.email || '');
                form.setFieldValue('phone', record.phone || '');
            }
            // 获取角色列表
            loadRoles()
        } else {
            // 关闭弹框则重置表单
            form.reset()
        }
    }, [open, record]);

    useEffect(() => {
        // 角色列表加载完成后，加载用户原有角色
        if (open && record && roles.length > 0) {
            loadUserRoles(record.id!);
        }
    }, [open, record, roles]);

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
     * 加载用户原有角色
     */
    const loadUserRoles = async (userId: string) => {
        try {
            const resp = await getUserRoleListAPI(userId);
            if (resp.code === 200) {
                const userRoleCodes = resp.data?.map(role => role.roleCode!) || [];
                form.setFieldValue('roleIds', userRoleCodes);
                console.log("设置用户角色:", userRoleCodes);
            }
        } catch (error) {
            console.error('获取用户角色失败:', error);
        }
    }

    /**
     * 编辑用户
     */
    const handleEditUser = async (user: UserParam) => {
        if (user) {
            // 更新用户
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
            toast.success('保存成功')

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
            <DialogContent className="max-w-2xl">
                <DialogHeader>
                    <DialogTitle>编辑用户</DialogTitle>
                </DialogHeader>
                <form
                    id='edit-user-form'
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
                                                    <FieldLabel htmlFor={field.name}
                                                                className="flex items-center gap-1">
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
                                                                    <div
                                                                        className="flex items-center space-x-2 cursor-pointer hover:bg-accent rounded p-1">
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
                        form='edit-user-form'
                        className='cursor-pointer'
                        disabled={form.state.isSubmitting}
                    >
                        保存
                    </Button>
                </DialogFooter>
            </DialogContent>

        </Dialog>
    );
}

export default EditUserForm;