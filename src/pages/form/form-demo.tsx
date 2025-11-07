import React from 'react';
import {
    Card, CardContent, CardDescription,
    CardFooter, CardHeader, CardTitle
} from "@/components/ui/card.tsx";
import {Button} from "@/components/ui/button.tsx";
import {
    Field, FieldDescription,
    FieldError, FieldGroup, FieldLabel
} from "@/components/ui/field.tsx";
import {Input} from "@/components/ui/input.tsx";
import {
    InputGroup, InputGroupAddon,
    InputGroupText, InputGroupTextarea
} from "@/components/ui/input-group.tsx";
import {z} from "zod";
import {useForm} from "@tanstack/react-form";
import {toast} from "sonner";




const FormDemo = () => {

    const formSchema = z.object({
        title: z.string()
            .min(5, '标题至少 5 个字')
            .max(20, '标题最多 20 个字'),
        description: z.string()
            .min(10, '描述至少 10 个字')
            .max(200, '描述最多 200 个字'),
    });

    const form = useForm({
        defaultValues: {
            title: "",
            description: "",
        },
        validators: {
            onSubmit: formSchema,
        },
        onSubmit: async ({value}) => {
            console.log('提交表单 value: ', JSON.stringify(value))

            toast.success("表单提交成功")
        }
    });


    return (
        <div className='w-full max-w-md p-4'>
            <Card>
                <CardHeader>
                    <CardTitle>
                        缺陷报告
                    </CardTitle>
                    <CardDescription>
                        请填写您在使用当中遇到的问题
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form
                        id='demo-form'
                        onSubmit={(e) => {
                            e.preventDefault()
                            form.handleSubmit()
                        }}
                    >
                        <FieldGroup>
                            <form.Field
                                name="title"
                                children={(field) => {
                                    const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid

                                    return (
                                        <Field data-invalid={isInvalid}>
                                            <FieldLabel htmlFor={field.name}>
                                                标题
                                            </FieldLabel>
                                            <Input
                                                id={field.name}
                                                name={field.name}
                                                onBlur={field.handleBlur}
                                                value={field.state.value}
                                                onChange={(e) =>
                                                    field.handleChange(e.target.value)
                                                }
                                                aria-invalid={isInvalid}
                                                autoComplete='off'
                                                placeholder='请填写标题...'
                                            />
                                            {isInvalid &&
                                                <FieldError errors={field.state.meta.errors}/>
                                            }
                                        </Field>
                                    )
                                }}>
                            </form.Field>
                            <form.Field
                                name='description'
                                children={(field) => {
                                    const isInvalid = field.state.meta.isTouched
                                        && !field.state.meta.isValid
                                    return (
                                        <Field>
                                            <FieldLabel htmlFor={field.name}>
                                                描述
                                            </FieldLabel>
                                            <InputGroup>
                                                <InputGroupTextarea
                                                    className='min-h-20 max-h-50'
                                                    id={field.name}
                                                    value={field.state.value}
                                                    onChange={(e) =>
                                                        field.handleChange(e.target.value)
                                                    }
                                                    rows={1}
                                                    placeholder='请填写详细的描述...'
                                                />
                                                <InputGroupAddon
                                                    align='block-end'
                                                    className='flex justify-end pt-1 pb-1'
                                                >
                                                    <InputGroupText className='text-end'>
                                                        {field.state.value.length}/200 字
                                                    </InputGroupText>
                                                </InputGroupAddon>
                                            </InputGroup>
                                            <FieldDescription>
                                                包含您的使用感受、时间、建议等
                                            </FieldDescription>
                                            {isInvalid &&
                                                <FieldError errors={field.state.meta.errors}/>
                                            }
                                        </Field>
                                    )
                                }}
                            />
                        </FieldGroup>
                    </form>
                </CardContent>
                <CardFooter>
                    <Field orientation='horizontal'>
                        <Button
                            id='demo-form'
                            variant='outline'
                            onClick={() => form.reset()}
                        >
                            重置
                        </Button>
                        <Button
                            form='demo-form'
                            type='submit'
                        >
                            提交
                        </Button>
                    </Field>
                </CardFooter>
            </Card>
        </div>
    );
};

export default FormDemo;