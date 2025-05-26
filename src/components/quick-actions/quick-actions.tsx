'use client';

import { FC } from 'react';

import { Card, CardBody, CardHeader } from '@heroui/react';
import { Icon } from '@iconify/react';

const messages = [
  {
    key: 'message1',
    description: 'Study Italian vocabulary',
    icon: <Icon className='text-primary-700' icon='solar:notebook-square-bold' width={24} />
  },
  {
    key: 'message2',
    description: 'Message inviting friend to wedding',
    icon: <Icon className='text-danger-600' icon='solar:chat-square-like-bold' width={24} />
  },
  {
    key: 'message3',
    description: 'Experience Buenos Aires like a local',
    icon: <Icon className='text-warning-600' icon='solar:user-id-bold' width={24} />
  },
  {
    key: 'message4',
    description: 'Design a fun Tetris game',
    icon: <Icon className='text-success-600' icon='solar:gameboy-bold' width={24} />
  }
];

const QuickActions: FC = () => {
  return (
    <div className='grid gap-2 sm:grid-cols-2 md:grid-cols-4'>
      {messages.map((message) => (
        <Card key={message.key} className='h-auto bg-default-100 px-[20px] py-[16px]' shadow='none'>
          <CardHeader className='p-0 pb-[9px]'>{message.icon}</CardHeader>
          <CardBody className='p-0 text-small text-default-400'>{message.description}</CardBody>
        </Card>
      ))}
    </div>
  );
};

export default QuickActions;
