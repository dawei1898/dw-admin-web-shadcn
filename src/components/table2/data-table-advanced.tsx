import * as React from "react";
import {
    type ColumnDef,
    type SortingState,
    type RowSelectionState,
    flexRender,
    getCoreRowModel,
    getSortedRowModel,
    useReactTable,

} from "@tanstack/react-table";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {Button} from "@/components/ui/button";
import {Loader2, Search, Filter} from "lucide-react";
import {Input} from "@/components/ui/input";
import {Checkbox} from "@/components/ui/checkbox";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {Select, SelectContent, SelectItem, SelectTrigger} from "@/components/ui/select";
import {cn} from "@/lib/utils";

interface DataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[];
    data: TData[];
    rowKey: keyof TData;
    loading?: boolean;
    pagination: {
        current: number;
        pageSize: number;
        total: number;
    };
    onPaginationChange: (page: number, pageSize: number) => void;
    onSearch?: (keyword: string) => void;
    onFilterChange?: (filters: Record<string, string>) => void;
    onSelectionChange?: (selectedKeys: string[]) => void;
}

export function DataTableAdvanced<TData, TValue>({
                                                     columns,
                                                     data,
                                                     rowKey,
                                                     loading,
                                                     pagination,
                                                     onPaginationChange,
                                                     onSearch,
                                                     onFilterChange,
                                                     onSelectionChange,
                                                 }: DataTableProps<TData, TValue>) {
    const [sorting, setSorting] = React.useState<SortingState>([]);
    const [rowSelection, setRowSelection] = React.useState<RowSelectionState>({});
    const [search, setSearch] = React.useState("");
    const [filters, setFilters] = React.useState<Record<string, string>>({});

    const table = useReactTable({
        data,
        columns,
        state: {sorting, rowSelection},
        onSortingChange: setSorting,
        onRowSelectionChange: setRowSelection,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getRowId: (row) => String(row[rowKey]),
    });

    const totalPages = Math.ceil(pagination.total / pagination.pageSize);

    // 勾选变化回调
    React.useEffect(() => {
        const selectedKeys = Object.keys(rowSelection).filter((key) => rowSelection[key]);
        onSelectionChange?.(selectedKeys);
    }, [rowSelection]);

    // 搜索
    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        onSearch?.(search.trim());
    };

    // 分页
    const handlePageChange = (page: number) => {
        if (page < 1 || page > totalPages) return;
        onPaginationChange(page, pagination.pageSize);
    };

    return (
        <div className="rounded-2xl border border-border bg-card shadow-sm overflow-hidden">
            {/* 顶部工具栏 */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-2 p-4 border-b border-border">
                <form onSubmit={handleSearch} className="flex items-center gap-2 w-full sm:w-auto">
                    <Input
                        placeholder="搜索..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-64"
                    />
                    <Button type="submit" variant="outline" size="sm">
                        <Search className="w-4 h-4 mr-1"/>
                        搜索
                    </Button>
                </form>

                {Object.keys(rowSelection).length > 0 && (
                    <div className="flex items-center text-sm text-muted-foreground">
                        已选中{" "}
                        <span className="font-semibold text-foreground mx-1">
              {Object.keys(rowSelection).length}
            </span>{" "}
                        项
                        <Button
                            size="sm"
                            variant="ghost"
                            className="ml-2 text-xs"
                            onClick={() => setRowSelection({})}
                        >
                            清空
                        </Button>
                    </div>
                )}
            </div>

            {/* 表格主体 */}
            <div className="overflow-x-auto">
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => (
                                    <TableHead
                                        key={header.id}
                                        className={cn(
                                            "px-4 py-2 text-left whitespace-nowrap",
                                            header.column.getCanSort() ? "cursor-pointer select-none" : ""
                                        )}
                                        onClick={
                                            header.column.getCanSort()
                                                ? header.column.getToggleSortingHandler()
                                                : undefined
                                        }
                                    >
                                        <div className="flex items-center justify-between gap-2">
                                            {flexRender(header.column.columnDef.header, header.getContext())}
                                            {header.column.columnDef.meta?.filterOptions && (
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button
                                                            size="icon"
                                                            variant="ghost"
                                                            className="w-5 h-5 p-0 hover:bg-muted"
                                                            onClick={(e) => e.stopPropagation()}
                                                        >
                                                            <Filter className="w-3 h-3"/>
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end" className="w-32">
                                                        {header.column.columnDef.meta?.filterOptions?.map(
                                                            (opt: string) => (
                                                                <DropdownMenuItem
                                                                    key={opt}
                                                                    onClick={() => {
                                                                        const newFilters = {
                                                                            ...filters,
                                                                            [header.id]: opt,
                                                                        };
                                                                        setFilters(newFilters);
                                                                        onFilterChange?.(newFilters);
                                                                    }}
                                                                >
                                                                    {opt}
                                                                </DropdownMenuItem>
                                                            )
                                                        )}
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            )}
                                        </div>
                                    </TableHead>
                                ))}
                            </TableRow>
                        ))}
                    </TableHeader>

                    <TableBody>
                        {loading ? (
                            <TableRow>
                                <TableCell colSpan={columns.length} className="py-10 text-center">
                                    <Loader2 className="animate-spin inline mr-2"/>
                                    加载中...
                                </TableCell>
                            </TableRow>
                        ) : table.getRowModel().rows.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow
                                    key={row.id}
                                    data-state={row.getIsSelected() && "selected"}
                                    className="hover:bg-muted/30 border-b border-border"
                                >
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id} className="px-4 py-2">
                                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell
                                    colSpan={columns.length}
                                    className="py-10 text-center text-muted-foreground"
                                >
                                    暂无数据
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>

            {/* 分页 */}
            <div className="flex items-center justify-between p-4 text-sm text-muted-foreground">
                <div>
                    共 <span className="font-medium text-foreground">{pagination.total}</span> 条
                </div>

                <div className="flex items-center gap-2">
                    <Button
                        variant="outline"
                        size="sm"
                        disabled={pagination.current === 1}
                        onClick={() => handlePageChange(pagination.current - 1)}
                    >
                        上一页
                    </Button>

                    <span>
            第 <span className="font-medium">{pagination.current}</span> / {totalPages} 页
          </span>

                    <Button
                        variant="outline"
                        size="sm"
                        disabled={pagination.current === totalPages}
                        onClick={() => handlePageChange(pagination.current + 1)}
                    >
                        下一页
                    </Button>

                    <Select
                        value={String(pagination.pageSize)}
                        onValueChange={(v) => onPaginationChange(1, Number(v))}
                    >
                        <SelectTrigger className="w-[90px]"/>
                        <SelectContent>
                            {[5, 10, 20, 50].map((size) => (
                                <SelectItem key={size} value={String(size)}>
                                    {size}/页
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            </div>
        </div>
    );
}
