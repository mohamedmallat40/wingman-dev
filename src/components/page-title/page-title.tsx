import React, { FC } from 'react'

interface IPageTitleProps {
    title: string
    description: string
}
const PageTitle:FC<IPageTitleProps> = ({title,description}) => {
  return (
    <div className='flex flex-col'>
    <h1 className='text-xl font-bold text-default-900 lg:text-3xl'>{title}</h1>
    <p className='text-small text-default-400 lg:text-medium'>
      {description}
    </p>
  </div>  )
}

export default PageTitle