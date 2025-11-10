import React from 'react';
import {DataTableDemo} from "@/pages/test/table/test-data.tsx";
import TableDemoPage from "@/pages/test/table/page.tsx";
import {FieldDemo} from "@/pages/test/form/field-demo.tsx";
import FormDemo from "@/pages/test/form/form-demo.tsx";
import DemoTable from "@/components/table2/demo-table.tsx";

/**
 * 分析页
 */
const AnalysisIndex = () => {
    return (
        <div>
            <p>分析页</p>
            {/*<DataTableDemo />*/}

           {/* <TableDemoPage/>*/}

            {/*<FieldDemo/>*/}
            {/*<FormDemo/>*/}

            <DemoTable/>

        </div>
    );
};

export default AnalysisIndex;