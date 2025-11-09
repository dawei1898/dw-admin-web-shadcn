#!/bin/bash

# stop.sh - 停止 Vite 开发服务器

echo "正在查找 Vite 开发服务器进程..."

# 查找包含 vite 或 npm run dev 的进程
PID=$(ps aux | grep -E "vite|npm.*run.*dev" | grep -v grep | awk '{print $2}')

if [ -z "$PID" ]; then
    echo "未找到运行中的 Vite 开发服务器"
else
    echo "找到 Vite 开发服务器进程 (PID: $PID)"
    echo "正在停止进程..."

    # 尝试优雅地停止进程
    kill $PID

    # 等待一段时间看进程是否正常退出
    sleep 3

    # 检查进程是否仍然存在
    if ps -p $PID > /dev/null; then
        echo "进程仍在运行，强制终止..."
        kill -9 $PID
    fi

    echo "Vite 开发服务器已停止"
fi
