import {cn} from "@/lib/utils"
import {Button} from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    Field,
    FieldDescription,
    FieldGroup,
    FieldLabel,
} from "@/components/ui/field"
import {InputGroup, InputGroupAddon, InputGroupInput} from "@/components/ui/input-group.tsx";
import {Lock, User} from "lucide-react";
import {Checkbox} from "@/components/ui/checkbox.tsx";
import {Link} from "react-router";
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar.tsx";

export function LoginForm({
                              className,
                              ...props
                          }: React.ComponentProps<"div">) {


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
                    <form>
                        <FieldGroup>
                            <Field>
                                {/*<FieldLabel htmlFor="username">账号</FieldLabel>*/}
                                <InputGroup>
                                    <InputGroupAddon>
                                        <User/>
                                    </InputGroupAddon>
                                    <InputGroupInput
                                        id="username"
                                        type="username"
                                        placeholder="账号：admin"
                                        required
                                    />
                                </InputGroup>
                            </Field>
                            <Field>
                                {/*<FieldLabel htmlFor="password">密码</FieldLabel>*/}
                                <InputGroup>
                                    <InputGroupAddon>
                                        <Lock/>
                                    </InputGroupAddon>
                                    <InputGroupInput
                                        id="password"
                                        type="password"
                                        placeholder='密码：123456'
                                        required
                                    />
                                </InputGroup>
                            </Field>

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
                                <Button type="submit">登录</Button>
                                <FieldDescription className="text-center">
                                    还没有账号?
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
