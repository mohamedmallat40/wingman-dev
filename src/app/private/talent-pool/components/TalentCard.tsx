'use client';

import React from 'react';

import {
  Avatar,
  Button,
  Card,
  CardBody,
  CardHeader,
  Chip,
  Divider,
  Progress,
  Tooltip
} from '@heroui/react';
import { Icon } from '@iconify/react';
import { motion } from 'framer-motion';

import { type TalentCardProps } from '../types';

const getAvailabilityConfig = (status: string) => {
  switch (status) {
    case 'OPEN_FOR_PROJECT':
      return { color: 'success' as const, label: 'Available for Projects', icon: 'solar:check-circle-bold' };
    case 'OPEN_FOR_PART_TIME':
      return { color: 'warning' as const, label: 'Part-time Available', icon: 'solar:clock-circle-bold' };
    case 'BUSY':
      return { color: 'danger' as const, label: 'Busy', icon: 'solar:close-circle-bold' };
    default:
      return { color: 'success' as const, label: 'Available', icon: 'solar:check-circle-bold' };
  }
};

const getWorkTypeConfig = (workType: string) => {
  switch (workType) {
    case 'REMOTE':
      return { 
        icon: 'solar:home-wifi-linear', 
        color: 'success' as const,
        label: 'remote'
      };
    case 'ON_LOCATION':
      return { 
        icon: 'solar:buildings-linear', 
        color: 'warning' as const,
        label: 'on location'
      };
    case 'HYBRID':
      return { 
        icon: 'solar:laptop-linear', 
        color: 'secondary' as const,
        label: 'hybrid'
      };
    default:
      return { 
        icon: 'solar:case-linear', 
        color: 'default' as const,
        label: workType?.toLowerCase() || 'unknown'
      };
  }
};

const formatRate = (amount: number, currency: string, paymentType: string): string => {
  const currencySymbol = currency === 'EUR' ? '€' : '$';
  const period = paymentType === 'HOURLY_BASED' ? '/hour' : '/day';
  const rateAmount = amount || 0;
  return `${currencySymbol}${rateAmount}${period}`;
};

const getCountryFlag = (region: string | null): string => {
  if (!region) return '🌍';
  const flags: Record<string, string> = {
    BE: '🇧🇪', NL: '🇳🇱', FR: '🇫🇷', DE: '🇩🇪', US: '🇺🇸', 
    UK: '🇬🇧', CA: '🇨🇦', AU: '🇦🇺', CH: '🇨🇭', AT: '🇦🇹'
  };
  return flags[region] || '🌍';
};

const mapUserType = (userType: string): string => {
  const typeMap: Record<string, string> = {
    'FULL_TIME_FREELANCER': 'Freelancer',
    'STUDENT': 'Freelancer',
    'FREELANCER': 'Freelancer',
    'AGENCY': 'Agency'
  };
  return typeMap[userType] || userType.toLowerCase().replace(/_/g, ' ');
};

