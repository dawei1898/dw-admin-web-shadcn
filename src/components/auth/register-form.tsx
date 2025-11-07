import {cn} from "@/lib/utils.ts"
import {Button} from "@/components/ui/button.tsx"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card.tsx"
import {
    Field,
    FieldDescription, FieldError,
    FieldGroup,
    FieldLabel,
} from "@/components/ui/field.tsx"
import {
    InputGroup, InputGroupAddon, InputGroupInput
} from "@/components/ui/input-group.tsx";
import {Lock, User} from "lucide-react";
import {Link, useNavigate} from "react-router";
import {
    Avatar, AvatarFallback, AvatarImage
} from "@/components/ui/avatar.tsx";
import {useAuth} from "@/providers/auth-provider.tsx";
import {useState} from "react";
import type {RegisterParam} from "@/types/auth.ts";
import {toast} from "sonner";
import {z} from "zod";
import {useForm} from "@tanstack/react-form";

/**
 * 注册框组件
 */
export function RegisterForm(
    {className, ...props}: React.ComponentProps<"div">
) {

    const navigate = useNavigate();
    const {register} = useAuth();
    const [loading, setLoading] = useState<boolean>(false);


    // 定义验证 schema
    const registerSchema = z.object({
        username: z.string().min(1, '用户名不能为空'),
        password: z.string()
            .min(6, '密码长度在 6-15 之间')
            .max(15, '密码长度在 6-15 之间'),
        confirmPassword: z.string()
            .min(6, '密码长度在 6-15 之间')
            .max(15, '密码长度在 6-15 之间')
    }).refine((data) => data.password === data.confirmPassword, {
        message: '密码不一致',
        path: ['confirmPassword']
    });

    const form = useForm({
        defaultValues: {
            username: "",
            password: "",
            confirmPassword: "",
        },
        validators: {
            onSubmit: registerSchema,
        },
        onSubmit: async ({value}) => {
            console.log('提交登录 value: ', JSON.stringify(value))
            await handleRegister({
                username: value.username,
                password: value.password,
            })
        }
    });


    /**
     * 处理注册操作
     */
    const handleRegister = async (param: RegisterParam) => {
        try {
            setLoading(true)

            await register(param)

            console.log('注册成功，跳到登录页')
            toast.success('注册成功')
            navigate('/login')
        } catch (e) {
            console.log('注册失败：', e)
            if (e instanceof Error) {
                toast.error(e.message)
            }
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className={cn("flex flex-col gap-6", className)} {...props}>
            <Card>
                <CardHeader className='text-center mb-4'>
                    <CardTitle className='flex justify-center items-center gap-3'>
                        <Avatar>
                            <AvatarImage src='logo.svg' alt="DW"/>
                            <AvatarFallback>DW</AvatarFallback>
                        </Avatar>
                        <span className='text-blue-500 text-xl'>DW Admin</span>
                    </CardTitle>
                    <CardDescription>
                        一个简单易用的后台管理系统
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form
                        id='register-form'
                        onSubmit={(e) => {
                            e.preventDefault()
                            form.handleSubmit()
                        }}
                    >
                        <FieldGroup>
                            <form.Field
                                name="username"
                                children={(field) => {
                                    const isInvalid = field.state.meta.isTouched
                                        && !field.state.meta.isValid
                                    return (
                                        <Field>
                                            <FieldLabel htmlFor={field.name}>账号</FieldLabel>
                                            <InputGroup>
                                                <InputGroupAddon>
                                                    <User/>
                                                </InputGroupAddon>
                                                <InputGroupInput
                                                    id={field.name}
                                                    name={field.name}
                                                    value={field.state.value}
                                                    onChange={(e) =>
                                                        field.handleChange(e.target.value)
                                                    }
                                                    aria-invalid={isInvalid}
                                                    placeholder="请输入账号...."
                                                />
                                            </InputGroup>
                                            {isInvalid &&
                                                <FieldError errors={field.state.meta.errors}/>}
                                        </Field>
                                    )
                                }}
                            />

                            <form.Field
                                name="password"
                                children={(field) => {
                                    const isInvalid = field.state.meta.isTouched
                                        && !field.state.meta.isValid
                                    return (
                                        <Field>
                                            <FieldLabel htmlFor={field.name}>密码</FieldLabel>
                                            <InputGroup>
                                                <InputGroupAddon>
                                                    <Lock/>
                                                </InputGroupAddon>
                                                <InputGroupInput
                                                    type="password"
                                                    placeholder='请输入密码...'
                                                    id={field.name}
                                                    name={field.name}
                                                    aria-invalid={isInvalid}
                                                    value={field.state.value}
                                                    onChange={(e) =>
                                                        field.handleChange(e.target.value)
                                                    }
                                                />
                                            </InputGroup>
                                            {isInvalid &&
                                                <FieldError errors={field.state.meta.errors}/>}
                                        </Field>
                                    )
                                }}
                            />

                            <form.Field
                                name='confirmPassword'
                                children={(field) => {
                                    const isInvalid = field.state.meta.isTouched
                                        && !field.state.meta.isValid
                                    return (
                                        <Field>
                                            <FieldLabel htmlFor={field.name}>确认密码</FieldLabel>
                                            <InputGroup>
                                                <InputGroupAddon>
                                                    <Lock/>
                                                </InputGroupAddon>
                                                <InputGroupInput
                                                    type="password"
                                                    placeholder='请确认密码...'
                                                    id={field.name}
                                                    name={field.name}
                                                    aria-invalid={isInvalid}
                                                    value={field.state.value}
                                                    onChange={(e) =>
                                                        field.handleChange(e.target.value)
                                                    }
                                                />
                                            </InputGroup>
                                            {isInvalid &&
                                                <FieldError errors={field.state.meta.errors}/>}
                                        </Field>
                                    )
                                }}
                            />

                            <Field>
                                <Button
                                    className='cursor-pointer'
                                    type="submit"
                                    disabled={form.state.isSubmitting}
                                >
                                    注册
                                </Button>
                                <FieldDescription className="text-center">
                                    已有账号？
                                    <Link to={'/login'}>
                                        <span className='text-blue-500 underline'>
                                            登录
                                        </span>
                                    </Link>
                                </FieldDescription>
                            </Field>
                        </FieldGroup>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}
