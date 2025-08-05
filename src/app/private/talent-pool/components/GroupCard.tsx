'use client';

import React from 'react';

import {
  Avatar,
  Button,
  Card,
  CardBody,
  CardHeader,
  Chip,
  Divider
} from '@heroui/react';
import { Icon } from '@iconify/react';
import { motion } from 'framer-motion';

import { type TeamCardProps } from '../types';

const GroupCard: React.FC<TeamCardProps> = ({
  group,
  onViewTeam,
  onJoinTeam
}) => {
  const {
    id,
    groupName,
    color,
    members,
    tools,
    owner,
    connections
  } = group;

  const displayTools = tools.slice(0, 4);
  const hasMoreTools = tools.length > 4;
  const connectionsCount = connections?.length || 0;

  return (
    <motion.div
      whileHover={{ y: -6, scale: 1.02 }}
      transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="h-full w-full"
    >
      <Card className="w-full max-w-[600px] h-full shadow-lg hover:shadow-2xl transition-all duration-300 border-0 bg-gradient-to-br from-white via-gray-50/50 to-white overflow-hidden relative">
        <div className="absolute top-0 right-0 w-32 h-32 bg-primary-100/30 rounded-full filter blur-2xl transform translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-blue-100/30 rounded-full filter blur-2xl transform -translate-x-1/2 translate-y-1/2"></div>
        <CardHeader className="relative flex flex-col items-start gap-4 pb-6 pt-6 px-6">
          <div className="flex w-full items-center justify-between">
            <div className="relative">
              <div 
                className="flex h-20 w-20 items-center justify-center rounded-full text-white font-bold text-xl shadow-lg ring-4 ring-primary-100 ring-offset-2"
                style={{ 
                  backgroundColor: color || '#6366f1'
                }}
              >
                {groupName.charAt(0).toUpperCase()}
              </div>
              <div className="absolute -bottom-2 -right-2 bg-primary-500 rounded-full px-2 py-1 border-2 border-white">
                <div className="flex items-center gap-1">
                  <Icon icon="solar:users-group-rounded-bold" className="w-3 h-3 text-white" />
                  <span className="text-xs font-bold text-white">{members}</span>
                </div>
              </div>
            </div>
            
            <div className="flex gap-2">
              <Button
                className="bg-primary-500 text-white hover:bg-primary-600 shadow-lg hover:shadow-xl"
                radius="full"
                size="sm"
                startContent={<Icon icon="solar:login-bold" className="w-4 h-4" />}
                onPress={() => onJoinTeam?.(id)}
              >
                Join Team
              </Button>
              
              <Button
                className="border-primary-200 text-primary-600 hover:bg-primary-50"
                radius="full"
                size="sm"
                variant="bordered"
                isIconOnly
                onPress={() => onViewTeam?.(id)}
              >
                <Icon icon="solar:eye-bold" className="w-4 h-4" />
              </Button>
            </div>
          </div>
          
          <div className="flex flex-col gap-2 w-full">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900">
                {groupName}
              </h2>
              <div className="flex items-center gap-1 bg-gray-100 px-2 py-1 rounded-full">
                <Icon icon="solar:users-group-rounded-linear" className="w-3 h-3 text-gray-600" />
                <span className="text-xs font-medium text-gray-600">
                  {members} member{members !== 1 ? 's' : ''}
                </span>
              </div>
            </div>
            
            <p className="text-small text-default-500 font-medium">
              Team • {connectionsCount > 0 ? `${connectionsCount} connections` : 'No connections yet'}
            </p>
          </div>
        </CardHeader>

        <CardBody className="gap-4 pt-0 px-6 pb-6 relative z-10">
          {/* Team Owner Section */}
          <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4 shadow-sm border border-gray-100">
            <h3 className="text-medium font-semibold mb-3 flex items-center gap-2">
              <Icon icon="solar:crown-linear" className="w-4 h-4 text-primary" />
              Team Owner
            </h3>
            <div className="flex items-center gap-3">
              <Avatar
                src={owner.profileImage ? `https://app.extraexpertise.be/api/upload/${owner.profileImage}` : undefined}
                className="h-12 w-12 ring-4 ring-primary-100 ring-offset-2"
                name={`${owner.firstName} ${owner.lastName}`}
              />
              <div className="flex flex-col">
                <p className="text-medium font-bold text-gray-900">
                  {owner.firstName} {owner.lastName}
                </p>
                <p className="text-small text-default-500">
                  {owner.profession || 'Team Lead'}
                </p>
              </div>
            </div>
          </div>

          {/* Tools Section */}
          {displayTools.length > 0 && (
            <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4 shadow-sm border border-gray-100">
              <h3 className="text-medium font-semibold mb-3 flex items-center gap-2">
                <Icon icon="solar:document-text-linear" className="w-4 h-4 text-primary" />
                Tools & Technologies
              </h3>
              <div className="flex flex-wrap gap-2">
                {displayTools.map((tool, index) => (
                  <Chip
                    key={`${tool.name}-${index}`}
                    variant="flat"
                    size="sm"
                    className="hover:scale-105 transition-transform cursor-pointer"
                    color="primary"
                  >
                    {tool.name}
                  </Chip>
                ))}
                {hasMoreTools && (
                  <Chip variant="bordered" size="sm" className="border-dashed">
                    +{tools.length - 4} more
                  </Chip>
                )}
              </div>
            </div>
          )}

          <Divider className="my-2" />

          {/* Stats Section */}
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <div className="flex items-center justify-center mb-1">
                <Icon icon="solar:users-group-rounded-linear" className="w-4 h-4 text-primary" />
              </div>
              <p className="text-small font-bold text-default-700">{members}</p>
              <p className="text-tiny text-default-400">Members</p>
            </div>
            
            <div className="text-center">
              <div className="flex items-center justify-center mb-1">
                <Icon icon="solar:document-text-linear" className="w-4 h-4 text-primary" />
              </div>
              <p className="text-small font-bold text-default-700">{tools.length}</p>
              <p className="text-tiny text-default-400">Tools</p>
            </div>
            
            <div className="text-center">
              <div className="flex items-center justify-center mb-1">
                <Icon icon="solar:link-linear" className="w-4 h-4 text-primary" />
              </div>
              <p className="text-small font-bold text-default-700">{connectionsCount}</p>
              <p className="text-tiny text-default-400">Connections</p>
            </div>
          </div>

          {/* Join Action Section */}
          <div className="bg-gradient-to-r from-primary-50 to-secondary-50 rounded-xl p-4 border border-primary-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Icon icon="solar:users-group-rounded-linear" className="w-4 h-4 text-primary" />
                <span className="text-medium font-bold text-primary">Join Team</span>
              </div>
              <div className="text-right">
                <p className="text-small text-primary">
                  Collaborate & grow together
                </p>
              </div>
            </div>
          </div>
        </CardBody>
      </Card>
    </motion.div>
  );
};

export default GroupCard;