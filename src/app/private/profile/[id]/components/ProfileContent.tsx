'use client';

import test from 'node:test';
import React, { useState } from 'react';

import type { IEducation, Note } from '@root/modules/profile/types';

import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Chip,
  Divider,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader
} from '@heroui/react';
import { Icon } from '@iconify/react';
import { type IReview, type IService } from '@root/modules/profile/types';
import ISO6391 from 'iso-639-1';
import { useTranslations } from 'next-intl';

import ConfirmDeleteModal from '@/app/private/components/confirm-delete';
import { getSkillIcon } from '@/app/private/talent-pool/utils/skill-icons';
import {
  getUserInitials,
  mapUserType,
  stripHtml,
  truncateText
} from '@/app/private/talent-pool/utils/talent-utilities';
import wingManApi from '@/lib/axios';
import { getImageUrl } from '@/lib/utils/utilities';

import {
  type Certification,
  type Education,
  type Experience,
  type Language,
  type ProfileUser,
  type SocialAccount,
  type UserNote
} from '../types';
import { ActionButtons } from './ActionButtons';
import { SocialAccountCard } from './cards/SocialAccountCard';
import { CertificationsForm } from './forms/CertificationsForm';
import { EnhancedLanguagesForm } from './forms/EnhancedLanguagesForm';
import { PersonalInfoForm } from './forms/PersonalInfoForm';
import { SkillsForm } from './forms/SkillsForm';
import { SocialAccountsForm } from './forms/SocialAccountsForm';
import AboutMeModal from './modals/about-me';
import EducationModal from './modals/education-modal';
import ExperienceModal from './modals/experience-modal';
import LanguageModal from './modals/language-modal';
import { NotesModal } from './modals/notes-modal';
import ProjectModal from './modals/projects-modal';
import ServiceModal from './modals/services-modal';
import SkillsModal from './modals/skills-modal';
import TestimonialModal from './modals/testimonials-modal';
import { EducationSection } from './sections/EducationSection';
import { NotesSection } from './sections/notes-section';
import { ProjectsSection } from './sections/projects-section';
import { ServicesSection } from './sections/services-section';
import { TestimonialsSection } from './sections/testimonials-section';

// Define local Skill type based on actual usage
interface Skill {
  id?: string;
  key: string;
  type?: string;
}

// Define local Skill type based on actual usage
interface Skill {
  id?: string;
  key: string;
  type?: string;
}

interface ProfileContentProperties {
  user: ProfileUser;
  experiences: Experience[];
  languages: Language[];
  education: Education[];
  userNotes: Note[];
  isOwnProfile: boolean;
  projects?: Experience[];
  services?: IService[];
  testimonials?: IReview[];
}

