import React, {useState} from 'react';
import type {Column, Table} from "@tanstack/react-table";
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu.tsx";
import {Funnel} from "lucide-react";



interface FilterItem {
    value: string,
    label: string
}

interface HeaderFilterPros<TData, TValue> {
    column: Column<TData, TValue>;
    filterItems: FilterItem[],
}

/**
 * 表格头列过滤器
 */
const ColumnFilter = <TData, TValue>(
    {column, filterItems}: HeaderFilterPros<TData, TValue>
) => {

    return (<>
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <div  className='ml-1  text-muted-foreground  cursor-pointer'>
                    <Funnel size={16}/>
                </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent align='end'>
                {filterItems.map((item) => (
                    <DropdownMenuCheckboxItem
                        key={item.value}
                        checked={item.value === column.getFilterValue()}
                        onCheckedChange={(checked) => {
                            if (checked) {
                                column.setFilterValue(item.value)
                            }
                        }}
                    >
                        {item.label}
                    </DropdownMenuCheckboxItem>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
    </>);
};

export default ColumnFilter;