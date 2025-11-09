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
- **React 19.1.1** - 前端框架（最新版本）
- **React Router v7.9.4** - 路由管理（最新版本）
- **TypeScript 5.9.3** - 类型安全
- **Vite (rolldown-vite 7.1.14)** - 构建工具

### UI 组件库
- **shadcn/ui 3.5.0** - 组件库框架（基于 Radix UI）
- **Tailwind CSS v4.1.16** - 样式框架
- **Lucide React 0.548.0** - 图标库
- **React Icons 5.5.0** - 额外图标库

### Radix UI 组件（已安装）
- **@radix-ui/react-alert-dialog** - 警告对话框
- **@radix-ui/react-avatar** - 头像组件
- **@radix-ui/react-checkbox** - 复选框
- **@radix-ui/react-dialog** - 对话框
- **@radix-ui/react-dropdown-menu** - 下拉菜单
- **@radix-ui/react-label** - 标签
- **@radix-ui/react-radio-group** - 单选按钮组
- **@radix-ui/react-select** - 选择器
- **@radix-ui/react-separator** - 分隔符
- **@radix-ui/react-slot** - 插槽组件
- **@radix-ui/react-tabs** - 选项卡
- **@radix-ui/react-toggle** - 切换开关
- **@radix-ui/react-toggle-group** - 切换组
- **@radix-ui/react-tooltip** - 工具提示

### 状态管理和数据
- **Zustand 5.0.8** - 轻量级状态管理（带持久化）
- **TanStack React Table 8.21.3** - 高性能表格组件
- **TanStack React Form 1.23.8** - 表单管理
- **Axios 1.12.2** - HTTP 请求库
- **Zod 4.1.12** - 数据验证

### 其他重要库
- **Sonner 2.0.7** - Toast 通知
- **next-themes 0.4.6** - 主题切换（与 shadcn/ui 兼容）
- **Recharts 2.15.4** - 图表组件
- **Vaul 1.1.2** - 抽屉组件
- **tw-animate-css 1.4.0** - Tailwind 动画库

## 项目架构

### 目录结构
```
src/
├── apis/           # API 接口定义
├── components/     # 通用组件
│   ├── auth/      # 认证相关组件
│   ├── sidebar/   # 侧边栏组件
│   ├── table/     # 表格组件
│   ├── test/      # 测试组件
│   └── ui/        # shadcn/ui 组件
├── hooks/         # 自定义 React Hooks
├── lib/           # 工具库
├── pages/         # 页面组件
│   ├── auth/      # 认证相关页面
│   │   ├── login/    # 登录页面
│   │   └── register/ # 注册页面
│   ├── dashboard/ # 仪表板页面
│   │   ├── workbench/ # 工作台
│   │   └── analysis/  # 分析页
│   ├── system/    # 系统管理页面
│   │   ├── user/   # 用户管理
│   │   ├── role/   # 角色管理
│   │   └── log/    # 日志管理
│   ├── file/      # 文件管理页面
│   │   └── image/  # 图片管理
│   ├── test/      # 测试页面
│   │   ├── table/  # 表格测试
│   │   └── form/   # 表单测试
│   ├── home/      # 首页布局
│   └── error/     # 错误页面
│       ├── 403/   # 403 错误页面
│       ├── 404/   # 404 错误页面
│       └── 500/   # 500 错误页面
├── providers/     # Context Providers
├── routers/       # 路由配置
├── stores/        # Zustand 状态管理
├── types/         # TypeScript 类型定义
└── utils/         # 工具函数
```

### 路由结构

项目使用 React Router v7 的嵌套路由结构，支持面包屑导航：

```
/                          # 主布局
├── dashboard/             # 控制台
│   ├── workbench/        # 工作台
│   └── analysis/         # 分析页
├── system/               # 系统管理
│   ├── user/             # 用户管理
│   ├── role/             # 角色管理
│   └── log/              # 日志管理
├── file/                 # 文件管理
│   └── image/            # 图片管理
└── auth/                 # 认证页面（独立路由）
    ├── login/
    └── register/
```

### 页面组件命名规范

