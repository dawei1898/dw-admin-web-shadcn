import React, {useState} from 'react';
import type {Payment} from "@/pages/test/table/test-data.tsx";
import DataTable from "@/pages/test/table/data-table.tsx";
import {columns} from "@/pages/test/table/columns.tsx";



const data: Payment[] = [
    {
        id: "m5gr84i9",
        amount: 316,
        status: "success",
        email: "ken99@example.com",
    },
    {
        id: "3u1reuv4",
        amount: 242,
        status: "pending",
        email: "Abe45@example.com",
    },
    {
        id: "derv1ws0",
        amount: 837,
        status: "success",
        email: "Monserrat44@example.com",
    },
    {
        id: "5kma53ae",
        amount: 874,
        status: "success",
        email: "Silas22@example.com",
    },
    {
        id: "bhqecj4p",
        amount: 721,
        status: "failed",
        email: "carmella@example.com",
    },
    {
        id: "1m5gr84i9",
        amount: 316,
        status: "success",
        email: "ken99@example.com",
    },
    {
        id: "23u1reuv4",
        amount: 242,
        status: "success",
        email: "Abe45@example.com",
    },
    {
        id: "3derv1ws0",
        amount: 837,
        status: "pending",
        email: "Monserrat44@example.com",
    },
    {
        id: "45kma53ae",
        amount: 874,
        status: "success",
        email: "Silas22@example.com",
    },
    {
        id: "5bhqecj4p",
        amount: 721,
        status: "failed",
        email: "carmella@example.com",
    },
    {
        id: "6m5gr84i9",
        amount: 316,
        status: "success",
        email: "ken99@example.com",
    },
    {
        id: "73u1reuv4",
        amount: 242,
        status: "success",
        email: "Abe45@example.com",
    },
    {
        id: "8derv1ws0",
        amount: 837,
        status: "processing",
        email: "Monserrat44@example.com",
    },
    {
        id: "95kma53ae",
        amount: 874,
        status: "success",
        email: "Silas22@example.com",
    },
    {
        id: "10bhqecj4p",
        amount: 721,
        status: "failed",
        email: "carmella@example.com",
    },
]

const TableDemoPage = () => {

    

    return (
        <div className="container mx-auto py-10">
            {/*<TagDemo/>*/}
            <DataTable columns={columns} data={data}/>
        </div>
    );
};

export default TableDemoPage;