const ProfileContent: React.FC<ProfileContentProperties> = ({
  user,
  experiences,
  languages,
  education,
  userNotes,
  projects,
  services,
  testimonials,
  isOwnProfile
}) => {
  const t = useTranslations();

  // Modal states for all forms
  const [isSkillsModalOpen, setIsSkillsModalOpen] = useState(false);
  const [isCertificationsModalOpen, setIsCertificationsModalOpen] = useState(false);
  const [isSocialAccountsModalOpen, setIsSocialAccountsModalOpen] = useState(false);
  const [isAboutMeModalOpen, setIsAboutMeModalOpen] = useState(false);

  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
  const [isServiceModalOpen, setIsServiceModalOpen] = useState(false);
  const [isTestimonialModalOpen, setIsTestimonialModalOpen] = useState(false);
  const [notes, setNotes] = useState<Note[]>(userNotes);
  const [isNotesModalOpen, setIsNotesModalOpen] = useState(false);

  // Individual item modals
  const [editingExperience, setEditingExperience] = useState<{
    item: Experience | null;
    isOpen: boolean;
  }>({ item: null, isOpen: false });
  const [editingEducation, setEditingEducation] = useState<{
    item: IEducation | null;
    isOpen: boolean;
  }>({ item: null, isOpen: false });
  const [editingLanguage, setEditingLanguage] = useState<{
    item: Language | null;
    isOpen: boolean;
  }>({ item: null, isOpen: false });

  const [educationToDelete, setEducationToDelete] = useState<{
    education: IEducation | null;
    isOpen: boolean;
  }>({ education: null, isOpen: false });

  const [experienceToDelete, setExperienceToDelete] = useState<{
    experience: Experience | null;
    isOpen: boolean;
  }>({ experience: null, isOpen: false });

  const [languageToDelete, setLanguageToDelete] = useState<{
    language: Language | null;
    isOpen: boolean;
  }>({ language: null, isOpen: false });
  const [editingProject, setEditingProject] = useState<{
    item: Experience | null;
    isOpen: boolean;
  }>({ item: null, isOpen: false });

  const [editingService, setEditingService] = useState<{
    item: IService | null;
    isOpen: boolean;
  }>({ item: null, isOpen: false });

  const [viewingTestimonial, setViewingTestimonial] = useState<{
    item: IReview | null;
    isOpen: boolean;
  }>({ item: null, isOpen: false });

  // Add delete states
  const [projectToDelete, setProjectToDelete] = useState<{
    project: Experience | null;
    isOpen: boolean;
  }>({ project: null, isOpen: false });

  const [serviceToDelete, setServiceToDelete] = useState<{
    service: IService | null;
    isOpen: boolean;
  }>({ service: null, isOpen: false });

  const [testimonialToDelete, setTestimonialToDelete] = useState<{
    testimonial: IReview | null;
    isOpen: boolean;
  }>({ testimonial: null, isOpen: false });

  const [noteToDelete, setNoteToDelete] = useState<{
    note: Note | null;
    isOpen: boolean;
  }>({ note: null, isOpen: false });

  // Local state for forms
  const [localUser, setLocalUser] = useState(user);
  const [localCertifications, setLocalCertifications] = useState<Certification[]>([]);
  const [localSocialAccounts, setLocalSocialAccounts] = useState<SocialAccount[]>(
    user.socialAccounts || []
  );

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

  const handleEditAbout = () => {
    setIsAboutMeModalOpen(true);
  };

  const handleAboutMeSuccess = (updatedAboutMe: string) => {
    // Update the local user state with the new about me
    setLocalUser((previous) => ({ ...previous, aboutMe: updatedAboutMe }));
    // Optionally call a prop function here to refresh the parent component's data
  };

  // Skills handlers
  const handleEditSkills = () => {
    setIsSkillsModalOpen(true);
  };

  const handleSkillsSuccess = () => {
    // Refresh skills data here - you might want to refetch from your API
    // or update the local state accordingly
    // You can call a prop function here to refresh the parent component's data
  };

  // Helper function to get skill color
  const getSkillColor = (index: number) => {
    const colors = ['primary', 'secondary', 'success', 'warning'] as const;
    return colors[index % colors.length];
  };

  // Languages handlers
  const handleAddLanguage = () => {
    setEditingLanguage({
      item: {
        id: crypto.randomUUID(),
        name: '',
        code: '',
        key: '',
        level: 'BEGINNER',
        isNative: false,
        canRead: false,
        canWrite: false,
        canSpeak: false,
        canUnderstand: false
      },
      isOpen: true
    });
  };

  const handleEditLanguage = (language: Language) => {
    setEditingLanguage({ item: language, isOpen: true });
  };

  const handleDeleteLanguage = (language: Language) => {
    setLanguageToDelete({ language, isOpen: true });
  };

  const confirmDeleteLanguage = async () => {
    if (!languageToDelete.language?.id) return;

    try {
      await wingManApi.delete(`/languages/${languageToDelete.language.id}`);
      addToast('Language deleted successfully', 'success');

      // Refresh the language data here
      handleLanguageSuccess();

      setLanguageToDelete({ language: null, isOpen: false });
    } catch (error: any) {
      console.error('Error deleting language:', error);

      let errorMessage = 'Failed to delete language';

      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.response?.status === 404) {
        errorMessage = 'Language record not found.';
      } else if (error.response?.status === 401) {
        errorMessage = 'You are not authorized to delete this language.';
      } else if (error.response?.status >= 500) {
        errorMessage = 'Server error. Please try again later.';
      }

      addToast(errorMessage, 'error');
    }
  };

  const handleLanguageSuccess = () => {
    // Refresh language data here - you might want to refetch from your API
    // or update the local state accordingly
    // You can call a prop function here to refresh the parent component's data
  };

  const getLanguageName = (code: string | undefined): string => {
    if (!code) return 'Unknown';

    // Try to get name from iso-639-1
    const isoName = ISO6391.getName(code.toLowerCase());
    if (isoName) return isoName;

    // Fallback to code if name not found
    return code;
  };

  const getLevelDisplay = (level: Language['level']): string => {
    const levelMap = {
      NATIVE: 'Native',
      FLUENT: 'Fluent',
      PROFESSIONAL: 'Professional',
      CONVERSATIONAL: 'Conversational',
      INTERMEDIATE: 'Intermediate',
      ELEMENTARY: 'Elementary',
      BEGINNER: 'Beginner'
    };
    return levelMap[level] || level;
  };

  // Helper function to get level color
  const getLevelColor = (level: Language['level']): string => {
    const colorMap = {
      NATIVE: 'success',
      FLUENT: 'success',
      PROFESSIONAL: 'primary',
      CONVERSATIONAL: 'secondary',
      INTERMEDIATE: 'warning',
      ELEMENTARY: 'warning',
      BEGINNER: 'default'
    };
    return colorMap[level] || 'default';
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
    setLocalCertifications((previous) => [...previous, newCertification]);
  };

  const handleRemoveCertification = (index: number) => {
    setLocalCertifications((previous) => previous.filter((_, index_) => index_ !== index));
  };

  const handleUpdateCertification = (index: number, data: any) => {
    setLocalCertifications((previous) =>
      previous.map((cert, index_) => (index_ === index ? data : cert))
    );
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
    setLocalSocialAccounts((previous) => [...previous, newSocialAccount]);
  };

  const handleRemoveSocialAccount = (index: number) => {
    setLocalSocialAccounts((previous) => previous.filter((_, index_) => index_ !== index));
  };

  const handleUpdateSocialAccount = (index: number, data: SocialAccount) => {
    setLocalSocialAccounts((previous) =>
      previous.map((account, index_) => (index_ === index ? data : account))
    );
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
      setLocalSocialAccounts((previous) => previous.filter((account) => account.id !== accountId));
    }
  };

  // Experience handlers
  const handleAddExperience = () => {
    setEditingExperience({
      item: {
        id: `temp_${Date.now()}`,
        company: '',
        position: '',
        startDate: '',
        endDate: '',
        description: ''
      },
      isOpen: true
    });
  };

  const handleEditExperience = (experience: Experience) => {
    setEditingExperience({ item: experience, isOpen: true });
  };

  const handleDeleteExperience = (experience: Experience) => {
    setExperienceToDelete({ experience, isOpen: true });
  };

  const confirmDeleteExperience = async () => {
    if (!experienceToDelete.experience?.id) return;

    try {
      await wingManApi.delete(`/experience/${experienceToDelete.experience.id}`);
      addToast('Experience deleted successfully', 'success');

      // Refresh the experience data here - you might want to call a prop function
      // or refetch from your API to update the experiences list
      handleExperienceSuccess();

      setExperienceToDelete({ experience: null, isOpen: false });
    } catch (error: any) {
      console.error('Error deleting experience:', error);

      let errorMessage = 'Failed to delete experience';

      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.response?.status === 404) {
        errorMessage = 'Experience record not found.';
      } else if (error.response?.status === 401) {
        errorMessage = 'You are not authorized to delete this experience.';
      } else if (error.response?.status >= 500) {
        errorMessage = 'Server error. Please try again later.';
      }

      addToast(errorMessage, 'error');
    }
  };

  const handleExperienceSuccess = () => {
    // Refresh experience data here - you might want to refetch from your API
    // or update the local state accordingly
    // You can call a prop function here to refresh the parent component's data
  };

  // Education handlers
  const handleAddEducation = () => {
    setEditingEducation({ item: null, isOpen: true });
  };

  const handleEditEducation = (education: IEducation) => {
    setEditingEducation({ item: education, isOpen: true });
  };

  const handleEducationSuccess = () => {
    // Refresh education data here - you might want to refetch from your API
    // or update the local state accordingly
    // You can call a prop function here to refresh the parent component's data
  };
  const addToast = (message: string, type: 'success' | 'error') => {
    // Implement your toast notification logic here
  };
  const handleDeleteEducation = (education: IEducation) => {
    setEducationToDelete({ education, isOpen: true });
  };

  const confirmDeleteEducation = async () => {
    try {
      await wingManApi.delete(`/education/${educationToDelete.education?.id}`);
      addToast('Education deleted successfully', 'success');

      // Refresh the education data here
      handleEducationSuccess();

      setEducationToDelete({ education: null, isOpen: false });
    } catch (error: any) {
      console.error('Error deleting education:', error);

      let errorMessage = 'Failed to delete education';

      if (error.response?.data?.message) {
        errorMessage = error?.response?.data?.message;
      } else if (error.response?.status === 404) {
        errorMessage = 'Education record not found.';
      } else if (error!.response?.status === 401) {
        errorMessage = 'You are not authorized to delete this education.';
      } else if (error.response?.status >= 500) {
        errorMessage = 'Server error. Please try again later.';
      }

      addToast(errorMessage, 'error');
    }
  };
  const handleAddProject = () => {
    setEditingProject({
      item: {
        id: `temp_${Date.now()}`,
        position: '',
        company: '',
        startDate: '',
        endDate: '',
        description: '',
        location: ''
      },
      isOpen: true
    });
    setIsProjectModalOpen(true);
  };

  const handleEditProject = (project: Experience) => {
    setIsProjectModalOpen(true);

    setEditingProject({ item: project, isOpen: true });
  };

  const handleDeleteProject = (project: Experience) => {
    setProjectToDelete({ project, isOpen: true });
  };

  const confirmDeleteProject = async () => {
    if (!projectToDelete.project?.id) return;

    try {
      await wingManApi.delete(`/experience/${projectToDelete.project.id}`);
      addToast('Project deleted successfully', 'success');
      handleProjectSuccess();
      setProjectToDelete({ project: null, isOpen: false });
    } catch (error: any) {
      console.error('Error deleting project:', error);
      let errorMessage = 'Failed to delete project';
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.response?.status === 404) {
        errorMessage = 'Project not found.';
      } else if (error.response?.status === 401) {
        errorMessage = 'You are not authorized to delete this project.';
      } else if (error.response?.status >= 500) {
        errorMessage = 'Server error. Please try again later.';
      }
      addToast(errorMessage, 'error');
    }
  };

  const handleProjectSuccess = () => {
    // Refresh projects data here
  };

  const handleAddService = () => {
    setEditingService({
      item: {
        id: crypto.randomUUID(),
        name: '',
        description: '',
        price: 0,
        type: 'HOURLY_BASED',
        skills: [],
        createdAt: new Date().toISOString()
      },
      isOpen: true
    });
    setIsServiceModalOpen(true);
  };

  const handleEditService = (service: IService) => {
    setIsServiceModalOpen(true);
    setEditingService({ item: service, isOpen: true });
  };

  const handleDeleteService = (service: IService) => {
    setServiceToDelete({ service, isOpen: true });
  };

  const confirmDeleteService = async () => {
    try {
      await wingManApi.delete(`/services/${serviceToDelete.service?.id}`);
      addToast('Service deleted successfully', 'success');
      handleServiceSuccess();
      setServiceToDelete({ service: null, isOpen: false });
    } catch (error: any) {
      console.error('Error deleting service:', error);
      let errorMessage = 'Failed to delete service';
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.response?.status === 404) {
        errorMessage = 'Service not found.';
      } else if (error.response?.status === 401) {
        errorMessage = 'You are not authorized to delete this service.';
      } else if (error.response?.status >= 500) {
        errorMessage = 'Server error. Please try again later.';
      }
      addToast(errorMessage, 'error');
    }
  };

  const handleServiceSuccess = () => {
    // Refresh services data here
  };

  const handleViewTestimonial = (testimonial: IReview) => {
    setViewingTestimonial({ item: testimonial, isOpen: true });
  };

  const handleDeleteTestimonial = (testimonial: IReview) => {
    setTestimonialToDelete({ testimonial, isOpen: true });
  };

  const confirmDeleteTestimonial = async () => {
    if (!testimonialToDelete.testimonial?.id) return;

    try {
      await wingManApi.delete(`/public-reviews/${testimonialToDelete.testimonial.id}`);
      addToast('Testimonial deleted successfully', 'success');
      handleTestimonialSuccess();
      setTestimonialToDelete({ testimonial: null, isOpen: false });
    } catch (error: any) {
      console.error('Error deleting testimonial:', error);
      let errorMessage = 'Failed to delete testimonial';
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.response?.status === 404) {
        errorMessage = 'Testimonial not found.';
      } else if (error.response?.status === 401) {
        errorMessage = 'You are not authorized to delete this testimonial.';
      } else if (error.response?.status >= 500) {
        errorMessage = 'Server error. Please try again later.';
      }
      addToast(errorMessage, 'error');
    }
  };

  const handleTestimonialSuccess = () => {
    // Refresh testimonials data here
  };

  const handleAddNote = () => {
    setIsNotesModalOpen(true);
  };

  const handleDeleteNote = (note: Note) => {
    setNoteToDelete({ note, isOpen: true });
  };

  const confirmDeleteNote = async () => {
    if (!noteToDelete.note?.id) return;

    try {
      await wingManApi.delete(`/notes/${noteToDelete.note.id}`);
      addToast('Note deleted successfully', 'success');

      // Remove the note from local state
      setNotes((previousNotes) => previousNotes.filter((n) => n.id !== noteToDelete.note?.id));
      setNoteToDelete({ note: null, isOpen: false });
    } catch (error: any) {
      console.error('Error deleting note:', error);

      let errorMessage = 'Failed to delete note';
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.response?.status === 404) {
        errorMessage = 'Note not found.';
      } else if (error.response?.status === 401) {
        errorMessage = 'You are not authorized to delete this note.';
      } else if (error.response?.status >= 500) {
        errorMessage = 'Server error. Please try again later.';
      }

      addToast(errorMessage, 'error');
    }
  };

  const handleNotesSuccess = async () => {
    // Refresh notes data
    try {
      const response = await wingManApi.get(`/notes/${user.id}`);
      setNotes(response.data);
    } catch (error) {
      console.error('Error refreshing notes:', error);
    }
  };

  return (
    <section className='container mx-auto px-6 pb-20 transition-all duration-300'>
      <div className='grid grid-cols-1 gap-8 lg:grid-cols-3'>
        {/* Main content */}
        <div className='animate-slide-up space-y-8 lg:col-span-2'>
          {/* About */}
          <Card
            id='about'
            className='border-default-200/50 hover:border-primary/20 scroll-mt-24 shadow-sm transition-all duration-300 hover:shadow-md'
          >
            <CardHeader className='pb-4 transition-all duration-200 hover:pb-5'>
              <div className='flex w-full items-center justify-between'>
                <div className='flex items-center gap-4'>
                  <div className='bg-primary/10 hover:bg-primary/15 transform rounded-full p-3 transition-colors duration-200 hover:scale-105'>
                    <Icon icon='solar:user-speak-linear' className='text-primary h-5 w-5' />
                  </div>
                  <div>
                    <h2 className='text-foreground hover:text-primary text-xl font-semibold transition-colors duration-200'>
                      {t('talentPool.profile.sections.about')}
                    </h2>
                    <p className='text-small text-foreground-500 hover:text-foreground-600 mt-1 transition-colors duration-200'>
                      {t('talentPool.profile.aboutDescription')}
                    </p>
                  </div>
                </div>

                {isOwnProfile && (
                  <ActionButtons
                    showEdit
                    onEdit={handleEditAbout}
                    editTooltip='Edit about me'
                    size='md'
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
                      className='text-default-300 hover:text-primary mx-auto mb-4 h-12 w-12 transform transition-colors duration-300 hover:scale-110'
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
          <Card
            id='experience'
            className='border-default-200/50 hover:border-primary/20 scroll-mt-24 shadow-sm transition-all duration-300 hover:shadow-md'
          >
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
                    addTooltip='Add new experience'
                    size='md'
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
                                      onEdit={() => {
                                        handleEditExperience(exp);
                                      }}
                                      onDelete={() => {
                                        handleDeleteExperience(exp);
                                      }}
                                      editTooltip={`Edit ${exp.position} at ${exp.company}`}
                                      deleteTooltip={`Delete ${exp.position} experience`}
                                    />
                                  )}
                                </div>
                                <p className='text-foreground-700 font-medium'>{exp.company}</p>
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
            onEdit={(edu) => {
              handleEditEducation(edu as IEducation);
            }}
            onDelete={(edu) => {
              handleDeleteEducation(edu as IEducation);
            }}
          />
          <ProjectsSection
            projects={projects || []}
            isOwnProfile={isOwnProfile}
            onAdd={handleAddProject}
            onEdit={handleEditProject}
            onDelete={handleDeleteProject}
            t={t}
          />

          {/* Services */}
          <ServicesSection
            services={services || []}
            isOwnProfile={isOwnProfile}
            onAdd={handleAddService}
            onEdit={handleEditService}
            onDelete={handleDeleteService}
            t={t}
          />

          {/* Testimonials */}
          <TestimonialsSection
            testimonials={testimonials || []}
            isOwnProfile={isOwnProfile}
            onView={handleViewTestimonial}
            onDelete={handleDeleteTestimonial}
            t={t}
          />
        </div>

        {/* Sidebar */}
        <div className='animate-slide-up space-y-8 [animation-delay:200ms]'>
          {/* Skills */}
          <Card
            id='skills'
            className='border-default-200/50 hover:border-success/20 scroll-mt-24 shadow-sm transition-all duration-300 hover:shadow-md'
          >
            <CardHeader className='pb-4'>
              <div className='flex w-full items-center justify-between'>
                <div className='flex items-center gap-4'>
                  <div className='bg-success/10 rounded-full p-3'>
                    <Icon icon='solar:medal-star-linear' className='text-success h-5 w-5' />
                  </div>
                  <div>
                    <h3 className='text-foreground text-lg font-semibold'>
                      Skills ({user.skills.length || 0})
                    </h3>
                    <p className='text-small text-foreground-500 mt-1'>
                      Technical and professional skills
                    </p>
                  </div>
                </div>

                {isOwnProfile && (
                  <ActionButtons
                    showEdit
                    onEdit={handleEditSkills}
                    editTooltip='Manage skills'
                    size='md'
                  />
                )}
              </div>
            </CardHeader>
            <CardBody className='pt-2'>
              {user.skills.length > 0 ? (
                <div className='flex flex-wrap gap-3'>
                  {user.skills.map((skill, index) => {
                    const chipColor = getSkillColor(index);

                    return (
                      <Chip
                        key={`${skill.key}-${index}`}
                        size='sm'
                        color={chipColor}
                        variant='flat'
                        className='transform cursor-default font-medium transition-all duration-200 hover:scale-105 hover:shadow-md'
                        startContent={
                          <Icon icon='solar:verified-check-linear' className='h-3 w-3' />
                        }
                      >
                        <div className='flex items-center gap-1'>
                          <span>{skill.key}</span>
                        </div>
                      </Chip>
                    );
                  })}
                </div>
              ) : (
                <div className='flex items-center justify-center py-12 text-center'>
                  <div>
                    <Icon
                      icon='solar:medal-star-linear'
                      className='text-default-300 mx-auto mb-4 h-12 w-12'
                    />
                    <p className='text-foreground-500 mb-4'>No skills listed</p>
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
          <Card
            id='languages'
            className='border-default-200/50 hover:border-warning/20 scroll-mt-24 shadow-sm transition-all duration-300 hover:shadow-md'
          >
            <CardHeader className='pb-4'>
              <div className='flex w-full items-center justify-between'>
                <div className='flex items-center gap-4'>
                  <div className='bg-warning/10 rounded-full p-3'>
                    <Icon icon='solar:globe-linear' className='text-warning h-5 w-5' />
                  </div>
                  <div>
                    <h3 className='text-foreground text-lg font-semibold'>Languages</h3>
                    <p className='text-small text-foreground-500 mt-1'>
                      Languages I can communicate in
                    </p>
                  </div>
                </div>

                {isOwnProfile && (
                  <ActionButtons
                    showAdd
                    onAdd={handleAddLanguage}
                    addTooltip='Add new language'
                    size='md'
                  />
                )}
              </div>
            </CardHeader>
            <CardBody className='pt-2'>
              {languages && languages.length > 0 ? (
                <div className='space-y-4'>
                  {languages.map((lang, index) => (
                    <div
                      key={lang.id || index}
                      className='bg-default-50 hover:bg-default-100 flex items-center justify-between rounded-lg p-4 transition-colors duration-200'
                    >
                      <div className='flex items-center gap-4'>
                        <div className='bg-warning/20 rounded-full p-2'>
                          <Icon icon='solar:translation-linear' className='text-warning h-4 w-4' />
                        </div>
                        <div>
                          <div className='flex items-center gap-2'>
                            <h4 className='text-foreground font-medium'>
                              {getLanguageName(lang.key)}
                            </h4>
                            {lang.key && (
                              <span className='text-tiny text-foreground-400 bg-default-200 rounded px-2 py-1'>
                                {lang.key.toUpperCase()}
                              </span>
                            )}
                          </div>
                          <Chip
                            size='sm'
                            color={getLevelColor(lang.level) as any}
                            variant='flat'
                            className='text-tiny text-foreground-500 mt-1'
                          >
                            {getLevelDisplay(lang.level)}
                          </Chip>
                        </div>
                      </div>

                      {isOwnProfile && (
                        <div className='flex gap-1'>
                          <ActionButtons
                            showEdit
                            showDelete
                            onEdit={() => {
                              handleEditLanguage(lang);
                            }}
                            onDelete={() => {
                              handleDeleteLanguage(lang);
                            }}
                            editTooltip={`Edit ${getLanguageName(lang.key)} language`}
                            deleteTooltip={`Delete ${getLanguageName(lang.key)} language`}
                            size='sm'
                          />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className='flex items-center justify-center py-12 text-center'>
                  <div>
                    <Icon
                      icon='solar:globe-linear'
                      className='text-default-300 mx-auto mb-4 h-12 w-12'
                    />
                    <p className='text-foreground-500 mb-4'>No languages listed</p>
                    {isOwnProfile && (
                      <Button
                        color='primary'
                        variant='flat'
                        size='sm'
                        startContent={<Icon icon='solar:plus-linear' className='h-4 w-4' />}
                        onPress={handleAddLanguage}
                      >
                        Add Languages
                      </Button>
                    )}
                  </div>
                </div>
              )}
            </CardBody>
          </Card>

          {/* Notes */}
          <NotesSection
            notes={notes}
            isOwnProfile={isOwnProfile}
            onAdd={handleAddNote}
            onDelete={handleDeleteNote}
            t={t}
          />

          {/* Social Accounts */}
          <Card
            id='social-accounts'
            className='border-default-200/50 hover:border-purple/20 scroll-mt-24 shadow-sm transition-all duration-300 hover:shadow-md'
          >
            <CardHeader className='pb-4'>
              <div className='flex w-full items-center justify-between'>
                <div className='flex items-center gap-4'>
                  <div className='bg-purple/10 rounded-full p-3'>
                    <Icon icon='solar:link-circle-linear' className='text-purple h-5 w-5' />
                  </div>
                  <div>
                    <h3 className='text-foreground text-lg font-semibold'>Social Accounts</h3>
                    <p className='text-small text-foreground-500 mt-1'>
                      Connect with me on social platforms
                    </p>
                  </div>
                </div>

                {isOwnProfile && (
                  <ActionButtons
                    showAdd
                    onAdd={handleEditSocialAccounts}
                    addTooltip='Add new social account'
                    size='md'
                  />
                )}
              </div>
            </CardHeader>
            <CardBody className='px-8 pt-2'>
              {localSocialAccounts.some((account) => account.isPublic) ? (
                <div className='grid grid-cols-2 gap-3'>
                  {localSocialAccounts
                    .filter((account) => account.isPublic)
                    .map((account, index) => (
                      <SocialAccountCard
                        key={account.id || index}
                        account={account}
                        isOwnProfile={isOwnProfile}
                        onEdit={() => {
                          handleEditSocialAccount(account);
                        }}
                        onDelete={() => {
                          handleDeleteSocialAccount(account.id);
                        }}
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
                    <p className='text-foreground-500 mb-4'>No social accounts available</p>
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
            <Card
              id='contact'
              className='border-default-200/50 hover:border-danger/20 scroll-mt-24 shadow-sm transition-all duration-300 hover:shadow-md'
            >
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
          <Card className='border-primary/20 from-primary/5 to-secondary/5 hover:border-primary/30 hover:from-primary/8 hover:to-secondary/8 bg-gradient-to-br shadow-sm transition-all duration-300 hover:shadow-lg'>
            <CardBody className='p-8 text-center'>
              <div className='mx-auto mb-4 h-20 w-20'>
                {user.profileImage?.trim() ? (
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

      <AboutMeModal
        isOpen={isAboutMeModalOpen}
        onClose={() => {
          setIsAboutMeModalOpen(false);
        }}
        currentAboutMe={localUser.aboutMe || ''}
        onSuccess={handleAboutMeSuccess}
        addToast={addToast}
      />

      <SkillsModal
        isOpen={isSkillsModalOpen}
        onClose={() => {
          setIsSkillsModalOpen(false);
        }}
        userSkills={
          user.skills.map((skill) => ({
            ...skill,
            id: crypto.randomUUID()
          })) as any
        }
        onSuccess={handleSkillsSuccess}
        addToast={addToast}
      />

      {/* Certifications Modal */}
      <Modal
        isOpen={isCertificationsModalOpen}
        onClose={() => {
          setIsCertificationsModalOpen(false);
        }}
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
            <Button
              variant='light'
              onPress={() => {
                setIsCertificationsModalOpen(false);
              }}
            >
              Cancel
            </Button>
            <Button color='primary' onPress={handleSaveCertifications}>
              Save Changes
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Individual Experience Item Modal */}
      <ExperienceModal
        isOpen={editingExperience.isOpen}
        onClose={() => {
          setEditingExperience({ item: null, isOpen: false });
        }}
        experience={editingExperience.item}
        onSuccess={handleExperienceSuccess}
        addToast={addToast}
      />

      {/* Individual Education Item Modal */}
      <EducationModal
        isOpen={editingEducation.isOpen}
        onClose={() => {
          setEditingEducation({ item: null, isOpen: false });
        }}
        education={editingEducation.item}
        onSuccess={handleEducationSuccess}
        addToast={addToast}
      />

      {/* Individual Language Item Modal */}
      <LanguageModal
        isOpen={editingLanguage.isOpen}
        onClose={() => {
          setEditingLanguage({ item: null, isOpen: false });
        }}
        language={editingLanguage.item}
        onSuccess={handleLanguageSuccess}
        addToast={addToast}
      />
      <ProjectModal
        isOpen={isProjectModalOpen}
        onClose={() => {
          setIsProjectModalOpen(false);
        }}
        project={editingProject.item}
        onSuccess={handleProjectSuccess}
        addToast={addToast}
      />
      <ServiceModal
        isOpen={isServiceModalOpen}
        onClose={() => {
          setIsServiceModalOpen(false);
        }}
        service={editingService.item}
        onSuccess={handleServiceSuccess}
        addToast={addToast}
      />
      <TestimonialModal
        isOpen={isTestimonialModalOpen}
        onClose={() => {
          setIsTestimonialModalOpen(false);
        }}
        testimonial={viewingTestimonial.item}
        onSuccess={handleTestimonialSuccess}
        addToast={addToast}
      />
      <NotesModal
        isOpen={isNotesModalOpen}
        onClose={() => {
          setIsNotesModalOpen(false);
        }}
        userId={user.id}
        onSuccess={handleNotesSuccess}
        addToast={addToast}
      />

      {/* Social Accounts Modal */}
      <Modal
        isOpen={isSocialAccountsModalOpen}
        onClose={() => {
          setIsSocialAccountsModalOpen(false);
        }}
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
            <Button
              variant='light'
              onPress={() => {
                setIsSocialAccountsModalOpen(false);
              }}
            >
              Cancel
            </Button>
            <Button color='primary' onPress={handleSaveSocialAccounts}>
              Save Changes
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
      <ConfirmDeleteModal
        isOpen={educationToDelete.isOpen}
        onOpenChange={(open) => {
          if (!open) setEducationToDelete({ education: null, isOpen: false });
        }}
        onConfirm={confirmDeleteEducation}
        title='Delete Education'
        message={`Are you sure you want to delete the education from ${educationToDelete.education?.university}?`}
        itemName={educationToDelete.education?.degree}
      />
      <ConfirmDeleteModal
        isOpen={experienceToDelete.isOpen}
        onOpenChange={(open) => {
          if (!open) setExperienceToDelete({ experience: null, isOpen: false });
        }}
        onConfirm={confirmDeleteExperience}
        title='Delete Experience'
        message={`Are you sure you want to delete the experience at ${experienceToDelete.experience?.company}?`}
        itemName={experienceToDelete.experience?.position}
      />
      <ConfirmDeleteModal
        isOpen={languageToDelete.isOpen}
        onOpenChange={(open) => {
          if (!open) setLanguageToDelete({ language: null, isOpen: false });
        }}
        onConfirm={confirmDeleteLanguage}
        title='Delete Language'
        message={`Are you sure you want to delete ${getLanguageName(languageToDelete.language?.key)} language?`}
        itemName={getLanguageName(languageToDelete.language?.key)}
      />
      <ConfirmDeleteModal
        isOpen={projectToDelete.isOpen}
        onOpenChange={(open) => {
          if (!open) setProjectToDelete({ project: null, isOpen: false });
        }}
        onConfirm={confirmDeleteProject}
        title='Delete Project'
        message={`Are you sure you want to delete the project from ${projectToDelete.project?.company}?`}
        itemName={projectToDelete.project?.position}
      />
      <ConfirmDeleteModal
        isOpen={serviceToDelete.isOpen}
        onOpenChange={(open) => {
          if (!open) setServiceToDelete({ service: null, isOpen: false });
        }}
        onConfirm={confirmDeleteService}
        title='Delete Service'
        message={`Are you sure you want to delete the service from ${serviceToDelete.service?.name}?`}
        itemName={serviceToDelete.service?.name}
      />
      <ConfirmDeleteModal
        isOpen={testimonialToDelete.isOpen}
        onOpenChange={(open) => {
          if (!open) setTestimonialToDelete({ testimonial: null, isOpen: false });
        }}
        onConfirm={confirmDeleteTestimonial}
        title='Delete Testimonial'
        message={`Are you sure you want to delete the testimonial from ${testimonialToDelete.testimonial?.name}?`}
        itemName={testimonialToDelete.testimonial?.name}
      />

      <ConfirmDeleteModal
        isOpen={noteToDelete.isOpen}
        onOpenChange={(open) => {
          if (!open) setNoteToDelete({ note: null, isOpen: false });
        }}
        onConfirm={confirmDeleteNote}
        title='Delete Note'
        message='Are you sure you want to delete this note? This action cannot be undone.'
        itemName='Note'
      />
    </section>
  );
};

export default ProfileContent;
