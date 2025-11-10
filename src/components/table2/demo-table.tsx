

import { useEffect, useState } from "react";
import { type ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "@/components/ui/checkbox";
import {DataTableAdvanced} from "@/components/table2/data-table-advanced.tsx";


interface User {
    id: number;
    name: string;
    city: string;
    role: string;
}

// 模拟接口
async function fetchUsers(
    page: number,
    size: number,
    keyword: string,
    filters: Record<string, string>
): Promise<{ list: User[]; total: number }> {
    await new Promise((r) => setTimeout(r, 500));
    const roles = ["Admin", "Editor", "Viewer"];
    const cities = ["深圳", "广州", "上海"];
    const all = Array.from({ length: 40 }, (_, i) => ({
        id: i + 1,
        name: `用户 ${i + 1}`,
        city: cities[i % 3],
        role: roles[i % 3],
    }));

    const filtered = all.filter(
        (u) =>
            u.name.includes(keyword) &&
            (!filters.city || u.city === filters.city) &&
            (!filters.role || u.role === filters.role)
    );

    const start = (page - 1) * size;
    const end = start + size;
    return { list: filtered.slice(start, end), total: filtered.length };
}

export default function DemoTable() {
    const [data, setData] = useState<User[]>([]);
    const [loading, setLoading] = useState(false);
    const [pagination, setPagination] = useState({ current: 1, pageSize: 5, total: 0 });
    const [keyword, setKeyword] = useState("");
    const [filters, setFilters] = useState<Record<string, string>>({});

    const loadData = async () => {
        setLoading(true);
        const res = await fetchUsers(pagination.current, pagination.pageSize, keyword, filters);
        setData(res.list);
        setPagination((p) => ({ ...p, total: res.total }));
        setLoading(false);
    };

    useEffect(() => {
        loadData();
    }, [pagination.current, pagination.pageSize, keyword, filters]);

    const columns: ColumnDef<User>[] = [
        {
            id: "select",
            header: ({ table }) => (
                <Checkbox
                    checked={table.getIsAllPageRowsSelected()}
                    onCheckedChange={(v) => table.toggleAllPageRowsSelected(!!v)}
                />
            ),
            cell: ({ row }) => (
                <Checkbox
                    checked={row.getIsSelected()}
                    onCheckedChange={(v) => row.toggleSelected(!!v)}
                />
            ),
        },
        { accessorKey: "name", header: "姓名" },
        {
            accessorKey: "city",
            header: "城市",
            meta: { filterOptions: ["深圳", "广州", "上海"] },
        },
        {
            accessorKey: "role",
            header: "角色",
            meta: { filterOptions: ["Admin", "Editor", "Viewer"] },
        },
    ];

    return (
        <div className="p-6">
            <DataTableAdvanced
                rowKey="id"
                columns={columns}
                data={data}
                loading={loading}
                pagination={pagination}
                onPaginationChange={(page, size) => setPagination({ ...pagination, current: page, pageSize: size })}
                onSearch={setKeyword}
                onFilterChange={setFilters}
                onSelectionChange={(keys) => console.log("已选中行:", keys)}
            />
        </div>
    );
}
