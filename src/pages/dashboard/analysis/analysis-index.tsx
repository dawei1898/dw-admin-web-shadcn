import React from 'react';
import {DataTableDemo} from "@/pages/table/test-data.tsx";
import TableDemoPage from "@/pages/table/page.tsx";
import {FieldDemo} from "@/pages/form/field-demo.tsx";
import FormDemo from "@/pages/form/form-demo.tsx";

/**
 * 分析页
 */
const AnalysisIndex = () => {
    return (
        <div>
            <p>分析页</p>
            {/*<DataTableDemo />*/}

            {/*<TableDemoPage/>*/}

            {/*<FieldDemo/>*/}
            <FormDemo/>

        </div>
    );
};

export default AnalysisIndex;