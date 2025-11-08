import React from 'react';
import type {Column} from "@tanstack/react-table";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
    DropdownMenuSeparator
} from "@/components/ui/dropdown-menu.tsx";
import {ArrowDown, ArrowUp, ArrowUpDown, X} from "lucide-react";

interface ColumnSortingPros<TData, TValue> {
    column: Column<TData, TValue>;
}

/**
 * 表格头列排序
 */
const ColumnSorting = <TData, TValue>(
    {column}: ColumnSortingPros<TData, TValue>
) => {

    if (!column.getCanSort()) {
        return (<div></div>)
    }

    return (<>
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <div className='ml-1 text-muted-foreground cursor-pointer'>
                    {column.getIsSorted() === 'desc' ? (<ArrowDown size={16}/>)
                        : column.getIsSorted() === 'asc' ? (<ArrowUp size={16}/>)
                            : (<ArrowUpDown size={16}/>)}
                </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent align='end'>
                <DropdownMenuItem onClick={() => column.toggleSorting(false)}>
                    <ArrowUp/> 升序
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => column.toggleSorting(true)}>
                    <ArrowDown/> 降序
                </DropdownMenuItem>
                {column.getIsSorted() && (
                    <>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => column.clearSorting()}>
                            <X /> 取消排序
                        </DropdownMenuItem>
                    </>
                )}
            </DropdownMenuContent>
        </DropdownMenu>
    </>);
};

export default ColumnSorting;