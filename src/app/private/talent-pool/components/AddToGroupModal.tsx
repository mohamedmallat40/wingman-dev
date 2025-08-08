'use client';

import React, { useState, useEffect } from 'react';

import { 
  Modal, 
  ModalContent, 
  ModalHeader, 
  ModalBody, 
  ModalFooter,
  Button,
  Avatar,
  Divider,
  Checkbox,
  Spinner,
  Chip,
  Input
} from '@heroui/react';
import { Icon } from '@iconify/react';
import { useTranslations } from 'next-intl';

import { type User, type Group } from '../types';
import { getImageUrl } from '@/lib/utils/utilities';

interface AddToGroupModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: User | null;
  onAddToGroups?: (userId: string, groupIds: string[]) => void;
}

const AddToGroupModal: React.FC<AddToGroupModalProps> = ({ 
  isOpen, 
  onClose, 
  user, 
  onAddToGroups 
}) => {
  const t = useTranslations();
  const [selectedGroups, setSelectedGroups] = useState<Set<string>>(new Set());
  const [groups, setGroups] = useState<Group[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetchingGroups, setIsFetchingGroups] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [newGroupName, setNewGroupName] = useState('');
  const [isCreatingGroup, setIsCreatingGroup] = useState(false);

  // Mock groups data - replace with actual API call
  const mockGroups: Group[] = [
    {
      id: '1',
      groupName: 'Frontend Developers',
      color: '#3B82F6',
      members: 12,
      tools: [],
      owner: user!,
      connections: []
    },
    {
      id: '2', 
      groupName: 'Backend Specialists',
      color: '#10B981',
      members: 8,
      tools: [],
      owner: user!,
      connections: []
    },
    {
      id: '3',
      groupName: 'Designers',
      color: '#F59E0B',
      members: 15,
      tools: [],
      owner: user!,
      connections: []
    }
  ];

  useEffect(() => {
    if (isOpen && user) {
      fetchGroups();
    }
  }, [isOpen, user]);

  const fetchGroups = async () => {
    setIsFetchingGroups(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setGroups(mockGroups);
    } catch (error) {
      console.error('Error fetching groups:', error);
    } finally {
      setIsFetchingGroups(false);
    }
  };

  const filteredGroups = groups.filter(group => 
    group.groupName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleGroupSelection = (groupId: string, isSelected: boolean) => {
    const newSelected = new Set(selectedGroups);
    if (isSelected) {
      newSelected.add(groupId);
    } else {
      newSelected.delete(groupId);
    }
    setSelectedGroups(newSelected);
  };

  const handleCreateGroup = async () => {
    if (!newGroupName.trim()) return;
    
    setIsCreatingGroup(true);
    try {
      // Simulate group creation
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const newGroup: Group = {
        id: `new-${Date.now()}`,
        groupName: newGroupName.trim(),
        color: '#6366F1',
        members: 1,
        tools: [],
        owner: user!,
        connections: []
      };
      
      setGroups(prev => [newGroup, ...prev]);
      setSelectedGroups(prev => new Set([...prev, newGroup.id]));
      setNewGroupName('');
    } catch (error) {
      console.error('Error creating group:', error);
    } finally {
      setIsCreatingGroup(false);
    }
  };

  const handleSave = async () => {
    if (!user || selectedGroups.size === 0) return;
    
    setIsLoading(true);
    try {
      await onAddToGroups?.(user.id, Array.from(selectedGroups));
      onClose();
    } catch (error) {
      console.error('Error adding to groups:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setSelectedGroups(new Set());
    setSearchQuery('');
    setNewGroupName('');
    onClose();
  };

  if (!user) return null;

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={handleClose}
      size="xl"
      backdrop="blur"
      placement="center"
      scrollBehavior="inside"
      classNames={{
        base: "bg-background dark:bg-content1",
        backdrop: "bg-black/50 backdrop-blur-sm"
      }}
    >
      <ModalContent className="w-full max-w-xl rounded-[24px] shadow-[0px_12px_24px_rgba(0,0,0,0.08)]">
        <ModalHeader className="flex flex-col items-center pt-8 pb-6">
          <div className="text-center">
            <div className="mb-4">
              <div className="bg-primary/10 mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-[24px]">
                <Icon icon="solar:users-group-rounded-linear" className="text-primary h-8 w-8" />
              </div>
            </div>
            <h2 className="text-foreground mb-2 text-2xl font-bold tracking-[0.02em]">
              {t('talentPool.modals.addToGroup.title')}
            </h2>
            <p className="text-default-500 font-normal tracking-[0.02em]">
              {t('talentPool.modals.addToGroup.subtitle')}
            </p>
          </div>
        </ModalHeader>

        <ModalBody className="gap-4 px-6">
          {/* User Info */}
          <div className="flex items-center gap-3 p-4 rounded-[16px] bg-default-100 dark:bg-default-50 border border-default-200 dark:border-default-100">
            <Avatar
              src={
                user.profileImage
                  ? getImageUrl(user.profileImage)
                  : undefined
              }
              name={`${user.firstName} ${user.lastName}`}
              className="w-12 h-12"
            />
            <div>
              <p className="font-semibold text-foreground">
                {user.firstName} {user.lastName}
              </p>
              <p className="text-small text-default-500">
                {user.profession || user.kind}
              </p>
            </div>
          </div>

          <Divider />

          {/* Create New Group */}
          <div className="space-y-3">
            <h3 className="text-medium font-semibold">
              {t('talentPool.modals.addToGroup.createNewGroup')}
            </h3>
            <div className="flex gap-2">
              <Input
                value={newGroupName}
                onValueChange={setNewGroupName}
                placeholder={t('talentPool.modals.addToGroup.newGroupPlaceholder')}
                size="sm"
                classNames={{
                  inputWrapper: "border-default-300 data-[hover=true]:border-primary group-data-[focus=true]:border-primary rounded-[16px] bg-default-100 dark:bg-default-50",
                  input: "text-foreground font-normal tracking-[0.02em] placeholder:text-default-400"
                }}
                startContent={<Icon icon="solar:add-circle-linear" className="h-4 w-4 text-default-400" />}
              />
              <Button
                size="sm"
                color="primary"
                variant="flat"
                onPress={handleCreateGroup}
                isLoading={isCreatingGroup}
                disabled={!newGroupName.trim()}
                startContent={!isCreatingGroup ? <Icon icon="solar:add-circle-bold" className="h-4 w-4" /> : null}
              >
                {t('common.create')}
              </Button>
            </div>
          </div>

          <Divider />

          {/* Existing Groups */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-medium font-semibold">
                {t('talentPool.modals.addToGroup.existingGroups')}
              </h3>
              {selectedGroups.size > 0 && (
                <Chip size="sm" color="primary" variant="flat">
                  {selectedGroups.size} {t('talentPool.modals.addToGroup.selected')}
                </Chip>
              )}
            </div>

            {/* Search Groups */}
            <Input
              value={searchQuery}
              onValueChange={setSearchQuery}
              placeholder={t('talentPool.modals.addToGroup.searchGroups')}
              size="sm"
              classNames={{
                inputWrapper: "border-default-300 data-[hover=true]:border-primary group-data-[focus=true]:border-primary rounded-[16px] bg-default-100 dark:bg-default-50",
                input: "text-foreground font-normal tracking-[0.02em] placeholder:text-default-400"
              }}
              startContent={<Icon icon="solar:magnifer-linear" className="h-4 w-4 text-default-400" />}
            />

            {/* Groups List */}
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {isFetchingGroups ? (
                <div className="flex items-center justify-center p-4">
                  <Spinner size="sm" />
                  <span className="ml-2 text-small text-default-500">
                    {t('talentPool.modals.addToGroup.loadingGroups')}
                  </span>
                </div>
              ) : filteredGroups.length === 0 ? (
                <div className="text-center p-4 text-default-500">
                  <Icon icon="solar:users-group-rounded-linear" className="h-12 w-12 mx-auto mb-2 text-default-300" />
                  <p className="text-small">
                    {searchQuery ? t('talentPool.modals.addToGroup.noGroupsFound') : t('talentPool.modals.addToGroup.noGroups')}
                  </p>
                </div>
              ) : (
                filteredGroups.map((group) => (
                  <div
                    key={group.id}
                    className="flex items-center gap-3 p-3 rounded-[16px] border border-default-200 dark:border-default-100 hover:bg-default-100 dark:hover:bg-default-50 transition-colors"
                  >
                    <Checkbox
                      isSelected={selectedGroups.has(group.id)}
                      onValueChange={(isSelected) => handleGroupSelection(group.id, isSelected)}
                      color="primary"
                    />
                    <div
                      className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold"
                      style={{ backgroundColor: group.color }}
                    >
                      {group.groupName.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-foreground">{group.groupName}</p>
                      <p className="text-tiny text-default-500">
                        {group.members} {t('talentPool.modals.addToGroup.members')}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </ModalBody>

        <ModalFooter className="justify-end pt-4 pb-8">
          <div className="flex gap-3">
            <Button 
              className="border-default-300 hover:border-primary hover:bg-primary/5 h-12 rounded-[16px] font-medium tracking-[0.02em] transition-all duration-300"
              variant="bordered"
              onPress={handleClose}
              disabled={isLoading}
            >
              {t('common.cancel')}
            </Button>
            <Button 
              className="h-12 rounded-[16px] font-bold tracking-[0.02em] shadow-[0px_8px_20px_rgba(59,130,246,0.15)] transition-all duration-300 hover:shadow-[0px_12px_24px_rgba(59,130,246,0.2)]"
              color="primary" 
              onPress={handleSave}
              isLoading={isLoading}
              disabled={selectedGroups.size === 0}
              startContent={!isLoading ? <Icon icon="solar:check-linear" className="h-5 w-5" /> : null}
            >
              {t('common.save')} ({selectedGroups.size})
            </Button>
          </div>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default AddToGroupModal;