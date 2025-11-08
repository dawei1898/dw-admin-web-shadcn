import { Button } from "@/components/ui/button.tsx"
import { Checkbox } from "@/components/ui/checkbox.tsx"
import {
    Field, FieldContent,
    FieldDescription,
    FieldGroup,
    FieldLabel,
    FieldLegend,
    FieldSeparator,
    FieldSet,
} from "@/components/ui/field.tsx"
import { Input } from "@/components/ui/input.tsx"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select.tsx"
import { Textarea } from "@/components/ui/textarea.tsx"
import {RadioGroup, RadioGroupItem} from "@/components/ui/radio-group.tsx";


export function FieldDemo() {
    return (
        <div className="w-full max-w-xl border rounded-md p-4">
            <form>
                <FieldGroup>
                    <FieldSet>
                        <FieldLegend>Payment Method</FieldLegend>
                        <FieldDescription>
                            All transactions are secure and encrypted
                        </FieldDescription>
                        <FieldGroup>
                            <Field>
                                <FieldLabel htmlFor="checkout-7j9-card-name-43j">
                                    Name on Card
                                </FieldLabel>
                                <Input
                                    id="checkout-7j9-card-name-43j"
                                    placeholder="Evil Rabbit"
                                    required
                                />
                            </Field>
                            <Field>
                                <FieldLabel htmlFor="checkout-7j9-card-number-uw1">
                                    Card Number
                                </FieldLabel>
                                <Input
                                    id="checkout-7j9-card-number-uw1"
                                    placeholder="1234 5678 9012 3456"
                                    required
                                />
                                <FieldDescription>
                                    Enter your 16-digit card number
                                </FieldDescription>
                            </Field>
                            <div className="grid grid-cols-3 gap-4">
                                <Field>
                                    <FieldLabel htmlFor="checkout-exp-month-ts6">
                                        Month
                                    </FieldLabel>
                                    <Select defaultValue="">
                                        <SelectTrigger id="checkout-exp-month-ts6">
                                            <SelectValue placeholder="MM" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="01">01</SelectItem>
                                            <SelectItem value="02">02</SelectItem>
                                            <SelectItem value="03">03</SelectItem>
                                            <SelectItem value="04">04</SelectItem>
                                            <SelectItem value="05">05</SelectItem>
                                            <SelectItem value="06">06</SelectItem>
                                            <SelectItem value="07">07</SelectItem>
                                            <SelectItem value="08">08</SelectItem>
                                            <SelectItem value="09">09</SelectItem>
                                            <SelectItem value="10">10</SelectItem>
                                            <SelectItem value="11">11</SelectItem>
                                            <SelectItem value="12">12</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </Field>
                                <Field>
                                    <FieldLabel htmlFor="checkout-7j9-exp-year-f59">
                                        Year
                                    </FieldLabel>
                                    <Select defaultValue="">
                                        <SelectTrigger id="checkout-7j9-exp-year-f59">
                                            <SelectValue placeholder="YYYY" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="2024">2024</SelectItem>
                                            <SelectItem value="2025">2025</SelectItem>
                                            <SelectItem value="2026">2026</SelectItem>
                                            <SelectItem value="2027">2027</SelectItem>
                                            <SelectItem value="2028">2028</SelectItem>
                                            <SelectItem value="2029">2029</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </Field>
                                <Field>
                                    <FieldLabel htmlFor="checkout-7j9-cvv">CVV</FieldLabel>
                                    <Input id="checkout-7j9-cvv" placeholder="123" required />
                                </Field>
                            </div>
                        </FieldGroup>
                    </FieldSet>
                    <FieldSeparator />
                    <FieldSet>
                        <FieldLegend>Billing Address</FieldLegend>
                        <FieldDescription>
                            The billing address associated with your payment method
                        </FieldDescription>
                        <FieldGroup>
                            <Field orientation="horizontal">
                                <Checkbox
                                    id="checkout-7j9-same-as-shipping-wgm"
                                    defaultChecked
                                />
                                <FieldLabel
                                    htmlFor="checkout-7j9-same-as-shipping-wgm"
                                    className="font-normal"
                                >
                                    Same as shipping address
                                </FieldLabel>
                            </Field>
                        </FieldGroup>
                    </FieldSet>
                    <FieldSet>
                        <FieldGroup>
                            <Field>
                                <FieldLabel htmlFor="checkout-7j9-optional-comments">
                                    Comments
                                </FieldLabel>
                                <Textarea
                                    id="checkout-7j9-optional-comments"
                                    placeholder="Add any additional comments"
                                    className="resize-none"
                                />
                            </Field>
                        </FieldGroup>
                    </FieldSet>

                    <FieldSet>
                        <FieldLegend>
                            选项卡
                        </FieldLegend>
                        <FieldDescription>
                            这里有两个选项给你选择
                        </FieldDescription>
                        <FieldGroup>
                            <RadioGroup defaultValue={'a'}>
                                <FieldLabel htmlFor={'a1'}>
                                    <Field orientation='horizontal'>
                                        <FieldContent>
                                            <FieldLegend>
                                                选项 1
                                            </FieldLegend>
                                            <FieldDescription>
                                                这是提一个选项
                                            </FieldDescription>
                                        </FieldContent>
                                        <RadioGroupItem value="a" id="a1" />
                                    </Field>
                                </FieldLabel>
                                {<FieldLabel>
                                    <Field orientation='horizontal'>
                                        <FieldContent>
                                            <FieldLegend>
                                                选项 2
                                            </FieldLegend>
                                            <FieldDescription>
                                                这是第二个选项
                                            </FieldDescription>
                                        </FieldContent>
                                        <RadioGroupItem value={'b'}/>
                                    </Field>
                                </FieldLabel>}
                            </RadioGroup>
                        </FieldGroup>

                        <FieldGroup>
                            <Field orientation='responsive'>
                                <FieldContent>
                                    <FieldLabel>
                                        姓名
                                    </FieldLabel>
                                    <FieldDescription>
                                        填写您的全名
                                    </FieldDescription>
                                </FieldContent>
                                <Input placeholder='请填写...'/>
                            </Field>
                            <Field orientation={'responsive'}>
                                <FieldContent>
                                    <FieldLabel>
                                        信息
                                    </FieldLabel>
                                    <FieldDescription>
                                        请填写您的介绍信息...
                                    </FieldDescription>
                                </FieldContent>
                                <Textarea
                                    className='min-h-20 min-w-56 resize-none'
                                    rows={4}
                                    placeholder={'请填写'}
                                />
                            </Field>
                        </FieldGroup>
                    </FieldSet>

                    <Field orientation="responsive">
                        <Button type="submit">Submit</Button>
                        <Button variant="outline" type="button">
                            Cancel
                        </Button>
                    </Field>
                </FieldGroup>
            </form>
        </div>
    )
}