const TalentCard: React.FC<TalentCardProps> = ({
  user,
  onViewProfile,
  onConnect
}) => {
  const {
    id,
    firstName,
    lastName,
    profileImage,
    profession,
    region,
    city,
    skills,
    statusAviability,
    isConnected,
    aboutMe,
    experienceYears,
    workType,
    workingTime,
    amount,
    currency,
    paymentType,
    reviewCount,
    averageRating
  } = user;

  const availabilityConfig = getAvailabilityConfig(statusAviability);
  const displaySkills = skills.slice(0, 4);
  const hasMoreSkills = skills.length > 4;
  const rate = formatRate(amount || 0, currency || 'EUR', paymentType || 'DAILY_BASED');
  const hasReviews = reviewCount && parseInt(reviewCount) > 0;

  return (
    <motion.div
      whileHover={{ y: -4, scale: 1.01 }}
      transition={{ duration: 0.2, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="h-full w-full"
    >
      <Card className="w-full h-full shadow-soft hover:shadow-medium transition-all duration-300 border border-default-200 bg-gradient-to-br from-background via-background/95 to-background overflow-hidden relative group">
        <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-full filter blur-xl transform translate-x-1/2 -translate-y-1/2 group-hover:bg-primary/10 transition-colors duration-300"></div>
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-secondary/5 rounded-full filter blur-xl transform -translate-x-1/2 translate-y-1/2 group-hover:bg-secondary/10 transition-colors duration-300"></div>
        
        <CardHeader className="relative pb-0">
          <div className="flex w-full items-start gap-4">
            <div className="relative">
              {profileImage && profileImage.trim() ? (
                <div className="h-20 w-20 rounded-full ring-2 ring-primary/10 shadow-medium overflow-hidden bg-gradient-to-br from-primary-200 to-secondary-200">
                  <img
                    src={`https://app.extraexpertise.be/api/upload/${profileImage}`}
                    alt={`${firstName} ${lastName}`}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                      e.currentTarget.parentElement.innerHTML = `<div class="w-full h-full flex items-center justify-center text-xl font-bold text-primary-800">${firstName?.charAt(0)?.toUpperCase() || ''}${lastName?.charAt(0)?.toUpperCase() || ''}</div>`;
                    }}
                  />
                </div>
              ) : (
                <div className="h-20 w-20 rounded-full flex items-center justify-center text-xl font-bold ring-2 ring-primary/10 shadow-medium bg-gradient-to-br from-primary-200 to-secondary-200 text-primary-800">
                  {firstName?.charAt(0)?.toUpperCase()}{lastName?.charAt(0)?.toUpperCase()}
                </div>
              )}
              <div className="absolute -bottom-1 -right-1">
                <div className={`w-6 h-6 rounded-full border-2 border-background shadow-medium flex items-center justify-center ${
                  availabilityConfig.color === 'success' ? 'bg-success' : 
                  availabilityConfig.color === 'warning' ? 'bg-warning' : 
                  availabilityConfig.color === 'danger' ? 'bg-danger' : 'bg-success'
                }`}>
                  <Icon icon={availabilityConfig.icon} className="w-3 h-3 text-white" />
                </div>
              </div>
            </div>
            
            <div className="flex flex-col gap-1 flex-grow min-w-0">
              <div className="flex items-start justify-between">
                <div className="flex-grow min-w-0">
                  <h2 className="text-xl font-bold text-foreground tracking-tight truncate">
                    {firstName} {lastName}
                  </h2>
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="text-medium text-foreground-600 font-medium truncate">
                      {profession && !['FULL_TIME_FREELANCER', 'STUDENT', 'FREELANCER', 'AGENCY'].includes(profession) 
                        ? profession 
                        : mapUserType(profession || user.kind || 'FREELANCER')}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center gap-1 ml-2">
                  <Tooltip content="View Profile" placement="bottom">
                    <Button
                      isIconOnly
                      variant="light"
                      size="sm"
                      className="hover:scale-105 transition-transform text-foreground-500 hover:text-foreground"
                      onPress={() => onViewProfile?.(id)}
                    >
                      <Icon icon="solar:eye-linear" className="w-4 h-4" />
                    </Button>
                  </Tooltip>
                  
                  <Tooltip content="More options" placement="bottom">
                    <Button
                      isIconOnly
                      variant="light"
                      size="sm"
                      className="text-foreground-400 hover:text-foreground"
                    >
                      <Icon icon="solar:menu-dots-linear" className="w-4 h-4" />
                    </Button>
                  </Tooltip>
                </div>
              </div>
              
              <div className="flex flex-col gap-1 mt-1">
                {region && (
                  <div className="flex items-center gap-1.5">
                    <Icon icon="solar:map-point-linear" className="w-3.5 h-3.5 text-foreground-400" />
                    <span className="text-small text-foreground-500 font-medium">
                      {city}, {region} {getCountryFlag(region)}
                    </span>
                  </div>
                )}
                
              </div>
              
              <div className="flex items-center justify-between mt-2">
                <div className="flex items-center gap-2 flex-wrap">
                  {workType && (
                    <Chip
                      startContent={<Icon icon={getWorkTypeConfig(workType).icon} className="w-3 h-3" />}
                      variant="flat"
                      color={getWorkTypeConfig(workType).color}
                      size="sm"
                      className="text-tiny font-medium"
                    >
                      {getWorkTypeConfig(workType).label}
                    </Chip>
                  )}
                  {workingTime && (
                    <Chip
                      startContent={<Icon icon="solar:clock-circle-linear" className="w-3 h-3" />}
                      variant="flat"
                      color="primary"
                      size="sm"
                      className="text-tiny font-bold"
                    >
                      {workingTime.replace('_', ' ').toLowerCase()}
                    </Chip>
                  )}
                </div>
              </div>
            </div>
          </div>
        </CardHeader>

        <CardBody className="gap-4 pt-2 px-6 pb-6 relative z-10">
          {/* About Section */}
          {aboutMe && (
            <div className="bg-background/80 backdrop-blur-sm rounded-large p-4 shadow-small border border-default-200/50">
              <h3 className="text-medium font-semibold mb-2 text-foreground flex items-center gap-2">
                <Icon icon="solar:user-speak-linear" className="w-4 h-4 text-primary" />
                About
              </h3>
              <p className="text-small text-foreground-700 leading-relaxed line-clamp-5">
                {aboutMe.replace(/<[^>]*>/g, '')}
              </p>
            </div>
          )}

          {/* Skills Section */}
          <div className="bg-background/80 backdrop-blur-sm rounded-large p-4 shadow-small border border-default-200/50">
            <h3 className="text-medium font-semibold mb-3 text-foreground flex items-center gap-2">
              <Icon icon="solar:verified-check-linear" className="w-4 h-4 text-primary" />
              Top Skills
            </h3>
            {displaySkills.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {displaySkills.map((skill, index) => (
                  <Chip
                    key={`${skill.key}-${index}`}
                    size="sm"
                    color={skill.type === 'SOFT' ? 'secondary' : 'primary'}
                    variant={skill.type === 'SOFT' ? 'flat' : 'flat'}
                    className="hover:scale-105 transition-transform cursor-pointer font-medium max-w-full"
                  >
                    <span className="truncate max-w-[120px] block">
                      {skill.key.length > 70 ? `${skill.key.substring(0, 70)}...` : skill.key}
                    </span>
                  </Chip>
                ))}
                {hasMoreSkills && (
                  <Chip variant="bordered" size="sm" className="border-dashed text-foreground-500 font-medium">
                    +{skills.length - 4} more
                  </Chip>
                )}
              </div>
            ) : (
              <div className="text-center py-4">
                <p className="text-small text-foreground-500">No skills listed</p>
              </div>
            )}
          </div>

          {/* Stats Section */}
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-background/80 backdrop-blur-sm rounded-large p-3 shadow-small border border-default-200/50 text-center">
              <div className="flex justify-center mb-2">
                <div className="p-2 rounded-full bg-primary/10">
                  <Icon icon="solar:calendar-linear" className="w-4 h-4 text-primary" />
                </div>
              </div>
              <p className="text-tiny font-medium text-foreground-500">Experience</p>
              <p className="text-small font-bold text-foreground">{experienceYears || 0} years</p>
            </div>
            
            <div className="bg-background/80 backdrop-blur-sm rounded-large p-3 shadow-small border border-default-200/50 text-center">
              <div className="flex justify-center mb-2">
                <div className="p-2 rounded-full bg-success/10">
                  <Icon icon="solar:dollar-minimalistic-linear" className="w-4 h-4 text-success" />
                </div>
              </div>
              <p className="text-tiny font-medium text-foreground-500">Rate</p>
              <p className="text-small font-bold text-foreground">{rate}</p>
            </div>
            
            <div className="bg-background/80 backdrop-blur-sm rounded-large p-3 shadow-small border border-default-200/50 text-center">
              <div className="flex justify-center mb-2">
                <div className="p-2 rounded-full bg-secondary/10">
                  <Icon icon="solar:verified-check-linear" className="w-4 h-4 text-secondary" />
                </div>
              </div>
              <p className="text-tiny font-medium text-foreground-500">Skills</p>
              <p className="text-small font-bold text-foreground">{skills?.length || 0} skills</p>
            </div>
          </div>

        </CardBody>
      </Card>
    </motion.div>
  );
};

export default TalentCard;