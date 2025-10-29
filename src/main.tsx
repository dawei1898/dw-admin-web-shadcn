import './index.css'
import {StrictMode} from 'react'
import {createRoot} from 'react-dom/client'
import {RouterProvider} from "react-router";
import router from "@/routers/router.tsx";
import ThemeProvider from "@/providers/theme-provider.tsx";
import {Toaster} from "sonner";
import {CircleCheck, CircleX} from "lucide-react";

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <ThemeProvider>
            <Toaster
                position='top-center'
                icons={{
                    success: <CircleCheck size={16} className='text-green-500'/>,
                    error: <CircleX size={16} className='text-red-500'/>,
                }}
            />
            <RouterProvider router={router}/>
        </ThemeProvider>
    </StrictMode>,
)
