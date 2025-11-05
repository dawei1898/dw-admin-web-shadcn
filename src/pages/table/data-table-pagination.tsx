import React from 'react';
import type {Table} from "@tanstack/react-table";
import {Select, SelectContent, SelectItem, SelectTrigger} from "@/components/ui/select.tsx";
import {SelectValue} from "@radix-ui/react-select";

import {Button} from "@/components/ui/button.tsx";
import {ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, Ellipsis} from "lucide-react";



interface DataTablePaginationProps<TData> {
    table: Table<TData>
}

/**
 * 分页组件
 */
const DataTablePagination = <TData,>(
    {table}: DataTablePaginationProps<TData>
) => {

    return (
        <div className='flex justify-center items-center p-4'>
            <div className='text-muted-foreground flex-1 text-sm'>
                {table.getFilteredSelectedRowModel().rows.length} of {' '}
                {table.getFilteredRowModel().rows.length} row(s) selected.
            </div>
            <div className='flex items-center space-x-6 lg:space-x-8'>
                <div className='block  text-sm font-medium'>
                    第 {table.getState().pagination.pageIndex + 1} 页，共 {table.getPageCount()} 页，
                    共 {table.getFilteredRowModel().rows.length} 条数据
                </div>

                <div className='flex justify-center items-center gap-2'>
                    <Button
                        variant='outline'
                        size='sm'
                        onClick={() => table.setPageIndex(0)}
                        disabled={!table.getCanPreviousPage()}
                    >
                        <ChevronsLeft />
                    </Button>
                    <Button
                        variant='outline'
                        size='sm'
                        onClick={() => table.previousPage()}
                        disabled={!table.getCanPreviousPage()}
                    >
                        <ChevronLeft />
                    </Button>
                    {Array.from({length: table.getPageCount()}, (_, pageIndex) => (
                        <Button
                            key={pageIndex}
                            variant={pageIndex === table.getState().pagination.pageIndex ? 'outline' : 'ghost'}
                            onClick={() => table.setPageIndex(pageIndex)}
                        >
                            {pageIndex + 1}
                        </Button>
                    ))}
                    <Button variant='outline' size='sm'>
                        <Ellipsis />
                    </Button>
                    <Button
                        variant='outline'
                        size='sm'
                        onClick={() => table.nextPage()}
                        disabled={!table.getCanNextPage()}
                    >
                        <ChevronRight />
                    </Button>
                    <Button
                        variant='outline'
                        size='sm'
                        onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                        disabled={!table.getCanNextPage()}
                    >
                        <ChevronsRight />
                    </Button>

                </div>


                <div className='flex items-center space-x-2'>
                    <Select
                        value={`${table.getState().pagination.pageSize}`}
                        onValueChange={(value) => {
                            table.setPageSize(Number(value))
                        }}
                    >
                        <SelectTrigger>
                            <SelectValue placeholder={table.getState().pagination.pageSize}/>
                        </SelectTrigger>
                        <SelectContent side='top' align='end'>
                            {[5, 10, 20, 50].map(pageSize => (
                                <SelectItem key={pageSize} value={`${pageSize}`}>
                                    {pageSize} 条/页
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            </div>
        </div>
    );
};

export default DataTablePagination;