import React, {useEffect, useState} from 'react';
import type {RoleSearchParam, RoleVO} from "@/types/roles.ts";
import {getRoleListAPI} from "@/apis/role-api.ts";
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
import {Tag} from "@/components/tag.tsx";
import ColumnFilter from "@/components/table/column-filter.tsx";
import ColumnSorting from "@/components/table/column-sorting.tsx";
import TablePagination, {initPagination, type TablePaginationConfig} from "@/components/table/table-pagination.tsx";
import ColumnViewOptions from "@/components/table/column-view-options.tsx";
import {
    FIELD_CREATE_TIME,
    FIELD_UPDATE_TIME,
    SORT_ASC,
    SORT_DESC,
    STATUS_DISABLED,
    STATUS_ENABLED
} from "@/types/constant.ts";
import type {ColumnMeta} from "@/types/table.ts";
import {
    Select, SelectContent,
    SelectItem, SelectTrigger,
    SelectValue
} from "@/components/ui/select.tsx";
import {Skeleton} from "@/components/ui/skeleton.tsx";
import AddRoleForm from "@/pages/system/role/add-role-form.tsx";
import EditRoleForm from "@/pages/system/role/edit-role-form.tsx";
import DeleteRoleDialog from "@/pages/system/role/delete-role-dialog.tsx";



/**
 * 状态选项
 */
export const statusOptions = [
    {label: "全部", value: "all"},
    {label: "启用", value: STATUS_ENABLED},
    {label: "禁用", value: STATUS_DISABLED},
]

const initSearchParams = {
    pageNum: 1,
    pageSize: 10,
}

/**
 * 角色管理
 */
