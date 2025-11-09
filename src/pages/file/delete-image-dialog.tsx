import React from 'react';
import {deleteFileAPI} from "@/apis/file-api.ts";
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


interface DeleteImageDialogProps {
    children?: React.ReactNode;
    fileIds: string[];
    onFinish?: () => void;
}

/**
 * 删除图片确认框
 */
const DeleteImageDialog = (
    { children, fileIds, onFinish }: DeleteImageDialogProps
) => {

    // 批量删除文件
    const handleBatchDelete = async (ids: string[]) => {
        if (ids && ids.length > 0) {
            try {
                for (const id of ids) {
                    const resp = await deleteFileAPI(id);
                    if (resp.code !== 200) {
                        toast.error(resp.message);
                        return; // 如果出错可以提前返回，或者根据需求继续处理其他项
                    }
                }
                toast.success('删除成功');
            } finally {
                // 删除后回调刷新页面
                onFinish?.();
            }
        }
    };

    if (!fileIds || fileIds.length === 0) {
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
                    <AlertDialogTitle>{`确定删除这 ${fileIds.length} 个图片文件吗?`}</AlertDialogTitle>
                    <AlertDialogDescription>
                        删除后将无法恢复
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>取消</AlertDialogCancel>
                    <AlertDialogAction
                        className="bg-red-500 hover:bg-red-600 cursor-pointer"
                        onClick={async () => {
                            await handleBatchDelete(fileIds)
                        }}
                    >
                        删除
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
};

export default DeleteImageDialog;