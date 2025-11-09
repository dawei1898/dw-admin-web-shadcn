# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 项目概述

这是一个基于 React + shadcn/ui 的管理后台项目，使用 Vite 作为构建工具，TypeScript 作为开发语言。

## 常用命令

### 开发相关
- `npm install` - 安装依赖
- `npm run dev` - 启动开发服务器（默认代理到 localhost:8020）
- `npm run build` - 构建生产版本（先运行 TypeScript 编译再构建）
- `npm run preview` - 预览生产构建
- `npm run lint` - 运行 ESLint 代码检查

### shadcn/ui 组件管理
- `npx shadcn@latest add [组件名]` - 添加新的 shadcn/ui 组件
- `npx shadcn@latest init` - 初始化 shadcn/ui 配置

## 技术栈

### 核心框架
- **React 19** - 前端框架
- **React Router v7** - 路由管理
- **TypeScript** - 类型安全
- **Vite (rolldown-vite)** - 构建工具

### UI 组件库
- **shadcn/ui** - 组件库框架（基于 Radix UI）
- **Tailwind CSS v4** - 样式框架
- **Lucide React** - 图标库

### 状态管理和数据
- **Zustand** - 轻量级状态管理（带持久化）
- **TanStack React Table** - 表格组件
- **TanStack React Form** - 表单管理
- **Axios** - HTTP 请求库
- **Zod** - 数据验证

### 其他重要库
- **Sonner** - Toast 通知
- **next-themes** - 主题切换
- **recharts** - 图表组件

## 项目架构

### 目录结构
```
src/
├── apis/           # API 接口定义
├── components/     # 组件
│   └── ui/        # shadcn/ui 组件
├── hooks/          # 自定义 React Hooks
├── lib/           # 工具库
├── pages/         # 页面组件
│   ├── auth/      # 认证相关页面
│   ├── dashboard/ # 仪表板页面
│   ├── system/    # 系统管理页面
│   ├── test/      # 测试页面
│   └── error/     # 错误页面
├── providers/     # Context Providers
├── routers/       # 路由配置
├── stores/        # Zustand 状态管理
├── types/         # TypeScript 类型定义
└── utils/         # 工具函数
```

### 核心架构模式

#### 认证系统
- 使用 `AuthProvider` 提供全局认证状态
- 配合 `useUserStore` (Zustand) 持久化用户信息
- Axios 拦截器自动处理 token 注入和失效跳转

#### 路由系统
- 使用 React Router v7 的 `createBrowserRouter`
- 配置了完整的错误边界处理（403、404、500）
- 嵌套路由结构支持面包屑导航

#### 主题系统
- 自定义 `ThemeProvider` 支持明暗主题切换
- 主题状态持久化到 localStorage
- 与 next-themes 集成

#### 组件开发
- shadcn/ui 组件位于 `src/components/ui/`
- 使用 `components.json` 配置文件管理组件别名
- 支持完整的 TypeScript 类型提示

## 开发配置

### 代理配置
开发服务器配置了代理：`/dwa/api/*` → `http://localhost:8020/*`

### 路径别名
- `@/` → `src/`
- `@/components` → `src/components`
- `@/lib` → `src/lib`
- `@/utils` → `src/utils`

### ESLint 配置
- 使用 TypeScript ESLint 配置
- 集成 React Hooks 和 React Refresh 规则
- 允许未使用的局部变量和参数（warn 级别）

## API 接口规范

### HTTP 客户端
- 使用 Axios 实例，配置 base URL 和超时
- 自动注入 Bearer token 到请求头
- 统一错误处理（401 自动跳转登录页）

### 响应格式
```typescript
interface ApiResponse<T> {
  code: number;
  message: string;
  data: T;
}
```

## 开发注意事项

### 添加新的 shadcn/ui 组件
1. 使用 `npx shadcn@latest add [组件名]` 添加
2. 组件会自动安装到 `src/components/ui/` 目录
3. 更新相关的导入路径

### 状态管理
- 用户状态使用 Zustand + persist 中间件
- 其他状态优先使用 React Context 或本地状态

### 样式开发
- 使用 Tailwind CSS 类名
- 遵循 shadcn/ui 的组件变体模式
- 支持完整的主题切换