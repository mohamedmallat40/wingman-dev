import React from 'react';

import { Button, Card, CardBody, Chip, Link } from '@heroui/react';
import { Icon } from '@iconify/react';
import { motion } from 'framer-motion';
import { Group } from '../../types';

interface TeamToolsTabProperties {
  team: Group;
  isOwner: boolean;
  onRefetch: () => void;
}

export const TeamToolsTab: React.FC<TeamToolsTabProperties> = ({ team, isOwner, onRefetch }) => {
  const handleAddTool = () => {
    // TODO: Implement add tool functionality
    console.log('Add tool clicked');
  };

  const handleRemoveTool = (toolName: string) => {
    // TODO: Implement remove tool functionality
    console.log('Remove tool:', toolName);
  };

  const handleEditTool = (toolName: string) => {
    // TODO: Implement edit tool functionality
    console.log('Edit tool:', toolName);
  };

  const getTagColor = (tag: string): "primary" | "default" | "secondary" | "success" | "warning" | "danger" => {
    const colors: Record<string, "primary" | "default" | "secondary" | "success" | "warning" | "danger"> = {
      Frontend: 'primary',
      Backend: 'secondary',
      Database: 'success',
      Language: 'warning',
      DevOps: 'danger',
      Design: 'default'
    };
    return colors[tag] || 'default';
  };

  if (team.tools.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className='flex flex-col items-center justify-center py-16 text-center'
      >
        <Icon icon='solar:widget-2-linear' className='text-default-300 mb-4 h-16 w-16' />
        <h3 className='text-foreground mb-2 text-xl font-semibold'>No Tools Added Yet</h3>
        <p className='text-default-600 mb-6 max-w-md'>
          {isOwner
            ? 'Add tools and technologies that your team uses to help others understand your capabilities.'
            : "This team hasn't added any tools yet."}
        </p>
        {isOwner && (
          <Button
            color='primary'
            variant='solid'
            startContent={<Icon icon='solar:add-circle-bold' className='h-4 w-4' />}
            onPress={handleAddTool}
          >
            Add First Tool
          </Button>
        )}
      </motion.div>
    );
  }

  return (
    <div className='space-y-6'>
      {/* Header */}
      <div className='flex items-center justify-between'>
        <div>
          <h3 className='text-foreground text-lg font-semibold'>Team Tools & Technologies</h3>
          <p className='text-default-600 text-sm'>Tools and technologies used by this team</p>
        </div>
        {isOwner && (
          <Button
            color='primary'
            variant='solid'
            size='sm'
            startContent={<Icon icon='solar:add-circle-bold' className='h-4 w-4' />}
            onPress={handleAddTool}
          >
            Add Tool
          </Button>
        )}
      </div>

      {/* Tools Grid */}
      <motion.div
        //variants={STAGGER_CONTAINER_VARIANTS}
        initial='hidden'
        animate='visible'
        className='grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3'
      >
        {team.tools.map((tool, index) => (
          <motion.div
            key={tool.name}
            //variants={STAGGER_ITEM_VARIANTS}
            transition={{ duration: 0.3, delay: index * 0.1 }}
          >
            <Card className='h-full transition-shadow duration-200 hover:shadow-md'>
              <CardBody className='p-4'>
                <div className='flex h-full flex-col'>
                  {/* Tool Header */}
                  <div className='mb-3 flex items-start justify-between'>
                    <div className='flex items-center gap-3'>
                      <div className='bg-primary-50 flex h-10 w-10 items-center justify-center rounded-lg'>
                        <Icon icon='solar:widget-2-bold' className='text-primary h-5 w-5' />
                      </div>
                      <div>
                        <h4 className='text-foreground font-semibold'>{tool.name}</h4>
                        <Chip
                          size='sm'
                          variant='flat'
                          color={getTagColor(tool.tag)}
                          className='mt-1'
                        >
                          {tool.tag}
                        </Chip>
                      </div>
                    </div>
                    {isOwner && (
                      <div className='flex gap-1'>
                        <Button
                          isIconOnly
                          size='sm'
                          variant='light'
                          color='default'
                          onPress={() => handleEditTool(tool.name)}
                        >
                          <Icon icon='solar:pen-linear' className='h-4 w-4' />
                        </Button>
                        <Button
                          isIconOnly
                          size='sm'
                          variant='light'
                          color='danger'
                          onPress={() => handleRemoveTool(tool.name)}
                        >
                          <Icon icon='solar:trash-bin-minimalistic-linear' className='h-4 w-4' />
                        </Button>
                      </div>
                    )}
                  </div>

                  {/* Tool Description */}
                  <p className='text-default-600 mb-4 flex-1 text-sm'>{tool.description}</p>

                  {/* Tool Link */}
                  {tool.link && (
                    <Link
                      href={tool.link}
                      target='_blank'
                      rel='noopener noreferrer'
                      className='text-primary text-sm hover:underline'
                      showAnchorIcon
                    >
                      Learn more
                    </Link>
                  )}
                </div>
              </CardBody>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      {/* Tools Summary */}
      <Card className='bg-default-50'>
        <CardBody className='p-4'>
          <div className='flex items-center gap-3'>
            <Icon icon='solar:info-circle-bold' className='text-primary h-5 w-5' />
            <div>
              <p className='text-foreground text-sm font-medium'>
                {team.tools.length} {team.tools.length === 1 ? 'tool' : 'tools'} in total
              </p>
              <p className='text-default-600 text-xs'>
                This team uses a variety of modern tools and technologies to deliver high-quality
                results.
              </p>
            </div>
          </div>
        </CardBody>
      </Card>
    </div>
  );
};
