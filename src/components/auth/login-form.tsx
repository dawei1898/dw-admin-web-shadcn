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
    FieldDescription,
    FieldError,
    FieldGroup,
} from "@/components/ui/field.tsx"
import {
    InputGroup, InputGroupAddon, InputGroupInput
} from "@/components/ui/input-group.tsx";
import {Lock, User} from "lucide-react";
import {Checkbox} from "@/components/ui/checkbox.tsx";
import {Link, useNavigate} from "react-router";
import {
    Avatar, AvatarFallback, AvatarImage
} from "@/components/ui/avatar.tsx";
import {z} from "zod";
import {useForm} from "@tanstack/react-form";
import {toast} from "sonner";
import {useState} from "react";
import {useAuth} from "@/providers/auth-provider.tsx";
import type {LoginParam} from "@/types/auth.ts";


/**
 * 登录组件
 */
export function LoginForm(
    {className, ...props}: React.ComponentProps<"div">
) {

    const navigate = useNavigate();
    const {login} = useAuth();
    const [loading, setLoading] = useState<boolean>(false);

    const loginSchema = z.object({
        username: z.string()
            .min(1, '用户名不能为空'),
        password: z.string()
            .min(6, '密码长度在 6-15 之间')
            .max(15, '密码长度在 6-15 之间'),
    });

    const form = useForm({
        defaultValues: {
            username: "",
            password: "",
        },
        validators: {
            onSubmit: loginSchema,
        },
        onSubmit: async ({value}) => {
            console.log('提交登录 value: ', JSON.stringify(value))
            await handleLogin({
                username: value.username,
                password: value.password,
            })
        }
    });

    /**
     * 处理登录操作
     */
    const handleLogin = async (param: LoginParam) => {
        try {
            setLoading(true)

            await login(param)
            // 跳到首页
            console.log('跳到首页')
            navigate('/')
        } catch (e) {
            console.log('登录失败：', e)
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
                        id='login-form'
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
                                                    placeholder="账号：admin"
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
                                            <InputGroup>
                                                <InputGroupAddon>
                                                    <Lock/>
                                                </InputGroupAddon>
                                                <InputGroupInput
                                                    id={field.name}
                                                    name={field.name}
                                                    value={field.state.value}
                                                    onChange={(e) =>
                                                        field.handleChange(e.target.value)
                                                    }
                                                    aria-invalid={isInvalid}
                                                    placeholder='密码：123456'
                                                />
                                            </InputGroup>
                                            {isInvalid &&
                                                <FieldError errors={field.state.meta.errors}/>}
                                        </Field>
                                    )
                                }}
                            />

                            <Field orientation='horizontal'>
                                {/* 记住我 */}
                                <Checkbox id="remember"/>
                                <FieldDescription>
                                    记住我
                                </FieldDescription>

                                <div className="flex items-center  ml-auto ">
                                    <a
                                        href="#"
                                        className="inline-block text-sm underline-offset-4 hover:underline"
                                    >
                                        忘记密码?
                                    </a>
                                </div>
                            </Field>

                            <Field>
                                <Button
                                    className='cursor-pointer'
                                    type="submit"
                                    disabled={form.state.isSubmitting}
                                >
                                    登录
                                </Button>
                                <FieldDescription className="text-center">
                                    还没有账号？
                                    <Link to={'/register'}>
                                        <span className='text-blue-500 underline'>
                                            注册
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
