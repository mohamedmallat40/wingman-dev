import React, { FC } from 'react'

interface IContainerProps {
    children: React.ReactNode
}
const Container: FC<IContainerProps> = ({ children }) => {
    return (
        <main className='flex h-full w-full flex-col items-center justify-start'>
            {children}
        </main>)
}

export default Container