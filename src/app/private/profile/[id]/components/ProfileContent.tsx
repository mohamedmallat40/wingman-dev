'use client';

import React, { useState } from 'react';

import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Chip,
  Divider,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Select,
  SelectItem,
  Textarea
} from '@heroui/react';
import { Icon } from '@iconify/react';
import { useTranslations } from 'next-intl';

import { getSkillIcon } from '@/app/private/talent-pool/utils/skill-icons';
import {
  getUserInitials,
  mapUserType,
  stripHtml,
  truncateText
} from '@/app/private/talent-pool/utils/talent-utils';
import { getImageUrl } from '@/lib/utils/utilities';

import {
  type Education,
  type Experience,
  type Language,
  type ProfileUser,
  type SocialAccount,
  type UserNote
} from '../types';
import { CertificationsForm } from './forms/CertificationsForm';
import { EducationForm } from './forms/EducationForm';
import { ExperienceForm } from './forms/ExperienceForm';
import { EnhancedLanguagesForm } from './forms/EnhancedLanguagesForm';
import { ActionButtons } from './ActionButtons';
import { SocialAccountCard } from './cards/SocialAccountCard';
import { LanguagesSection } from './sections/LanguagesSection';
import { EducationSection } from './sections/EducationSection';
import { PersonalInfoForm } from './forms/PersonalInfoForm';
import { SkillsForm } from './forms/SkillsForm';
import { SocialAccountsForm } from './forms/SocialAccountsForm';

interface ProfileContentProps {
  user: ProfileUser;
  experiences: Experience[];
  languages: Language[];
  education: Education[];
  notes: UserNote[];
  isOwnProfile: boolean;
}

