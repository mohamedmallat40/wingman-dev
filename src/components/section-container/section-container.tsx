import React from 'react'

import type { FC, PropsWithChildren } from 'react'
interface SectionContainerProps extends PropsWithChildren {
    className?: string
}
const SectionContainer: FC<SectionContainerProps> = ({ children,className }) => {
    return (
        <div className={'bg-default-100 w-full py-2 px-4 rounded-lg shadow-sm ' + className}>
            {children}
        </div>
    )
}

export default SectionContainer