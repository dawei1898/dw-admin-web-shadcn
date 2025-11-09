import React, {useEffect, useState} from 'react';
import type {UserSearchParam, UserVO} from "@/types/users.ts";
import {getUserListAPI} from "@/apis/user-api.ts";
import {toast} from "sonner";
import {Label} from "@/components/ui/label.tsx";
import {Input} from "@/components/ui/input.tsx";
import {Button} from "@/components/ui/button.tsx";
import {
    Plus,
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
import ColumnSorting from "@/components/table/column-sorting.tsx";
import TablePagination from "@/components/table/table-pagination.tsx";
import ColumnViewOptions from "@/components/table/column-view-options.tsx";
import {
    FIELD_CREATE_TIME,
    FIELD_UPDATE_TIME,
    SORT_ASC,
    SORT_DESC,
} from "@/types/constant.ts";
import type {ColumnMeta} from "@/types/table.ts";
import {Skeleton} from "@/components/ui/skeleton.tsx";
import AddUserForm from "@/pages/system/user/add-user-form.tsx";
import EditUserForm from "@/pages/system/user/edit-user-form.tsx";
import DeleteUserDialog from "@/pages/system/user/delete-user-dialog.tsx";


const initSearchParams = {
    pageNum: 1,
    pageSize: 10,
}


/**
 * 用户管理
 */
const UserManageIndex = () => {

    const [data, setData] = useState<UserVO[]>([])
    const [searchParams, setSearchParams] = useState<UserSearchParam>(initSearchParams)
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
        if (loading) {
            return
        }
        try {
            setLoading(true)

            const resp = await getUserListAPI(param);
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

        table.resetColumnFilters()
        table.resetSorting()
        table.resetPagination()
        table.resetRowSelection()
        table.resetColumnVisibility()
    }

    // 搜索操作
    const handleSearch = async () => {
        await getUserList(searchParams)
    }


    /**
     * 表格标题行
     */
    const columns: ColumnDef<UserVO>[] = [
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
            accessorKey: "name",
            meta: {
                displayName: "用户名"
            } as ColumnMeta,
            header: () => (
                <div className='w-full min-w-20 text-center'>
                    用户名
                </div>
            ),
            cell: ({row}) => (
                <div className='text-center'>
                    <span>{row.original.name}</span>
                </div>
            ),
            filterFn: (row, columnId, filterValue) => {
                return true // 去除过滤
            },
        },
        {
            accessorKey: "email",
            meta: {
                displayName: "邮箱"
            } as ColumnMeta,
            header: () => (
                <div className='flex gap-2 w-full min-w-24 text-center'>
                    <Separator
                        orientation="vertical"
                        className="-ml-4 data-[orientation=vertical]:h-4"
                    />
                    <div className='flex justify-center w-full gap-2'>
                        <span>邮箱</span>
                    </div>
                </div>
            ),
            cell: ({row}) => (
                <div className='text-center'>
                    <span>{row.original.email || '-'}</span>
                </div>
            ),
            filterFn: (row, columnId, filterValue) => {
                return true // 去除过滤
            },
        },
        {
            accessorKey: "phone",
            meta: {
                displayName: "手机号"
            } as ColumnMeta,
            header: () => (
                <div className='flex gap-2 w-full min-w-24 text-center'>
                    <Separator
                        orientation="vertical"
                        className="-ml-4 data-[orientation=vertical]:h-4"
                    />
                    <div className='flex justify-center w-full gap-2'>
                        <span>手机号</span>
                    </div>
                </div>
            ),
            cell: ({row}) => (
                <div className='text-center'>
                    <span>{row.original.phone || '-'}</span>
                </div>
            ),
            filterFn: (row, columnId, filterValue) => {
                return true // 去除过滤
            },
        },
          {
            accessorKey: "createTime",
            meta: {
                displayName: "创建时间"
            } as ColumnMeta,
            header: ({column}) => (
                <div className='flex gap-2'>
                    <Separator
                        orientation="vertical"
                        className="-ml-4 data-[orientation=vertical]:h-4"
                    />
                    <div className='flex justify-center items-center w-full gap-2'>
                        <span>创建时间</span>
                        <ColumnSorting column={column}/>
                    </div>
                </div>
            ),
            cell: ({row}) => (
                <div className='text-center'>
                    <span>{row.original.createTime}</span>
                </div>
            ),
            sortingFn: (a, b) => {
                return 0 // 去除过滤
            },
        },
        {
            accessorKey: "updateTime",
            meta: {
                displayName: "更新时间"
            } as ColumnMeta,
            header: ({column}) => (
                <div className='flex gap-2'>
                    <Separator
                        orientation="vertical"
                        className="-ml-4 data-[orientation=vertical]:h-4"
                    />
                    <div className='flex justify-center items-center w-full gap-2'>
                        <span>更新时间</span>
                        <ColumnSorting column={column}/>
                    </div>
                </div>
            ),
            cell: ({row}) => (
                <div className='text-center'>
                    <span>{row.original.updateTime}</span>
                </div>
            ),
            sortingFn: (a, b) => {
                return 0 // 去除过滤
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
                const user = row.original;
                return (
                    <div className='flex justify-center items-center gap-3'>
                        <EditUserForm
                            record={user}
                            onFinish={handleReset}>
                            <a href='#' className='text-blue-500 hover:text-blue-600'>
                                编辑
                            </a>
                        </EditUserForm>
                        <Separator
                            orientation="vertical"
                            className="data-[orientation=vertical]:h-4"
                        />
                        <DeleteUserDialog
                            userIds={[user.id || '']}
                            onFinish={handleReset}
                        >
                            <a href='#' className='text-red-500 hover:text-red-600'>
                                删除
                            </a>
                        </DeleteUserDialog>
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
        const pagination = table.getState().pagination;
        console.log('pagination:', JSON.stringify(pagination))

        let pageNum: number = 1;
        let pageSize: number = 10;
        let name: string = '';
        let email: string = '';
        let phone: string = '';
        let createTimeSort: string = '';
        let updateTimeSort: string = '';

        // 分页
        if (pagination) {
            pageNum = pagination.pageIndex + 1;
            pageSize = pagination.pageSize;
        }
        // 筛选
        if (columnFilters && columnFilters.length > 0) {
            for (let filter of columnFilters) {
                const filedName = filter.id;
                switch (filedName) {
                    case 'name':
                        name = (filter.value as string).trim();
                        break;
                    case 'email':
                        email = (filter.value as string).trim();
                        break;
                    case 'phone':
                        phone = (filter.value as string).trim();
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
            // 创建时间排序
            if (field === FIELD_CREATE_TIME) {
                createTimeSort = isDesc ? SORT_DESC : SORT_ASC
            }
            // 更新时间排序
            if (field === FIELD_UPDATE_TIME) {
                updateTimeSort = isDesc ? SORT_DESC : SORT_ASC
            }
        }

        setSearchParams({
            pageNum,
            pageSize,
            name,
            email,
            phone,
            createTimeSort,
            updateTimeSort
        })

    }, [sorting, columnFilters, table.getState().pagination]);

    // 选中的用户 ID
    const selectedUserIds = table.getSelectedRowModel().rows
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
                                value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
                                onChange={(event) => {
                                    table.getColumn("name")?.setFilterValue(event.target.value)
                                }}
                            />
                        </div>
                        <div className='flex'>
                            <Label className='font-normal'> 邮箱：</Label>
                            <Input
                                className='max-w-40 ml-1'
                                placeholder=''
                                value={(table.getColumn("email")?.getFilterValue() as string) ?? ""}
                                onChange={(event) => {
                                    table.getColumn("email")?.setFilterValue(event.target.value)
                                }}
                            />
                        </div>
                        <div className='flex'>
                            <Label className='font-normal'> 手机号：</Label>
                            <Input
                                className='max-w-40 ml-1'
                                placeholder=''
                                value={(table.getColumn("phone")?.getFilterValue() as string) ?? ""}
                                onChange={(event) => {
                                    table.getColumn("phone")?.setFilterValue(event.target.value)
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

                {/* 添加删除按钮 */}
                <div className='flex justify-end items-center gap-4'>
                    <AddUserForm onFinish={handleSearch}>
                        <Button size='sm' className='cursor-pointer'>
                            <Plus/>
                            添加
                        </Button>
                    </AddUserForm>
                    <DeleteUserDialog
                        userIds={selectedUserIds}
                        onFinish={handleReset}
                    >
                        <Button
                            className='cursor-pointer'
                            variant='destructive'
                            size='sm'
                            disabled={selectedUserIds.length < 1}
                        >
                            <Trash2/>
                            删除
                        </Button>
                    </DeleteUserDialog>

                    <ColumnViewOptions<UserVO>
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

export default UserManageIndex;