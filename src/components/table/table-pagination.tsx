import React, { useState} from 'react';
import {
    Select, SelectContent,
    SelectItem, SelectTrigger
} from "@/components/ui/select.tsx";
import {SelectValue} from "@radix-ui/react-select";
import {Button} from "@/components/ui/button.tsx";
import {
    ChevronLeft, ChevronRight, Ellipsis
} from "lucide-react";
import {Input} from "@/components/ui/input.tsx";
import {cn} from "@/lib/utils.ts";


export const initPagination = {
    pageNum: 1,
    pageSize: 10,
    total: 0,
}

export interface TablePaginationConfig {
    pageNum: number,
    pageSize: number,
    total: number,
}

interface TablePaginationProps<TData> {
    showSizeChanger?: boolean,
    showQuickJumper?: boolean,
    defaultPageSize?: number,
    pageSizeOptions?: number[],
    pagination?: TablePaginationConfig,
    onChange: (pageNum: number, pageSize: number) => void
}

/**
 * 表格分页组件
 */
const TablePagination = <TData, >(
    {
        showSizeChanger = false,
        showQuickJumper = false,
        defaultPageSize = 10,
        pageSizeOptions = [2, 10, 20, 50, 100],
        pagination = initPagination,
        onChange,
    }: TablePaginationProps<TData>
) => {
    console.log('TablePaginationProps:', pagination)

    const [quickJumper, setQuickJumper] = useState('')
    const pages = pagination?.total ? Math.ceil(pagination?.total / pagination?.pageSize) : 1

    return (
        <div className='flex justify-end items-center  px-6 py-4'>
            <div className='flex items-center space-x-2'>
                <div className='block text-sm '>
                    共 {pagination?.total} 条数据
                </div>

                {showSizeChanger &&
                    <Select
                        value={String(pagination?.pageSize)}
                        onValueChange={(value) => {
                            onChange(1, Number(value))
                        }}
                    >
                        <SelectTrigger size='sm'>
                            <SelectValue placeholder={pagination?.pageSize}/>
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
                    {/* 上一页 */}
                    <Button
                        variant='outline'
                        size='sm'
                        onClick={() => {
                            //table.previousPage()
                            onChange(pagination?.pageNum - 1, pagination?.pageSize)
                        }}
                        disabled={pagination?.pageNum <= 1}
                    >
                        <ChevronLeft/>
                    </Button>

                    {pages <= 6 ? (
                        // 当总页数小于等于6时，显示所有页码
                        Array.from({length: pages}, (_, pageIndex: number) => {
                            const currentPage = pageIndex + 1;
                            const active = currentPage === Number(pagination?.pageNum);
                            return (
                                <Button
                                    key={pageIndex}
                                    size='sm'
                                    variant={active ? 'outline' : 'ghost'}
                                    onClick={() => {
                                        onChange(currentPage, pagination?.pageSize);
                                    }}
                                >
                                    <span className={cn(active ? 'text-blue-500' : '')}>
                                        {currentPage}
                                    </span>
                                </Button>
                            );
                        })
                    ) : (
                        // 当总页数大于6时，显示第一页、当前页附近和最后一页
                        <>
                            {/* 第一页 */}
                            <Button
                                key={0}
                                size='sm'
                                variant={1 === Number(pagination?.pageNum) ? 'outline' : 'ghost'}
                                onClick={() => {
                                    onChange(1, pagination?.pageSize);
                                }}
                            >
                                <span className={cn(1 === Number(pagination?.pageNum) ? 'text-blue-500' : '')}>
                                    1
                                </span>
                            </Button>

                            {/* 省略号 */}
                            {Number(pagination?.pageNum) > 3 && (
                                <div className="flex items-center px-2">
                                    <Ellipsis className="h-4 w-4"/>
                                </div>
                            )}

                            {/* 当前页前后各一页 */}
                            {Array.from({length: 3}, (_, i: number) => {
                                const currentPage = Number(pagination?.pageNum) + i - 1;
                                if (currentPage <= 1 || currentPage >= pages) return null;

                                const active = currentPage === Number(pagination?.pageNum);
                                return (
                                    <Button
                                        key={currentPage}
                                        size='sm'
                                        variant={active ? 'outline' : 'ghost'}
                                        onClick={() => {
                                            onChange(currentPage, pagination?.pageSize);
                                        }}
                                    >
                                        <span className={cn(active ? 'text-blue-500' : '')}>
                                            {currentPage}
                                        </span>
                                    </Button>
                                );
                            })}

                            {/* 省略号 */}
                            {Number(pagination?.pageNum) < pages - 2 && (
                                <div className="flex items-center px-2">
                                    <Ellipsis className="h-4 w-4"/>
                                </div>
                            )}

                            {/* 最后一页 */}
                            <Button
                                key={pages - 1}
                                size='sm'
                                variant={pages === Number(pagination?.pageNum) ? 'outline' : 'ghost'}
                                onClick={() => {
                                    onChange(pages, pagination?.pageSize);
                                }}
                            >
                                <span className={cn(pages === Number(pagination?.pageNum) ? 'text-blue-500' : '')}>
                                    {pages}
                                </span>
                            </Button>
                        </>
                    )}

                    {/* 下一页 */}
                    <Button
                        variant='outline'
                        size='sm'
                        onClick={() => {
                            onChange(pagination?.pageNum + 1, pagination?.pageSize)
                        }}
                        disabled={pagination?.pageNum >= pages}
                    >
                        <ChevronRight/>
                    </Button>
                </div>

                {/* 跳转到第 x 页 */}
                {showQuickJumper &&
                    <div className='flex justify-center items-center gap-2'>
                        <Input
                            className='h-8 w-10'
                            value={quickJumper}
                            onChange={(e) => {
                                if (e.target.value) {
                                    setQuickJumper(e.target.value)
                                } else {
                                    setQuickJumper('')
                                }

                            }}
                        />
                        <Button
                            className='cursor-pointer'
                            size='sm'
                            onClick={() => {
                                let quickJumperNumber = Number(quickJumper);
                                if (quickJumperNumber) {
                                    quickJumperNumber = quickJumperNumber > pages ? pages : quickJumperNumber
                                    quickJumperNumber = quickJumperNumber < 1 ? 1 : quickJumperNumber
                                    onChange(quickJumperNumber, pagination?.pageSize)
                                    setQuickJumper('')
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