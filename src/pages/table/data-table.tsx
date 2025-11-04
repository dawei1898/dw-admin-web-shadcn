import React, {useState} from 'react';
import {
    type ColumnDef, type ColumnFiltersState,
    flexRender,
    getCoreRowModel, getFilteredRowModel,
    getPaginationRowModel, getSortedRowModel,
    type SortingState,
    useReactTable, type VisibilityState
} from "@tanstack/react-table";
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table.tsx";
import {Button} from "@/components/ui/button.tsx";
import {Select, SelectContent, SelectItem, SelectLabel, SelectTrigger, SelectValue} from "@/components/ui/select.tsx";
import {Input} from "@/components/ui/input.tsx";
import {Label} from "@/components/ui/label.tsx";
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu.tsx";
import {ChevronLeft, ChevronRight} from "lucide-react";
import DataTablePagination from "@/pages/table/data-table-pagination.tsx";
import DataTableViewOptions from "@/pages/table/data-table-view-options.tsx";


interface DataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[],
    data: TData[]
}

/**
 * 数据表格示例
 * @param columns
 * @param data
 * @constructor
 */
const DataTable = <TData, TValue>(
    {columns, data,}: DataTableProps<TData, TValue>
) => {

    // 排序
    const [sorting, setSorting] = useState<SortingState>([])
    // 搜索过滤
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
    // 列显示
    const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
    // 选中的行
    const [rowSelection, setRowSelection] = useState({})

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
            columnVisibility,
            rowSelection,
        }

    });

    return (
        <div className='px-4'>
            <div className='flex items-center py-4'>
                <Label>Email: </Label>
                <Input
                    className='max-w-sm ml-1'
                    placeholder='Filter emails ...'
                    value={(table.getColumn("email")?.getFilterValue() as string) ?? ""}
                    onChange={(event) => {
                        table.getColumn("email")?.setFilterValue(event.target.value)
                    }}
                />

                <DataTableViewOptions table={table} className='ml-auto'/>
            </div>

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
                        ) : (
                            <TableRow>
                                <TableCell colSpan={columns.length} className={'h-24 text-center'}>
                                    暂无数据
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>

                <DataTablePagination table={table}/>

            </div>
        </div>
    );
};

export default DataTable;