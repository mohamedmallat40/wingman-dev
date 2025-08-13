'use client';

import React from 'react';

import { Card, CardBody, CardHeader } from '@heroui/react';
import { Icon } from '@iconify/react';
import { type Note } from '@root/modules/profile/types';

import { ActionButtons } from '../ActionButtons';

interface NotesSectionProperties {
  notes: Note[];
  isOwnProfile: boolean;
  onAdd: () => void;
  onDelete: (note: Note) => void;
  t: (key: string) => string;
}

export const NotesSection: React.FC<NotesSectionProperties> = ({
  notes,
  isOwnProfile,
  onAdd,
  onDelete,
  t
}) => {
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return dateString;
    }
  };

  // Only show notes if there are any
  if (notes.length === 0) {
    return null;
  }

  return (
    <Card
      id='notes'
      className='border-default-200/50 hover:border-info/20 scroll-mt-24 shadow-sm transition-all duration-300 hover:shadow-md'
    >
      <CardHeader className='pb-4'>
        <div className='flex w-full items-center justify-between'>
          <div className='flex items-center gap-4'>
            <div className='bg-info/10 rounded-full p-3'>
              <Icon icon='solar:notes-linear' className='text-info h-5 w-5' />
            </div>
            <div>
              <h2 className='text-foreground text-xl font-semibold'>Notes ({notes.length})</h2>
              <p className='text-small text-foreground-500 mt-1'>Personal notes and observations</p>
            </div>
          </div>

          {isOwnProfile && (
            <ActionButtons showAdd onAdd={onAdd} addTooltip='Add new note' size='md' />
          )}
        </div>
      </CardHeader>
      <CardBody className='px-8 pt-2'>
        <div className='space-y-4'>
          {notes
            .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
            .map((note, index) => (
              <div
                key={note.id}
                className='bg-default-50 hover:bg-default-100 rounded-lg p-4 transition-colors duration-200'
              >
                <div className='flex items-start justify-between gap-4'>
                  <div className='flex-1'>
                    <div className='mb-2 flex items-center gap-3'>
                      <div className='bg-info/20 rounded-full p-1.5'>
                        <Icon icon='solar:document-text-linear' className='text-info h-3 w-3' />
                      </div>
                      <div className='flex items-center gap-2'>
                        <span className='text-small text-foreground-600 font-medium'>
                          {note.owner.firstName} {note.owner.lastName}
                        </span>
                        <span className='text-tiny text-foreground-400'>•</span>
                        <span className='text-tiny text-foreground-400'>
                          {formatDate(note.created_at)}
                        </span>
                      </div>
                    </div>
                    <p className='text-foreground-700 leading-relaxed whitespace-pre-wrap'>
                      {note.note}
                    </p>
                  </div>

                  {isOwnProfile && (
                    <ActionButtons
                      showDelete
                      onDelete={() => {
                        onDelete(note);
                      }}
                      deleteTooltip='Delete note'
                      size='sm'
                    />
                  )}
                </div>
              </div>
            ))}
        </div>
      </CardBody>
    </Card>
  );
};
