import React, { useState, useEffect } from 'react';
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Input,
  Textarea,
  Spinner
} from '@heroui/react';
import { Icon } from '@iconify/react';
import wingManApi from '@/lib/axios';

interface ProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  project?: Experience | null;
  onSuccess: () => void;
  addToast: (message: string, type: 'success' | 'error') => void;
}

const ProjectModal: React.FC<ProjectModalProps> = ({
  isOpen,
  onClose,
  project = null,
  onSuccess,
  addToast
}) => {
  const [formData, setFormData] = useState({
    title: '',
    company: '',
    position: '',
    startDate: '',
    endDate: '',
    description: '',
    location: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isCurrentProject, setIsCurrentProject] = useState(false);

  const isEditing = Boolean(project?.id);

  // Update form data when project changes
  useEffect(() => {
    if (project && isOpen) {
      setFormData({
        title: project.title || '',
        company: project.company || '',
        position: project.position || '',
        startDate: project.startDate || '',
        endDate: project.endDate || '',
        description: project.description || '',
        location: project.location || ''
      });
      setIsCurrentProject(!project.endDate);
    } else if (isOpen) {
      // Reset form for new project
      setFormData({
        title: '',
        company: '',
        position: '',
        startDate: '',
        endDate: '',
        description: '',
        location: ''
      });
      setIsCurrentProject(false);
    }
  }, [project, isOpen]);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleCurrentProjectChange = (checked: boolean) => {
    setIsCurrentProject(checked);
    if (checked) {
      setFormData(prev => ({ ...prev, endDate: '' }));
    }
  };

  const validateForm = () => {
    const requiredFields = ['title', 'company', 'position', 'startDate'];
    
    for (const field of requiredFields) {
      if (!formData[field as keyof typeof formData]?.trim()) {
        addToast(`Please fill in the ${field.replace(/([A-Z])/g, ' $1').toLowerCase()}`, 'error');
        return false;
      }
    }

    // Validate dates
    const startDate = new Date(formData.startDate);
    const endDate = formData.endDate ? new Date(formData.endDate) : null;

    if (endDate && startDate >= endDate) {
      addToast('End date must be after start date', 'error');
      return false;
    }

    return true;
  };

  const handleSave = async () => {
    if (!validateForm()) return;

    setIsLoading(true);

    try {
      const projectData = {
        ...formData,
        endDate: isCurrentProject ? null : formData.endDate || null
      };

      if (isEditing) {
        await wingManApi.patch(`/experience/${project.id}`, projectData);
        addToast('Project updated successfully', 'success');
      } else {
        await wingManApi.post('/experience', projectData);
        addToast('Project added successfully', 'success');
      }

      onSuccess();
      onClose();
    } catch (error: any) {
      console.error('Error saving project:', error);
      
      let errorMessage = `Failed to ${isEditing ? 'update' : 'add'} project`;
      
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.response?.status === 400) {
        errorMessage = 'Invalid data provided. Please check your input.';
      } else if (error.response?.status === 401) {
        errorMessage = 'You are not authorized to perform this action.';
      } else if (error.response?.status >= 500) {
        errorMessage = 'Server error. Please try again later.';
      }

      addToast(errorMessage, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setFormData({
      title: '',
      company: '',
      position: '',
      startDate: '',
      endDate: '',
      description: '',
      location: ''
    });
    setIsCurrentProject(false);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      size="3xl"
      scrollBehavior="inside"
      isDismissable={!isLoading}
      hideCloseButton={isLoading}
    >
      <ModalContent>
        <ModalHeader className="flex items-center gap-3">
          <div className="bg-primary/20 rounded-xl p-2">
            <Icon icon="solar:code-square-linear" className="text-primary h-5 w-5" />
          </div>
          <div>
            <h2 className="text-xl font-semibold">
              {isEditing ? 'Edit Project' : 'Add New Project'}
            </h2>
            <p className="text-foreground-500 text-sm">
              {isEditing ? 'Update project details' : 'Share details about your project'}
            </p>
          </div>
        </ModalHeader>
        
        <ModalBody className="gap-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Project Title"
              placeholder="e.g., E-commerce Platform"
              value={formData.title}
              onValueChange={(value) => handleInputChange('title', value)}
              isRequired
              variant="bordered"
              disabled={isLoading}
            />

            <Input
              label="Company/Client"
              placeholder="e.g., Tech Solutions Inc."
              value={formData.company}
              onValueChange={(value) => handleInputChange('company', value)}
              isRequired
              variant="bordered"
              disabled={isLoading}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Your Role"
              placeholder="e.g., Full Stack Developer"
              value={formData.position}
              onValueChange={(value) => handleInputChange('position', value)}
              isRequired
              variant="bordered"
              disabled={isLoading}
            />

            <Input
              label="Location"
              placeholder="e.g., Remote, New York"
              value={formData.location}
              onValueChange={(value) => handleInputChange('location', value)}
              variant="bordered"
              disabled={isLoading}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Start Date"
              type="date"
              value={formData.startDate}
              onValueChange={(value) => handleInputChange('startDate', value)}
              isRequired
              variant="bordered"
              disabled={isLoading}
            />

            <div className="space-y-2">
              <Input
                label="End Date"
                type="date"
                value={formData.endDate}
                onValueChange={(value) => handleInputChange('endDate', value)}
                variant="bordered"
                disabled={isLoading || isCurrentProject}
              />
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="currentProject"
                  checked={isCurrentProject}
                  onChange={(e) => handleCurrentProjectChange(e.target.checked)}
                  disabled={isLoading}
                  className="rounded"
                />
                <label htmlFor="currentProject" className="text-sm text-foreground-600">
                  This is an ongoing project
                </label>
              </div>
            </div>
          </div>

          <Textarea
            label="Project Description"
            placeholder="Describe the project, your contributions, technologies used, and key achievements..."
            value={formData.description}
            onValueChange={(value) => handleInputChange('description', value)}
            minRows={4}
            variant="bordered"
            disabled={isLoading}
          />
        </ModalBody>
        
        <ModalFooter className="gap-3">
          <Button
            variant="light"
            onPress={handleClose}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button
            color="primary"
            onPress={handleSave}
            disabled={isLoading}
            startContent={
              isLoading ? (
                <Spinner size="sm" color="white" />
              ) : (
                <Icon icon="solar:check-linear" className="h-4 w-4" />
              )
            }
          >
            {isLoading ? 'Saving...' : isEditing ? 'Update Project' : 'Add Project'}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default ProjectModal;