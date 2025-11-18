import React, {useRef, useState} from 'react';
import {InputGroup, InputGroupAddon, InputGroupTextarea} from "@/components/ui/input-group.tsx";
import {Button} from "@/components/ui/button.tsx";
import {Atom, Globe, Paperclip, Send, X} from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu.tsx";
import {Input} from "@/components/ui/input.tsx";

const Sender = () => {

    // 修改为数组形式的状态管理
    const [files, setFiles] = useState<File[]>([]);
    const [previewUrls, setPreviewUrls] = useState<string[]>([]);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    // 在 useState 后添加新的状态
    const [acceptType, setAcceptType] = useState<string>('image/*');


    // 添加文件类型判断函数
    const getFileType = (file: File): string => {
        const type = file.type;
        if (type.startsWith('image/')) return 'image';
        if (type.startsWith('audio/')) return 'audio';
        if (type.startsWith('video/')) return 'video';
        if (type.includes('pdf') ||
            type.includes('word') ||
            type.includes('excel') ||
            type.includes('powerpoint') ||
            /\.(pdf|doc|docx|txt|xls|xlsx|ppt|pptx)$/i.test(file.name)) {
            return 'document';
        }
        return 'other';
    };

    // 修改 handleFileChange 函数
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFiles = e.target.files;
        if (selectedFiles && selectedFiles.length > 0) {
            const newFiles = Array.from(selectedFiles);
            setFiles(prev => [...prev, ...newFiles]);

            const urls = newFiles.map(file => URL.createObjectURL(file));
            setPreviewUrls(prev => [...prev, ...urls]);
        }
        // 重置 input value 以便可以选择相同文件
        e.target.value = '';
    };


    // 修改 triggerFileInput 函数，增加参数
    const triggerFileInput = (accept: string = 'image/*') => {
        setAcceptType(accept);
        // 延迟触发点击，确保 accept 属性已更新
        setTimeout(() => {
            fileInputRef.current?.click();
        }, 0);
    };


    // 处理粘贴事件 - 支持多图
    const handlePaste = (e: React.ClipboardEvent<HTMLTextAreaElement>) => {
        const items = e.clipboardData.items;
        const newFiles: File[] = [];
        const newUrls: string[] = [];

        for (let i = 0; i < items.length; i++) {
            if (items[i].type.indexOf('image') !== -1) {
                const blob = items[i].getAsFile();
                if (blob) {
                    newFiles.push(blob);
                    newUrls.push(URL.createObjectURL(blob));
                }
            }
        }

        if (newFiles.length > 0) {
            setFiles(prev => [...prev, ...newFiles]);
            setPreviewUrls(prev => [...prev, ...newUrls]);
            e.preventDefault();
        }
    };

    // 删除指定图片
    const removeImage = (index: number) => {
        // 清理URL对象
        URL.revokeObjectURL(previewUrls[index]);

        setFiles(prev => prev.filter((_, i) => i !== index));
        setPreviewUrls(prev => prev.filter((_, i) => i !== index));
    };

    // 组件卸载时清理所有URL对象
    React.useEffect(() => {
        return () => {
            previewUrls.forEach(url => URL.revokeObjectURL(url));
        };
    }, [previewUrls]);


    return (
        <div className='p-4 max-w-xl mx-auto '>
            <InputGroup className='max-h-70 rounded-xl'>
                <InputGroupAddon align='block-start'>
                    <div className='relative'>
                        <Input
                            ref={fileInputRef}
                            className='absolute inset-0 w-full h-full opacity-0 cursor-pointer'
                            type='file'
                            accept={acceptType}  // 使用动态 accept 类型
                            onChange={handleFileChange}
                            multiple
                        />
                    </div>

                    {/* 显示多张预览图片 */}
                    {previewUrls.length > 0 && (
                        <div className='mt-2 flex flex-wrap gap-2'>
                            {previewUrls.map((url, index) => {
                                const file = files[index];
                                const fileType = getFileType(file);

                                return (
                                    <div key={index} className='relative'>
                                        {fileType === 'image' ? (
                                            // 图片预览
                                            <img
                                                className='max-w-full max-h-12 rounded-md object-contain'
                                                src={url}
                                                alt={`预览图片 ${index + 1}`}
                                            />
                                        ) : (
                                            // 非图片文件显示图标
                                            <div
                                                className='flex flex-row items-center justify-center w-30 h-12 rounded-md bg-gray-100 border'>
                                                {fileType === 'document' && <span className='text-xs'>📄</span>}
                                                {fileType === 'audio' && <span className='text-xs'>🎵</span>}
                                                {fileType === 'video' && <span className='text-xs'>🎬</span>}
                                                {fileType === 'other' && <span className='text-xs'>📁</span>}
                                                {/* 文件名缩略显示 */}
                                                <div
                                                    className=' bg-opacity-50  text-xs px-1 py-0.5'>
                                                    {file.name.length > 10 ? `${file.name.substring(0, 10)}...` : file.name}
                                                </div>
                                            </div>

                                        )}
                                        <button
                                            className='absolute -top-2 -right-2 bg-gray-500 text-white rounded-full p-1'
                                            onClick={() => removeImage(index)}
                                        >
                                            <X size={10}/>
                                        </button>

                                    </div>
                                )
                            })}
                        </div>
                    )}
                </InputGroupAddon>

                <InputGroupTextarea
                    ref={textareaRef}
                    onPaste={handlePaste} // 添加粘贴事件处理
                    className=''
                    placeholder='请输入您的问题...'
                />

                <InputGroupAddon align='block-end'>
                    <div className='flex gap-4'>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant='ghost' size='sm'>
                                    <Paperclip/>
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align='center' side='top'>
                                <DropdownMenuItem
                                    onClick={() => triggerFileInput('image/*')}
                                >
                                    上传图片
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                    onClick={() => triggerFileInput('.pdf,.doc,.docx,.txt,.xls,.xlsx,.ppt,.pptx')}
                                >
                                    上传文档
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                    onClick={() => triggerFileInput('audio/*')}
                                >
                                    上传音频
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                    onClick={() => triggerFileInput('video/*')}
                                >
                                    上传视频
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>

                        <Button variant='outline' size='sm'>
                            <Atom />
                            推理
                        </Button>
                        <Button variant='outline' size='sm'>
                            <Globe />
                            搜索
                        </Button>
                    </div>

                    <Button variant='default' size='sm' className='ml-auto rounded-full'>
                        <Send className='w-6 h-6' size={6}/>
                    </Button>
                </InputGroupAddon>
            </InputGroup>
        </div>
    );
};

export default Sender;