const ProfileContent: React.FC<ProfileContentProps> = ({
  user,
  experiences,
  languages,
  education,
  notes,
  isOwnProfile
}) => {
  const t = useTranslations();

  // Modal states for all forms
  const [isPersonalInfoModalOpen, setIsPersonalInfoModalOpen] = useState(false);
  const [isExperienceModalOpen, setIsExperienceModalOpen] = useState(false);
  const [isEducationModalOpen, setIsEducationModalOpen] = useState(false);
  const [isSkillsModalOpen, setIsSkillsModalOpen] = useState(false);
  const [isLanguagesModalOpen, setIsLanguagesModalOpen] = useState(false);
  const [isCertificationsModalOpen, setIsCertificationsModalOpen] = useState(false);
  const [isSocialAccountsModalOpen, setIsSocialAccountsModalOpen] = useState(false);

  // Individual item modals
  const [editingExperience, setEditingExperience] = useState<{item: Experience | null, isOpen: boolean}>({item: null, isOpen: false});
  const [editingEducation, setEditingEducation] = useState<{item: Education | null, isOpen: boolean}>({item: null, isOpen: false});
  const [editingLanguage, setEditingLanguage] = useState<{item: Language | null, isOpen: boolean}>({item: null, isOpen: false});

  // Local state for forms
  const [localUser, setLocalUser] = useState(user);
  const [localExperiences, setLocalExperiences] = useState<Experience[]>(experiences);
  const [localEducation, setLocalEducation] = useState<Education[]>(education);
  const [localLanguages, setLocalLanguages] = useState<Language[]>(languages);
  const [localSkills, setLocalSkills] = useState(user.skills || []);
  const [localCertifications, setLocalCertifications] = useState([]);
  const [localSocialAccounts, setLocalSocialAccounts] = useState<SocialAccount[]>(user.socialAccounts || []);

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'short'
      });
    } catch {
      return dateString;
    }
  };

  const fullName = `${user.firstName} ${user.lastName}`;

  // Personal Info handlers
  const handleEditAbout = () => {
    setIsPersonalInfoModalOpen(true);
  };

  const handlePersonalInfoChange = (field: string, value: string) => {
    setLocalUser((prev) => ({ ...prev, [field]: value }));
  };

  const handleSavePersonalInfo = () => {
    setIsPersonalInfoModalOpen(false);
  };

  // Skills handlers
  const handleEditSkills = () => {
    // Ensure we start with current skills
    setLocalSkills(user.skills || []);
    setIsSkillsModalOpen(true);
  };

  const handleAddSkill = () => {
    const newSkill = {
      id: `temp-${Date.now()}`,
      name: '',
      level: 'Beginner'
    };
    setLocalSkills((prev) => [...prev, newSkill]);
  };

  const handleRemoveSkill = (index: number) => {
    setLocalSkills((prev) => prev.filter((_, i) => i !== index));
  };

  const handleUpdateSkill = (index: number, data: any) => {
    setLocalSkills((prev) => prev.map((skill, i) => (i === index ? data : skill)));
  };

  const handleSaveSkills = () => {
    setIsSkillsModalOpen(false);
  };

  // Languages handlers
  const handleEditLanguages = (language?: Language) => {
    if (language) {
      // Edit specific language item
      setEditingLanguage({item: language, isOpen: true});
    } else {
      // Add new language directly
      const newLanguage: Language = {
        id: `temp-${Date.now()}`,
        name: '',
        nativeName: '',
        code: '',
        key: '',
        level: 'BEGINNER',
        isNative: false,
        canRead: true,
        canWrite: true,
        canSpeak: true,
        canUnderstand: true,
        yearsOfExperience: 0
      };
      setEditingLanguage({item: newLanguage, isOpen: true});
    }
  };

  const handleAddLanguage = () => {
    const newLanguage: Language = {
      id: `temp-${Date.now()}`,
      name: '',
      nativeName: '',
      code: '',
      key: '', // For backwards compatibility
      level: 'BEGINNER',
      isNative: false,
      canRead: true,
      canWrite: true,
      canSpeak: true,
      canUnderstand: true,
      yearsOfExperience: 0
    };
    setLocalLanguages((prev) => [...prev, newLanguage]);
  };

  const handleRemoveLanguage = (index: number) => {
    setLocalLanguages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleUpdateLanguage = (index: number, data: Language) => {
    setLocalLanguages((prev) => prev.map((lang, i) => (i === index ? data : lang)));
  };

  const handleSaveLanguages = () => {
    setIsLanguagesModalOpen(false);
  };

  const handleSaveIndividualLanguage = (updatedLanguage: Language) => {
    // Here you would save to your backend
    setEditingLanguage({item: null, isOpen: false});
  };

  // Certifications handlers
  const handleEditCertifications = () => {
    setIsCertificationsModalOpen(true);
  };

  const handleAddCertification = () => {
    const newCertification = {
      id: `temp-${Date.now()}`,
      name: '',
      issuer: '',
      issueDate: '',
      expiryDate: '',
      credentialId: ''
    };
    setLocalCertifications((prev) => [...prev, newCertification]);
  };

  const handleRemoveCertification = (index: number) => {
    setLocalCertifications((prev) => prev.filter((_, i) => i !== index));
  };

  const handleUpdateCertification = (index: number, data: any) => {
    setLocalCertifications((prev) => prev.map((cert, i) => (i === index ? data : cert)));
  };

  const handleSaveCertifications = () => {
    setIsCertificationsModalOpen(false);
  };

  // Social Accounts handlers
  const handleEditSocialAccounts = () => {
    // Ensure we start with current social accounts
    setLocalSocialAccounts(user.socialAccounts || []);
    setIsSocialAccountsModalOpen(true);
  };

  const handleAddSocialAccount = () => {
    const newSocialAccount: SocialAccount = {
      id: `temp-${Date.now()}`,
      platform: 'linkedin',
      username: '',
      url: '',
      isPublic: true,
      displayName: ''
    };
    setLocalSocialAccounts((prev) => [...prev, newSocialAccount]);
  };

  const handleRemoveSocialAccount = (index: number) => {
    setLocalSocialAccounts((prev) => prev.filter((_, i) => i !== index));
  };

  const handleUpdateSocialAccount = (index: number, data: SocialAccount) => {
    setLocalSocialAccounts((prev) => prev.map((account, i) => (i === index ? data : account)));
  };

  const handleSaveSocialAccounts = () => {
    setIsSocialAccountsModalOpen(false);
  };

  const handleEditSocialAccount = (account: SocialAccount) => {
    // Find and edit specific social account
    // Here you would open the edit form for the specific account
    setIsSocialAccountsModalOpen(true);
  };

  const handleDeleteSocialAccount = (accountId: string) => {
    const confirmed = confirm('Are you sure you want to delete this social account?');
    if (confirmed) {
      setLocalSocialAccounts(prev => prev.filter(account => account.id !== accountId));
    }
  };

  // Experience handlers
  const handleAddExperience = () => {
    // Create and add new empty experience
    const newExperience: Experience = {
      id: `temp-${Date.now()}`,
      position: '',
      company: '',
      location: '',
      startDate: '',
      endDate: '',
      description: '',
      skills: []
    };
    setEditingExperience({item: newExperience, isOpen: true});
  };

  const handleEditExperience = (experience?: Experience) => {
    if (experience) {
      // Edit specific experience item
      setEditingExperience({item: experience, isOpen: true});
    } else {
      // Edit all experiences
      setIsExperienceModalOpen(true);
    }
  };

  const handleAddExperienceItem = () => {
    const newExperience: Experience = {
      id: `temp-${Date.now()}`,
      position: '',
      company: '',
      location: '',
      startDate: '',
      endDate: '',
      description: '',
      skills: []
    };
    setLocalExperiences((prev) => [...prev, newExperience]);
  };

  const handleRemoveExperience = (index: number) => {
    setLocalExperiences((prev) => prev.filter((_, i) => i !== index));
  };

  const handleUpdateExperience = (index: number, data: Experience) => {
    setLocalExperiences((prev) => prev.map((exp, i) => (i === index ? data : exp)));
  };

  const handleSaveExperiences = () => {
    // Here you would save to your backend
    setIsExperienceModalOpen(false);
  };

  const handleSaveIndividualExperience = (updatedExperience: Experience) => {
    // Here you would save to your backend
    setEditingExperience({item: null, isOpen: false});
  };

  const handleSaveIndividualEducation = (updatedEducation: Education) => {
    // Here you would save to your backend
    setEditingEducation({item: null, isOpen: false});
  };

  // Education handlers
  const handleAddEducation = () => {
    // Create and add new empty education
    const newEducation: Education = {
      id: `temp-${Date.now()}`,
      degree: '',
      university: '',
      field: '',
      startDate: '',
      endDate: '',
      description: '',
      grade: ''
    };
    setEditingEducation({item: newEducation, isOpen: true});
  };

  const handleEditEducation = (education?: Education) => {
    if (education) {
      // Edit specific education item
      setEditingEducation({item: education, isOpen: true});
    } else {
      // Edit all education
      setIsEducationModalOpen(true);
    }
  };

  const handleAddEducationItem = () => {
    const newEducation: Education = {
      id: `temp-${Date.now()}`,
      degree: '',
      university: '',
      field: '',
      startDate: '',
      endDate: '',
      description: '',
      grade: ''
    };
    setLocalEducation((prev) => [...prev, newEducation]);
  };

  const handleRemoveEducation = (index: number) => {
    setLocalEducation((prev) => prev.filter((_, i) => i !== index));
  };

  const handleUpdateEducation = (index: number, data: Education) => {
    setLocalEducation((prev) => prev.map((edu, i) => (i === index ? data : edu)));
  };

  const handleSaveEducation = () => {
    // Here you would save to your backend
    setIsEducationModalOpen(false);
  };


  return (
    <section className='container mx-auto px-6 pb-20 transition-all duration-300'>
      <div className='grid grid-cols-1 gap-8 lg:grid-cols-3'>
        {/* Main content */}
        <div className='space-y-8 lg:col-span-2 animate-slide-up'>
          {/* About */}
          <Card id='about' className='border-default-200/50 scroll-mt-24 shadow-sm hover:shadow-md transition-all duration-300 hover:border-primary/20'>
            <CardHeader className='pb-4 hover:pb-5 transition-all duration-200'>
              <div className='flex w-full items-center justify-between'>
                <div className='flex items-center gap-4'>
                  <div className='bg-primary/10 rounded-full p-3 hover:bg-primary/15 transition-colors duration-200 hover:scale-105 transform'>
                    <Icon icon='solar:user-speak-linear' className='text-primary h-5 w-5' />
                  </div>
                  <div>
                    <h2 className='text-foreground text-xl font-semibold hover:text-primary transition-colors duration-200'>
                      {t('talentPool.profile.sections.about')}
                    </h2>
                    <p className='text-small text-foreground-500 mt-1 hover:text-foreground-600 transition-colors duration-200'>
                      {t('talentPool.profile.aboutDescription')}
                    </p>
                  </div>
                </div>

                {isOwnProfile && (
                  <ActionButtons
                    showEdit
                    onEdit={handleEditAbout}
                    editTooltip="Edit about me"
                    size="md"
                  />
                )}
              </div>
            </CardHeader>
            <CardBody className='px-8 pt-2'>
              {user.aboutMe ? (
                <div
                  className='prose prose-slate dark:prose-invert text-foreground-700 max-w-none leading-relaxed'
                  dangerouslySetInnerHTML={{ __html: stripHtml(user.aboutMe) }}
                />
              ) : (
                <div className='flex items-center justify-center py-12 text-center'>
                  <div className='animate-fade-in'>
                    <Icon
                      icon='solar:document-text-linear'
                      className='text-default-300 mx-auto mb-4 h-12 w-12 hover:text-primary transition-colors duration-300 hover:scale-110 transform'
                    />
                    <p className='text-foreground-500 mb-4'>
                      {t('talentPool.cards.noAboutAvailable')}
                    </p>
                    {isOwnProfile && (
                      <Button
                        color='primary'
                        variant='flat'
                        size='sm'
                        startContent={<Icon icon='solar:pen-linear' className='h-4 w-4' />}
                        onPress={handleEditAbout}
                      >
                        <span className='hidden sm:inline'>Add About Me</span>
                        <span className='sm:hidden'>Add</span>
                      </Button>
                    )}
                  </div>
                </div>
              )}
            </CardBody>
          </Card>


          {/* Experience */}
          <Card id='experience' className='border-default-200/50 scroll-mt-24 shadow-sm hover:shadow-md transition-all duration-300 hover:border-primary/20'>
            <CardHeader className='pb-4'>
              <div className='flex w-full items-center justify-between'>
                <div className='flex items-center gap-4'>
                  <div className='bg-primary/10 rounded-full p-3'>
                    <Icon icon='solar:case-linear' className='text-primary h-5 w-5' />
                  </div>
                  <div>
                    <h2 className='text-foreground text-xl font-semibold'>
                      {t('talentPool.profile.sections.experience')}
                    </h2>
                    <p className='text-small text-foreground-500 mt-1'>
                      {t('talentPool.profile.experienceDescription')}
                    </p>
                  </div>
                </div>

                {isOwnProfile && (
                  <ActionButtons
                    showAdd
                    onAdd={handleAddExperience}
                    addTooltip="Add new experience"
                    size="md"
                  />
                )}
              </div>
            </CardHeader>
            <CardBody className='px-8 pt-2'>
              {experiences.length > 0 ? (
                <div className='space-y-8'>
                  {[...experiences]
                    .sort(
                      (a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime()
                    )
                    .map((exp, index) => (
                      <div key={exp.id || index} className='relative'>
                        {index < experiences.length - 1 && (
                          <div className='from-primary/20 absolute top-14 bottom-0 left-6 w-px bg-gradient-to-b to-transparent' />
                        )}

                        <div className='flex gap-6'>
                          <div className='flex-shrink-0'>
                            <Icon
                              icon='solar:calendar-minimalistic-linear'
                              className='text-primary mt-2 h-5 w-5'
                            />
                          </div>

                          <div className='flex-1 space-y-4'>
                            <div className='flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between'>
                              <div className='space-y-2'>
                                <div className='flex items-center gap-2'>
                                  <h3 className='text-foreground text-lg font-bold'>
                                    {exp.position}
                                  </h3>
                                  {isOwnProfile && (
                                  <ActionButtons
                                    showEdit
                                    showDelete
                                    onEdit={() => handleEditExperience(exp)}
                                    onDelete={() => {
                                      const confirmed = confirm(`Are you sure you want to delete the experience at ${exp.company}?`);
                                      if (confirmed) {
                                        const index = experiences.findIndex(e => e.id === exp.id);
                                        if (index !== -1) {
                                          handleRemoveExperience(index);
                                        }
                                      }
                                    }}
                                    editTooltip={`Edit ${exp.position} at ${exp.company}`}
                                    deleteTooltip={`Delete ${exp.position} experience`}
                                  />
                                )}
                                </div>
                                <p className='text-foreground-700 font-medium'>{exp.company}</p>
                                {exp.location && (
                                  <p className='text-small text-foreground-500 flex items-center gap-1.5'>
                                    <Icon icon='solar:map-point-linear' className='h-3 w-3' />
                                    {exp.location}
                                  </p>
                                )}
                              </div>
                              <div className='text-small text-foreground-500 bg-default-100 flex items-center gap-2 rounded-full px-3 py-2'>
                                <Icon icon='solar:calendar-linear' className='h-4 w-4' />
                                <span>
                                  {formatDate(exp.startDate)} —{' '}
                                  {exp.endDate
                                    ? formatDate(exp.endDate)
                                    : t('talentPool.profile.present')}
                                </span>
                              </div>
                            </div>

                            {exp.description && (
                              <p className='text-foreground-600 leading-relaxed'>
                                {exp.description}
                              </p>
                            )}

                            {exp.skills && exp.skills.length > 0 && (
                              <div className='mt-4 flex flex-wrap gap-2'>
                                {exp.skills.map((skill, skillIndex) => (
                                  <Chip
                                    key={skillIndex}
                                    size='sm'
                                    variant='flat'
                                    color='primary'
                                    className='text-tiny font-medium'
                                  >
                                    {skill}
                                  </Chip>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              ) : (
                <div className='flex items-center justify-center py-12 text-center'>
                  <div>
                    <Icon
                      icon='solar:case-linear'
                      className='text-default-300 mx-auto mb-4 h-12 w-12'
                    />
                    <p className='text-foreground-500 mb-4'>
                      {t('talentPool.profile.noExperience')}
                    </p>
                    {isOwnProfile && (
                      <Button
                        color='primary'
                        variant='flat'
                        size='sm'
                        startContent={<Icon icon='solar:plus-linear' className='h-4 w-4' />}
                        onPress={handleAddExperience}
                      >
                        Add Experience
                      </Button>
                    )}
                  </div>
                </div>
              )}
            </CardBody>
          </Card>

          {/* Education */}
          <EducationSection
            education={education}
            isOwnProfile={isOwnProfile}
            onAdd={handleAddEducation}
            onEdit={(edu) => handleEditEducation(edu)}
            onDelete={(edu) => {
              const confirmed = confirm(`Are you sure you want to delete the education from ${edu.university}?`);
              if (confirmed) {
                const index = education.findIndex(e => e.id === edu.id);
                if (index !== -1) {
                  handleRemoveEducation(index);
                }
              }
            }}
          />
        </div>

        {/* Sidebar */}
        <div className='space-y-8 animate-slide-up [animation-delay:200ms]'>
          {/* Skills */}
          <Card id='skills' className='border-default-200/50 scroll-mt-24 shadow-sm hover:shadow-md transition-all duration-300 hover:border-success/20'>
            <CardHeader className='pb-4'>
              <div className='flex w-full items-center justify-between'>
                <div className='flex items-center gap-4'>
                  <div className='bg-success/10 rounded-full p-3'>
                    <Icon icon='solar:verified-check-linear' className='text-success h-5 w-5' />
                  </div>
                  <div>
                    <h3 className='text-foreground text-lg font-semibold'>
                      {t('talentPool.profile.sections.skills')}
                    </h3>
                    <p className='text-small text-foreground-500 mt-1'>
                      {t('talentPool.profile.skillsDescription')}
                    </p>
                  </div>
                </div>

                {isOwnProfile && (
                  <ActionButtons
                    showAdd
                    onAdd={handleEditSkills}
                    addTooltip="Add new skills"
                    size="md"
                  />
                )}
              </div>
            </CardHeader>
            <CardBody className='pt-2'>
              {user.skills && user.skills.length > 0 ? (
                <div className='flex flex-wrap gap-3'>
                  {user.skills.map((skill, index) => {
                    const colors = ['primary', 'secondary', 'success', 'warning'] as const;
                    const chipColor = colors[index % colors.length] as
                      | 'primary'
                      | 'secondary'
                      | 'success'
                      | 'warning';

                    return (
                      <Chip
                        key={`${skill.key}-${index}`}
                        size='sm'
                        color={chipColor}
                        variant='flat'
                        className='font-medium hover:scale-105 transform transition-all duration-200 cursor-default hover:shadow-md'
                        startContent={<Icon icon={getSkillIcon(skill.key)} className='h-3 w-3' />}
                      >
                        {skill.key.trim()}
                      </Chip>
                    );
                  })}
                </div>
              ) : (
                <div className='flex items-center justify-center py-12 text-center'>
                  <div>
                    <Icon
                      icon='solar:verified-check-linear'
                      className='text-default-300 mx-auto mb-4 h-12 w-12'
                    />
                    <p className='text-foreground-500 mb-4'>
                      {t('talentPool.cards.noSkillsListed')}
                    </p>
                    {isOwnProfile && (
                      <Button
                        color='primary'
                        variant='flat'
                        size='sm'
                        startContent={<Icon icon='solar:plus-linear' className='h-4 w-4' />}
                        onPress={handleEditSkills}
                      >
                        Add Skills
                      </Button>
                    )}
                  </div>
                </div>
              )}
            </CardBody>
          </Card>

          {/* Languages */}
          <LanguagesSection
            languages={languages}
            isOwnProfile={isOwnProfile}
            onAdd={() => handleEditLanguages()}
            onEdit={(lang) => handleEditLanguages(lang)}
            onDelete={(lang) => {
              const confirmed = confirm(`Are you sure you want to delete ${lang.name || lang.key} language?`);
              if (confirmed) {
                const index = languages.findIndex(l => l.id === lang.id);
                if (index !== -1) {
                  handleRemoveLanguage(index);
                }
              }
            }}
          />

          {/* Social Accounts */}
          <Card id='social-accounts' className='border-default-200/50 scroll-mt-24 shadow-sm hover:shadow-md transition-all duration-300 hover:border-purple/20'>
            <CardHeader className='pb-4'>
              <div className='flex w-full items-center justify-between'>
                <div className='flex items-center gap-4'>
                  <div className='bg-purple/10 rounded-full p-3'>
                    <Icon icon='solar:link-circle-linear' className='text-purple h-5 w-5' />
                  </div>
                  <div>
                    <h3 className='text-foreground text-lg font-semibold'>
                      Social Accounts
                    </h3>
                    <p className='text-small text-foreground-500 mt-1'>
                      Connect with me on social platforms
                    </p>
                  </div>
                </div>

                {isOwnProfile && (
                  <ActionButtons
                    showAdd
                    onAdd={handleEditSocialAccounts}
                    addTooltip="Add new social account"
                    size="md"
                  />
                )}
              </div>
            </CardHeader>
            <CardBody className='px-8 pt-2'>
              {localSocialAccounts.filter(account => account.isPublic).length > 0 ? (
                <div className='grid grid-cols-2 gap-3'>
                  {localSocialAccounts
                    .filter(account => account.isPublic)
                    .map((account, index) => (
                      <SocialAccountCard
                        key={account.id || index}
                        account={account}
                        isOwnProfile={isOwnProfile}
                        onEdit={() => handleEditSocialAccount(account)}
                        onDelete={() => handleDeleteSocialAccount(account.id)}
                      />
                    ))}
                </div>
              ) : (
                <div className='flex items-center justify-center py-12 text-center'>
                  <div>
                    <Icon
                      icon='solar:link-circle-linear'
                      className='text-default-300 mx-auto mb-4 h-12 w-12'
                    />
                    <p className='text-foreground-500 mb-4'>
                      No social accounts available
                    </p>
                    {isOwnProfile && (
                      <Button
                        color='primary'
                        variant='flat'
                        size='sm'
                        startContent={<Icon icon='solar:plus-linear' className='h-4 w-4' />}
                        onPress={handleEditSocialAccounts}
                      >
                        Add Social Accounts
                      </Button>
                    )}
                  </div>
                </div>
              )}
            </CardBody>
          </Card>

          {/* Contact - Only show for other users */}
          {!isOwnProfile && (
            <Card id='contact' className='border-default-200/50 scroll-mt-24 shadow-sm hover:shadow-md transition-all duration-300 hover:border-danger/20'>
              <CardHeader className='pb-4'>
                <div className='flex items-center gap-4'>
                  <div className='bg-danger/10 rounded-full p-3'>
                    <Icon icon='solar:letter-linear' className='text-danger h-5 w-5' />
                  </div>
                  <div>
                    <h3 className='text-foreground text-lg font-semibold'>
                      {t('talentPool.profile.sections.contact')}
                    </h3>
                    <p className='text-small text-foreground-500 mt-1'>
                      {t('talentPool.profile.workWithUser', { name: user.firstName })}
                    </p>
                  </div>
                </div>
              </CardHeader>
              <CardBody className='pt-2'>
                <div className='space-y-4'>
                  {user.email && (
                    <div className='bg-default-50 flex items-center gap-3 rounded-lg p-3'>
                      <Icon icon='solar:letter-linear' className='text-foreground-500 h-4 w-4' />
                      <a
                        className='text-primary font-medium hover:underline'
                        href={`mailto:${user.email}`}
                      >
                        {user.email}
                      </a>
                    </div>
                  )}

                  {user.phoneNumber && (
                    <div className='bg-default-50 flex items-center gap-3 rounded-lg p-3'>
                      <Icon icon='solar:phone-linear' className='text-foreground-500 h-4 w-4' />
                      <a
                        className='text-primary font-medium hover:underline'
                        href={`tel:${user.phoneNumber}`}
                      >
                        {user.phoneNumber}
                      </a>
                    </div>
                  )}

                  {user.linkedinProfile && (
                    <div className='bg-default-50 flex items-center gap-3 rounded-lg p-3'>
                      <Icon icon='solar:link-linear' className='text-foreground-500 h-4 w-4' />
                      <a
                        className='text-primary font-medium hover:underline'
                        href={user.linkedinProfile}
                        target='_blank'
                        rel='noopener noreferrer'
                      >
                        {t('talentPool.profile.linkedinProfile')}
                      </a>
                    </div>
                  )}

                  {user.profileWebsite && (
                    <div className='bg-default-50 flex items-center gap-3 rounded-lg p-3'>
                      <Icon icon='solar:globe-linear' className='text-foreground-500 h-4 w-4' />
                      <a
                        className='text-primary font-medium hover:underline'
                        href={user.profileWebsite}
                        target='_blank'
                        rel='noopener noreferrer'
                      >
                        {t('talentPool.profile.website')}
                      </a>
                    </div>
                  )}
                </div>

                <Divider className='my-6' />

                <div className='flex flex-col gap-3'>
                  {user.email && (
                    <Button
                      color='primary'
                      size='lg'
                      startContent={<Icon icon='solar:letter-linear' className='h-4 w-4' />}
                      as='a'
                      href={`mailto:${user.email}`}
                      className='w-full'
                    >
                      {t('talentPool.profile.letsTalk')}
                    </Button>
                  )}

                  {user.resume && (
                    <Button
                      variant='bordered'
                      size='lg'
                      startContent={<Icon icon='solar:download-linear' className='h-4 w-4' />}
                      as='a'
                      href={getImageUrl(user.resume)}
                      target='_blank'
                      rel='noopener noreferrer'
                      className='hover:border-primary w-full transition-colors duration-200'
                    >
                      {t('talentPool.profile.downloadCV')}
                    </Button>
                  )}
                </div>
              </CardBody>
            </Card>
          )}

          {/* Profile summary card */}
          <Card className='border-primary/20 from-primary/5 to-secondary/5 bg-gradient-to-br shadow-sm hover:shadow-lg transition-all duration-300 hover:border-primary/30 hover:from-primary/8 hover:to-secondary/8'>
            <CardBody className='p-8 text-center'>
              <div className='mx-auto mb-4 h-20 w-20'>
                {user.profileImage && user.profileImage.trim() ? (
                  <div className='ring-primary/20 from-primary-200 to-secondary-200 h-full w-full overflow-hidden rounded-full bg-gradient-to-br shadow-lg ring-4'>
                    <img
                      src={getImageUrl(user.profileImage)}
                      alt={`${user.firstName} ${user.lastName}`}
                      className='h-full w-full object-cover'
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                        const parent = e.currentTarget.parentElement;
                        if (parent) {
                          parent.innerHTML = `<div class="w-full h-full flex items-center justify-center text-xl font-bold text-primary-800">${getUserInitials(user.firstName, user.lastName)}</div>`;
                        }
                      }}
                    />
                  </div>
                ) : (
                  <div className='ring-primary/20 from-primary-200 to-secondary-200 text-primary-800 flex h-full w-full items-center justify-center rounded-full bg-gradient-to-br text-xl font-bold shadow-lg ring-4'>
                    {getUserInitials(user.firstName, user.lastName)}
                  </div>
                )}
              </div>

              <h4 className='text-foreground mb-3 text-lg font-bold'>{fullName}</h4>

              <p className='text-small text-foreground-700 bg-primary/10 mb-4 rounded-full px-4 py-2'>
                {mapUserType(user.profession || user.kind || 'FREELANCER', t)}
              </p>

              <div className='via-primary/30 mb-4 h-px bg-gradient-to-r from-transparent to-transparent' />

              <p className='text-tiny text-foreground-500 leading-relaxed'>
                {user.aboutMe
                  ? truncateText(stripHtml(user.aboutMe), 120)
                  : t('talentPool.profile.noSummaryAvailable')}
              </p>
            </CardBody>
          </Card>
        </div>
      </div>


      {/* Experience Modal */}
      <Modal
        isOpen={isExperienceModalOpen}
        onClose={() => setIsExperienceModalOpen(false)}
        size='3xl'
        scrollBehavior='inside'
      >
        <ModalContent>
          <ModalHeader className='flex items-center gap-3'>
            <div className='bg-primary/20 rounded-xl p-2'>
              <Icon icon='solar:case-linear' className='text-primary h-5 w-5' />
            </div>
            <div>
              <h2 className='text-xl font-semibold'>Manage Experience</h2>
              <p className='text-foreground-500 text-sm'>
                Add, edit, or remove your work experience
              </p>
            </div>
          </ModalHeader>
          <ModalBody>
            <ExperienceForm
              experience={localExperiences}
              onAdd={handleAddExperienceItem}
              onRemove={handleRemoveExperience}
              onUpdate={handleUpdateExperience}
            />
          </ModalBody>
          <ModalFooter>
            <Button variant='light' onPress={() => setIsExperienceModalOpen(false)}>
              Cancel
            </Button>
            <Button color='primary' onPress={handleSaveExperiences}>
              Save Changes
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Education Modal */}
      <Modal
        isOpen={isEducationModalOpen}
        onClose={() => setIsEducationModalOpen(false)}
        size='3xl'
        scrollBehavior='inside'
      >
        <ModalContent>
          <ModalHeader className='flex items-center gap-3'>
            <div className='bg-secondary/20 rounded-xl p-2'>
              <Icon icon='solar:diploma-linear' className='text-secondary h-5 w-5' />
            </div>
            <div>
              <h2 className='text-xl font-semibold'>Manage Education</h2>
              <p className='text-foreground-500 text-sm'>Add, edit, or remove your education</p>
            </div>
          </ModalHeader>
          <ModalBody>
            <EducationForm
              education={localEducation}
              onAdd={handleAddEducationItem}
              onRemove={handleRemoveEducation}
              onUpdate={handleUpdateEducation}
            />
          </ModalBody>
          <ModalFooter>
            <Button variant='light' onPress={() => setIsEducationModalOpen(false)}>
              Cancel
            </Button>
            <Button color='primary' onPress={handleSaveEducation}>
              Save Changes
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Personal Info Modal */}
      <Modal
        isOpen={isPersonalInfoModalOpen}
        onClose={() => setIsPersonalInfoModalOpen(false)}
        size='3xl'
        scrollBehavior='inside'
      >
        <ModalContent>
          <ModalHeader className='flex items-center gap-3'>
            <div className='bg-primary/20 rounded-xl p-2'>
              <Icon icon='solar:user-speak-linear' className='text-primary h-5 w-5' />
            </div>
            <div>
              <h2 className='text-xl font-semibold'>Edit Personal Information</h2>
              <p className='text-foreground-500 text-sm'>Update your personal details and bio</p>
            </div>
          </ModalHeader>
          <ModalBody>
            <PersonalInfoForm data={localUser} onChange={handlePersonalInfoChange} />
          </ModalBody>
          <ModalFooter>
            <Button variant='light' onPress={() => setIsPersonalInfoModalOpen(false)}>
              Cancel
            </Button>
            <Button color='primary' onPress={handleSavePersonalInfo}>
              Save Changes
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Skills Modal */}
      <Modal
        isOpen={isSkillsModalOpen}
        onClose={() => setIsSkillsModalOpen(false)}
        size='3xl'
        scrollBehavior='inside'
      >
        <ModalContent>
          <ModalHeader className='flex items-center gap-3'>
            <div className='bg-success/20 rounded-xl p-2'>
              <Icon icon='solar:verified-check-linear' className='text-success h-5 w-5' />
            </div>
            <div>
              <h2 className='text-xl font-semibold'>Manage Skills</h2>
              <p className='text-foreground-500 text-sm'>Add, edit, or remove your skills</p>
            </div>
          </ModalHeader>
          <ModalBody>
            <SkillsForm
              skills={localSkills}
              onAdd={handleAddSkill}
              onRemove={handleRemoveSkill}
              onUpdate={handleUpdateSkill}
            />
          </ModalBody>
          <ModalFooter>
            <Button variant='light' onPress={() => setIsSkillsModalOpen(false)}>
              Cancel
            </Button>
            <Button color='primary' onPress={handleSaveSkills}>
              Save Changes
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Languages Modal */}
      <Modal
        isOpen={isLanguagesModalOpen}
        onClose={() => setIsLanguagesModalOpen(false)}
        size='3xl'
        scrollBehavior='inside'
      >
        <ModalContent>
          <ModalHeader className='flex items-center gap-3'>
            <div className='bg-warning/20 rounded-xl p-2'>
              <Icon icon='solar:globe-linear' className='text-warning h-5 w-5' />
            </div>
            <div>
              <h2 className='text-xl font-semibold'>Manage Languages</h2>
              <p className='text-foreground-500 text-sm'>
                Add, edit, or remove languages you speak
              </p>
            </div>
          </ModalHeader>
          <ModalBody>
            <EnhancedLanguagesForm
              languages={localLanguages}
              onAdd={handleAddLanguage}
              onRemove={handleRemoveLanguage}
              onUpdate={handleUpdateLanguage}
            />
          </ModalBody>
          <ModalFooter>
            <Button variant='light' onPress={() => setIsLanguagesModalOpen(false)}>
              Cancel
            </Button>
            <Button color='primary' onPress={handleSaveLanguages}>
              Save Changes
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Certifications Modal */}
      <Modal
        isOpen={isCertificationsModalOpen}
        onClose={() => setIsCertificationsModalOpen(false)}
        size='3xl'
        scrollBehavior='inside'
      >
        <ModalContent>
          <ModalHeader className='flex items-center gap-3'>
            <div className='bg-secondary/20 rounded-xl p-2'>
              <Icon icon='solar:medal-star-linear' className='text-secondary h-5 w-5' />
            </div>
            <div>
              <h2 className='text-xl font-semibold'>Manage Certifications</h2>
              <p className='text-foreground-500 text-sm'>
                Add, edit, or remove your certifications
              </p>
            </div>
          </ModalHeader>
          <ModalBody>
            <CertificationsForm
              certifications={localCertifications}
              onAdd={handleAddCertification}
              onRemove={handleRemoveCertification}
              onUpdate={handleUpdateCertification}
            />
          </ModalBody>
          <ModalFooter>
            <Button variant='light' onPress={() => setIsCertificationsModalOpen(false)}>
              Cancel
            </Button>
            <Button color='primary' onPress={handleSaveCertifications}>
              Save Changes
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Individual Experience Item Modal */}
      <Modal 
        isOpen={editingExperience.isOpen}
        onClose={() => setEditingExperience({item: null, isOpen: false})}
        size="2xl"
        scrollBehavior="inside"
      >
        <ModalContent>
          <ModalHeader className="flex items-center gap-3">
            <div className="bg-primary/20 rounded-xl p-2">
              <Icon icon="solar:case-linear" className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h2 className="text-xl font-semibold">Edit Experience</h2>
              <p className="text-sm text-foreground-500">Update this work experience</p>
            </div>
          </ModalHeader>
          <ModalBody>
            {editingExperience.item && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    label="Position"
                    value={editingExperience.item.position}
                    onChange={(e) => setEditingExperience(prev => ({
                      ...prev,
                      item: prev.item ? {...prev.item, position: e.target.value} : null
                    }))}
                  />
                  <Input
                    label="Company"
                    value={editingExperience.item.company}
                    onChange={(e) => setEditingExperience(prev => ({
                      ...prev,
                      item: prev.item ? {...prev.item, company: e.target.value} : null
                    }))}
                  />
                </div>
                <Input
                  label="Location"
                  value={editingExperience.item.location || ''}
                  onChange={(e) => setEditingExperience(prev => ({
                    ...prev,
                    item: prev.item ? {...prev.item, location: e.target.value} : null
                  }))}
                />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    label="Start Date"
                    type="date"
                    value={editingExperience.item.startDate?.split('T')[0] || ''}
                    onChange={(e) => setEditingExperience(prev => ({
                      ...prev,
                      item: prev.item ? {...prev.item, startDate: e.target.value} : null
                    }))}
                  />
                  <Input
                    label="End Date"
                    type="date"
                    value={editingExperience.item.endDate?.split('T')[0] || ''}
                    onChange={(e) => setEditingExperience(prev => ({
                      ...prev,
                      item: prev.item ? {...prev.item, endDate: e.target.value} : null
                    }))}
                  />
                </div>
                <Textarea
                  label="Description"
                  value={editingExperience.item.description || ''}
                  onChange={(e) => setEditingExperience(prev => ({
                    ...prev,
                    item: prev.item ? {...prev.item, description: e.target.value} : null
                  }))}
                  minRows={3}
                />
              </div>
            )}
          </ModalBody>
          <ModalFooter>
            <Button variant="light" onPress={() => setEditingExperience({item: null, isOpen: false})}>
              Cancel
            </Button>
            <Button color="primary" onPress={() => editingExperience.item && handleSaveIndividualExperience(editingExperience.item)}>
              Save Changes
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Individual Education Item Modal */}
      <Modal 
        isOpen={editingEducation.isOpen}
        onClose={() => setEditingEducation({item: null, isOpen: false})}
        size="2xl"
        scrollBehavior="inside"
      >
        <ModalContent>
          <ModalHeader className="flex items-center gap-3">
            <div className="bg-secondary/20 rounded-xl p-2">
              <Icon icon="solar:diploma-linear" className="h-5 w-5 text-secondary" />
            </div>
            <div>
              <h2 className="text-xl font-semibold">Edit Education</h2>
              <p className="text-sm text-foreground-500">Update this education entry</p>
            </div>
          </ModalHeader>
          <ModalBody>
            {editingEducation.item && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    label="Degree"
                    value={editingEducation.item.degree}
                    onChange={(e) => setEditingEducation(prev => ({
                      ...prev,
                      item: prev.item ? {...prev.item, degree: e.target.value} : null
                    }))}
                  />
                  <Input
                    label="University"
                    value={editingEducation.item.university}
                    onChange={(e) => setEditingEducation(prev => ({
                      ...prev,
                      item: prev.item ? {...prev.item, university: e.target.value} : null
                    }))}
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    label="Field of Study"
                    value={editingEducation.item.field || ''}
                    onChange={(e) => setEditingEducation(prev => ({
                      ...prev,
                      item: prev.item ? {...prev.item, field: e.target.value} : null
                    }))}
                  />
                  <Input
                    label="Grade"
                    value={editingEducation.item.grade || ''}
                    onChange={(e) => setEditingEducation(prev => ({
                      ...prev,
                      item: prev.item ? {...prev.item, grade: e.target.value} : null
                    }))}
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    label="Start Date"
                    type="date"
                    value={editingEducation.item.startDate?.split('T')[0] || ''}
                    onChange={(e) => setEditingEducation(prev => ({
                      ...prev,
                      item: prev.item ? {...prev.item, startDate: e.target.value} : null
                    }))}
                  />
                  <Input
                    label="End Date"
                    type="date"
                    value={editingEducation.item.endDate?.split('T')[0] || ''}
                    onChange={(e) => setEditingEducation(prev => ({
                      ...prev,
                      item: prev.item ? {...prev.item, endDate: e.target.value} : null
                    }))}
                  />
                </div>
                <Textarea
                  label="Description"
                  value={editingEducation.item.description || ''}
                  onChange={(e) => setEditingEducation(prev => ({
                    ...prev,
                    item: prev.item ? {...prev.item, description: e.target.value} : null
                  }))}
                  minRows={3}
                />
              </div>
            )}
          </ModalBody>
          <ModalFooter>
            <Button variant="light" onPress={() => setEditingEducation({item: null, isOpen: false})}>
              Cancel
            </Button>
            <Button color="primary" onPress={() => editingEducation.item && handleSaveIndividualEducation(editingEducation.item)}>
              Save Changes
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Individual Language Item Modal */}
      <Modal 
        isOpen={editingLanguage.isOpen}
        onClose={() => setEditingLanguage({item: null, isOpen: false})}
        size="md"
        scrollBehavior="inside"
      >
        <ModalContent>
          <ModalHeader className="flex items-center gap-3">
            <div className="bg-secondary/20 rounded-xl p-2">
              <Icon icon="solar:globe-linear" className="h-5 w-5 text-secondary" />
            </div>
            <div>
              <h2 className="text-xl font-semibold">Edit Language</h2>
              <p className="text-sm text-foreground-500">Update this language skill</p>
            </div>
          </ModalHeader>
          <ModalBody>
            {editingLanguage.item && (
              <div className="space-y-4">
                <Input
                  label="Language"
                  value={editingLanguage.item.key}
                  onChange={(e) => setEditingLanguage(prev => ({
                    ...prev,
                    item: prev.item ? {...prev.item, key: e.target.value} : null
                  }))}
                />
                <Select
                  label="Proficiency Level"
                  selectedKeys={[editingLanguage.item.level]}
                  onSelectionChange={(keys) => {
                    const level = Array.from(keys)[0] as string;
                    setEditingLanguage(prev => ({
                      ...prev,
                      item: prev.item ? {...prev.item, level} : null
                    }));
                  }}
                >
                  <SelectItem key="NATIVE">Native</SelectItem>
                  <SelectItem key="PROFESSIONAL">Professional</SelectItem>
                  <SelectItem key="INTERMEDIATE">Intermediate</SelectItem>
                  <SelectItem key="BEGINNER">Beginner</SelectItem>
                </Select>
              </div>
            )}
          </ModalBody>
          <ModalFooter>
            <Button variant="light" onPress={() => setEditingLanguage({item: null, isOpen: false})}>
              Cancel
            </Button>
            <Button color="primary" onPress={() => editingLanguage.item && handleSaveIndividualLanguage(editingLanguage.item)}>
              Save Changes
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Social Accounts Modal */}
      <Modal
        isOpen={isSocialAccountsModalOpen}
        onClose={() => setIsSocialAccountsModalOpen(false)}
        size='3xl'
        scrollBehavior='inside'
      >
        <ModalContent>
          <ModalHeader className='flex items-center gap-3'>
            <div className='bg-purple/20 rounded-xl p-2'>
              <Icon icon='solar:link-circle-linear' className='text-purple h-5 w-5' />
            </div>
            <div>
              <h2 className='text-xl font-semibold'>Manage Social Accounts</h2>
              <p className='text-foreground-500 text-sm'>
                Add, edit, or remove your social media profiles
              </p>
            </div>
          </ModalHeader>
          <ModalBody>
            <SocialAccountsForm
              socialAccounts={localSocialAccounts}
              onAdd={handleAddSocialAccount}
              onRemove={handleRemoveSocialAccount}
              onUpdate={handleUpdateSocialAccount}
            />
          </ModalBody>
          <ModalFooter>
            <Button variant='light' onPress={() => setIsSocialAccountsModalOpen(false)}>
              Cancel
            </Button>
            <Button color='primary' onPress={handleSaveSocialAccounts}>
              Save Changes
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </section>
  );
};

export default ProfileContent;