- **主页面组件**: `xxx-index.tsx`（如 `user-manage-index.tsx`）
- **表单组件**: `add-xxx-form.tsx`、`edit-xxx-form.tsx`
- **对话框组件**: `delete-xxx-dialog.tsx`
- **测试页面**: `test.tsx`、`form-demo.tsx`、`page.tsx`
- **错误页面**: `not-found.tsx`、`error.tsx`、`not-authorized.tsx`

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

### 构建工具
- **Vite**: 使用 rolldown-vite 7.1.14 作为打包工具
- **TypeScript**: 先编译 (`tsc -b`) 再构建 (`vite build`)
- **SWC**: 使用 @vitejs/plugin-react-swc 进行快速编译

### 代理配置
开发服务器配置了代理：`/dwa/api/*` → `http://localhost:8020/*`
- 路径重写：去除 `/dwa/api` 前缀
- 自动启动浏览器：`open: true`
- 本地访问地址：`localhost`

### 路径别名
根据 `components.json` 配置：
- `@/` → `src/`
- `@/components` → `src/components`
- `@/lib` → `src/lib`
- `@/utils` → `src/utils`
- `@/hooks` → `src/hooks`
- `ui` → `@/components/ui`

### ESLint 配置
- 使用 TypeScript ESLint 配置
- 集成 React Hooks 和 React Refresh 规则
- 允许未使用的局部变量和参数（warn 级别）
- 使用最新的 ESLint Flat Config 格式

### shadcn/ui 配置
- **样式风格**: new-york
- **CSS 变量**: 启用，支持主题切换
- **图标库**: Lucide React
- **基础颜色**: neutral
- **前缀**: 无前缀

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

## 开发指南

### 错误处理
- 项目配置了完整的错误边界处理
- 403 错误：权限不足页面
- 404 错误：页面未找到
- 500 错误：服务器内部错误
- 使用 `GeneralErrorBoundary` 组件统一处理路由错误

### shadcn/ui 组件开发
- 添加组件：`npx shadcn@latest add [组件名]`
- 组件自动安装到 `src/components/ui/` 目录
- 使用 `cn()` 函数合并 className（位于 `@/lib/utils`）
- 遵循组件变体模式，使用 `class-variance-authority`

### 表格组件使用
项目集成了 TanStack React Table，参考测试页面：
- `src/pages/test/table/` - 表格组件示例
- 包含分页、排序、筛选、列显示控制等功能
- 使用 `columns.tsx` 定义表格列配置

### 表单组件使用
项目集成了 TanStack React Form + Zod：
- `src/pages/test/form/` - 表单组件示例
- 使用 Zod 进行表单验证
- 支持嵌套表单和动态字段

### shadcn MCP 集成
- 使用 `npx shadcn@latest mcp init --client claude` 初始化 MCP
- 允许 Claude Code 直接操作 shadcn/ui 组件

## 状态管理

### Zustand 配置
- 用户状态：使用 `useUserStore` + persist 中间件
- 持久化到 localStorage
- 支持状态自动同步和恢复

### 状态管理规范
- **全局状态**: 使用 Zustand store（如用户信息）
- **页面状态**: 使用 React useState 或 useReducer
- **表单状态**: 使用 TanStack React Form
- **UI 状态**: 优先使用 React Context（如主题、认证）

### 状态持久化
```typescript
// Zustand persist 示例
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

const useUserStore = create(
  persist(
    (set, get) => ({
      user: null,
      setUser: (user) => set({ user }),
    }),
    {
      name: 'user-storage',
    }
  )
)
```

## 开发注意事项

### 添加新的 shadcn/ui 组件
1. 使用 `npx shadcn@latest add [组件名]` 添加
2. 组件会自动安装到 `src/components/ui/` 目录
3. 更新相关的导入路径

### 样式开发
- 使用 Tailwind CSS 类名
- 遵循 shadcn/ui 的组件变体模式
- 支持完整的主题切换
- 使用 CSS 变量进行主题定制

### 路由开发
- 新增页面需要在 `src/routers/router.tsx` 中配置路由
- 使用 `handle.breadcrumb` 配置面包屑导航
- 嵌套路由支持布局继承

### API 开发
- 使用统一的 `ApiResponse<T>` 响应格式
- 在 `src/apis/` 目录下定义接口
- 使用 Axios 拦截器处理认证和错误