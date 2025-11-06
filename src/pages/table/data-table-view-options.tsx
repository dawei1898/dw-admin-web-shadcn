import React from 'react';
import type {Table} from "@tanstack/react-table";
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent, DropdownMenuLabel,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu.tsx";
import {Button} from "@/components/ui/button.tsx";
import {Settings2} from "lucide-react";
import {cn} from "@/lib/utils.ts";

interface DataTableViewOptionsProps<TData> {
    table: Table<TData>,
    label?: string,
    className?: string,
}

const DataTableViewOptions = <TData,>(
    {table, label, className}: DataTableViewOptionsProps<TData>
) => {


    return (
        <div className={cn(className)}>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button
                        variant='outline'
                        size='sm'
                        className='flex ml-auto'
                    >
                        <Settings2/>
                        {label}
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align='end'>
                    <DropdownMenuLabel>显示的列</DropdownMenuLabel>
                    {table.getAllColumns()
                        .filter((column) => column.getCanHide())
                        .map((column) => {
                            return (
                                <DropdownMenuCheckboxItem
                                    key={column.id}
                                    className='capitalize'
                                    checked={column.getIsVisible()}
                                    onCheckedChange={(value) => {
                                        column.toggleVisibility(value)
                                    }}
                                >
                                    {column.id}
                                </DropdownMenuCheckboxItem>
                            )
                        })
                    }
                </DropdownMenuContent>
            </DropdownMenu>

        </div>
    );
};

export default DataTableViewOptions;