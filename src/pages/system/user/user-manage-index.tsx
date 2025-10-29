import React from 'react';
import {Card} from "@/components/ui/card.tsx";
import {Input} from "@/components/ui/input.tsx";
import {Label} from "@/components/ui/label.tsx";
import {RotateCw, Search} from "lucide-react";
import {
    Table,
    TableBody,
    TableCell,
    TableFooter,
    TableHead,
    TableHeader,
    TableRow
} from "@/components/ui/table.tsx";
import {Button} from "@/components/ui/button.tsx";


const invoices = [
    {
        invoice: "INV001",
        paymentStatus: "Paid",
        totalAmount: "$250.00",
        paymentMethod: "Credit Card",
    },
    {
        invoice: "INV002",
        paymentStatus: "Pending",
        totalAmount: "$150.00",
        paymentMethod: "PayPal",
    },
    {
        invoice: "INV003",
        paymentStatus: "Unpaid",
        totalAmount: "$350.00",
        paymentMethod: "Bank Transfer",
    },
    {
        invoice: "INV004",
        paymentStatus: "Paid",
        totalAmount: "$450.00",
        paymentMethod: "Credit Card",
    },
    {
        invoice: "INV005",
        paymentStatus: "Paid",
        totalAmount: "$550.00",
        paymentMethod: "PayPal",
    },
    {
        invoice: "INV006",
        paymentStatus: "Pending",
        totalAmount: "$200.00",
        paymentMethod: "Bank Transfer",
    },
    {
        invoice: "INV007",
        paymentStatus: "Unpaid",
        totalAmount: "$300.00",
        paymentMethod: "Credit Card",
    },
]


/**
 * 用户管理
 */
const UserManageIndex = () => {
    return (
        <div className='flex flex-col gap-4'>
            {/* 搜索栏 */}
            <div>
                <Card className='flex flex-row justify-between items-center p-4 md:p-6'>
                    <div className='flex gap-6'>
                        <div className='flex'>
                            <Label>账号：</Label>
                            <Input className='w-40'/>
                        </div>
                        <div className='flex'>
                            <Label>邮箱：</Label>
                            <Input className='w-40'/>
                        </div>
                        <div className='flex'>
                            <Label>手机：</Label>
                            <Input className='w-40'/>
                        </div>
                    </div>
                    <div className='space-x-4'>
                        <Button variant="outline" className='cursor-pointer'>
                            <RotateCw/>
                            重置
                        </Button>
                        <Button className='cursor-pointer'>
                            <Search/>
                            搜索
                        </Button>
                    </div>
                </Card>

            </div>

            {/* 用户列表 */}
            <div className='h-full w-full'>
                <Card>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-[100px]">Invoice</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Method</TableHead>
                                <TableHead className="text-right">Amount</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {invoices.map((invoice) => (
                                <TableRow key={invoice.invoice}>
                                    <TableCell className="font-medium">{invoice.invoice}</TableCell>
                                    <TableCell>{invoice.paymentStatus}</TableCell>
                                    <TableCell>{invoice.paymentMethod}</TableCell>
                                    <TableCell className="text-right">{invoice.totalAmount}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                        <TableFooter>
                            <TableRow>
                                <TableCell colSpan={3}>Total</TableCell>
                                <TableCell className="text-right">$2,500.00</TableCell>
                            </TableRow>
                        </TableFooter>
                    </Table>
                </Card>
            </div>
        </div>
    );
};

export default UserManageIndex;