import React, { useState } from 'react';

import { 
  Button, 
  Card, 
  CardBody, 
  Chip, 
  Link, 
  Modal, 
  ModalContent, 
  ModalHeader, 
  ModalBody, 
  ModalFooter, 
  Input, 
  Textarea, 
  Select, 
  SelectItem,
  useDisclosure 
} from '@heroui/react';
import { Icon } from '@iconify/react';
import { motion } from 'framer-motion';

import { Group } from '../../types';

interface Tool {
  name: string;
  description: string;
  tag?: string;
  link?: string;
}

interface TeamToolsTabProperties {
  team: Group;
  isOwner: boolean;
  onRefetch: () => void;
}

export const TeamToolsTab: React.FC<TeamToolsTabProperties> = ({ team, isOwner, onRefetch }) => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newTool, setNewTool] = useState<Tool>({
    name: '',
    description: '',
    tag: '',
    link: ''
  });

  const toolTags = [
    { key: 'Frontend', label: 'Frontend' },
    { key: 'Backend', label: 'Backend' },
    { key: 'Database', label: 'Database' },
    { key: 'Language', label: 'Language' },
    { key: 'DevOps', label: 'DevOps' },
    { key: 'Design', label: 'Design' }
  ];

  const resetForm = () => {
    setNewTool({
      name: '',
      description: '',
      tag: '',
      link: ''
    });
  };

  const handleAddTool = async () => {
    if (!newTool.name.trim() || !newTool.description.trim()) {
      return;
    }

    setIsSubmitting(true);

    try {
      // Create the updated tools array with the new tool
      const updatedTools = [
        ...team.tools,
        {
          name: newTool.name.trim(),
          description: newTool.description.trim(),
          tag: newTool.tag || undefined,
          link: newTool.link.trim() || undefined
        }
      ];

      // POST request to update team tools
      const response = await fetch(`/groups/${team.id}/tools`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedTools),
      });

      if (!response.ok) {
        throw new Error('Failed to add tool');
      }

      // Reset form and close modal
      resetForm();
      onOpenChange();
      
      // Refetch team data to update UI
      onRefetch();
      
    } catch (error) {
      console.error('Error adding tool:', error);
      // You might want to show a toast notification here
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRemoveTool = async (toolName: string) => {
    try {
      // Create the updated tools array without the removed tool
      const updatedTools = team.tools.filter(tool => tool.name !== toolName);

      // DELETE request with remaining tools
      const response = await fetch(`/groups/${team.id}/tools`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedTools),
      });

      if (!response.ok) {
        throw new Error('Failed to remove tool');
      }

      // Refetch team data to update UI
      onRefetch();
      
    } catch (error) {
      console.error('Error removing tool:', error);
      // You might want to show a toast notification here
    }
  };

  const getTagColor = (
    tag: string
  ): 'primary' | 'default' | 'secondary' | 'success' | 'warning' | 'danger' => {
    const colors: Record<
      string,
      'primary' | 'default' | 'secondary' | 'success' | 'warning' | 'danger'
    > = {
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
      <>
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
              onPress={onOpen}
            >
              Add First Tool
            </Button>
          )}
        </motion.div>

        {/* Add Tool Modal */}
        <Modal 
          isOpen={isOpen} 
          onOpenChange={onOpenChange}
          placement="top-center"
          size="lg"
        >
          <ModalContent>
            {(onClose) => (
              <>
                <ModalHeader className="flex flex-col gap-1">Add New Tool</ModalHeader>
                <ModalBody>
                  <div className="flex flex-col gap-4">
                    <Input
                      autoFocus
                      label="Tool Name"
                      placeholder="Enter tool name"
                      variant="bordered"
                      value={newTool.name}
                      onChange={(e) => setNewTool({ ...newTool, name: e.target.value })}
                      isRequired
                    />
                    
                    <Textarea
                      label="Description"
                      placeholder="Describe what this tool is used for"
                      variant="bordered"
                      value={newTool.description}
                      onChange={(e) => setNewTool({ ...newTool, description: e.target.value })}
                      isRequired
                    />

                    <Select
                      label="Category"
                      placeholder="Select a category"
                      variant="bordered"
                      selectedKeys={newTool.tag ? [newTool.tag] : []}
                      onSelectionChange={(keys) => {
                        const selectedKey = Array.from(keys)[0] as string;
                        setNewTool({ ...newTool, tag: selectedKey || '' });
                      }}
                    >
                      {toolTags.map((tag) => (
                        <SelectItem key={tag.key} value={tag.key}>
                          {tag.label}
                        </SelectItem>
                      ))}
                    </Select>

                    <Input
                      label="Link (Optional)"
                      placeholder="https://example.com"
                      variant="bordered"
                      value={newTool.link}
                      onChange={(e) => setNewTool({ ...newTool, link: e.target.value })}
                    />
                  </div>
                </ModalBody>
                <ModalFooter>
                  <Button 
                    color="danger" 
                    variant="flat" 
                    onPress={() => {
                      resetForm();
                      onClose();
                    }}
                  >
                    Cancel
                  </Button>
                  <Button 
                    color="primary" 
                    onPress={handleAddTool}
                    isLoading={isSubmitting}
                    isDisabled={!newTool.name.trim() || !newTool.description.trim()}
                  >
                    Add Tool
                  </Button>
                </ModalFooter>
              </>
            )}
          </ModalContent>
        </Modal>
      </>
    );
  }

  return (
    <>
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
              onPress={onOpen}
            >
              Add Tool
            </Button>
          )}
        </div>

        {/* Tools Grid */}
        <motion.div
          initial='hidden'
          animate='visible'
          className='grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3'
        >
          {team.tools.map((tool, index) => (
            <motion.div
              key={tool.name}
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
                          {tool.tag && <Chip
                            size='sm'
                            variant='flat'
                            color={getTagColor(tool.tag)}
                            className='mt-1'
                          >
                            {tool.tag}
                          </Chip>}
                        </div>
                      </div>
                      {isOwner && (
                        <div className='flex gap-1'>
                          <Button
                            isIconOnly
                            size='sm'
                            variant='light'
                            color='danger'
                            onPress={() => {
                              handleRemoveTool(tool.name);
                            }}
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

      {/* Add Tool Modal */}
      <Modal 
        isOpen={isOpen} 
        onOpenChange={onOpenChange}
        placement="top-center"
        size="lg"
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">Add New Tool</ModalHeader>
              <ModalBody>
                <div className="flex flex-col gap-4">
                  <Input
                    autoFocus
                    label="Tool Name"
                    placeholder="Enter tool name"
                    variant="bordered"
                    value={newTool.name}
                    onChange={(e) => setNewTool({ ...newTool, name: e.target.value })}
                    isRequired
                  />
                  
                  <Textarea
                    label="Description"
                    placeholder="Describe what this tool is used for"
                    variant="bordered"
                    value={newTool.description}
                    onChange={(e) => setNewTool({ ...newTool, description: e.target.value })}
                    isRequired
                  />

                  <Select
                    label="Category"
                    placeholder="Select a category"
                    variant="bordered"
                    selectedKeys={newTool.tag ? [newTool.tag] : []}
                    onSelectionChange={(keys) => {
                      const selectedKey = Array.from(keys)[0] as string;
                      setNewTool({ ...newTool, tag: selectedKey || '' });
                    }}
                  >
                    {toolTags.map((tag) => (
                      <SelectItem key={tag.key} value={tag.key}>
                        {tag.label}
                      </SelectItem>
                    ))}
                  </Select>

                  <Input
                    label="Link (Optional)"
                    placeholder="https://example.com"
                    variant="bordered"
                    value={newTool.link}
                    onChange={(e) => setNewTool({ ...newTool, link: e.target.value })}
                  />
                </div>
              </ModalBody>
              <ModalFooter>
                <Button 
                  color="danger" 
                  variant="flat" 
                  onPress={() => {
                    resetForm();
                    onClose();
                  }}
                >
                  Cancel
                </Button>
                <Button 
                  color="primary" 
                  onPress={handleAddTool}
                  isLoading={isSubmitting}
                  isDisabled={!newTool.name.trim() || !newTool.description.trim()}
                >
                  Add Tool
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};