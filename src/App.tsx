import { useState } from 'react'
import {Button} from "@/components/ui/button.tsx";



function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <div className='flex flex-col justify-center items-center min-h-svh w-full gap-4'>
          <p className='text-lg font-bold'>hello world</p>
          <Button> send </Button>
      </div>
    </>
  )
}

export default App
