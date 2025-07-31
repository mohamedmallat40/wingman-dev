import React from 'react';

import type { FC, PropsWithChildren } from 'react';

interface SectionContainerProps extends PropsWithChildren {
  className?: string;
}
const SectionContainer: FC<SectionContainerProps> = ({ children, className }) => {
  return (
    <div className={'w-full rounded-lg bg-transparent px-4 py-2 shadow-sm ' + className}>
      {children}
    </div>
  );
};

export default SectionContainer;
