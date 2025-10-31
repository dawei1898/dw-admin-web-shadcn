import React from 'react';
import {DataTableDemo} from "@/pages/table/test-data.tsx";
import TableDemoPage from "@/pages/table/page.tsx";

/**
 * 分析页
 */
const AnalysisIndex = () => {
    return (
        <div>
            <p>分析页</p>
            {/*<DataTableDemo />*/}

            <TableDemoPage/>

        </div>
    );
};

export default AnalysisIndex;