import React, {useEffect, useState} from 'react';
import type {LoginLogSearchParam, LoginLogVO} from "@/types/loginLog.ts";
import {getLoginLogListAPI} from "@/apis/loginLog-api.ts";
import {toast} from "sonner";
import {Label} from "@/components/ui/label.tsx";
import {Input} from "@/components/ui/input.tsx";
import {Button} from "@/components/ui/button.tsx";
import {
    RotateCw, Search, Trash2,
} from "lucide-react";
import {
    Table, TableBody, TableCell,
    TableHead, TableHeader, TableRow
} from "@/components/ui/table.tsx";
import {
    type ColumnDef,
    type ColumnFiltersState,
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    type SortingState, useReactTable,
    type VisibilityState
} from "@tanstack/react-table";
import {Checkbox} from "@/components/ui/checkbox.tsx";
import {Separator} from "@/components/ui/separator.tsx";
import {Tag} from "@/components/tag.tsx";
import ColumnSorting from "@/components/table/column-sorting.tsx";
import TablePagination from "@/components/table/table-pagination.tsx";
import ColumnViewOptions from "@/components/table/column-view-options.tsx";
import {
    FIELD_LOGIN_TIME,
    SORT_ASC,
    SORT_DESC,
    STATUS_ENABLED
} from "@/types/constant.ts";
import type {ColumnMeta} from "@/types/table.ts";
import {Skeleton} from "@/components/ui/skeleton.tsx";
import DeleteLogDialog from "@/pages/system/log/delete-log-dialog.tsx";


const initSearchParams = {
    pageNum: 1,
    pageSize: 10,
}


/**
 * 日志管理
 */
