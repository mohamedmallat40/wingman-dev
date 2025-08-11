'use client';

import React, { useCallback, useState } from 'react';
import {
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
  Accordion,
  AccordionItem,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
  Form,
  Spacer,
  Avatar,
  Badge,
  Tabs,
  Tab
} from '@heroui/react';
import { Icon } from '@iconify/react';
import { AnimatePresence, motion } from 'framer-motion';
import { CVService, type ParsedCVData } from '../services/cv-service';
import { type IUserProfile, type IEducation, type IExperience, type ILanguage, type Skill } from 'modules/profile/types';

interface CVUploadDrawerProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onDataParsed: (data: ParsedCVData) => void;
}

type UploadStep = 'upload' | 'parsing' | 'review' | 'applying' | 'complete';

// Enhanced data interfaces that match the existing profile structure
interface ReviewData {
  personalInfo: Partial<IUserProfile>;
  skills: Skill[];
  experience: IExperience[];
  education: IEducation[];
  languages: ILanguage[];
  portfolio: string[];
  certifications: Array<{
    id: string;
    name: string;
    issuer: string;
    issueDate: string;
    expiryDate?: string;
    credentialId?: string;
  }>;
}

const CVUploadDrawer: React.FC<CVUploadDrawerProps> = ({
  isOpen,
  onOpenChange,
  onDataParsed
}) => {
  const [currentStep, setCurrentStep] = useState<UploadStep>('upload');
  const [uploadProgress, setUploadProgress] = useState(0);
  const [parsedData, setParsedData] = useState<ParsedCVData | null>(null);
  const [reviewData, setReviewData] = useState<ReviewData | null>(null);
  const [selectedSections, setSelectedSections] = useState<Set<string>>(new Set());
  const [isApplying, setIsApplying] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [activeTab, setActiveTab] = useState('personal');

  const [isDragActive, setIsDragActive] = useState(false);
  const {isOpen: isEditModalOpen, onOpen: onEditModalOpen, onClose: onEditModalClose} = useDisclosure();
  const [editingSection, setEditingSection] = useState<string>('');
  const [editingIndex, setEditingIndex] = useState<number>(-1);

  const handleFileUpload = useCallback(async (file: File) => {
    if (!file) return;

    // Enhanced file validation
    const allowedTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ];

    if (!allowedTypes.includes(file.type)) {
      alert('Please upload a PDF, DOC, or DOCX file');
      return;
    }

    if (file.size > 15 * 1024 * 1024) {
      alert('File size must be less than 15MB');
      return;
    }

    setUploadedFile(file);
    setCurrentStep('parsing');
    setUploadProgress(0);

    try {
      // Enhanced progress simulation
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 85) {
            clearInterval(progressInterval);
            return 85;
          }
          return prev + Math.random() * 15;
        });
      }, 300);

      try {
        const parsedData = await CVService.parseCV(file);
        clearInterval(progressInterval);
        setUploadProgress(100);

        setTimeout(() => {
          setParsedData(parsedData);
          setReviewData(transformToReviewData(parsedData));
          setSelectedSections(new Set(['personalInfo', 'skills', 'experience', 'education', 'languages']));
          setCurrentStep('review');
        }, 800);
      } catch (apiError) {
        console.log('API not available, using comprehensive mock data');
        clearInterval(progressInterval);
        setUploadProgress(100);

        setTimeout(() => {
          const mockData = CVService.getMockCVData();
          setParsedData(mockData);
          setReviewData(transformToReviewData(mockData));
          setSelectedSections(new Set(['personalInfo', 'skills', 'experience', 'education', 'languages']));
          setCurrentStep('review');
        }, 1200);
      }

    } catch (error) {
      console.error('Error parsing CV:', error);
      setCurrentStep('upload');
      setUploadProgress(0);
    }
  }, []);

  const transformToReviewData = (data: ParsedCVData): ReviewData => {
    return {
      personalInfo: {
        firstName: data.personalInfo.firstName || '',
        lastName: data.personalInfo.lastName || '',
        email: data.personalInfo.email || '',
        phoneNumber: data.personalInfo.phone || '',
        city: data.personalInfo.location || '',
        linkedinProfile: data.personalInfo.linkedIn || '',
        profileWebsite: data.personalInfo.website || '',
        aboutMe: data.personalInfo.summary || '',
        portfolio: data.personalInfo.website || null,
      },
      skills: data.skills.map((skill, index) => ({
        id: `skill_${index}`,
        key: skill.name,
        type: skill.category.toLowerCase().includes('soft') ? 'SOFT' : 'NORMAL'
      })),
      experience: data.experience.map((exp, index) => ({
        id: `exp_${index}`,
        company: exp.company,
        position: exp.position,
        title: exp.position,
        description: exp.description,
        startDate: exp.startDate,
        endDate: exp.endDate || '',
        link: null,
        image: '',
        screenShots: null,
        videoUrl: null
      })),
      education: data.education.map((edu, index) => ({
        id: `edu_${index}`,
        university: edu.institution,
        degree: `${edu.degree} in ${edu.field}`,
        description: `Grade: ${edu.grade || 'N/A'}`,
        startDate: edu.startDate,
        endDate: edu.endDate || ''
      })),
      languages: data.languages.map((lang, index) => ({
        id: `lang_${index}`,
        key: lang.name,
        level: lang.level.toUpperCase() as 'BEGINNER' | 'INTERMEDIATE' | 'PROFESSIONAL' | 'NATIVE'
      })),
      portfolio: data.projects.map(project => project.url).filter(Boolean) as string[],
      certifications: data.certifications.map((cert, index) => ({
        id: `cert_${index}`,
        name: cert.name,
        issuer: cert.issuer,
        issueDate: cert.issueDate,
        expiryDate: cert.expiryDate,
        credentialId: cert.credentialId
      }))
    };
  };

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
    if (!reviewData) return;

    setIsApplying(true);
    setCurrentStep('applying');

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 3000));
      setCurrentStep('complete');
      onDataParsed(parsedData!);
    } catch (error) {
      console.error('Error applying CV data:', error);
    } finally {
      setIsApplying(false);
    }
  };

  const handleClose = () => {
    setCurrentStep('upload');
    setUploadProgress(0);
    setParsedData(null);
    setReviewData(null);
    setSelectedSections(new Set());
    setUploadedFile(null);
    setActiveTab('personal');
    onOpenChange(false);
  };

  const handleAddNew = (section: string) => {
    if (!reviewData) return;

    const newReviewData = { ...reviewData };
    
    const templates = {
      skills: { id: `skill_${Date.now()}`, key: '', type: 'NORMAL' as const },
      experience: {
        id: `exp_${Date.now()}`,
        company: '',
        position: '',
        title: '',
        description: '',
        startDate: '',
        endDate: '',
        link: null,
        image: '',
        screenShots: null,
        videoUrl: null
      },
      education: {
        id: `edu_${Date.now()}`,
        university: '',
        degree: '',
        description: '',
        startDate: '',
        endDate: ''
      },
      languages: { id: `lang_${Date.now()}`, key: '', level: 'BEGINNER' as const },
      certifications: {
        id: `cert_${Date.now()}`,
        name: '',
        issuer: '',
        issueDate: '',
        expiryDate: '',
        credentialId: ''
      }
    };
    
    if (section in templates) {
      (newReviewData as any)[section].push((templates as any)[section]);
      setReviewData(newReviewData);
    }
  };

  const handleRemove = (section: string, index: number) => {
    if (!reviewData) return;

    const newReviewData = { ...reviewData };
    (newReviewData as any)[section].splice(index, 1);
    setReviewData(newReviewData);
  };

  const handleUpdateItem = (section: string, index: number, data: any) => {
    if (!reviewData) return;

    const newReviewData = { ...reviewData };
    if (section === 'personalInfo') {
      newReviewData.personalInfo = { ...newReviewData.personalInfo, ...data };
    } else {
      (newReviewData as any)[section][index] = data;
    }
    setReviewData(newReviewData);
  };

  const renderUploadStep = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center h-full px-8"
    >
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => document.getElementById('cv-upload-input')?.click()}
        className={`w-full max-w-2xl p-12 border-3 border-dashed rounded-3xl text-center cursor-pointer transition-all duration-300 ${
          isDragActive
            ? 'border-primary bg-primary/10 scale-[1.02]'
            : 'border-default-300 hover:border-primary hover:bg-primary/5'
        }`}
      >
        <input
          id="cv-upload-input"
          type="file"
          accept=".pdf,.doc,.docx"
          onChange={handleFileChange}
          className="hidden"
        />
        <div className="space-y-8">
          <div className="flex justify-center">
            <div className="relative">
              <div className="p-8 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-3xl">
                <Icon icon="solar:document-add-outline" className="h-20 w-20 text-primary/70" />
              </div>
              <div className="absolute -top-2 -right-2 p-2 bg-success rounded-full">
                <Icon icon="solar:cloud-upload-outline" className="h-6 w-6 text-white" />
              </div>
            </div>
          </div>
          
          <div className="space-y-4">
            <h3 className="text-3xl font-bold text-foreground">Upload Your CV</h3>
            <p className="text-lg text-default-600 max-w-md mx-auto">
              {isDragActive
                ? "Drop your CV here to get started..."
                : "Drag & drop your CV here, or click to browse your files"}
            </p>
          </div>

          <div className="flex justify-center">
            <Chip 
              variant="flat" 
              color="primary" 
              size="lg"
              startContent={<Icon icon="solar:shield-check-linear" className="h-4 w-4" />}
            >
              Supports PDF, DOC, DOCX • Max 15MB • Secure Processing
            </Chip>
          </div>
        </div>
      </div>
      
      <div className="mt-12 max-w-3xl">
        <h4 className="text-xl font-semibold text-foreground mb-6 text-center">
          What happens after upload?
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              icon: "solar:cpu-outline",
              title: "AI Analysis",
              description: "Advanced AI extracts all information from your CV with high accuracy"
            },
            {
              icon: "solar:settings-outline",
              title: "Smart Review",
              description: "Review and edit extracted data in structured, easy-to-use forms"
            },
            {
              icon: "solar:user-check-outline",
              title: "Profile Update",
              description: "Apply selected information to automatically enhance your profile"
            }
          ].map((feature, index) => (
            <Card key={index} className="border-none bg-default-50">
              <CardBody className="text-center p-6">
                <div className="flex justify-center mb-4">
                  <div className="p-3 bg-primary/10 rounded-2xl">
                    <Icon icon={feature.icon} className="h-8 w-8 text-primary/70" />
                  </div>
                </div>
                <h5 className="font-semibold text-foreground mb-2">{feature.title}</h5>
                <p className="text-sm text-default-600">{feature.description}</p>
              </CardBody>
            </Card>
          ))}
        </div>
      </div>
    </motion.div>
  );

  const renderParsingStep = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center h-full px-8"
    >
      <div className="text-center space-y-8 max-w-2xl">
        <div className="flex justify-center">
          <div className="relative">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
              className="p-8 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-3xl"
            >
              <Icon icon="solar:cpu-outline" className="h-20 w-20 text-primary/70" />
            </motion.div>
            <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-primary/20 to-transparent animate-pulse" />
          </div>
        </div>
        
        <div className="space-y-4">
          <h3 className="text-3xl font-bold text-foreground">Processing Your CV</h3>
          <p className="text-lg text-default-600">
            Our advanced AI is analyzing your CV and extracting all relevant information...
          </p>
        </div>

        <div className="w-full max-w-md space-y-4">
          <Progress 
            value={uploadProgress} 
            color="primary" 
            className="w-full h-3"
            classNames={{
              track: "drop-shadow-md border border-default",
              indicator: "bg-gradient-to-r from-primary to-secondary",
            }}
          />
          <div className="grid grid-cols-3 gap-4 text-sm">
            <div className={`transition-colors ${uploadProgress > 20 ? 'text-primary font-medium' : 'text-default-500'}`}>
              <Icon icon="solar:upload-outline" className="h-4 w-4 inline mr-1" />
              Uploading
            </div>
            <div className={`transition-colors ${uploadProgress > 60 ? 'text-primary font-medium' : 'text-default-500'}`}>
              <Icon icon="solar:eye-scan-outline" className="h-4 w-4 inline mr-1" />
              Analyzing
            </div>
            <div className={`transition-colors ${uploadProgress > 90 ? 'text-primary font-medium' : 'text-default-500'}`}>
              <Icon icon="solar:check-circle-outline" className="h-4 w-4 inline mr-1" />
              Finalizing
            </div>
          </div>
        </div>

        {uploadedFile && (
          <Card className="max-w-md mx-auto">
            <CardBody className="p-4">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-success/10 rounded-xl">
                  <Icon icon="solar:document-text-outline" className="h-6 w-6 text-success/70" />
                </div>
                <div className="flex-1 text-left">
                  <div className="font-semibold text-foreground">{uploadedFile.name}</div>
                  <div className="text-sm text-default-500">
                    {(uploadedFile.size / 1024 / 1024).toFixed(1)} MB • Uploaded successfully
                  </div>
                </div>
                <Icon icon="solar:check-circle-outline" className="h-6 w-6 text-success/70" />
              </div>
            </CardBody>
          </Card>
        )}
      </div>
    </motion.div>
  );

  const renderPersonalInfoForm = () => {
    if (!reviewData) return null;

    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Input
            label="First Name"
            placeholder="Enter your first name"
            variant="bordered"
            value={reviewData.personalInfo.firstName || ''}
            onChange={(e) => handleUpdateItem('personalInfo', -1, { firstName: e.target.value })}
            startContent={<Icon icon="solar:user-outline" className="h-4 w-4 text-default-400" />}
          />
          <Input
            label="Last Name"
            placeholder="Enter your last name"
            variant="bordered"
            value={reviewData.personalInfo.lastName || ''}
            onChange={(e) => handleUpdateItem('personalInfo', -1, { lastName: e.target.value })}
            startContent={<Icon icon="solar:user-outline" className="h-4 w-4 text-default-400" />}
          />
          <Input
            label="Email Address"
            placeholder="Enter your email"
            variant="bordered"
            type="email"
            value={reviewData.personalInfo.email || ''}
            onChange={(e) => handleUpdateItem('personalInfo', -1, { email: e.target.value })}
            startContent={<Icon icon="solar:letter-outline" className="h-4 w-4 text-default-400" />}
          />
          <Input
            label="Phone Number"
            placeholder="Enter your phone number"
            variant="bordered"
            value={reviewData.personalInfo.phoneNumber || ''}
            onChange={(e) => handleUpdateItem('personalInfo', -1, { phoneNumber: e.target.value })}
            startContent={<Icon icon="solar:phone-outline" className="h-4 w-4 text-default-400" />}
          />
          <Input
            label="Location"
            placeholder="City, Country"
            variant="bordered"
            value={reviewData.personalInfo.city || ''}
            onChange={(e) => handleUpdateItem('personalInfo', -1, { city: e.target.value })}
            startContent={<Icon icon="solar:map-point-linear" className="h-4 w-4 text-default-400" />}
          />
          <Input
            label="LinkedIn Profile"
            placeholder="https://linkedin.com/in/username"
            variant="bordered"
            value={reviewData.personalInfo.linkedinProfile || ''}
            onChange={(e) => handleUpdateItem('personalInfo', -1, { linkedinProfile: e.target.value })}
            startContent={<Icon icon="solar:link-linear" className="h-4 w-4 text-default-400" />}
          />
        </div>
        <Input
          label="Portfolio Website"
          placeholder="https://yourportfolio.com"
          variant="bordered"
          value={reviewData.personalInfo.profileWebsite || ''}
          onChange={(e) => handleUpdateItem('personalInfo', -1, { profileWebsite: e.target.value })}
          startContent={<Icon icon="solar:global-linear" className="h-4 w-4 text-default-400" />}
        />
        <Textarea
          label="Professional Summary"
          placeholder="Brief description of your professional background and expertise..."
          variant="bordered"
          value={reviewData.personalInfo.aboutMe || ''}
          onChange={(e) => handleUpdateItem('personalInfo', -1, { aboutMe: e.target.value })}
          minRows={4}
          startContent={<Icon icon="solar:notes-linear" className="h-4 w-4 text-default-400" />}
        />
      </div>
    );
  };

  const renderSkillsSection = () => {
    if (!reviewData) return null;

    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-lg font-semibold">Skills ({reviewData.skills.length})</h3>
            <p className="text-sm text-default-600">Manage your technical and soft skills</p>
          </div>
          <Button
            color="primary"
            variant="flat"
            startContent={<Icon icon="solar:add-circle-linear" className="h-4 w-4" />}
            onPress={() => handleAddNew('skills')}
          >
            Add Skill
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 max-h-96 overflow-y-auto pr-2">
          {reviewData.skills.map((skill, index) => (
            <Card key={skill.id} className="border-2 border-default-200 hover:border-primary/50 transition-colors">
              <CardBody className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 flex-1">
                    <div className={`p-2 rounded-lg ${skill.type === 'SOFT' ? 'bg-secondary/20' : 'bg-primary/20'}`}>
                      <Icon 
                        icon={skill.type === 'SOFT' ? "solar:heart-linear" : "solar:code-linear"} 
                        className={`h-4 w-4 ${skill.type === 'SOFT' ? 'text-secondary' : 'text-primary'}`}
                      />
                    </div>
                    <div className="flex-1">
                      <Input
                        variant="bordered"
                        size="sm"
                        value={skill.key}
                        onChange={(e) => handleUpdateItem('skills', index, { ...skill, key: e.target.value })}
                        placeholder="Skill name"
                      />
                    </div>
                    <Select
                      variant="bordered"
                      size="sm"
                      className="w-32"
                      selectedKeys={[skill.type]}
                      onSelectionChange={(keys) => {
                        const type = Array.from(keys)[0] as 'NORMAL' | 'SOFT';
                        handleUpdateItem('skills', index, { ...skill, type });
                      }}
                    >
                      <SelectItem key="NORMAL">Technical</SelectItem>
                      <SelectItem key="SOFT">Soft Skill</SelectItem>
                    </Select>
                  </div>
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
              </CardBody>
            </Card>
          ))}
        </div>
      </div>
    );
  };

  const renderExperienceSection = () => {
    if (!reviewData) return null;

    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-lg font-semibold">Work Experience ({reviewData.experience.length})</h3>
            <p className="text-sm text-default-600">Your professional work history</p>
          </div>
          <Button
            color="primary"
            variant="flat"
            startContent={<Icon icon="solar:add-circle-linear" className="h-4 w-4" />}
            onPress={() => handleAddNew('experience')}
          >
            Add Experience
          </Button>
        </div>

        <div className="space-y-6 max-h-96 overflow-y-auto pr-2">
          {reviewData.experience.map((exp, index) => (
            <Card key={exp.id} className="border-2 border-default-200">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start w-full">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary/20 rounded-lg">
                      <Icon icon="solar:briefcase-linear" className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-semibold">{exp.position || 'Position'}</h4>
                      <p className="text-sm text-default-600">{exp.company || 'Company'}</p>
                    </div>
                  </div>
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
              </CardHeader>
              <CardBody className="pt-0">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  <Input
                    label="Company"
                    variant="bordered"
                    value={exp.company}
                    onChange={(e) => handleUpdateItem('experience', index, { ...exp, company: e.target.value })}
                  />
                  <Input
                    label="Position"
                    variant="bordered"
                    value={exp.position}
                    onChange={(e) => handleUpdateItem('experience', index, { ...exp, position: e.target.value, title: e.target.value })}
                  />
                  <Input
                    label="Start Date"
                    type="date"
                    variant="bordered"
                    value={exp.startDate}
                    onChange={(e) => handleUpdateItem('experience', index, { ...exp, startDate: e.target.value })}
                  />
                  <Input
                    label="End Date"
                    type="date"
                    variant="bordered"
                    value={exp.endDate}
                    onChange={(e) => handleUpdateItem('experience', index, { ...exp, endDate: e.target.value })}
                  />
                </div>
                <Textarea
                  label="Description"
                  variant="bordered"
                  value={exp.description}
                  onChange={(e) => handleUpdateItem('experience', index, { ...exp, description: e.target.value })}
                  minRows={3}
                  className="mt-4"
                />
              </CardBody>
            </Card>
          ))}
        </div>
      </div>
    );
  };

  const renderEducationSection = () => {
    if (!reviewData) return null;

    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-lg font-semibold">Education ({reviewData.education.length})</h3>
            <p className="text-sm text-default-600">Your educational background</p>
          </div>
          <Button
            color="primary"
            variant="flat"
            startContent={<Icon icon="solar:add-circle-linear" className="h-4 w-4" />}
            onPress={() => handleAddNew('education')}
          >
            Add Education
          </Button>
        </div>

        <div className="space-y-6 max-h-96 overflow-y-auto pr-2">
          {reviewData.education.map((edu, index) => (
            <Card key={edu.id} className="border-2 border-default-200">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start w-full">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-success/20 rounded-lg">
                      <Icon icon="solar:graduation-linear" className="h-5 w-5 text-success" />
                    </div>
                    <div>
                      <h4 className="font-semibold">{edu.degree || 'Degree'}</h4>
                      <p className="text-sm text-default-600">{edu.university || 'University'}</p>
                    </div>
                  </div>
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
              </CardHeader>
              <CardBody className="pt-0">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  <Input
                    label="University/Institution"
                    variant="bordered"
                    value={edu.university}
                    onChange={(e) => handleUpdateItem('education', index, { ...edu, university: e.target.value })}
                  />
                  <Input
                    label="Degree"
                    variant="bordered"
                    value={edu.degree}
                    onChange={(e) => handleUpdateItem('education', index, { ...edu, degree: e.target.value })}
                  />
                  <Input
                    label="Start Date"
                    type="date"
                    variant="bordered"
                    value={edu.startDate}
                    onChange={(e) => handleUpdateItem('education', index, { ...edu, startDate: e.target.value })}
                  />
                  <Input
                    label="End Date"
                    type="date"
                    variant="bordered"
                    value={edu.endDate}
                    onChange={(e) => handleUpdateItem('education', index, { ...edu, endDate: e.target.value })}
                  />
                </div>
                <Textarea
                  label="Additional Information"
                  variant="bordered"
                  value={edu.description}
                  onChange={(e) => handleUpdateItem('education', index, { ...edu, description: e.target.value })}
                  className="mt-4"
                  placeholder="Grade, achievements, etc."
                />
              </CardBody>
            </Card>
          ))}
        </div>
      </div>
    );
  };

  const renderLanguagesSection = () => {
    if (!reviewData) return null;

    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-lg font-semibold">Languages ({reviewData.languages.length})</h3>
            <p className="text-sm text-default-600">Languages you speak</p>
          </div>
          <Button
            color="primary"
            variant="flat"
            startContent={<Icon icon="solar:add-circle-linear" className="h-4 w-4" />}
            onPress={() => handleAddNew('languages')}
          >
            Add Language
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 max-h-96 overflow-y-auto pr-2">
          {reviewData.languages.map((lang, index) => (
            <Card key={lang.id} className="border-2 border-default-200">
              <CardBody className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 flex-1">
                    <div className="p-2 bg-warning/20 rounded-lg">
                      <Icon icon="solar:translation-linear" className="h-4 w-4 text-warning" />
                    </div>
                    <div className="flex-1 space-y-2">
                      <Input
                        variant="bordered"
                        size="sm"
                        value={lang.key}
                        onChange={(e) => handleUpdateItem('languages', index, { ...lang, key: e.target.value })}
                        placeholder="Language name"
                      />
                      <Select
                        variant="bordered"
                        size="sm"
                        selectedKeys={[lang.level]}
                        onSelectionChange={(keys) => {
                          const level = Array.from(keys)[0] as typeof lang.level;
                          handleUpdateItem('languages', index, { ...lang, level });
                        }}
                      >
                        <SelectItem key="BEGINNER">Beginner</SelectItem>
                        <SelectItem key="INTERMEDIATE">Intermediate</SelectItem>
                        <SelectItem key="PROFESSIONAL">Professional</SelectItem>
                        <SelectItem key="NATIVE">Native</SelectItem>
                      </Select>
                    </div>
                  </div>
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
              </CardBody>
            </Card>
          ))}
        </div>
      </div>
    );
  };

  const renderCertificationsSection = () => {
    if (!reviewData) return null;

    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-lg font-semibold">Certifications ({reviewData.certifications.length})</h3>
            <p className="text-sm text-default-600">Professional certifications and achievements</p>
          </div>
          <Button
            color="primary"
            variant="flat"
            startContent={<Icon icon="solar:add-circle-linear" className="h-4 w-4" />}
            onPress={() => handleAddNew('certifications')}
          >
            Add Certification
          </Button>
        </div>

        <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
          {reviewData.certifications.map((cert, index) => (
            <Card key={cert.id} className="border-2 border-default-200">
              <CardBody className="p-4">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-secondary/20 rounded-lg">
                      <Icon icon="solar:medal-star-linear" className="h-5 w-5 text-secondary" />
                    </div>
                    <div>
                      <h4 className="font-semibold">{cert.name || 'Certification Name'}</h4>
                      <p className="text-sm text-default-600">{cert.issuer || 'Issuing Organization'}</p>
                    </div>
                  </div>
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
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  <Input
                    label="Certification Name"
                    variant="bordered"
                    value={cert.name}
                    onChange={(e) => handleUpdateItem('certifications', index, { ...cert, name: e.target.value })}
                  />
                  <Input
                    label="Issuing Organization"
                    variant="bordered"
                    value={cert.issuer}
                    onChange={(e) => handleUpdateItem('certifications', index, { ...cert, issuer: e.target.value })}
                  />
                  <Input
                    label="Issue Date"
                    type="date"
                    variant="bordered"
                    value={cert.issueDate}
                    onChange={(e) => handleUpdateItem('certifications', index, { ...cert, issueDate: e.target.value })}
                  />
                  <Input
                    label="Expiry Date"
                    type="date"
                    variant="bordered"
                    value={cert.expiryDate || ''}
                    onChange={(e) => handleUpdateItem('certifications', index, { ...cert, expiryDate: e.target.value })}
                  />
                </div>
                <Input
                  label="Credential ID"
                  variant="bordered"
                  value={cert.credentialId || ''}
                  onChange={(e) => handleUpdateItem('certifications', index, { ...cert, credentialId: e.target.value })}
                  className="mt-4"
                />
              </CardBody>
            </Card>
          ))}
        </div>
      </div>
    );
  };

  const renderReviewStep = () => {
    if (!reviewData) return null;

    const sections = [
      { id: 'personal', title: 'Personal Info', icon: 'solar:user-circle-linear', content: renderPersonalInfoForm },
      { id: 'skills', title: 'Skills', icon: 'solar:code-linear', content: renderSkillsSection },
      { id: 'experience', title: 'Experience', icon: 'solar:briefcase-linear', content: renderExperienceSection },
      { id: 'education', title: 'Education', icon: 'solar:graduation-linear', content: renderEducationSection },
      { id: 'languages', title: 'Languages', icon: 'solar:translation-linear', content: renderLanguagesSection },
      { id: 'certifications', title: 'Certifications', icon: 'solar:medal-star-linear', content: renderCertificationsSection },
    ];

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="h-full flex flex-col"
      >
        <div className="mb-6">
          <h3 className="text-2xl font-bold text-foreground mb-2">Review & Edit Your Information</h3>
          <p className="text-default-600">
            Review the extracted information and make any necessary edits before applying to your profile.
          </p>
        </div>

        <div className="flex-1 flex flex-col">
          <Tabs 
            value={activeTab} 
            onSelectionChange={(key) => setActiveTab(key as string)}
            variant="underlined"
            classNames={{
              tabList: "gap-6 w-full relative rounded-none p-0 border-b border-divider",
              cursor: "w-full bg-primary",
              tab: "max-w-fit px-0 h-12",
              tabContent: "group-data-[selected=true]:text-primary"
            }}
          >
            {sections.map((section) => (
              <Tab
                key={section.id}
                title={
                  <div className="flex items-center space-x-2">
                    <Icon icon={section.icon} className="h-4 w-4" />
                    <span>{section.title}</span>
                    <Badge 
                      content={
                        section.id === 'personal' ? '1' : 
                        section.id === 'skills' ? reviewData.skills.length :
                        section.id === 'experience' ? reviewData.experience.length :
                        section.id === 'education' ? reviewData.education.length :
                        section.id === 'languages' ? reviewData.languages.length :
                        reviewData.certifications.length
                      }
                      color="primary"
                      size="sm"
                      variant="flat"
                    />
                  </div>
                }
              >
                <ScrollShadow className="h-[calc(100vh-350px)] w-full">
                  <div className="py-6">
                    {section.content()}
                  </div>
                </ScrollShadow>
              </Tab>
            ))}
          </Tabs>
        </div>

        <div className="mt-6 p-4 bg-warning/10 border border-warning/20 rounded-xl">
          <div className="flex gap-3">
            <Icon icon="solar:info-circle-linear" className="h-5 w-5 text-warning mt-0.5" />
            <div className="text-sm">
              <p className="font-medium text-warning-700 dark:text-warning-400">Review Complete</p>
              <p className="text-warning-600 dark:text-warning-500 mt-1">
                Make sure all information is accurate. Selected sections will be merged with your existing profile.
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
      className="flex flex-col items-center justify-center h-full px-8"
    >
      <div className="text-center space-y-8 max-w-2xl">
        <div className="flex justify-center">
          <div className="relative">
            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="p-8 bg-gradient-to-br from-success/20 to-primary/20 rounded-3xl"
            >
              <Icon icon="solar:database-linear" className="h-20 w-20 text-success" />
            </motion.div>
            <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-success/20 to-transparent animate-pulse" />
          </div>
        </div>
        
        <div className="space-y-4">
          <h3 className="text-3xl font-bold text-foreground">Updating Your Profile</h3>
          <p className="text-lg text-default-600">
            Applying the selected information to your profile. This may take a few moments...
          </p>
        </div>

        <div className="w-full max-w-md">
          <Progress 
            value={100}
            color="success" 
            className="w-full h-3"
            isIndeterminate
            classNames={{
              track: "drop-shadow-md border border-default",
              indicator: "bg-gradient-to-r from-success to-primary",
            }}
          />
          <p className="text-sm text-success mt-2 font-medium">Processing your information...</p>
        </div>

        <div className="grid grid-cols-2 gap-4 max-w-md">
          {[
            { icon: "solar:user-check-linear", label: "Personal Info" },
            { icon: "solar:code-linear", label: "Skills" },
            { icon: "solar:briefcase-linear", label: "Experience" },
            { icon: "solar:graduation-linear", label: "Education" }
          ].map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.2 }}
              className="flex items-center gap-2 p-3 bg-success/10 rounded-lg"
            >
              <Icon icon={item.icon} className="h-4 w-4 text-success" />
              <span className="text-sm font-medium text-success">{item.label}</span>
              <Icon icon="solar:check-circle-bold" className="h-4 w-4 text-success ml-auto" />
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );

  const renderCompleteStep = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center h-full px-8"
    >
      <div className="text-center space-y-8 max-w-2xl">
        <div className="flex justify-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 10 }}
            className="relative"
          >
            <div className="p-8 bg-gradient-to-br from-success/20 to-primary/20 rounded-3xl">
              <Icon icon="solar:check-circle-bold" className="h-20 w-20 text-success" />
            </div>
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="absolute -top-2 -right-2 p-2 bg-success rounded-full"
            >
              <Icon icon="solar:star-bold" className="h-6 w-6 text-white" />
            </motion.div>
          </motion.div>
        </div>
        
        <div className="space-y-4">
          <h3 className="text-3xl font-bold text-foreground">Profile Updated Successfully!</h3>
          <p className="text-lg text-default-600">
            Your CV information has been successfully applied to your profile. Your profile is now more complete and professional.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4 max-w-lg">
          {[
            { icon: "solar:user-check-rounded-linear", label: "Personal information updated", count: "6 fields" },
            { icon: "solar:code-linear", label: "Skills synchronized", count: `${reviewData?.skills.length || 0} skills` },
            { icon: "solar:briefcase-linear", label: "Experience added", count: `${reviewData?.experience.length || 0} positions` },
            { icon: "solar:graduation-linear", label: "Education history updated", count: `${reviewData?.education.length || 0} degrees` }
          ].map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="p-4 bg-success/10 border border-success/20 rounded-xl text-center"
            >
              <div className="flex justify-center mb-2">
                <Icon icon={item.icon} className="h-6 w-6 text-success" />
              </div>
              <p className="text-sm font-medium text-success">{item.label}</p>
              <p className="text-xs text-success/70 mt-1">{item.count}</p>
            </motion.div>
          ))}
        </div>

        <Chip 
          variant="flat" 
          color="success" 
          size="lg"
          startContent={<Icon icon="solar:shield-check-linear" className="h-4 w-4" />}
        >
          Profile completion improved significantly
        </Chip>
      </div>
    </motion.div>
  );

  const steps = [
    { key: 'upload', title: 'Upload', icon: 'solar:cloud-upload-outline' },
    { key: 'parsing', title: 'Processing', icon: 'solar:cpu-outline' },
    { key: 'review', title: 'Review', icon: 'solar:eye-outline' },
    { key: 'applying', title: 'Applying', icon: 'solar:database-outline' },
    { key: 'complete', title: 'Complete', icon: 'solar:check-circle-outline' }
  ];

  const currentStepIndex = steps.findIndex(step => step.key === currentStep);

  return (
    <Drawer
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      size="5xl"
      placement="right"
      classNames={{
        base: "w-[80vw] h-screen max-w-[80vw]",
        wrapper: "w-[80vw] h-screen",
        backdrop: "bg-black/60 backdrop-blur-md"
      }}
    >
      <DrawerContent className="h-screen">
        {(onClose) => (
          <>
            <DrawerHeader className="border-b border-divider/30 bg-gradient-to-r from-background/95 to-default-50/30 backdrop-blur-xl">
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-gradient-to-br from-primary/15 to-primary/5 rounded-2xl border border-primary/20">
                    <Icon icon="solar:document-add-outline" className="h-7 w-7 text-primary/80" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                      CV Upload & Review
                    </h2>
                    <p className="text-default-500 font-medium">
                      {currentStep === 'upload' && 'Upload your CV to automatically enhance your profile'}
                      {currentStep === 'parsing' && 'AI is analyzing and extracting information from your CV'}
                      {currentStep === 'review' && 'Review and edit the extracted information before applying'}
                      {currentStep === 'applying' && 'Applying selected information to your profile'}
                      {currentStep === 'complete' && 'CV information successfully applied to your profile'}
                    </p>
                  </div>
                </div>

                <Button
                  isIconOnly
                  variant="light"
                  size="lg"
                  onPress={handleClose}
                  className="hover:bg-danger/10 hover:text-danger transition-all duration-200"
                >
                  <Icon icon="solar:close-circle-outline" className="h-6 w-6" />
                </Button>
              </div>
            </DrawerHeader>

            <DrawerBody className="p-0 overflow-hidden">
              <div className="h-full flex">
                {/* Vertical Steps Sidebar */}
                <div className="w-80 bg-gradient-to-b from-default-50/50 to-default-100/30 border-r border-divider/30 backdrop-blur-sm">
                  <div className="p-6 h-full flex flex-col">
                    <div className="mb-8">
                      <h3 className="text-lg font-semibold text-foreground mb-2">Progress</h3>
                      <p className="text-sm text-default-500">Follow the steps to complete your CV upload</p>
                    </div>

                    <div className="flex-1 space-y-6">
                      {steps.map((step, index) => (
                        <motion.div
                          key={step.key}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="relative"
                        >
                          <div className={`flex items-center gap-4 p-4 rounded-2xl transition-all duration-300 ${
                            index === currentStepIndex
                              ? 'bg-gradient-to-r from-primary/10 to-primary/5 border border-primary/20 shadow-lg'
                              : index < currentStepIndex
                              ? 'bg-gradient-to-r from-success/10 to-success/5 border border-success/20'
                              : 'bg-default-100/50 border border-default-200/50 hover:bg-default-100/80'
                          }`}>
                            <div className={`relative flex items-center justify-center w-12 h-12 rounded-xl transition-all duration-300 ${
                              index < currentStepIndex
                                ? 'bg-gradient-to-br from-success/20 to-success/10 border border-success/30'
                                : index === currentStepIndex
                                ? 'bg-gradient-to-br from-primary/20 to-primary/10 border border-primary/30'
                                : 'bg-gradient-to-br from-default-200/50 to-default-100/50 border border-default-300/50'
                            }`}>
                              {index < currentStepIndex ? (
                                <Icon
                                  icon="solar:check-circle-outline"
                                  className="h-6 w-6 text-success/80"
                                />
                              ) : (
                                <Icon
                                  icon={step.icon}
                                  className={`h-6 w-6 ${
                                    index === currentStepIndex ? 'text-primary/80' : 'text-default-400'
                                  }`}
                                />
                              )}
                              {index === currentStepIndex && (
                                <motion.div
                                  className="absolute inset-0 rounded-xl border-2 border-primary/40"
                                  animate={{ scale: [1, 1.05, 1] }}
                                  transition={{ duration: 2, repeat: Infinity }}
                                />
                              )}
                            </div>

                            <div className="flex-1">
                              <div className={`font-semibold transition-colors duration-300 ${
                                index === currentStepIndex
                                  ? 'text-primary'
                                  : index < currentStepIndex
                                  ? 'text-success'
                                  : 'text-default-600'
                              }`}>
                                {step.title}
                              </div>
                              <div className="text-sm text-default-500 mt-1">
                                {step.key === 'upload' && 'Select and upload your CV file'}
                                {step.key === 'parsing' && 'AI extracts information'}
                                {step.key === 'review' && 'Review and edit data'}
                                {step.key === 'applying' && 'Update your profile'}
                                {step.key === 'complete' && 'Process completed'}
                              </div>
                            </div>

                            {index < currentStepIndex && (
                              <div className="w-2 h-2 rounded-full bg-success/60" />
                            )}
                            {index === currentStepIndex && (
                              <motion.div
                                className="w-2 h-2 rounded-full bg-primary/80"
                                animate={{ scale: [1, 1.3, 1] }}
                                transition={{ duration: 1.5, repeat: Infinity }}
                              />
                            )}
                          </div>

                          {/* Connecting Line */}
                          {index < steps.length - 1 && (
                            <div className={`absolute left-10 top-20 w-0.5 h-6 transition-colors duration-300 ${
                              index < currentStepIndex ? 'bg-success/30' : 'bg-default-300/50'
                            }`} />
                          )}
                        </motion.div>
                      ))}
                    </div>

                    {/* Progress Summary */}
                    <div className="mt-8 p-4 bg-gradient-to-r from-default-100/50 to-default-50/50 rounded-2xl border border-default-200/50">
                      <div className="flex items-center gap-3 mb-3">
                        <Icon icon="solar:chart-outline" className="h-5 w-5 text-primary/70" />
                        <span className="font-medium text-default-700">Progress Overview</span>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-default-600">Completed Steps</span>
                          <span className="font-medium text-primary">{currentStepIndex} / {steps.length}</span>
                        </div>
                        <div className="w-full bg-default-200/50 rounded-full h-2">
                          <div
                            className="bg-gradient-to-r from-primary to-primary/80 h-2 rounded-full transition-all duration-500"
                            style={{ width: `${(currentStepIndex / steps.length) * 100}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Main Content Area */}
                <div className="flex-1 flex flex-col">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={currentStep}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.3 }}
                      className="flex-1 p-8"
                    >
                      {currentStep === 'upload' && renderUploadStep()}
                      {currentStep === 'parsing' && renderParsingStep()}
                      {currentStep === 'review' && renderReviewStep()}
                      {currentStep === 'applying' && renderApplyingStep()}
                      {currentStep === 'complete' && renderCompleteStep()}
                    </motion.div>
                  </AnimatePresence>
                </div>
              </div>
            </DrawerBody>

            <DrawerFooter className="border-t border-divider/30 bg-gradient-to-r from-background/95 to-default-50/30 backdrop-blur-xl">
              <div className="flex justify-end gap-3 w-full">
                {currentStep === 'upload' && (
                  <Button
                    variant="flat"
                    onPress={handleClose}
                    size="lg"
                    startContent={<Icon icon="solar:close-circle-outline" className="h-4 w-4" />}
                    className="hover:bg-default-200/50"
                  >
                    Cancel
                  </Button>
                )}

                {currentStep === 'review' && (
                  <>
                    <Button
                      variant="flat"
                      onPress={() => setCurrentStep('upload')}
                      size="lg"
                      startContent={<Icon icon="solar:arrow-left-outline" className="h-4 w-4" />}
                      className="hover:bg-default-200/50"
                    >
                      Upload Different CV
                    </Button>
                    <Button
                      color="primary"
                      onPress={handleApplyData}
                      isDisabled={selectedSections.size === 0}
                      size="lg"
                      endContent={<Icon icon="solar:arrow-right-outline" className="h-4 w-4" />}
                      className="bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary/80"
                    >
                      Apply to Profile ({Object.keys(reviewData || {}).length} sections)
                    </Button>
                  </>
                )}

                {currentStep === 'complete' && (
                  <Button
                    color="success"
                    onPress={handleClose}
                    size="lg"
                    variant="solid"
                    endContent={<Icon icon="solar:check-circle-outline" className="h-4 w-4" />}
                    className="bg-gradient-to-r from-success to-success/90 hover:from-success/90 hover:to-success/80"
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
