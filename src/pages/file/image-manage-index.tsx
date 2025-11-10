import React, {useEffect, useState} from 'react';
import type {FileSearchParam, FileVO} from "@/types/files.ts";
import {getFileListAPI} from "@/apis/file-api.ts";
import {toast} from "sonner";
import {Label} from "@/components/ui/label.tsx";
import {Input} from "@/components/ui/input.tsx";
import {Button} from "@/components/ui/button.tsx";
import {
    RotateCw, Search, Trash2, Eye,
} from "lucide-react";
import {
    Table, TableBody, TableCell,
    TableHead, TableHeader, TableRow
} from "@/components/ui/table.tsx";
import {
    type ColumnDef,
    type ColumnFiltersState,
    type SortingState,
    type VisibilityState,
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getSortedRowModel,
    useReactTable,
} from "@tanstack/react-table";
import {Checkbox} from "@/components/ui/checkbox.tsx";
import {Separator} from "@/components/ui/separator.tsx";
import ColumnSorting from "@/components/table/column-sorting.tsx";
import TablePagination, {initPagination, type TablePaginationConfig} from "@/components/table/table-pagination.tsx";
import ColumnViewOptions from "@/components/table/column-view-options.tsx";
import {
    FIELD_CREATE_TIME,
    FIELD_UPDATE_TIME,
    SORT_ASC,
    SORT_DESC,
} from "@/types/constant.ts";
import type {ColumnMeta} from "@/types/table.ts";
import {
    Dialog,
    DialogContent,
    DialogTrigger,
} from "@/components/ui/dialog.tsx";
import {Skeleton} from "@/components/ui/skeleton.tsx";
import DeleteImageDialog from "@/pages/file/delete-image-dialog.tsx";
import {Tooltip, TooltipContent, TooltipTrigger} from "@/components/ui/tooltip.tsx";

const initSearchParams = {
    pageNum: 1,
    pageSize: 10,
}

/**
 * 图片管理
 */
