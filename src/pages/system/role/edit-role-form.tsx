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
    Field, FieldDescription, FieldError,
    FieldGroup, FieldLabel, FieldSet
} from "@/components/ui/field.tsx";
import {Button} from "@/components/ui/button.tsx";
import {Input} from "@/components/ui/input.tsx";
import {toast} from "sonner";
import {z} from "zod";
import {useForm} from "@tanstack/react-form";
import type {RoleParam} from "@/types/roles.ts";
import {saveRoleAPI} from "@/apis/role-api.ts";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select.tsx";
import {statusOptions} from "@/pages/system/role/role-manage-index.tsx";


interface AddRoleFormProps {
    children: React.ReactNode;
    record: RoleParam | null;
    onFinish?: () => void;
}

/**
 * 编辑角色弹框表单
 */
const EditRoleForm = (
    {children, record, onFinish}: AddRoleFormProps
) => {

    const [open, setOpen] = useState(false)

    const roleSchema = z.object({
        id: z.string(),
        roleCode: z.string()
            .min(1, '角色码不能为空')
            .max(20, '角色码最多 20 个字母')
            .regex(/^[a-zA-Z]+$/, '角色码只能包含英文字母'),
        roleName: z.string()
            .min(1, '角色名称不能为空')
            .max(20, '角色名称最多 20 个字'),
        status: z.string()
            .min(1, '状态不能为空'),
    });

    const form = useForm({
        defaultValues: {
            id: record?.id || "",
            roleCode: record?.roleCode || "",
            roleName: record?.roleName || "",
            status: record?.status || "",
        },
        validators: {
            onSubmit: roleSchema,
        },
        onSubmit: async ({value}) => {
            console.log('提交表单 value: ', JSON.stringify(value))
            // 调添加角色接口
            await handleEditRole(value)
        }
    });

    useEffect(() => {
        console.log("初始化编辑角色框")
        if (open) {
            // 打开弹框
            console.log("EditRoleForm init record:", record)

        } else {
            // 关闭弹框则重置表单
            form.reset()
        }
    }, [open]);


    /**
     * 编辑角色
     */
    const handleEditRole = async (role: RoleParam) => {
        if (role) {
            // 保存角色
            const resp = await saveRoleAPI(role);
            if (resp.code !== 200) {
                toast.error(resp.message);
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
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>编辑角色</DialogTitle>
                </DialogHeader>
                <form
                    id='add-role-form'
                    onSubmit={async (e) => {
                        e.preventDefault()
                        await form.handleSubmit()
                    }}
                >
                    <div className="flex flex-col gap-4 m-4">
                        <FieldSet>
                            <FieldGroup>
                                <form.Field
                                    name='roleCode'
                                    children={(field) => {
                                        const isInvalid = field.state.meta.isTouched
                                            && !field.state.meta.isValid
                                        return (
                                            <Field>
                                                <FieldLabel htmlFor={field.name}>
                                                    <span className='text-red-500'>*</span>
                                                    角色码
                                                </FieldLabel>
                                                <Input
                                                    id={field.name}
                                                    value={field.state.value}
                                                    onChange={(e) => {
                                                        field.handleChange(e.target.value)
                                                    }}
                                                    aria-invalid={isInvalid}
                                                    disabled
                                                    placeholder='请输入角色码...'
                                                />
                                                <FieldDescription>
                                                    角色码要求是英文字母
                                                </FieldDescription>
                                                {isInvalid &&
                                                    <FieldError errors={field.state.meta.errors}/>}
                                            </Field>
                                        )
                                    }}
                                />

                                <form.Field
                                    name='roleName'
                                    children={(field) => {
                                        const isInvalid = field.state.meta.isTouched
                                            && !field.state.meta.isValid
                                        return (
                                            <Field>
                                                <FieldLabel htmlFor={field.name}>
                                                    <span className='text-red-500'>*</span>
                                                    角色名称
                                                </FieldLabel>
                                                <Input
                                                    id={field.name}
                                                    value={field.state.value}
                                                    onChange={(e) => {
                                                        field.handleChange(e.target.value)
                                                    }}
                                                    aria-invalid={isInvalid}
                                                    placeholder='请输入角色名称...'
                                                />
                                                <FieldDescription>
                                                    角色名称建议是中文
                                                </FieldDescription>
                                                {isInvalid &&
                                                    <FieldError errors={field.state.meta.errors}/>}
                                            </Field>
                                        )
                                    }}
                                />

                                <form.Field
                                    name='status'
                                    children={(field) => {
                                        return (
                                            <Field>
                                                <FieldLabel htmlFor={field.name}>
                                                    <span className='text-red-500'>*</span>
                                                    状态
                                                </FieldLabel>
                                                <Select
                                                    value={field.state.value}
                                                    onValueChange={(value) => {
                                                        field.handleChange(value)
                                                    }}
                                                >
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="请选择"/>
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {statusOptions
                                                            .filter((item) => item.value !== "all")
                                                            .map((item, index) => (
                                                            <SelectItem key={index} value={item.value}>
                                                                {item.label}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                            </Field>
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
                        form='add-role-form'
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

export default EditRoleForm;