import React from 'react';
import type {Column} from "@tanstack/react-table";
import {cn} from "@/lib/utils.ts";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu.tsx";
import {Button} from "@/components/ui/button.tsx";
import {ArrowDown, ArrowUp, ArrowUpDown, EyeOff} from "lucide-react";


interface DataTableColumnHeaderProps<TData, TValue> extends React.HTMLAttributes<HTMLDivElement> {
    title: string;
    column: Column<TData, TValue>;
    table?: any;
    className?: string;
}

const DataTableColumnHeader = <TData, TValue>(
    {title, column, table, className}: DataTableColumnHeaderProps<TData, TValue>
) => {

    if (!column.getCanSort()) {
        return (<div className={cn(className)}>{title}</div>)
    }

    return (
        <div className={cn("flex items-center gap-2", className)}>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button
                        variant='ghost'
                        size='sm'
                        className='data-[state=open]:bg-accent -ml-3 h-8'
                    >
                        <span>{title}</span>
                        {column.getIsSorted() === 'desc' ? (<ArrowDown/>)
                            : column.getIsSorted() === 'asc' ? (<ArrowUp/>)
                                : (<ArrowUpDown/>)}
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align='start'>
                    <DropdownMenuItem onClick={() => column.toggleSorting(false)}>
                        <ArrowUp/> Asc
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => column.toggleSorting(true)}>
                        <ArrowDown/> Desc
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => column.toggleVisibility(false)}>
                        <EyeOff/> Hide
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    );
};

export default DataTableColumnHeader;