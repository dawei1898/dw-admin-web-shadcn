import {useState} from 'react'
import {Button} from "@/components/ui/button.tsx";
import {toast} from "sonner";


function App() {
    const [count, setCount] = useState(0)

    return (
        <>
            <div className='flex flex-col justify-center items-center min-h-svh w-full gap-4'>
                <p className='text-lg font-bold'>hello world</p>
                <Button
                    className='cursor-pointer'
                    onClick={() => {
                        toast.success('发送成功')
                    }}
                > send </Button>
            </div>
        </>
    )
}

export default App