const ImageManageIndex = () => {

    const [data, setData] = useState<FileVO[]>([])
    const [loading, setLoading] = useState<boolean>(false)
    const [searchParams, setSearchParams] = useState<FileSearchParam>(initSearchParams)
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
     * 初始化加载图片列表
     */
    useEffect(() => {
            getFileList(searchParams)
        }, [searchParams.pageNum,
            searchParams.pageSize,
            searchParams.createTimeSort,
            searchParams.updateTimeSort]
    );

    // 获取图片列表
    const getFileList = async (param: FileSearchParam) => {
        if (loading) {
            return
        }
        try {
            setLoading(true)

            const resp = await getFileListAPI(param);
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
        await getFileList(searchParams)
    }

    const onChangePagination = (pageNum: number, pageSize: number) => {
        setPagination({...pagination, pageNum, pageSize})
    }

    /**
     * 表格标题行
     */
    const columns: ColumnDef<FileVO>[] = [
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
                displayName: "文件名"
            } as ColumnMeta,
            header: () => (
                <div className='w-full min-w-40 text-center'>
                    文件名
                </div>
            ),
            cell: ({row}) => {
                const file = row.original;
                return (
                    <div className='max-w-40 text-center' title={file.name}>
                        <Tooltip>
                            <TooltipTrigger asChild>
                            <span className="text-sm truncate inline-block w-full">
                                {row.original.name}
                            </span>
                            </TooltipTrigger>
                            <TooltipContent>
                            <span className="text-sm">
                                {row.original.name}
                            </span>
                            </TooltipContent>
                        </Tooltip>
                    </div>
                )
            },
            filterFn: (row, columnId, filterValue) => {
                return true // 去除过滤
            },
        },
        {
            accessorKey: "type",
            meta: {
                displayName: "文件类型"
            } as ColumnMeta,
            header: ({column}) => (
                <div className='flex gap-2 w-full min-w-24 text-center'>
                    <Separator
                        orientation="vertical"
                        className="-ml-4 data-[orientation=vertical]:h-4"
                    />
                    <div className='flex justify-center w-full gap-2'>
                        <span>文件类型</span>
                    </div>
                </div>
            ),
            cell: ({row}) => (
                <div className='text-center'>
                    <span className="font-mono">{row.original.type}</span>
                </div>
            ),
            filterFn: (row, columnId, filterValue) => {
                return true // 去除过滤
            },
        },
        {
            accessorKey: "path",
            meta: {
                displayName: "文件路径"
            } as ColumnMeta,
            header: () => (
                <div className='flex gap-2'>
                    <Separator
                        orientation="vertical"
                        className="-ml-4 data-[orientation=vertical]:h-4"
                    />
                    <div className='flex justify-center w-full min-w-40 gap-2'>
                        <span>文件路径</span>
                    </div>
                </div>
            ),
            cell: ({row}) => (
                <div className='max-w-40 text-center'>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <span className="text-sm truncate inline-block w-full">
                                {row.original.path}
                            </span>
                        </TooltipTrigger>
                        <TooltipContent>
                            <span className="text-sm">
                                {row.original.path}
                            </span>
                        </TooltipContent>
                    </Tooltip>
                </div>
            ),
            filterFn: (row, columnId, filterValue) => {
                return true // 去除过滤
            },
        },
        {
            id: "preview",
            meta: {
                displayName: "图片预览"
            } as ColumnMeta,
            header: () => (
                <div className='flex gap-2'>
                    <Separator
                        orientation="vertical"
                        className="-ml-4 data-[orientation=vertical]:h-4"
                    />
                    <div className='flex justify-center w-full min-w-24 gap-2'>
                        <span>图片预览</span>
                    </div>
                </div>
            ),
            cell: ({row}) => {
                const file = row.original;
                //const isImage = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'].includes(file.type.toLowerCase());
                const isImage = file.type.includes('image/');

                return (
                    <div className='flex justify-center'>
                        {isImage && file.url ? (
                            <Dialog>
                                <DialogTrigger asChild>
                                    <div className='cursor-pointer group'>
                                        <img
                                            src={file.url}
                                            alt={file.name}
                                            className='w-24 h-24 object-cover rounded border border-gray-200 group-hover:border-blue-400 transition-colors'
                                            onError={(e) => {
                                                e.currentTarget.src = '';
                                                e.currentTarget.style.display = 'none';
                                            }}
                                        />
                                    </div>
                                </DialogTrigger>
                                <DialogContent className="max-w-4xl">
                                    <div className="flex justify-center">
                                        <img
                                            src={file.url}
                                            alt={file.name}
                                            className="max-w-full max-h-96 object-contain rounded"
                                        />
                                    </div>
                                    <div className="text-sm text-muted-foreground text-center">
                                        <p>文件名: {file.name}</p>
                                        <p>文件大小: {file.size} B</p>
                                    </div>
                                </DialogContent>
                            </Dialog>
                        ) : (
                            <div className='w-12 h-12 bg-gray-100 rounded flex items-center justify-center'>
                                <Eye className='w-6 h-6 text-gray-400'/>
                            </div>
                        )}
                    </div>
                )
            },
            enableSorting: false,
            enableHiding: false,
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
                const file = row.original;
                return (
                    <div className='flex justify-center items-center gap-3'>
                        <DeleteImageDialog
                            fileIds={[file.id || '']}
                            onFinish={handleReset}
                        >
                            <a href='#' className='text-red-500 hover:text-red-600'>
                                删除
                            </a>
                        </DeleteImageDialog>
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

        let pageNum: number = 1;
        let pageSize: number = 10;
        let name: string = '';
        let type: string = '';
        let path: string = '';
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
                    case 'name':
                        name = (filter.value as string).trim();
                        break;
                    case 'type':
                        type = (filter.value as string).trim();
                        break;
                    case 'path':
                        path = (filter.value as string).trim();
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
            type,
            path,
            createTimeSort,
            updateTimeSort
        })

    }, [sorting, columnFilters, pagination]);

    // 选中的文件 ID
    const selectedFileIds = table.getSelectedRowModel().rows
        .map((row) => row.original.id || '');

    return (<>
            <div className='flex flex-col gap-6 p-4'>
                {/* 搜索栏 */}
                <div className='flex items-center gap-6 p-4 rounded-md border border-secondary'>
                    <div className='flex gap-6'>
                        <div className='flex'>
                            <Label className='font-normal'> 文件名：</Label>
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
                            <Label className='font-normal'> 文件类型：</Label>
                            <Input
                                className='max-w-40 ml-1'
                                placeholder='如：jpg, png'
                                value={(table.getColumn("type")?.getFilterValue() as string) ?? ""}
                                onChange={(event) => {
                                    table.getColumn("type")?.setFilterValue(event.target.value)
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

                {/* 删除按钮 */}
                <div className='flex justify-end items-center gap-4'>
                    <DeleteImageDialog
                        fileIds={selectedFileIds}
                        onFinish={handleReset}
                    >
                        <Button
                            className='cursor-pointer'
                            variant='destructive'
                            size='sm'
                            disabled={selectedFileIds.length < 1}
                        >
                            <Trash2/>
                            删除
                        </Button>
                    </DeleteImageDialog>

                    <ColumnViewOptions<FileVO>
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

export default ImageManageIndex;