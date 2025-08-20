import React, { useEffect, useState } from 'react';

import {
  Button,
  Card,
  CardBody,
  Chip,
  Image,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Progress,
  Select,
  SelectItem,
  Textarea
} from '@heroui/react';
import { Icon } from '@iconify/react';
import { useUpload } from '@root/modules/documents/hooks/useUpload';
import { useQuery } from '@tanstack/react-query';

import { getSkills } from '@/app/private/skills/services/skills.service';

import { PROJECT_PRIORITY_CONFIG, PROJECT_STATUS_CONFIG } from '../constants';

interface UploadResponse {
  filename: string;
  originalName: string;
  size: number;
}

interface Project {
  id?: string;
  title: string;
  summary: string;
  backgroundImage?: string;
  skills: string[];
  priority?: string;
  status?: string;
  startDate?: string;
  endDate?: string;
}

interface ProjectModalProperties {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (project: Project) => Promise<void>;
  project?: Project | null;
  teamId: string;
  isLoading?: boolean;
}

export const ProjectModal: React.FC<ProjectModalProperties> = ({
  isOpen,
  onClose,
  onSubmit,
  project,
  teamId,
  isLoading = false
}) => {
  const upload = useUpload();
  const [formData, setFormData] = useState<Project>({
    title: '',
    summary: '',
    backgroundImage: '',
    skills: []
  });

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Fetch skills using React Query
  const { data: skills = [], isLoading: skillsLoading } = useQuery({
    queryKey: ['skills'],
    queryFn: () => getSkills(),
    enabled: isOpen
  });

  // Initialize form data when modal opens or project changes
  useEffect(() => {
    if (isOpen) {
      if (project) {
        setFormData({
          title: project.title || '',
          summary: project.summary || '',
          backgroundImage: project.backgroundImage ?? '',
          skills: project.skills,
          priority: project.priority ?? 'MEDIUM',
          status: project.status ?? 'PLANNING',
          startDate: project.startDate ?? '',
          endDate: project.endDate ?? ''
        });
        if (project.backgroundImage) {
          setPreviewUrl(`/upload/${project.backgroundImage}`);
        }
      } else {
        // Reset form for new project
        setFormData({
          title: '',
          summary: '',
          backgroundImage: '',
          skills: []
        });
        setPreviewUrl('');
      }
      setSelectedFile(null);
      setErrors({});
      setUploadProgress(0);
    }
  }, [isOpen, project]);

  const handleInputChange = (field: keyof Project, value: any) => {
    setFormData((previous) => ({
      ...previous,
      [field]: value
    }));

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((previous) => {
        const newErrors = { ...previous };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        setErrors((previous) => ({ ...previous, backgroundImage: 'Please select an image file' }));
        return;
      }

      // Validate file size (5MB limit)
      if (file.size > 5 * 1024 * 1024) {
        setErrors((previous) => ({
          ...previous,
          backgroundImage: 'File size must be less than 5MB'
        }));
        return;
      }

      setSelectedFile(file);

      // Create preview URL
      const reader = new FileReader();
      reader.addEventListener('load', (e) => {
        setPreviewUrl(e.target?.result as string);
      });
      reader.readAsDataURL(file);

      // Clear any existing error
      setErrors((previous) => {
        const newErrors = { ...previous };
        delete newErrors.backgroundImage;
        return newErrors;
      });
    }
  };

  const handleUploadImage = async (): Promise<string | null> => {
    if (!selectedFile) return formData.backgroundImage || null;

    try {
      setIsUploading(true);
      setUploadProgress(0);

      // Simulate progress for better UX
      const progressInterval = setInterval(() => {
        setUploadProgress((previous) => Math.min(previous + 10, 90));
      }, 100);

      const uploadResponse = (await upload.uploadeFileSingle(selectedFile)) as UploadResponse;

      clearInterval(progressInterval);
      setUploadProgress(100);

      return uploadResponse.filename;
    } catch (error) {
      console.error('Upload failed:', error);
      setErrors((previous) => ({ ...previous, backgroundImage: 'Failed to upload image' }));
      return null;
    } finally {
      setIsUploading(false);
      setTimeout(() => {
        setUploadProgress(0);
      }, 1000);
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }

    if (!formData.summary.trim()) {
      newErrors.summary = 'Summary is required';
    }

    if (formData.skills.length === 0) {
      newErrors.skills = 'At least one skill is required';
    }

    if (
      formData.startDate &&
      formData.endDate &&
      new Date(formData.startDate) >= new Date(formData.endDate)
    ) {
      newErrors.endDate = 'End date must be after start date';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    try {
      let backgroundImage = formData.backgroundImage;

      // Upload image if a new file is selected
      if (selectedFile) {
        const uploadedFilename = await handleUploadImage();
        if (!uploadedFilename) return; // Upload failed
        backgroundImage = uploadedFilename;
      }

      const projectData: Project = {
        ...formData,
        backgroundImage,
        skills: formData.skills.filter(Boolean) // Remove empty skills
      };
      console.log('projectData', projectData);

      await onSubmit(projectData);
      onClose();
    } catch (error) {
      console.error('Failed to save project:', error);
      setErrors((previous) => ({
        ...previous,
        submit: 'Failed to save project. Please try again.'
      }));
    }
  };

  const handleSkillChange = (selectedKeys: Set<string>) => {
    const skillsArray = [...selectedKeys];
    handleInputChange('skills', skillsArray);
  };

  const removeSkill = (skillToRemove: string) => {
    const updatedSkills = formData.skills.filter((skill) => skill !== skillToRemove);
    handleInputChange('skills', updatedSkills);
  };

  const isFormValid =
    formData.title.trim() && formData.summary.trim() && formData.skills.length > 0;
  const isSubmitting = isLoading || isUploading;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size='2xl'
      scrollBehavior='inside'
      classNames={{
        base: 'max-h-[90vh]',
        body: 'py-6',
        header: 'border-b border-divider',
        footer: 'border-t border-divider'
      }}
    >
      <ModalContent>
        <ModalHeader className='flex flex-col gap-1'>
          <h2 className='text-xl font-semibold'>
            {project ? 'Edit Project' : 'Create New Project'}
          </h2>
          <p className='text-default-600 text-sm'>
            {project ? 'Update project details' : 'Add a new project to your team'}
          </p>
        </ModalHeader>

        <ModalBody className='space-y-6'>
          {/* Background Image Upload */}
          <div className='space-y-3'>
            <label className='text-foreground text-sm font-medium'>Background Image</label>

            <div className='relative'>
              {previewUrl ? (
                <div className='relative'>
                  <Image
                    src={previewUrl}
                    alt='Project background'
                    className='h-32 w-full rounded-lg object-cover'
                  />
                  <Button
                    isIconOnly
                    size='sm'
                    color='danger'
                    variant='solid'
                    className='absolute top-2 right-2'
                    onPress={() => {
                      setPreviewUrl('');
                      setSelectedFile(null);
                      handleInputChange('backgroundImage', '');
                    }}
                  >
                    <Icon icon='solar:trash-bin-minimalistic-linear' className='h-4 w-4' />
                  </Button>
                </div>
              ) : (
                <Card className='border-default-200 hover:border-default-300 border-2 border-dashed transition-colors'>
                  <CardBody className='flex flex-col items-center justify-center py-8 text-center'>
                    <Icon
                      icon='solar:cloud-upload-linear'
                      className='text-default-400 mb-2 h-8 w-8'
                    />
                    <p className='text-default-600 mb-2 text-sm'>
                      Click to upload background image
                    </p>
                    <p className='text-default-400 text-xs'>PNG, JPG up to 5MB</p>
                  </CardBody>
                </Card>
              )}

              <input
                type='file'
                accept='image/*'
                onChange={handleFileSelect}
                className='absolute inset-0 h-full w-full cursor-pointer opacity-0'
              />
            </div>

            {isUploading && (
              <div className='space-y-2'>
                <Progress
                  value={uploadProgress}
                  color='primary'
                  size='sm'
                  label='Uploading image...'
                />
              </div>
            )}

            {errors.backgroundImage && (
              <p className='text-danger text-xs'>{errors.backgroundImage}</p>
            )}
          </div>

          {/* Title */}
          <Input
            label='Project Title'
            placeholder='Enter project title'
            value={formData.title}
            onValueChange={(value) => {
              handleInputChange('title', value);
            }}
            isInvalid={!!errors.title}
            errorMessage={errors.title}
            isRequired
          />

          {/* Summary */}
          <Textarea
            label='Project Summary'
            placeholder='Describe your project...'
            value={formData.summary}
            onValueChange={(value) => {
              handleInputChange('summary', value);
            }}
            minRows={3}
            maxRows={6}
            isInvalid={!!errors.summary}
            errorMessage={errors.summary}
            isRequired
          />

          {/* Skills Selection */}
          <div className='space-y-3'>
            <Select
              label='Required Skills'
              placeholder='Select skills for this project'
              selectionMode='multiple'
              selectedKeys={new Set(formData.skills)}
              onSelectionChange={handleSkillChange}
              isLoading={skillsLoading}
              isInvalid={!!errors.skills}
              errorMessage={errors.skills}
              isRequired
            >
              {skills.map((skill: any) => (
                <SelectItem key={skill.id}>{skill.key}</SelectItem>
              ))}
            </Select>

            {/* Selected Skills Display */}
            {formData.skills.length > 0 && (
              <div className='flex flex-wrap gap-2'>
                {formData.skills.map((skillId) => {
                  const skill = skills.find((s: any) => s.id === skillId);
                  return skill ? (
                    <Chip
                      key={skillId}
                      onClose={() => {
                        removeSkill(skillId);
                      }}
                      variant='flat'
                      color='primary'
                      size='sm'
                    >
                      {skill.key}
                    </Chip>
                  ) : null;
                })}
              </div>
            )}
          </div>

          {errors.submit && (
            <div className='bg-danger-50 border-danger-200 rounded-lg border p-3'>
              <p className='text-danger text-sm'>{errors.submit}</p>
            </div>
          )}
        </ModalBody>

        <ModalFooter>
          <Button variant='light' onPress={onClose} isDisabled={isSubmitting}>
            Cancel
          </Button>
          <Button
            color='primary'
            onPress={handleSubmit}
            isDisabled={!isFormValid}
            isLoading={isSubmitting}
            startContent={
              isSubmitting ? undefined : (
                <Icon
                  icon={project ? 'solar:pen-bold' : 'solar:add-circle-bold'}
                  className='h-4 w-4'
                />
              )
            }
          >
            {project ? 'Update Project' : 'Create Project'}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
