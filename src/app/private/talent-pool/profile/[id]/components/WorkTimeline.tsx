'use client';

import { Icon } from '@iconify/react';

type WorkItem = {
  title: string;
  period: string;
  description: string;
  company?: string;
  position?: string;
};

interface WorkTimelineProps {
  items: WorkItem[];
}

function formatDate(input: string | null | undefined): string {
  if (!input) return 'Present';
  try {
    return new Date(input).toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short'
    });
  } catch {
    return input ?? '';
  }
}

export const WorkTimeline: React.FC<WorkTimelineProps> = ({ items = [] }) => {
  return (
    <ol className='border-primary/15 relative ms-3 border-s'>
      {items.map((item, idx) => (
        <li key={`${item.title}-${idx}`} className='ms-6 mb-8'>
          <span className='bg-primary/5 text-primary ring-primary/20 absolute -start-3 flex h-6 w-6 items-center justify-center rounded-full ring-2'>
            <Icon icon='solar:briefcase-linear' className='h-3.5 w-3.5' aria-hidden />
          </span>
          <div className='flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between'>
            <h3 className='text-foreground font-medium'>{item.title}</h3>
            <div className='text-foreground-500 inline-flex items-center gap-1 text-sm'>
              <Icon icon='solar:calendar-linear' className='text-primary h-4 w-4' aria-hidden />
              <span>{item.period}</span>
            </div>
          </div>
          <p className='text-foreground-600 mt-2 text-sm leading-relaxed'>{item.description}</p>
        </li>
      ))}
    </ol>
  );
};