const RoleManageIndex = () => {

    const [data, setData] = useState<RoleVO[]>([])
    const [loading, setLoading] = useState<boolean>(false)
    const [searchParams, setSearchParams] = useState<RoleSearchParam>(initSearchParams)
    // 分页
    const [pagination, setPagination] = useState<TablePaginationConfig>(initPagination)

    // 排序
    const [sorting, setSorting] = useState<SortingState>([])
    // 搜索过滤
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
    // 列显示
    const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
    // 选中的行
    const [rowSelection, setRowSelection] = useState({})


    /**
     * 初始化加载角色列表
     */
    useEffect(() => {
            getRoleList(searchParams)

        }, [searchParams.pageNum,
            searchParams.pageSize,
            searchParams.createTimeSort,
            searchParams.updateTimeSort]
    );


    // 获取角色列表
    const getRoleList = async (param: RoleSearchParam) => {
        if (loading) {
            return
        }
        try {
            setLoading(true)

            const resp = await getRoleListAPI(param);
            if (resp.code !== 200) {
                toast.error(resp.message);
                return;
            }
            setData(resp.data.list);

            // 设置分页数据
            setPagination({
                pageNum: Number(resp.data.pageNum),
                pageSize: Number(resp.data.pageSize),
                total: Number(resp.data.total),
            })
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
        await getRoleList(searchParams)
    }

    const onChangePagination = (pageNum: number, pageSize: number) => {
        setPagination({...pagination, pageNum, pageSize})
    }

    /**
     * 表格标题行
     */
    const columns: ColumnDef<RoleVO>[] = [
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
            accessorKey: "roleCode",
            meta: {
                displayName: "角色码"
            } as ColumnMeta,
            header: () => (
                <div className='w-full min-w-20 text-center'>
                    角色码
                </div>
            ),
            cell: ({row}) => (
                <div className='text-center'>
                    <span>{row.original.roleCode}</span>
                </div>
            ),
            filterFn: (row, columnId, filterValue) => {
                return true // 去除过滤
            },
        },
        {
            accessorKey: "roleName",
            meta: {
                displayName: "角色名称"
            } as ColumnMeta,
            header: () => (
                <div className='flex gap-2 w-full min-w-24 text-center'>
                    <Separator
                        orientation="vertical"
                        className="-ml-4 data-[orientation=vertical]:h-4"
                    />
                    <div className='flex justify-center w-full gap-2'>
                        <span>角色名称</span>
                    </div>
                </div>
            ),
            cell: ({row}) => (
                <div className='text-center'>
                    <span>{row.original.roleName}</span>
                </div>
            ),
            filterFn: (row, columnId, filterValue) => {
                return true // 去除过滤
            },
        },
        {
            accessorKey: "status",
            meta: {
                displayName: "状态"
            } as ColumnMeta,
            header: ({column}) => (
                <div className='flex gap-2'>
                    <Separator
                        orientation="vertical"
                        className="-ml-4 data-[orientation=vertical]:h-4"
                    />
                    <div className='flex justify-center items-center w-full min-w-18 gap-2'>
                        <span>状态</span>
                        <ColumnFilter column={column} filterItems={statusOptions}/>
                    </div>
                </div>
            ),
            filterFn: (row, columnId, filterValue) => {
                return true // 去除过滤
                // filterValue 是字符串数组
                //if (!filterValue || filterValue.length === 0) return true;
                //if (filterValue.includes("all")) return true;
                // OR 关系：只要匹配任何一个值就返回 true
                //return filterValue.includes(row.getValue(columnId));
            },
            cell: ({row}) => {
                const status = row.getValue("status");
                return (
                    <div className='flex justify-center'>
                        {status === STATUS_ENABLED
                            ? <Tag color="success">启用</Tag>
                            : <Tag color="warning">禁用</Tag>}
                    </div>
                )
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
                const role = row.original;
                return (
                    <div className='flex justify-center items-center gap-3'>
                        <EditRoleForm
                            record={role}
                            onFinish={handleReset}>
                            <a href='#' className='text-blue-500 hover:text-blue-600'>
                                编辑
                            </a>
                        </EditRoleForm>
                        <Separator
                            orientation="vertical"
                            className="data-[orientation=vertical]:h-4"
                        />
                        <DeleteRoleDialog
                            roleIds={[role.id || '']}
                            onFinish={handleReset}
                        >
                            <a href='#' className='text-red-500 hover:text-red-600'>
                                删除
                            </a>
                        </DeleteRoleDialog>
                    </div>
                )
            }
        }
    ]

    const table = useReactTable({
        columns,
        data,
        getCoreRowModel: getCoreRowModel(),
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
        // console.log('sorting:', sorting)
        // console.log('columnFilters:', columnFilters)
        // console.log('pagination:', pagination)
        // console.log('rowSelection:', rowSelection)

        let pageNum: number = 1;
        let pageSize: number = 10;
        let status: string = '';
        let roleCode: string = '';
        let roleName: string = '';
        let createTimeSort: string = '';
        let updateTimeSort: string = '';

        // 分页
        if (pagination) {
            pageNum = pagination.pageNum;
            pageSize = pagination.pageSize;
        }
        // 筛选
        if (columnFilters && columnFilters.length > 0) {
            for (let filter of columnFilters) {
                const filedName = filter.id;
                switch (filedName) {
                    case 'status':
                        status = filter.value as string;
                        status = status === 'all' ? '' : status
                        break;
                    case 'roleCode':
                        roleCode = (filter.value as string).trim();
                        break;
                    case 'roleName':
                        roleName = (filter.value as string).trim();
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
            status,
            roleCode,
            roleName,
            createTimeSort,
            updateTimeSort
        })

    }, [sorting, columnFilters, pagination]);

    // 选中的角色 ID
    const selectedRoleIds = table.getSelectedRowModel().rows
        .map((row) => row.original.id || '');

    return (<>
            <div className='flex flex-col gap-6 p-4'>
                {/* 搜索栏 */}
                <div className='flex items-center gap-6 p-4 rounded-md border border-secondary'>
                    <div className='flex gap-6'>
                        <div className='flex'>
                            <Label className='font-normal'> 角色码：</Label>
                            <Input
                                className='max-w-40 ml-1'
                                placeholder=''
                                value={(table.getColumn("roleCode")?.getFilterValue() as string) ?? ""}
                                onChange={(event) => {
                                    table.getColumn("roleCode")?.setFilterValue(event.target.value)
                                }}
                            />
                        </div>
                        <div className='flex'>
                            <Label className='font-normal'> 角色名称：</Label>
                            <Input
                                className='max-w-40 ml-1'
                                placeholder=''
                                value={(table.getColumn("roleName")?.getFilterValue() as string) ?? ""}
                                onChange={(event) => {
                                    table.getColumn("roleName")?.setFilterValue(event.target.value)
                                }}
                            />
                        </div>
                        <div className='flex'>
                            <Label className='font-normal'> 状态：</Label>
                            <Select
                                value={table.getColumn("status")?.getFilterValue() as string}
                                onValueChange={(value) => {
                                    table.getColumn("status")?.setFilterValue(value)
                                }}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="请选择"/>
                                </SelectTrigger>
                                <SelectContent>
                                    {statusOptions.map((item, index) => (
                                        <SelectItem key={index} value={item.value}>
                                            {item.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
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
                    <AddRoleForm onFinish={handleSearch}>
                        <Button size='sm' className='cursor-pointer'>
                            <Plus/>
                            添加
                        </Button>
                    </AddRoleForm>
                    <DeleteRoleDialog
                        roleIds={selectedRoleIds}
                        onFinish={handleReset}
                    >
                        <Button
                            className='cursor-pointer'
                            variant='destructive'
                            size='sm'
                            disabled={selectedRoleIds.length < 1}
                        >
                            <Trash2/>
                            删除
                        </Button>
                    </DeleteRoleDialog>

                    <ColumnViewOptions<RoleVO>
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
                        pagination={pagination}
                        onChange={onChangePagination}
                        showSizeChanger
                        showQuickJumper
                    />
                </div>
            </div>
        </>
    );
};

export default RoleManageIndex;