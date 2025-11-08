import React, {useEffect, useState} from 'react';
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
import type {UserSearchParam, UserVO} from "@/types/users.ts";
import {deleteUserAPI, getUserListAPI} from "@/apis/user-api.ts";
import {toast} from "sonner";


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


const initSearchParams = {
    pageNum: 1,
    pageSize: 10,
}

const initPagination = {
    current: 1,
    pageSize: 10,
}

/**
 * 用户管理
 */
const UserManageIndex = () => {


    const [data, setData] = useState<UserVO[]>([])
    const [selectedIds, setSelectedIds] = useState<string[]>([])
    const [loading, setLoading] = useState<boolean>(false)
    const [searchParams, setSearchParams] = useState<UserSearchParam>(initSearchParams)
    const [pagination, setPagination] = useState(initPagination);



    /**
     * 初始化加载用户列表
     */
    useEffect(() => {
            getUserList(searchParams)

        }, [searchParams.pageNum,
            searchParams.pageSize,
            searchParams.createTimeSort,
            searchParams.updateTimeSort]
    );



    // 获取用户列表
    const getUserList = async (param: UserSearchParam) => {
        try {
            setLoading(true)

            const resp = await getUserListAPI(param);
            if (resp.code !== 200) {
                toast.error(resp.message);
                return;
            }
            setData(resp.data.list);
            /*setPagination((pre) => ({
                ...pre,
                current: resp.data.pageNum,
                pageSize: resp.data.pageSize,
                total: Number(resp.data.total),
                showTotal: (total) => `共 ${total} 条数据`,
            }))*/
        } finally {
            setLoading(false)
        }
    }

    // 搜索操作
    const handleSearch = async () => {
        await getUserList(searchParams)
    }

    // 重置搜索操作
    const handleReset = async () => {
        setSearchParams(initSearchParams)
        setPagination(initPagination)
        await getUserList(initSearchParams)
    }

    // 删除用户
    const handleDelete =  async (id: string)  => {
        if (id) {
            const resp = await deleteUserAPI(id);
            if (resp.code === 200) {
                toast.success('删除成功')
            } else {
                toast.error(resp.message);
            }
            await handleReset()
        }
    }

    // 批量删除用户
    const handleBatchDelete = async () => {
        if (selectedIds && selectedIds.length > 0) {
            try {
                for (const id of selectedIds) {
                    const resp = await deleteUserAPI(id);
                    if (resp.code !== 200) {
                        toast.error(resp.message);
                        return; // 如果出错可以提前返回，或者根据需求继续处理其他项
                    }
                }
                toast.success('删除成功');
            } finally {
                //setSelectedIds([])
                await handleReset();
            }
        }
    };


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