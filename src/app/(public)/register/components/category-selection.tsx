'use client';

import { Card, CardBody, Radio, RadioGroup } from '@heroui/react';
import Image from 'next/image';

import { type Plan } from '@/lib/types/auth';

interface CategorySelectionProperties {
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  categories: Plan[];
}

export default function CategorySelection({
  selectedCategory,
  onCategoryChange,
  categories
}: Readonly<CategorySelectionProperties>) {
  return (
    <div className='space-y-3'>
      <div>
        <h2 className='mb-1 text-lg font-semibold text-gray-900 dark:text-white'>
          Choose Your Category
        </h2>
        <p className='text-sm text-gray-600 dark:text-gray-400'>Select what best describes you</p>
      </div>

      <RadioGroup
        value={selectedCategory}
        onValueChange={onCategoryChange}
        classNames={{
          wrapper: 'grid grid-cols-3 gap-2'
        }}
      >
        {categories.map((category) => (
          <Radio
            key={category.id}
            value={category.userCategory}
            classNames={{
              base: 'inline-flex m-0 bg-transparent items-center justify-start flex-row-reverse w-full max-w-full cursor-pointer rounded-lg border-2 border-default-200 p-0 hover:border-primary-500 hover:bg-transparent data-[selected=true]:border-primary-500',
              control: 'hidden',
              wrapper: 'hidden',
              labelWrapper: 'm-0 w-full'
            }}
          >
            <Card className='w-full bg-transparent shadow-none'>
              <CardBody className='flex flex-row items-center gap-3 p-3'>
                <div className='bg-primary/10 flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full'>
                  {category.image && process.env.NEXT_PUBLIC_API_BASE_URL && (
                    <Image
                      src={`${process.env.NEXT_PUBLIC_API_BASE_URL.replace(/\/$/, '')}/upload/${category.image}`}
                      className='text-primary'
                      width={20}
                      height={20}
                      alt={category.name}
                    />
                  )}
                </div>
                <div className='flex-1'>
                  <h3 className='text-sm font-semibold text-gray-900 dark:text-white'>
                    {category.userCategory.charAt(0).toUpperCase() +
                      category.userCategory.slice(1).toLowerCase()}
                  </h3>
                  <p className='text-xs text-gray-600 dark:text-gray-400'>{category.subTitle}</p>
                </div>
              </CardBody>
            </Card>
          </Radio>
        ))}
      </RadioGroup>
    </div>
  );
}
