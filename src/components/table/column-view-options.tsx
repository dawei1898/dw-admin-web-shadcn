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
        // 1. 优先使用 meta.displayName
        if (column.columnDef.meta?.displayName) {
            return column.columnDef.meta.displayName;
        }

        // 2. 兼容性：使用硬编码映射表作为回退（针对角色管理页面）
        const columnNamesMap: Record<string, string> = {
            'roleCode': '角色码',
            'roleName': '角色名称',
            'status': '状态',
            'createTime': '创建时间',
            'updateTime': '更新时间',
            'id': 'ID',
            'name': '名称',
            'email': '邮箱',
            'phone': '电话',
        };

        if (columnNamesMap[column.id]) {
            return columnNamesMap[column.id];
        }

        // 3. 如果 header 是字符串，直接返回
        const header = column.columnDef.header;
        if (typeof header === 'string') {
            return header;
        }

        // 4. 回退到列 ID（并格式化）
        return column.id
            .replace(/_/g, ' ')
            .replace(/\b\w/g, (char: string) => char.toUpperCase());
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