import React from 'react';

import Container from '@/components/container/container';
import HeaderPage from '@/components/header-page/header-page';

const page = () => {
  return (
    <Container>
      <HeaderPage title='Broadcasts' description='Team updates, announcements & async reviews' />
    </Container>
  );
};

export default page;
