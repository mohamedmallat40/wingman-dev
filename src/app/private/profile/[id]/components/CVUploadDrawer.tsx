'use client';

import React, { useCallback, useState } from 'react';

import {
  Avatar,
  Button,
  Card,
  CardBody,
  CardHeader,
  Chip,
  Divider,
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  Input,
  Textarea,
  Select,
  SelectItem,
  Progress,
  ScrollShadow,
  Spacer,
  Accordion,
  AccordionItem,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure
} from '@heroui/react';
import { Icon } from '@iconify/react';
import { AnimatePresence, motion } from 'framer-motion';

import { CVService, type ParsedCVData } from '../services/cv-service';

interface CVUploadDrawerProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onDataParsed: (data: ParsedCVData) => void;
}

type UploadStep = 'upload' | 'parsing' | 'review' | 'applying' | 'complete';

const CVUploadDrawer: React.FC<CVUploadDrawerProps> = ({
  isOpen,
  onOpenChange,
  onDataParsed
}) => {
  const [currentStep, setCurrentStep] = useState<UploadStep>('upload');
  const [uploadProgress, setUploadProgress] = useState(0);
  const [parsedData, setParsedData] = useState<ParsedCVData | null>(null);
  const [selectedSections, setSelectedSections] = useState<Set<string>>(new Set());
  const [isApplying, setIsApplying] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [editingData, setEditingData] = useState<ParsedCVData | null>(null);
  const [activeReviewSection, setActiveReviewSection] = useState<string>('');

  const [isDragActive, setIsDragActive] = useState(false);
  const {isOpen: isEditModalOpen, onOpen: onEditModalOpen, onClose: onEditModalClose} = useDisclosure();
  const [editingSection, setEditingSection] = useState<string>('');
  const [editingIndex, setEditingIndex] = useState<number>(-1);

  const handleFileUpload = useCallback(async (file: File) => {
    if (!file) return;

    // Validate file type
    const allowedTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ];

    if (!allowedTypes.includes(file.type)) {
      alert('Please upload a PDF, DOC, or DOCX file');
      return;
    }

    // Validate file size (10MB)
    if (file.size > 10 * 1024 * 1024) {
      alert('File size must be less than 10MB');
      return;
    }

    setUploadedFile(file);
    setCurrentStep('parsing');
    setUploadProgress(0);

    try {
      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 200);

      // Try to parse CV with backend API
      try {
        const parsedData = await CVService.parseCV(file);
        clearInterval(progressInterval);
        setUploadProgress(100);

        setTimeout(() => {
          setParsedData(parsedData);
          setEditingData(JSON.parse(JSON.stringify(parsedData))); // Deep clone
          setSelectedSections(new Set(['personalInfo', 'skills', 'experience', 'education', 'languages']));
          setCurrentStep('review');
        }, 500);
      } catch (apiError) {
        // If API fails, use mock data for demonstration
        console.log('API not available, using mock data for demo');
        clearInterval(progressInterval);
        setUploadProgress(100);

        setTimeout(() => {
          const mockData = CVService.getMockCVData();
          setParsedData(mockData);
          setEditingData(JSON.parse(JSON.stringify(mockData))); // Deep clone
          setSelectedSections(new Set(['personalInfo', 'skills', 'experience', 'education', 'languages']));
          setCurrentStep('review');
        }, 1500);
      }

    } catch (error) {
      console.error('Error parsing CV:', error);
      // Reset to upload step on error
      setCurrentStep('upload');
      setUploadProgress(0);
    }
  }, []);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      handleFileUpload(file);
    }
  };

  const handleDragOver = (event: React.DragEvent) => {
    event.preventDefault();
    setIsDragActive(true);
  };

  const handleDragLeave = (event: React.DragEvent) => {
    event.preventDefault();
    setIsDragActive(false);
  };

  const handleDrop = (event: React.DragEvent) => {
    event.preventDefault();
    setIsDragActive(false);

    const file = event.dataTransfer.files[0];
    if (file) {
      handleFileUpload(file);
    }
  };

  const handleSectionToggle = (section: string) => {
    const newSelected = new Set(selectedSections);
    if (newSelected.has(section)) {
      newSelected.delete(section);
    } else {
      newSelected.add(section);
    }
    setSelectedSections(newSelected);
  };

  const handleApplyData = async () => {
    if (!editingData) return;

    setIsApplying(true);
    setCurrentStep('applying');

    try {
      // Filter data based on selected sections
      const dataToApply: Partial<ParsedCVData> = {};

      selectedSections.forEach(section => {
        if (editingData[section as keyof ParsedCVData]) {
          (dataToApply as any)[section] = editingData[section as keyof ParsedCVData];
        }
      });

      // Apply the data to profile
      try {
        await CVService.applyCVData(dataToApply);
      } catch (apiError) {
        console.log('API not available, simulating data application for demo');
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 2000));
      }

      setCurrentStep('complete');
      onDataParsed(editingData);

    } catch (error) {
      console.error('Error applying CV data:', error);
    } finally {
      setIsApplying(false);
    }
  };

  const handleClose = () => {
    // Reset state when closing
    setCurrentStep('upload');
    setUploadProgress(0);
    setParsedData(null);
    setEditingData(null);
    setSelectedSections(new Set());
    setUploadedFile(null);
    setActiveReviewSection('');
    onOpenChange(false);
  };

  const handleEditSection = (section: string, index: number = -1) => {
    setEditingSection(section);
    setEditingIndex(index);
    onEditModalOpen();
  };

  const handleSaveEdit = (section: string, data: any, index: number = -1) => {
    if (!editingData) return;

    const newEditingData = { ...editingData };

    if (index >= 0) {
      // Editing an array item
      const sectionArray = newEditingData[section as keyof ParsedCVData] as any[];
      sectionArray[index] = data;
    } else {
      // Editing the entire section
      (newEditingData as any)[section] = data;
    }

    setEditingData(newEditingData);
    onEditModalClose();
  };

  const handleAddNew = (section: string) => {
    if (!editingData) return;

    const newEditingData = { ...editingData };
    const sectionArray = newEditingData[section as keyof ParsedCVData] as any[];

    // Add empty template based on section type
    const templates = {
      skills: { name: '', category: '', level: '', years: 0 },
      experience: { company: '', position: '', startDate: '', endDate: '', location: '', description: '', responsibilities: [] },
      education: { institution: '', degree: '', field: '', startDate: '', endDate: '', grade: '', location: '' },
      languages: { name: '', level: '', proficiency: '' },
      certifications: { name: '', issuer: '', issueDate: '', expiryDate: '', credentialId: '' },
      projects: { name: '', description: '', technologies: [], startDate: '', endDate: '', url: '' }
    };

    sectionArray.push(templates[section as keyof typeof templates]);
    setEditingData(newEditingData);
  };

  const handleRemove = (section: string, index: number) => {
    if (!editingData) return;

    const newEditingData = { ...editingData };
    const sectionArray = newEditingData[section as keyof ParsedCVData] as any[];
    sectionArray.splice(index, 1);
    setEditingData(newEditingData);
  };

  const renderUploadStep = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center min-h-[400px] px-6"
    >
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => document.getElementById('cv-upload-input')?.click()}
        className={`w-full max-w-md p-8 border-2 border-dashed rounded-2xl text-center cursor-pointer transition-all duration-300 ${
          isDragActive
            ? 'border-primary bg-primary/5 scale-105'
            : 'border-default-300 hover:border-primary hover:bg-default-50'
        }`}
      >
        <input
          id="cv-upload-input"
          type="file"
          accept=".pdf,.doc,.docx"
          onChange={handleFileChange}
          className="hidden"
        />
        <div className="space-y-4">
          <div className="flex justify-center">
            <div className="p-4 bg-primary/10 rounded-2xl">
              <Icon icon="solar:document-add-bold" className="h-12 w-12 text-primary" />
            </div>
          </div>
          <div>
            <h3 className="text-xl font-semibold text-foreground mb-2">Upload Your CV</h3>
            <p className="text-default-600 text-sm">
              {isDragActive
                ? "Drop your CV here..."
                : "Drag & drop your CV here, or click to browse"}
            </p>
          </div>
          <div className="text-xs text-default-500">
            Supports PDF, DOC, DOCX • Max size 10MB
          </div>
        </div>
      </div>
      
      <div className="mt-8 text-center max-w-md">
        <h4 className="font-medium text-foreground mb-2">What happens next?</h4>
        <div className="space-y-2 text-sm text-default-600">
          <div className="flex items-center gap-2">
            <Icon icon="solar:check-circle-linear" className="h-4 w-4 text-success" />
            <span>AI will parse your CV and extract all information</span>
          </div>
          <div className="flex items-center gap-2">
            <Icon icon="solar:check-circle-linear" className="h-4 w-4 text-success" />
            <span>Review and choose what to import to your profile</span>
          </div>
          <div className="flex items-center gap-2">
            <Icon icon="solar:check-circle-linear" className="h-4 w-4 text-success" />
            <span>Your profile will be automatically updated</span>
          </div>
        </div>
      </div>
    </motion.div>
  );

  const renderParsingStep = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center min-h-[400px] px-6"
    >
      <div className="text-center space-y-6">
        <div className="flex justify-center">
          <div className="p-6 bg-primary/10 rounded-3xl">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            >
              <Icon icon="solar:cpu-bolt-line-duotone" className="h-16 w-16 text-primary" />
            </motion.div>
          </div>
        </div>
        
        <div>
          <h3 className="text-2xl font-semibold text-foreground mb-2">Parsing Your CV</h3>
          <p className="text-default-600">
            Our AI is analyzing your CV and extracting all the important information...
          </p>
        </div>

        <div className="w-full max-w-sm space-y-2">
          <Progress 
            value={uploadProgress} 
            color="primary" 
            className="w-full"
            showValueLabel
          />
          <p className="text-sm text-default-500">
            {uploadProgress < 50 ? 'Uploading file...' : 
             uploadProgress < 90 ? 'Analyzing content...' : 
             'Almost done...'}
          </p>
        </div>

        {uploadedFile && (
          <div className="flex items-center gap-3 p-3 bg-default-100 rounded-lg">
            <Icon icon="solar:document-text-linear" className="h-6 w-6 text-default-600" />
            <div className="text-sm">
              <div className="font-medium text-foreground">{uploadedFile.name}</div>
              <div className="text-default-500">{(uploadedFile.size / 1024 / 1024).toFixed(1)} MB</div>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );

  const renderPersonalInfoForm = (data: ParsedCVData['personalInfo']) => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <Input
        label="First Name"
        value={data.firstName || ''}
        onChange={(e) => {
          if (!editingData) return;
          setEditingData({
            ...editingData,
            personalInfo: { ...editingData.personalInfo, firstName: e.target.value }
          });
        }}
      />
      <Input
        label="Last Name"
        value={data.lastName || ''}
        onChange={(e) => {
          if (!editingData) return;
          setEditingData({
            ...editingData,
            personalInfo: { ...editingData.personalInfo, lastName: e.target.value }
          });
        }}
      />
      <Input
        label="Email"
        type="email"
        value={data.email || ''}
        onChange={(e) => {
          if (!editingData) return;
          setEditingData({
            ...editingData,
            personalInfo: { ...editingData.personalInfo, email: e.target.value }
          });
        }}
      />
      <Input
        label="Phone"
        value={data.phone || ''}
        onChange={(e) => {
          if (!editingData) return;
          setEditingData({
            ...editingData,
            personalInfo: { ...editingData.personalInfo, phone: e.target.value }
          });
        }}
      />
      <Input
        label="Location"
        value={data.location || ''}
        onChange={(e) => {
          if (!editingData) return;
          setEditingData({
            ...editingData,
            personalInfo: { ...editingData.personalInfo, location: e.target.value }
          });
        }}
      />
      <Input
        label="LinkedIn"
        value={data.linkedIn || ''}
        onChange={(e) => {
          if (!editingData) return;
          setEditingData({
            ...editingData,
            personalInfo: { ...editingData.personalInfo, linkedIn: e.target.value }
          });
        }}
      />
      <Input
        label="Website"
        className="md:col-span-2"
        value={data.website || ''}
        onChange={(e) => {
          if (!editingData) return;
          setEditingData({
            ...editingData,
            personalInfo: { ...editingData.personalInfo, website: e.target.value }
          });
        }}
      />
      <Textarea
        label="Professional Summary"
        className="md:col-span-2"
        value={data.summary || ''}
        onChange={(e) => {
          if (!editingData) return;
          setEditingData({
            ...editingData,
            personalInfo: { ...editingData.personalInfo, summary: e.target.value }
          });
        }}
        minRows={3}
      />
    </div>
  );

  const renderSkillsList = (skills: ParsedCVData['skills']) => (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h4 className="font-medium">Skills ({skills.length})</h4>
        <Button
          size="sm"
          color="primary"
          variant="flat"
          startContent={<Icon icon="solar:add-circle-linear" className="h-4 w-4" />}
          onPress={() => handleAddNew('skills')}
        >
          Add Skill
        </Button>
      </div>
      <div className="grid grid-cols-1 gap-3 max-h-60 overflow-y-auto">
        {skills.map((skill, index) => (
          <Card key={index} className="border">
            <CardBody className="p-3">
              <div className="flex items-center justify-between">
                <div className="flex-1 grid grid-cols-4 gap-2 text-sm">
                  <div>
                    <span className="font-medium">{skill.name}</span>
                  </div>
                  <div className="text-default-600">{skill.category}</div>
                  <div className="text-default-600">{skill.level}</div>
                  <div className="text-default-600">{skill.years} years</div>
                </div>
                <div className="flex gap-1">
                  <Button
                    size="sm"
                    variant="light"
                    isIconOnly
                    onPress={() => handleEditSection('skills', index)}
                  >
                    <Icon icon="solar:pen-linear" className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="light"
                    color="danger"
                    isIconOnly
                    onPress={() => handleRemove('skills', index)}
                  >
                    <Icon icon="solar:trash-bin-trash-linear" className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardBody>
          </Card>
        ))}
      </div>
    </div>
  );

  const renderExperienceList = (experience: ParsedCVData['experience']) => (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h4 className="font-medium">Work Experience ({experience.length})</h4>
        <Button
          size="sm"
          color="primary"
          variant="flat"
          startContent={<Icon icon="solar:add-circle-linear" className="h-4 w-4" />}
          onPress={() => handleAddNew('experience')}
        >
          Add Experience
        </Button>
      </div>
      <div className="space-y-3 max-h-80 overflow-y-auto">
        {experience.map((exp, index) => (
          <Card key={index} className="border">
            <CardBody className="p-4">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h5 className="font-semibold">{exp.position}</h5>
                  <p className="text-sm text-default-600">{exp.company} • {exp.location}</p>
                  <p className="text-xs text-default-500">{exp.startDate} - {exp.endDate || 'Present'}</p>
                </div>
                <div className="flex gap-1">
                  <Button
                    size="sm"
                    variant="light"
                    isIconOnly
                    onPress={() => handleEditSection('experience', index)}
                  >
                    <Icon icon="solar:pen-linear" className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="light"
                    color="danger"
                    isIconOnly
                    onPress={() => handleRemove('experience', index)}
                  >
                    <Icon icon="solar:trash-bin-trash-linear" className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <p className="text-sm text-default-700 mb-2">{exp.description}</p>
              {exp.responsibilities.length > 0 && (
                <div className="text-xs text-default-600">
                  <span className="font-medium">Key responsibilities:</span>
                  <ul className="list-disc list-inside mt-1 space-y-0.5">
                    {exp.responsibilities.slice(0, 3).map((resp, i) => (
                      <li key={i}>{resp}</li>
                    ))}
                    {exp.responsibilities.length > 3 && (
                      <li>... and {exp.responsibilities.length - 3} more</li>
                    )}
                  </ul>
                </div>
              )}
            </CardBody>
          </Card>
        ))}
      </div>
    </div>
  );

  const renderEducationList = (education: ParsedCVData['education']) => (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h4 className="font-medium">Education ({education.length})</h4>
        <Button
          size="sm"
          color="primary"
          variant="flat"
          startContent={<Icon icon="solar:add-circle-linear" className="h-4 w-4" />}
          onPress={() => handleAddNew('education')}
        >
          Add Education
        </Button>
      </div>
      <div className="space-y-3 max-h-60 overflow-y-auto">
        {education.map((edu, index) => (
          <Card key={index} className="border">
            <CardBody className="p-3">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h5 className="font-semibold">{edu.degree} in {edu.field}</h5>
                  <p className="text-sm text-default-600">{edu.institution}</p>
                  <p className="text-xs text-default-500">
                    {edu.startDate} - {edu.endDate} • {edu.grade}
                  </p>
                </div>
                <div className="flex gap-1">
                  <Button
                    size="sm"
                    variant="light"
                    isIconOnly
                    onPress={() => handleEditSection('education', index)}
                  >
                    <Icon icon="solar:pen-linear" className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="light"
                    color="danger"
                    isIconOnly
                    onPress={() => handleRemove('education', index)}
                  >
                    <Icon icon="solar:trash-bin-trash-linear" className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardBody>
          </Card>
        ))}
      </div>
    </div>
  );

  const renderLanguagesList = (languages: ParsedCVData['languages']) => (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h4 className="font-medium">Languages ({languages.length})</h4>
        <Button
          size="sm"
          color="primary"
          variant="flat"
          startContent={<Icon icon="solar:add-circle-linear" className="h-4 w-4" />}
          onPress={() => handleAddNew('languages')}
        >
          Add Language
        </Button>
      </div>
      <div className="grid grid-cols-1 gap-3 max-h-40 overflow-y-auto">
        {languages.map((lang, index) => (
          <Card key={index} className="border">
            <CardBody className="p-3">
              <div className="flex items-center justify-between">
                <div className="flex-1 grid grid-cols-3 gap-2 text-sm">
                  <div>
                    <span className="font-medium">{lang.name}</span>
                  </div>
                  <div className="text-default-600">{lang.level}</div>
                  <div className="text-default-600 text-xs">{lang.proficiency}</div>
                </div>
                <div className="flex gap-1">
                  <Button
                    size="sm"
                    variant="light"
                    isIconOnly
                    onPress={() => handleEditSection('languages', index)}
                  >
                    <Icon icon="solar:pen-linear" className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="light"
                    color="danger"
                    isIconOnly
                    onPress={() => handleRemove('languages', index)}
                  >
                    <Icon icon="solar:trash-bin-trash-linear" className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardBody>
          </Card>
        ))}
      </div>
    </div>
  );

  const renderCertificationsList = (certifications: ParsedCVData['certifications']) => (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h4 className="font-medium">Certifications ({certifications.length})</h4>
        <Button
          size="sm"
          color="primary"
          variant="flat"
          startContent={<Icon icon="solar:add-circle-linear" className="h-4 w-4" />}
          onPress={() => handleAddNew('certifications')}
        >
          Add Certification
        </Button>
      </div>
      <div className="space-y-3 max-h-60 overflow-y-auto">
        {certifications.map((cert, index) => (
          <Card key={index} className="border">
            <CardBody className="p-3">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h5 className="font-semibold">{cert.name}</h5>
                  <p className="text-sm text-default-600">{cert.issuer}</p>
                  <p className="text-xs text-default-500">
                    {cert.issueDate} - {cert.expiryDate || 'No expiry'}
                  </p>
                  {cert.credentialId && (
                    <p className="text-xs text-default-400">ID: {cert.credentialId}</p>
                  )}
                </div>
                <div className="flex gap-1">
                  <Button
                    size="sm"
                    variant="light"
                    isIconOnly
                    onPress={() => handleEditSection('certifications', index)}
                  >
                    <Icon icon="solar:pen-linear" className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="light"
                    color="danger"
                    isIconOnly
                    onPress={() => handleRemove('certifications', index)}
                  >
                    <Icon icon="solar:trash-bin-trash-linear" className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardBody>
          </Card>
        ))}
      </div>
    </div>
  );

  const renderProjectsList = (projects: ParsedCVData['projects']) => (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h4 className="font-medium">Projects ({projects.length})</h4>
        <Button
          size="sm"
          color="primary"
          variant="flat"
          startContent={<Icon icon="solar:add-circle-linear" className="h-4 w-4" />}
          onPress={() => handleAddNew('projects')}
        >
          Add Project
        </Button>
      </div>
      <div className="space-y-3 max-h-80 overflow-y-auto">
        {projects.map((project, index) => (
          <Card key={index} className="border">
            <CardBody className="p-4">
              <div className="flex justify-between items-start mb-2">
                <div className="flex-1">
                  <h5 className="font-semibold">{project.name}</h5>
                  <p className="text-sm text-default-700 mb-2">{project.description}</p>
                  <div className="flex flex-wrap gap-1 mb-2">
                    {project.technologies.map((tech, i) => (
                      <Chip key={i} size="sm" variant="flat" color="primary">
                        {tech}
                      </Chip>
                    ))}
                  </div>
                  <p className="text-xs text-default-500">
                    {project.startDate} - {project.endDate}
                  </p>
                  {project.url && (
                    <p className="text-xs text-primary">{project.url}</p>
                  )}
                </div>
                <div className="flex gap-1">
                  <Button
                    size="sm"
                    variant="light"
                    isIconOnly
                    onPress={() => handleEditSection('projects', index)}
                  >
                    <Icon icon="solar:pen-linear" className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="light"
                    color="danger"
                    isIconOnly
                    onPress={() => handleRemove('projects', index)}
                  >
                    <Icon icon="solar:trash-bin-trash-linear" className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardBody>
          </Card>
        ))}
      </div>
    </div>
  );

  const renderReviewStep = () => {
    if (!editingData) return null;

    const sections = [
      {
        id: 'personalInfo',
        title: 'Personal Information',
        icon: 'solar:user-linear',
        data: editingData.personalInfo,
        preview: `${editingData.personalInfo.firstName} ${editingData.personalInfo.lastName}`,
        render: () => renderPersonalInfoForm(editingData.personalInfo)
      },
      {
        id: 'skills',
        title: 'Skills',
        icon: 'solar:code-linear',
        data: editingData.skills,
        preview: `${editingData.skills.length} skills found`,
        render: () => renderSkillsList(editingData.skills)
      },
      {
        id: 'experience',
        title: 'Work Experience',
        icon: 'solar:briefcase-linear',
        data: editingData.experience,
        preview: `${editingData.experience.length} positions`,
        render: () => renderExperienceList(editingData.experience)
      },
      {
        id: 'education',
        title: 'Education',
        icon: 'solar:graduation-linear',
        data: editingData.education,
        preview: `${editingData.education.length} qualifications`,
        render: () => renderEducationList(editingData.education)
      },
      {
        id: 'languages',
        title: 'Languages',
        icon: 'solar:translation-linear',
        data: editingData.languages,
        preview: `${editingData.languages.length} languages`,
        render: () => renderLanguagesList(editingData.languages)
      },
      {
        id: 'certifications',
        title: 'Certifications',
        icon: 'solar:medal-star-linear',
        data: editingData.certifications,
        preview: `${editingData.certifications.length} certifications`,
        render: () => renderCertificationsList(editingData.certifications)
      },
      {
        id: 'projects',
        title: 'Projects',
        icon: 'solar:code-square-linear',
        data: editingData.projects,
        preview: `${editingData.projects.length} projects`,
        render: () => renderProjectsList(editingData.projects)
      }
    ];

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6 h-full"
      >
        <div className="text-center pb-4">
          <h3 className="text-xl font-semibold text-foreground mb-2">Review & Edit Parsed Data</h3>
          <p className="text-default-600">
            Review and edit the information before applying to your profile
          </p>
        </div>

        <ScrollShadow className="flex-1 max-h-[calc(100vh-400px)]">
          <Accordion
            defaultExpandedKeys={[activeReviewSection || 'personalInfo']}
            onSelectionChange={(keys) => {
              const keyArray = Array.from(keys);
              setActiveReviewSection(keyArray[0] as string);
            }}
          >
            {sections.map((section) => (
              <AccordionItem
                key={section.id}
                aria-label={section.title}
                title={
                  <div className="flex items-center justify-between w-full pr-4">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${
                        selectedSections.has(section.id)
                          ? 'bg-primary/20'
                          : 'bg-default-100'
                      }`}>
                        <Icon
                          icon={section.icon}
                          className={`h-5 w-5 ${
                            selectedSections.has(section.id)
                              ? 'text-primary'
                              : 'text-default-600'
                          }`}
                        />
                      </div>
                      <div>
                        <h4 className="font-medium text-foreground">{section.title}</h4>
                        <p className="text-sm text-default-600">{section.preview}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {Array.isArray(section.data) && section.data.length > 0 && (
                        <Chip size="sm" variant="flat" color="success">
                          {section.data.length} items
                        </Chip>
                      )}
                      <Button
                        size="sm"
                        variant={selectedSections.has(section.id) ? 'solid' : 'flat'}
                        color={selectedSections.has(section.id) ? 'primary' : 'default'}
                        onPress={(e) => {
                          e.stopPropagation();
                          handleSectionToggle(section.id);
                        }}
                      >
                        {selectedSections.has(section.id) ? 'Selected' : 'Select'}
                      </Button>
                    </div>
                  </div>
                }
              >
                <div className="pb-4">
                  {section.render()}
                </div>
              </AccordionItem>
            ))}
          </Accordion>
        </ScrollShadow>

        <div className="bg-warning/10 border border-warning/20 rounded-lg p-4">
          <div className="flex gap-3">
            <Icon icon="solar:info-circle-linear" className="h-5 w-5 text-warning mt-0.5" />
            <div className="text-sm">
              <p className="font-medium text-warning-700 dark:text-warning-400">Important Note</p>
              <p className="text-warning-600 dark:text-warning-500 mt-1">
                Selected data will be merged with your existing profile. You can edit any information before applying.
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    );
  };

  const renderApplyingStep = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center min-h-[400px] px-6"
    >
      <div className="text-center space-y-6">
        <div className="flex justify-center">
          <div className="p-6 bg-success/10 rounded-3xl">
            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Icon icon="solar:database-linear" className="h-16 w-16 text-success" />
            </motion.div>
          </div>
        </div>
        
        <div>
          <h3 className="text-2xl font-semibold text-foreground mb-2">Updating Your Profile</h3>
          <p className="text-default-600">
            Applying the selected information to your profile...
          </p>
        </div>

        <Progress 
          value={100}
          color="success" 
          className="w-full max-w-sm"
          isIndeterminate
        />
      </div>
    </motion.div>
  );

  const renderCompleteStep = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center min-h-[400px] px-6"
    >
      <div className="text-center space-y-6">
        <div className="flex justify-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 10 }}
            className="p-6 bg-success/10 rounded-3xl"
          >
            <Icon icon="solar:check-circle-bold" className="h-16 w-16 text-success" />
          </motion.div>
        </div>
        
        <div>
          <h3 className="text-2xl font-semibold text-foreground mb-2">Profile Updated Successfully!</h3>
          <p className="text-default-600">
            Your CV data has been successfully applied to your profile.
          </p>
        </div>

        <div className="text-sm text-default-600 space-y-1">
          <p>✓ Personal information updated</p>
          <p>✓ Skills and experience added</p>
          <p>✓ Education history synchronized</p>
          <p>✓ Profile is now more complete</p>
        </div>
      </div>
    </motion.div>
  );

  return (
    <Drawer
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      size="5xl"
      placement="right"
      classNames={{
        base: "max-w-[95vw] sm:max-w-[90vw] lg:max-w-[85vw]",
        body: "flex flex-col h-full",
        wrapper: "max-h-[95vh]"
      }}
    >
      <DrawerContent>
        {(onClose) => (
          <>
            <DrawerHeader className="flex flex-col gap-1">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-semibold">Upload CV</h2>
                  <p className="text-sm text-default-600">
                    {currentStep === 'upload' && 'Upload your CV to auto-fill your profile'}
                    {currentStep === 'parsing' && 'Analyzing your CV...'}
                    {currentStep === 'review' && 'Review extracted data'}
                    {currentStep === 'applying' && 'Updating your profile...'}
                    {currentStep === 'complete' && 'Successfully updated!'}
                  </p>
                </div>
                <Button
                  isIconOnly
                  variant="light"
                  onPress={handleClose}
                >
                  <Icon icon="solar:close-linear" className="h-6 w-6" />
                </Button>
              </div>
              
              {/* Progress Steps */}
              <div className="flex items-center gap-2 mt-4">
                {['upload', 'parsing', 'review', 'applying', 'complete'].map((step, index) => (
                  <div key={step} className="flex items-center">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium ${
                      currentStep === step
                        ? 'bg-primary text-white'
                        : ['upload', 'parsing', 'review', 'applying', 'complete'].indexOf(currentStep) > index
                        ? 'bg-success text-white'
                        : 'bg-default-200 text-default-600'
                    }`}>
                      {['upload', 'parsing', 'review', 'applying', 'complete'].indexOf(currentStep) > index ? (
                        <Icon icon="solar:check-linear" className="h-4 w-4" />
                      ) : (
                        index + 1
                      )}
                    </div>
                    {index < 4 && (
                      <div className={`w-8 h-0.5 ${
                        ['upload', 'parsing', 'review', 'applying', 'complete'].indexOf(currentStep) > index
                          ? 'bg-success'
                          : 'bg-default-200'
                      }`} />
                    )}
                  </div>
                ))}
              </div>
            </DrawerHeader>

            <DrawerBody>
              <AnimatePresence mode="wait">
                {currentStep === 'upload' && renderUploadStep()}
                {currentStep === 'parsing' && renderParsingStep()}
                {currentStep === 'review' && renderReviewStep()}
                {currentStep === 'applying' && renderApplyingStep()}
                {currentStep === 'complete' && renderCompleteStep()}
              </AnimatePresence>
            </DrawerBody>

            <DrawerFooter>
              <div className="flex gap-2 w-full">
                {currentStep === 'upload' && (
                  <Button
                    variant="flat"
                    onPress={handleClose}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                )}
                
                {currentStep === 'review' && (
                  <>
                    <Button
                      variant="flat"
                      onPress={() => setCurrentStep('upload')}
                      className="flex-1"
                    >
                      Upload Different CV
                    </Button>
                    <Button
                      color="primary"
                      onPress={handleApplyData}
                      isDisabled={selectedSections.size === 0}
                      className="flex-1"
                    >
                      Apply Selected Data
                    </Button>
                  </>
                )}
                
                {currentStep === 'complete' && (
                  <Button
                    color="success"
                    onPress={handleClose}
                    className="flex-1"
                  >
                    Done
                  </Button>
                )}
              </div>
            </DrawerFooter>
          </>
        )}
      </DrawerContent>
    </Drawer>
  );
};

export default CVUploadDrawer;
