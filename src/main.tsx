import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import {RouterProvider} from "react-router";
import router from "@/routers/router.tsx";
import './index.css'
import ThemeProvider from "@/providers/theme-provider.tsx";

createRoot(document.getElementById('root')!).render(
  <StrictMode>
      <ThemeProvider>
            <RouterProvider router={router}/>
      </ThemeProvider>
  </StrictMode>,
)