const LogManageIndex = () => {

    const [data, setData] = useState<LoginLogVO[]>([])
    const [searchParams, setSearchParams] = useState<LoginLogSearchParam>(initSearchParams)
    const [total, setTotal] = useState<number>(0);
    const [loading, setLoading] = useState<boolean>(false)

    // 排序
    const [sorting, setSorting] = useState<SortingState>([])
    // 搜索过滤
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
    // 列显示
    const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
    // 选中的行
    const [rowSelection, setRowSelection] = useState({})


    /**
     * 初始化加载日志列表
     */
    useEffect(() => {
            getLogList(searchParams)

        }, [searchParams.pageNum,
            searchParams.pageSize,
            searchParams.loginTimeSort]
    );


    // 获取日志列表
    const getLogList = async (param: LoginLogSearchParam) => {
        if (loading) {
            return
        }
        try {
            setLoading(true)

            const resp = await getLoginLogListAPI(param);
            if (resp.code !== 200) {
                toast.error(resp.message);
                return;
            }
            setData(resp.data.list);

            // 设置总数据条数
            setTotal(resp.data.total);
        } finally {
            setLoading(false)
        }
    }

    // 重置搜索操作
    const handleReset = async () => {
        setSearchParams(initSearchParams)
        setSorting([])
        setColumnFilters([])
        setRowSelection({})
        setColumnVisibility({})
    }

    // 搜索操作
    const handleSearch = async () => {
        await getLogList(searchParams)
    }

    /**
     * 表格标题行
     */
    const columns: ColumnDef<LoginLogVO>[] = [
        {
            id: "select",
            header: ({table}) => (
                <div className='flex justify-center ml-2'>
                    <Checkbox
                        checked={table.getIsAllPageRowsSelected() ||
                            (table.getIsSomePageRowsSelected() && "indeterminate")}
                        onCheckedChange={
                            (value) => table.toggleAllPageRowsSelected(!!value)
                        }
                    />
                </div>
            ),
            cell: ({row}) => (
                <div className='flex justify-center ml-2'>
                    <Checkbox
                        checked={row.getIsSelected()}
                        onCheckedChange={(value) => row.toggleSelected(!!value)}
                    />
                </div>
            ),
            enableSorting: false,
            enableHiding: false,
        },
        {
            accessorKey: "id",
            meta: {
                displayName: "ID"
            } as ColumnMeta,
            header: () => (
                <div className='w-full min-w-16 text-center'>
                    ID
                </div>
            ),
            cell: ({row}) => (
                <div className='text-center'>
                    <span>{row.original.id}</span>
                </div>
            ),
            filterFn: (row, columnId, filterValue) => {
                return true
            },
        },
        {
            accessorKey: "username",
            meta: {
                displayName: "用户名"
            } as ColumnMeta,
            header: () => (
                <div className='flex gap-2 w-full min-w-20 text-center'>
                    <Separator
                        orientation="vertical"
                        className="-ml-4 data-[orientation=vertical]:h-4"
                    />
                    <div className='flex justify-center w-full gap-2'>
                        <span>用户名</span>
                    </div>
                </div>
            ),
            cell: ({row}) => (
                <div className='text-center'>
                    <span>{row.original.username}</span>
                </div>
            ),
            filterFn: (row, columnId, filterValue) => {
                return true
            },
        },
        {
            accessorKey: "ipAddr",
            meta: {
                displayName: "IP地址"
            } as ColumnMeta,
            header: () => (
                <div className='flex gap-2 w-full min-w-24 text-center'>
                    <Separator
                        orientation="vertical"
                        className="-ml-4 data-[orientation=vertical]:h-4"
                    />
                    <div className='flex justify-center w-full gap-2'>
                        <span>IP地址</span>
                    </div>
                </div>
            ),
            cell: ({row}) => (
                <div className='text-center'>
                    <span>{row.original.ipAddr || '-'}</span>
                </div>
            ),
            filterFn: (row, columnId, filterValue) => {
                return true
            },
        },
        {
            accessorKey: "loginLocation",
            meta: {
                displayName: "登录地点"
            } as ColumnMeta,
            header: () => (
                <div className='flex gap-2 w-full min-w-24 text-center'>
                    <Separator
                        orientation="vertical"
                        className="-ml-4 data-[orientation=vertical]:h-4"
                    />
                    <div className='flex justify-center w-full gap-2'>
                        <span>登录地点</span>
                    </div>
                </div>
            ),
            cell: ({row}) => (
                <div className='text-center'>
                    <span>{row.original.loginLocation || '-'}</span>
                </div>
            ),
            filterFn: (row, columnId, filterValue) => {
                return true
            },
        },
        {
            accessorKey: "loginTime",
            meta: {
                displayName: "登录时间"
            } as ColumnMeta,
            header: ({column}) => (
                <div className='flex gap-2'>
                    <Separator
                        orientation="vertical"
                        className="-ml-4 data-[orientation=vertical]:h-4"
                    />
                    <div className='flex justify-center items-center w-full min-w-32 gap-2'>
                        <span>登录时间</span>
                        <ColumnSorting column={column}/>
                    </div>
                </div>
            ),
            cell: ({row}) => (
                <div className='text-center'>
                    <span>{row.original.loginTime}</span>
                </div>
            ),
            sortingFn: (a, b) => {
                return 0
            },
        },
        {
            accessorKey: "os",
            meta: {
                displayName: "操作系统"
            } as ColumnMeta,
            header: () => (
                <div className='flex gap-2 w-full min-w-20 text-center'>
                    <Separator
                        orientation="vertical"
                        className="-ml-4 data-[orientation=vertical]:h-4"
                    />
                    <div className='flex justify-center w-full gap-2'>
                        <span>操作系统</span>
                    </div>
                </div>
            ),
            cell: ({row}) => (
                <div className='text-center'>
                    <span>{row.original.os || '-'}</span>
                </div>
            ),
            filterFn: (row, columnId, filterValue) => {
                return true
            },
        },
        {
            accessorKey: "browser",
            meta: {
                displayName: "浏览器"
            } as ColumnMeta,
            header: () => (
                <div className='flex gap-2 w-full min-w-20 text-center'>
                    <Separator
                        orientation="vertical"
                        className="-ml-4 data-[orientation=vertical]:h-4"
                    />
                    <div className='flex justify-center w-full gap-2'>
                        <span>浏览器</span>
                    </div>
                </div>
            ),
            cell: ({row}) => (
                <div className='text-center'>
                    <span>{row.original.browser || '-'}</span>
                </div>
            ),
            filterFn: (row, columnId, filterValue) => {
                return true
            },
        },
        {
            accessorKey: "status",
            meta: {
                displayName: "状态"
            } as ColumnMeta,
            header: () => (
                <div className='flex gap-2 w-full min-w-16 text-center'>
                    <Separator
                        orientation="vertical"
                        className="-ml-4 data-[orientation=vertical]:h-4"
                    />
                    <div className='flex justify-center w-full gap-2'>
                        <span>状态</span>
                    </div>
                </div>
            ),
            cell: ({row}) => {
                const status = row.getValue("status");
                return (
                    <div className='flex justify-center'>
                        {status === "success"
                            ? <Tag color="success">登录成功</Tag>
                            : <Tag color="warning">失败</Tag>}
                    </div>
                )
            },
        },
        {
            id: "action",
            enableSorting: false,
            enableHiding: false,
            header: () => (
                <div className='flex gap-2'>
                    <Separator
                        orientation="vertical"
                        className="-ml-4 data-[orientation=vertical]:h-4"
                    />
                    <div className='flex justify-center w-full gap-2'>
                        <span>操作</span>
                    </div>
                </div>
            ),
            cell: ({row}) => {
                const log = row.original;
                return (
                    <div className='flex justify-center items-center gap-3'>
                        <DeleteLogDialog
                            logIds={[log.id]}
                            onFinish={handleReset}>
                            <a href='#' className='text-red-500 hover:text-red-600'>
                                删除
                            </a>
                        </DeleteLogDialog>
                    </div>
                )
            }
        }
    ]

    const table = useReactTable({
        columns,
        data,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        onSortingChange: setSorting,
        getFilteredRowModel: getFilteredRowModel(),
        onColumnFiltersChange: setColumnFilters,
        onColumnVisibilityChange: setColumnVisibility,
        onRowSelectionChange: setRowSelection,
        state: {
            sorting,
            columnFilters,
            rowSelection,
            columnVisibility,
        }
    });

    
    useEffect(() => {
        console.log('sorting:', sorting)
        console.log('columnFilters:', columnFilters)
        const pagination = table.getState().pagination;
        console.log('pagination:', pagination)
        console.log('rowSelection:', rowSelection)

        let pageNum: number = 1;
        let pageSize: number = 10;
        let username: string = '';
        let ipAddr: string = '';
        let loginTimeSort: string = '';

        // 分页
        if (pagination) {
            pageNum = pagination.pageIndex + 1;
            pageSize = pagination.pageSize;
        }
        // 筛选
        if (columnFilters && columnFilters.length > 0) {
            for (let filter of columnFilters) {
                const fieldName = filter.id;
                switch (fieldName) {
                    case 'username':
                        username = (filter.value as string).trim();
                        break;
                    case 'ipAddr':
                        ipAddr = (filter.value as string).trim();
                        break;
                }
            }
        }
        // 排序
        if (sorting && sorting.length > 0) {
            // 排序字段
            const field = sorting[0].id;
            // 排序顺序
            const isDesc = sorting[0].desc;
            // 登录时间排序
            if (field === FIELD_LOGIN_TIME) {
                loginTimeSort = isDesc ? SORT_DESC : SORT_ASC
            }
        }

        setSearchParams({
            pageNum,
            pageSize,
            username,
            ipAddr,
            loginTimeSort
        })

    }, [sorting, columnFilters, table.getState().pagination]);

    // 选中的日志 ID
    const selectedLogIds = table.getSelectedRowModel().rows
        .map((row) => row.original.id || '');

    return (<>
            <div className='flex flex-col gap-6 p-4'>
                {/* 搜索栏 */}
                <div className='flex items-center gap-6 p-4 rounded-md border border-secondary'>
                    <div className='flex gap-6'>
                        <div className='flex'>
                            <Label className='font-normal'> 用户名：</Label>
                            <Input
                                className='max-w-40 ml-1'
                                placeholder=''
                                value={(table.getColumn("username")?.getFilterValue() as string) ?? ""}
                                onChange={(event) => {
                                    table.getColumn("username")?.setFilterValue(event.target.value)
                                }}
                            />
                        </div>
                        <div className='flex'>
                            <Label className='font-normal'> IP地址：</Label>
                            <Input
                                className='max-w-40 ml-1'
                                placeholder=''
                                value={(table.getColumn("ipAddr")?.getFilterValue() as string) ?? ""}
                                onChange={(event) => {
                                    table.getColumn("ipAddr")?.setFilterValue(event.target.value)
                                }}
                            />
                        </div>
                    </div>

                    <div className='flex gap-2 ml-auto'>
                        <Button
                            className='cursor-pointer'
                            size='sm'
                            onClick={() => handleSearch()}
                        >
                            <Search/>
                            搜索
                        </Button>
                        <Button
                            className='cursor-pointer'
                            variant="outline"
                            size='sm'
                            onClick={() => handleReset()}
                        >
                            <RotateCw/>
                            重置
                        </Button>
                    </div>
                </div>

                {/* 批量删除按钮 */}
                <div className='flex justify-end items-center gap-4'>
                    <DeleteLogDialog
                        logIds={selectedLogIds}
                        onFinish={handleReset}>
                        <Button
                            className='cursor-pointer'
                            variant='destructive'
                            size='sm'
                            disabled={selectedLogIds.length < 1}
                        >
                            <Trash2/>
                            批量删除
                        </Button>
                    </DeleteLogDialog>

                    <ColumnViewOptions<LoginLogVO>
                        className='cursor-pointer'
                        label='列'
                        table={table}
                    />
                </div>

                {/* 数据列表 */}
                <div className="overflow-hidden rounded-md border">
                    <Table>
                        <TableHeader>
                            {table.getHeaderGroups().map((headerGroup) => (
                                <TableRow key={headerGroup.id}>
                                    {headerGroup.headers.map((header) => (
                                        <TableHead key={header.id}>
                                            {header.isPlaceholder ? null : (
                                                flexRender(
                                                    header.column.columnDef.header,
                                                    header.getContext()
                                                )
                                            )}
                                        </TableHead>
                                    ))}
                                </TableRow>
                            ))}
                        </TableHeader>
                        <TableBody>
                            {table.getRowModel().rows?.length ? (
                                    table.getRowModel().rows.map((row) => (
                                        <TableRow
                                            key={row.id}
                                            data-state={row.getIsSelected() && "selected"}
                                        >
                                            {row.getVisibleCells().map((cell) => (
                                                <TableCell key={cell.id}>
                                                    {flexRender(
                                                        cell.column.columnDef.cell,
                                                        cell.getContext()
                                                    )}
                                                </TableCell>
                                            ))}
                                        </TableRow>
                                    ))
                                )
                                : (loading ? (
                                        <TableRow>
                                            <TableCell colSpan={columns.length} className={'h-32 text-center'}>
                                                <div className="flex items-center space-x-4 p-4">
                                                    <Skeleton className="h-12 w-12 rounded-full"/>
                                                    <div className="space-y-2 w-full">
                                                        <Skeleton className="h-4 max-w-4xl"/>
                                                        <Skeleton className="h-4 max-w-4xl"/>
                                                        <Skeleton className="h-4 max-w-4xl"/>
                                                    </div>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        <TableRow>
                                            <TableCell colSpan={columns.length} className={'h-32 text-center'}>
                                                暂无数据
                                            </TableCell>
                                        </TableRow>)

                                )}
                        </TableBody>
                    </Table>

                    <TablePagination
                        table={table}
                        total={total}
                        showSizeChanger
                        showQuickJumper
                    />
                </div>
            </div>
        </>
    );
};

export default LogManageIndex;