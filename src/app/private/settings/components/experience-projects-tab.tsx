import type { IUserProfile } from '@root/modules/profile/types';
import type {
  ExperienceFormData,
  ProjectsFormData
} from '@root/modules/settings/schema/settings.schema';

import { Button, Card, CardBody, CardHeader, Input } from '@heroui/react';
import { zodResolver } from '@hookform/resolvers/zod';
import { type IExperience } from '@root/modules/profile/types';
import useSettings from '@root/modules/settings/hooks/use-settings';
import { experienceSchema } from '@root/modules/settings/schema/settings.schema';
import { Plus, Save, X } from 'lucide-react';
import { useFieldArray, useForm } from 'react-hook-form';

interface ExperienceProjectsTabProperties {
  user: IUserProfile;
  projects: IExperience[];
  experiences: IExperience[];
}

export default function ExperienceProjectsTab({
  user,
  projects,
  experiences
}: Readonly<ExperienceProjectsTabProperties>) {
  const { updateExperience, updateProjects, isUpdatingExperience, isUpdatingProjects } =
    useSettings(user.id);
  // Experience Form
  const experienceForm = useForm<ExperienceFormData>({
    resolver: zodResolver(experienceSchema),
    defaultValues: {
      experience: experiences
    }
  });

  const {
    fields: experienceFields,
    append: appendExperience,
    remove: removeExperience
  } = useFieldArray({
    control: experienceForm.control,
    name: 'experience'
  });

  // Projects Form
  const projectsForm = useForm<ExperienceFormData>({
    resolver: zodResolver(experienceSchema),
    defaultValues: {
      project: projects
    }
  });

  const {
    fields: projectFields,
    append: appendProject,
    remove: removeProject
  } = useFieldArray({
    control: projectsForm.control,
    name: 'projects'
  });

  const onSubmitExperience = async (data: ExperienceFormData) => {
    updateExperience(data);
  };

  const onSubmitProjects = async (data: ExperienceFormData) => {
    updateProjects(data);
  };

  return (
    <div className='space-y-8'>
      {/* Experience */}
      <Card>
        <CardHeader>
          <h3 className='text-xl font-semibold'>Work Experience</h3>
        </CardHeader>
        <CardBody>
          <form onSubmit={experienceForm.handleSubmit(onSubmitExperience)} className='space-y-6'>
            <div className='space-y-4'>
              {experienceFields.map((field, index) => (
                <div
                  key={field.id}
                  className='space-y-4 rounded-lg border border-gray-200 p-4 dark:border-gray-700'
                >
                  <div className='flex items-center justify-between'>
                    <h4 className='font-medium'>Experience {index + 1}</h4>
                    <Button
                      isIconOnly
                      color='danger'
                      variant='light'
                      size='sm'
                      onPress={() => {
                        removeExperience(index);
                      }}
                    >
                      <X size={16} />
                    </Button>
                  </div>

                  <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
                    <Input
                      {...experienceForm.register(`experience.${index}.position`)}
                      label='Position'
                      placeholder='Senior Developer'
                      errorMessage={
                        experienceForm.formState.errors.experience?.[index]?.position?.message
                      }
                      isInvalid={!!experienceForm.formState.errors.experience?.[index]?.position}
                    />
                    <Input
                      {...experienceForm.register(`experience.${index}.company`)}
                      label='Company'
                      placeholder='Tech Corp'
                      errorMessage={
                        experienceForm.formState.errors.experience?.[index]?.company?.message
                      }
                      isInvalid={!!experienceForm.formState.errors.experience?.[index]?.company}
                    />
                  </div>

                  <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
                    <Input
                      {...experienceForm.register(`experience.${index}.startDate`)}
                      type='date'
                      label='Start Date'
                      errorMessage={
                        experienceForm.formState.errors.experience?.[index]?.startDate?.message
                      }
                      isInvalid={!!experienceForm.formState.errors.experience?.[index]?.startDate}
                    />
                    <Input
                      {...experienceForm.register(`experience.${index}.endDate`)}
                      type='date'
                      label='End Date (Leave empty if current)'
                      errorMessage={
                        experienceForm.formState.errors.experience?.[index]?.endDate?.message
                      }
                      isInvalid={!!experienceForm.formState.errors.experience?.[index]?.endDate}
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className='flex gap-2'>
              <Button
                color='secondary'
                variant='flat'
                startContent={<Plus size={18} />}
                onPress={() => {
                  appendExperience({
                    id: Date.now().toString(),
                    position: '',
                    company: '',
                    startDate: '',
                    endDate: ''
                  });
                }}
              >
                Add Experience
              </Button>
              <Button
                type='submit'
                color='primary'
                isLoading={isUpdatingExperience}
                startContent={<Save size={18} />}
              >
                Save Experience
              </Button>
            </div>
          </form>
        </CardBody>
      </Card>

      {/* Projects */}
      <Card>
        <CardHeader>
          <h3 className='text-xl font-semibold'>Projects</h3>
        </CardHeader>
        <CardBody>
          <form onSubmit={projectsForm.handleSubmit(onSubmitProjects)} className='space-y-6'>
            <div className='space-y-4'>
              {projectFields.map((field, index) => (
                <div
                  key={field.id}
                  className='space-y-4 rounded-lg border border-gray-200 p-4 dark:border-gray-700'
                >
                  <div className='flex items-center justify-between'>
                    <h4 className='font-medium'>Project {index + 1}</h4>
                    <Button
                      isIconOnly
                      color='danger'
                      variant='light'
                      size='sm'
                      onPress={() => {
                        removeProject(index);
                      }}
                    >
                      <X size={16} />
                    </Button>
                  </div>

                  <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
                    <Input
                      {...projectsForm.register(`projects.${index}.name`)}
                      label='Project Name'
                      placeholder='E-commerce Platform'
                      errorMessage={projectsForm.formState.errors.projects?.[index]?.name?.message}
                      isInvalid={!!projectsForm.formState.errors.projects?.[index]?.name}
                    />
                    <Input
                      {...projectsForm.register(`projects.${index}.company`)}
                      label='Company'
                      placeholder='Tech Corp'
                      errorMessage={
                        projectsForm.formState.errors.projects?.[index]?.company?.message
                      }
                      isInvalid={!!projectsForm.formState.errors.projects?.[index]?.company}
                    />
                  </div>

                  <Input
                    {...projectsForm.register(`projects.${index}.image`)}
                    label='Project Image URL'
                    placeholder='https://example.com/project-image.jpg'
                    errorMessage={projectsForm.formState.errors.projects?.[index]?.image?.message}
                    isInvalid={!!projectsForm.formState.errors.projects?.[index]?.image}
                  />
                </div>
              ))}
            </div>

            <div className='flex gap-2'>
              <Button
                color='secondary'
                variant='flat'
                startContent={<Plus size={18} />}
                onPress={() => {
                  appendProject({
                    id: Date.now().toString(),
                    name: '',
                    company: '',
                    image: ''
                  });
                }}
              >
                Add Project
              </Button>
              <Button
                type='submit'
                color='primary'
                isLoading={isUpdatingProjects}
                startContent={<Save size={18} />}
              >
                Save Projects
              </Button>
            </div>
          </form>
        </CardBody>
      </Card>
    </div>
  );
}
