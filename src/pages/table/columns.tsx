import type {ColumnDef, Table} from "@tanstack/react-table";
import {
    DropdownMenu,
    DropdownMenuContent, DropdownMenuItem,
    DropdownMenuLabel, DropdownMenuSeparator,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu.tsx";
import {Button} from "@/components/ui/button.tsx";
import {
    CheckCircle, Funnel,
    MinusCircle, MoreHorizontal,
    RefreshCw, XCircle
} from "lucide-react";
import {Checkbox} from "@/components/ui/checkbox.tsx";
import DataTableColumnHeader from "@/pages/table/data-table-column-header.tsx";
import {Tag} from "@/components/tag.tsx";
import {Separator} from "@/components/ui/separator.tsx";
import {Label} from "@radix-ui/react-label";
import FilterDropdownMenu from "@/pages/table/filter-dropdown-menu.tsx";

export type Payment = {
    id: string,
    amount: number,
    status: "pending" | "processing" | "success" | "failed",
    email: string,
}


export const columns: ColumnDef<Payment>[] = [
    {
        id: "select",
        header: ({table}) => (
            <Checkbox
                checked={table.getIsAllPageRowsSelected() ||
                    (table.getIsSomePageRowsSelected() && "indeterminate")}
                onCheckedChange={
                    (value) => table.toggleAllPageRowsSelected(!!value)
                }
            />
        ),
        cell: ({row}) => (
            <Checkbox
                checked={row.getIsSelected()}
                onCheckedChange={(value) => row.toggleSelected(!!value)}
            />
        ),
        enableSorting: false,
        enableHiding: false,
    },
    {
        accessorKey: "email",
        header: ({column}) => (
            <DataTableColumnHeader column={column} title='Email'/>
            /*<Button
                variant='ghost'
                onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
            >
                Email
                <ArrowUpDown className='ml-2 h-4 w-4'/>
            </Button>*/
        ),
        /*sortingFn: (a, b) => {
            return 0 // 去除过滤
        },*/
    },
    {
        accessorKey: "status",
        header: ({table}) => (
            <div className='flex gap-2'>
                <Separator
                    orientation="vertical"
                    className="-ml-6 mr-6 data-[orientation=vertical]:h-4"
                />
                Status
                <div className='ml-auto mr-6'>
                    <FilterDropdownMenu
                        table={table}
                        accessorKey="status"
                        items={[
                            {value: "pending", label: "pending"},
                            {value: "processing", label: "processing"},
                            {value: "success", label: "success"},
                            {value: "failed", label: "failed"},
                        ]}/>
                </div>
            </div>
        ),
        filterFn: (row, columnId, filterValue) => {
            // filterValue 是字符串数组
            if (!filterValue || filterValue.length === 0) return true;
            // OR 关系：只要匹配任何一个值就返回 true
            return filterValue.includes(row.getValue(columnId));
        },
        cell: ({row}) => {
            const status = row.getValue("status") as Payment["status"];
            switch (status) {
                case "pending":
                    return (
                        <Tag icon={<MinusCircle className="w-3.5 h-3.5"/>} color="default">
                            {status}
                        </Tag>
                    );
                case "processing":
                    return (
                        <Tag icon={<RefreshCw className="w-3.5 h-3.5 animate-spin"/>} color="processing">
                            {status}
                        </Tag>
                    )
                case "success":
                    return (
                        <Tag icon={<CheckCircle className="w-3.5 h-3.5"/>} color="success">
                            {status}
                        </Tag>
                    )
                case "failed":
                    return (
                        <Tag icon={<XCircle className="w-3.5 h-3.5"/>} color="error">
                            {status}
                        </Tag>
                    )
            }
        },
    },
    {
        accessorKey: "amount",
        header: () => <div className='flex gap-2'>
            <Separator
                orientation="vertical"
                className="-ml-6 mr-6 data-[orientation=vertical]:h-4"
            />
            Amount
        </div>,
        cell:
            ({row}) => {
                const amount = parseFloat(row.getValue("amount"));
                const formattedAmount = new Intl.NumberFormat("en-US", {
                    style: "currency",
                    currency: "USD"
                }).format(amount);
                return <div className='text-center font-medium'>{formattedAmount}</div>
            }
    },
    {
        id: "action",
        header: () => <div className='flex gap-2'>
            <Separator
                orientation="vertical"
                className="-ml-6 mr-6 data-[orientation=vertical]:h-4"
            />
            Action
        </div>,
        cell: ({row}) => {
            const payment = row.original;

            return (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant='ghost' className='h-8 w-8 p-0'>
                            <MoreHorizontal className='h-4 w-4'/>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align='end'>
                        <DropdownMenuLabel>
                            Actions
                        </DropdownMenuLabel>
                        <DropdownMenuItem
                            onClick={() => navigator.clipboard.writeText(payment.id)}
                        >
                            Copy payment ID
                        </DropdownMenuItem>
                        <DropdownMenuSeparator/>
                        <DropdownMenuItem>
                            View customer
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                            View payment details
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            )
        }
    }
]