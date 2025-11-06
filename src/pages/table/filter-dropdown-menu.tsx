import React from 'react';
import type {Table} from "@tanstack/react-table";
import type {Payment} from "@/pages/table/columns.tsx";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem, DropdownMenuSeparator,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu.tsx";
import {Funnel} from "lucide-react";
import {Checkbox} from "@/components/ui/checkbox.tsx";
import {Label} from "@radix-ui/react-label";
import {Button} from "@/components/ui/button.tsx";


interface FilterItem {
    value: string,
    label: string
}

interface FilterDropdownMenuPros {
    table: Table<Payment>,
    accessorKey: string,
    items: FilterItem[],
}

const FilterDropdownMenu = (
    {table, accessorKey, items}: FilterDropdownMenuPros
) => {

    const handleStatusFilterChange = (
        key: string,
        value: string,
        checked: boolean | "indeterminate",
        table: any // 实际应使用 Table<Payment> 类型
    ) => {
        table.getColumn(key)?.setFilterValue(
            (prev: string[] | undefined) => {
                const currentValues = prev ?? [];
                if (checked) {
                    return currentValues.includes(value)
                        ? currentValues
                        : [...currentValues, value];
                } else {
                    return currentValues.filter(item => item !== value);
                }
            }
        );
    };

    return <DropdownMenu>
        <DropdownMenuTrigger asChild>
            <Funnel size={16} className='cursor-pointer'/>
        </DropdownMenuTrigger>
        <DropdownMenuContent align='end'>
            {items.map((item) => (
                <DropdownMenuItem
                    key={item.value}
                    onClick={(e) => e.preventDefault()}
                >
                    <Checkbox
                        value={item.value}
                        onCheckedChange={(checked) =>
                            handleStatusFilterChange(accessorKey, item.value, checked === true, table)
                        }
                    />
                    <Label>{item.label}</Label>
                </DropdownMenuItem>
            ))}
            <DropdownMenuSeparator/>
            <DropdownMenuItem
                className="focus:bg-transparent focus:text-inherit space-x-3"
            >
                <Button
                    variant={"ghost"}
                    size={"sm"}
                    className='h-7 px-1.5 cursor-pointer'
                    onClick={() => table.getColumn(accessorKey)?.setFilterValue(undefined)}
                >
                    重置
                </Button>
                <Button size={"sm"} className='h-6.5 px-1.5 cursor-pointer'>
                    确定
                </Button>
            </DropdownMenuItem>
        </DropdownMenuContent>
    </DropdownMenu>;
};

export default FilterDropdownMenu;