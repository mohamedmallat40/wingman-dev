import React, { FC } from 'react';

interface IContainerProperties {
  children: React.ReactNode;
}
const Container: FC<IContainerProperties> = ({ children }) => {
  return (
    <main className='flex h-full w-full flex-col items-center justify-start px-2'>{children}</main>
  );
};

export default Container;
