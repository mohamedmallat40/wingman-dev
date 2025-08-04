'use client';

import React, { PropsWithChildren } from 'react';

type TRootLayout = PropsWithChildren;

export default function DashboardLayout({ children }: Readonly<TRootLayout>) {
  return <>{children}</>;
}
