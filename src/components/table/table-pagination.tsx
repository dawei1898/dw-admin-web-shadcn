import React, {useEffect, useState} from 'react';
import type {Table} from "@tanstack/react-table";
import {Select, SelectContent, SelectItem, SelectTrigger} from "@/components/ui/select.tsx";
import {SelectValue} from "@radix-ui/react-select";

import {Button} from "@/components/ui/button.tsx";
import {ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, Ellipsis} from "lucide-react";
import {Input} from "@/components/ui/input.tsx";
import {cn} from "@/lib/utils.ts";


interface TablePaginationProps<TData> {
    table: Table<TData>,
    showSizeChanger?: boolean,
    showQuickJumper?: boolean,
    defaultPageSize?: number,
    pageSizeOptions?: number[],
    total?: number,
}

/**
 * 表格分页组件
 */
const TablePagination = <TData, >(
    {
        table,
        showSizeChanger = false,
        showQuickJumper = false,
        defaultPageSize = 10,
        pageSizeOptions = [2, 10, 20, 50, 100],
        total = 0,
    }: TablePaginationProps<TData>
) => {

    const [quickJumper, setQuickJumper] = useState<number | undefined>(undefined)
    const pageCount = total ? Math.ceil(total / table.getState().pagination.pageSize) : 1

    return (
        <div className='flex justify-end items-center  px-6 py-4'>
            {/*<div className='text-muted-foreground flex-1 text-sm'>
                {table.getFilteredSelectedRowModel().rows.length} of {' '}
                {table.getFilteredRowModel().rows.length} row(s) selected.
            </div>*/}

            <div className='flex items-center space-x-2'>
                <div className='block text-sm '>
                    共 {total} 条数据
                </div>

                {showSizeChanger &&
                    <Select
                        value={`${table.getState().pagination.pageSize}`}
                        onValueChange={(value) => {
                            table.setPageSize(Number(value))
                        }}
                    >
                        <SelectTrigger>
                            <SelectValue placeholder={table.getState().pagination.pageSize}/>
                        </SelectTrigger>
                        <SelectContent side='top' align='center'>
                            {pageSizeOptions.map(pageSize => (
                                <SelectItem key={pageSize} value={`${pageSize}`}>
                                    {pageSize} 条/页
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                }
            </div>

            <div className='flex items-center gpa-6 lg:gap-8 ml-auto'>
                <div className='flex justify-center items-center gap-2'>
                    <Button
                        variant='outline'
                        size='sm'
                        onClick={() => table.previousPage()}
                        disabled={!table.getCanPreviousPage()}
                    >
                        <ChevronLeft/>
                    </Button>
                    {Array.from({length: pageCount}, (_, pageIndex) => {
                        const active = pageIndex === table.getState().pagination.pageIndex
                        return (
                            <Button
                                key={pageIndex}
                                variant={active ? 'outline' : 'ghost'}
                                onClick={() => table.setPageIndex(pageIndex)}
                            >
                                <span className={cn(active ? 'text-blue-500' : '')}>
                                    {pageIndex + 1}
                                </span>
                            </Button>
                        )
                    })}
                    <Button
                        variant='outline'
                        size='sm'
                        onClick={() => table.nextPage()}
                        disabled={!table.getCanNextPage()}
                    >
                        <ChevronRight/>
                    </Button>
                </div>

                {showQuickJumper &&
                    <div className='flex justify-center items-center gap-2'>
                        <Input
                            className='w-15'
                            type='number'
                            value={quickJumper}
                            onChange={(e) => {
                                if (Number(e.target.value)) {
                                    setQuickJumper(Number(e.target.value))
                                } else {
                                    setQuickJumper(0)
                                }

                            }}
                        />
                        <Button
                            className='cursor-pointer'
                            onClick={() => {
                                if (quickJumper) {
                                    table.setPageIndex(quickJumper - 1)
                                    setQuickJumper(undefined)
                                }
                            }}
                        >
                            跳转
                        </Button>
                    </div>
                }
            </div>
        </div>
    );
};

export default TablePagination;