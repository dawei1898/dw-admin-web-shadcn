import {defineConfig, loadEnv} from 'vite'
import react from '@vitejs/plugin-react-swc'
import tailwindcss from "@tailwindcss/vite";
import path from "path"

// https://vite.dev/config/
export default defineConfig(({mode}) => {
    // 加载 .env.[mode] 文件
    const env = loadEnv(mode, process.cwd(), '');

    console.log('✅ 当前模式:', mode)
    //console.log('✅ VITE_PROXY_URL =', env.VITE_API_PROXY_URL)

    return {
        plugins: [
            react(),
            tailwindcss(),
        ],
        resolve: {
            alias: {
                "@": path.resolve(__dirname, "./src"),
            },
        },
        server: {
            // 设置本地启动的访问地址
            host: 'localhost',   // ip地址
            port: Number(env.VITE_PORT), // 端口号
            //port: 9110, // 端口号
            open: true,          // 启动后是否自动打开浏览器
            // 配置代理
            proxy: {
                '/dwa/api': {  // 拦截规则
                    //target: 'http://localhost:8020',   // 后端本地地址
                    target: env.VITE_API_PROXY_URL,
                    //changeOrigin: true,              // 是否允许跨域
                    rewrite: (path) => path.replace(/^\/dwa\/api/, '')  // 重写路径，去除 /dwa/api 前缀
                },

            }
        },
    }
})
