import { useState } from 'react'



function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <div className='flex justify-center items-center min-h-screen w-full'>
          <p className='text-lg font-bold'>hello world</p>
      </div>
    </>
  )
}

export default App
