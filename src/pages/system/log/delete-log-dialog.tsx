import React from 'react';
import {deleteLoginLogAPI} from "@/apis/loginLog-api.ts";
import {toast} from "sonner";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent, AlertDialogDescription, AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger
} from "@/components/ui/alert-dialog.tsx";


interface DeleteLogDialogProps {
    children?: React.ReactNode;
    logIds: string[];
    onFinish?: () => void;
}

/**
 * 删除日志确认框
 */
const DeleteLogDialog = (
    { children, logIds, onFinish }: DeleteLogDialogProps
) => {

    // 批量删除日志
    const handleBatchDelete = async (ids: string[]) => {
        if (ids && ids.length > 0) {
            try {
                for (const id of ids) {
                    const resp = await deleteLoginLogAPI(id);
                    if (resp.code !== 200) {
                        toast.error(resp.message);
                        return; // 如果出错可以提前返回，或者根据需求继续处理其他项
                    }
                }
                toast.success(`成功删除 ${ids.length} 条记录`);
            } finally {
                // 删除后回调刷新页面
                onFinish?.();
            }
        }
    };

    if (!logIds || logIds.length === 0) {
        return (<AlertDialog>
            <AlertDialogTrigger>
                {children}
            </AlertDialogTrigger>
        </AlertDialog>);
    }

    return (
        <AlertDialog>
            <AlertDialogTrigger>
                {children}
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>{`确定删除这 ${logIds.length} 条数据吗?`}</AlertDialogTitle>
                    <AlertDialogDescription>
                        删除后将无法恢复
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>取消</AlertDialogCancel>
                    <AlertDialogAction
                        className="bg-red-500 hover:bg-red-600 cursor-pointer"
                        onClick={async () => {
                            await handleBatchDelete(logIds)
                        }}
                    >
                        删除
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
};

export default DeleteLogDialog;