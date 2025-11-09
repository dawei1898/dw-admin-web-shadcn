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


/**
 * 从列定义中提取显示名称
 * @param column 表格列对象
 * @returns 显示名称
 */
const getColumnDisplayName = <TData,>(column: any): string => {
    try {
        // 简单的列名映射，根据列ID返回中文名称
        const columnNamesMap: Record<string, string> = {
            'roleCode': '角色码',
            'roleName': '角色名称',
            'status': '状态',
            'createTime': '创建时间',
            'updateTime': '更新时间',
        };

        // 优先使用映射表中的名称
        if (columnNamesMap[column.id]) {
            return columnNamesMap[column.id];
        }

        // 如果 header 是字符串，直接返回
        const header = column.columnDef.header;
        if (typeof header === 'string') {
            return header;
        }

        // 回退到列 ID
        return column.id;
    } catch (error) {
        console.warn('Failed to extract column display name:', error);
        return column.id;
    }
};


interface ColumnViewOptionsProps<TData> {
    table: Table<TData>,
    label?: string,
    className?: string,
}

/**
 * 筛选需要显示的列
 */
const ColumnViewOptions = <TData,>(
    {table, label, className}: ColumnViewOptionsProps<TData>
) => {


    return (
        <div className={cn(className)}>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button
                        variant='outline'
                        size='sm'
                        className='flex ml-auto cursor-pointer'
                    >
                        <Settings2/>
                        {label}
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align='end'>
                    <DropdownMenuLabel>
                        显示的列
                    </DropdownMenuLabel>
                    {table.getAllColumns()
                        .filter((column) => column.getCanHide())
                        .map((column) => {
                            return (
                                <DropdownMenuCheckboxItem
                                    key={column.id}
                                    checked={column.getIsVisible()}
                                    onCheckedChange={(value) => {
                                        column.toggleVisibility(value)
                                    }}
                                >
                                    {getColumnDisplayName(column)}
                                </DropdownMenuCheckboxItem>
                            )
                        })
                    }
                </DropdownMenuContent>
            </DropdownMenu>

        </div>
    );
};

export default ColumnViewOptions;