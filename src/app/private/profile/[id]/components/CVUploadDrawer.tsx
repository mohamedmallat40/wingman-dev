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
  Progress,
  ScrollShadow,
  Spacer
} from '@heroui/react';
import { Icon } from '@iconify/react';
import { AnimatePresence, motion } from 'framer-motion';
import { useDropzone } from 'react-dropzone';

import wingManApi from '@/lib/axios';

interface ParsedCVData {
  personalInfo: {
    firstName?: string;
    lastName?: string;
    email?: string;
    phone?: string;
    location?: string;
    linkedIn?: string;
    website?: string;
    summary?: string;
  };
  skills: Array<{
    name: string;
    category: string;
    level?: string;
    years?: number;
  }>;
  education: Array<{
    institution: string;
    degree: string;
    field: string;
    startDate: string;
    endDate?: string;
    grade?: string;
    location?: string;
  }>;
  experience: Array<{
    company: string;
    position: string;
    startDate: string;
    endDate?: string;
    location?: string;
    description: string;
    responsibilities: string[];
  }>;
  languages: Array<{
    name: string;
    level: string;
    proficiency?: string;
  }>;
  certifications: Array<{
    name: string;
    issuer: string;
    issueDate: string;
    expiryDate?: string;
    credentialId?: string;
  }>;
  projects: Array<{
    name: string;
    description: string;
    technologies: string[];
    startDate?: string;
    endDate?: string;
    url?: string;
  }>;
}

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

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;

    setUploadedFile(file);
    setCurrentStep('parsing');
    setUploadProgress(0);

    try {
      const formData = new FormData();
      formData.append('cv', file);

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

      // Call the backend API to parse CV
      const response = await wingManApi.post('/cv/parse', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      clearInterval(progressInterval);
      setUploadProgress(100);

      setTimeout(() => {
        setParsedData(response.data);
        setSelectedSections(new Set(['personalInfo', 'skills', 'experience', 'education', 'languages']));
        setCurrentStep('review');
      }, 500);

    } catch (error) {
      console.error('Error parsing CV:', error);
      // Reset to upload step on error
      setCurrentStep('upload');
      setUploadProgress(0);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx']
    },
    maxFiles: 1,
    maxSize: 10 * 1024 * 1024 // 10MB
  });

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
    if (!parsedData) return;

    setIsApplying(true);
    setCurrentStep('applying');

    try {
      // Filter data based on selected sections
      const dataToApply: Partial<ParsedCVData> = {};
      
      selectedSections.forEach(section => {
        if (parsedData[section as keyof ParsedCVData]) {
          (dataToApply as any)[section] = parsedData[section as keyof ParsedCVData];
        }
      });

      // Apply the data to profile
      await wingManApi.post('/profile/apply-cv-data', dataToApply);

      setCurrentStep('complete');
      onDataParsed(parsedData);

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
    setSelectedSections(new Set());
    setUploadedFile(null);
    onOpenChange(false);
  };

  const renderUploadStep = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center min-h-[400px] px-6"
    >
      <div
        {...getRootProps()}
        className={`w-full max-w-md p-8 border-2 border-dashed rounded-2xl text-center cursor-pointer transition-all duration-300 ${
          isDragActive
            ? 'border-primary bg-primary/5 scale-105'
            : 'border-default-300 hover:border-primary hover:bg-default-50'
        }`}
      >
        <input {...getInputProps()} />
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

  const renderReviewStep = () => {
    if (!parsedData) return null;

    const sections = [
      {
        id: 'personalInfo',
        title: 'Personal Information',
        icon: 'solar:user-linear',
        data: parsedData.personalInfo,
        preview: `${parsedData.personalInfo.firstName} ${parsedData.personalInfo.lastName}`
      },
      {
        id: 'skills',
        title: 'Skills',
        icon: 'solar:code-linear',
        data: parsedData.skills,
        preview: `${parsedData.skills.length} skills found`
      },
      {
        id: 'experience',
        title: 'Work Experience',
        icon: 'solar:briefcase-linear',
        data: parsedData.experience,
        preview: `${parsedData.experience.length} positions`
      },
      {
        id: 'education',
        title: 'Education',
        icon: 'solar:graduation-linear',
        data: parsedData.education,
        preview: `${parsedData.education.length} qualifications`
      },
      {
        id: 'languages',
        title: 'Languages',
        icon: 'solar:translation-linear',
        data: parsedData.languages,
        preview: `${parsedData.languages.length} languages`
      },
      {
        id: 'certifications',
        title: 'Certifications',
        icon: 'solar:medal-star-linear',
        data: parsedData.certifications,
        preview: `${parsedData.certifications.length} certifications`
      }
    ];

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        <div className="text-center pb-4">
          <h3 className="text-xl font-semibold text-foreground mb-2">Review Parsed Data</h3>
          <p className="text-default-600">
            Select the sections you want to import to your profile
          </p>
        </div>

        <ScrollShadow className="max-h-[500px]">
          <div className="space-y-4">
            {sections.map((section) => (
              <Card
                key={section.id}
                className={`border cursor-pointer transition-all duration-200 ${
                  selectedSections.has(section.id)
                    ? 'border-primary bg-primary/5 shadow-md'
                    : 'border-default-200 hover:border-default-300'
                }`}
                isPressable
                onPress={() => handleSectionToggle(section.id)}
              >
                <CardBody className="p-4">
                  <div className="flex items-center justify-between">
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
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                        selectedSections.has(section.id)
                          ? 'border-primary bg-primary'
                          : 'border-default-300'
                      }`}>
                        {selectedSections.has(section.id) && (
                          <Icon icon="solar:check-linear" className="h-3 w-3 text-white" />
                        )}
                      </div>
                    </div>
                  </div>
                </CardBody>
              </Card>
            ))}
          </div>
        </ScrollShadow>

        <div className="bg-warning/10 border border-warning/20 rounded-lg p-4">
          <div className="flex gap-3">
            <Icon icon="solar:info-circle-linear" className="h-5 w-5 text-warning mt-0.5" />
            <div className="text-sm">
              <p className="font-medium text-warning-700 dark:text-warning-400">Important Note</p>
              <p className="text-warning-600 dark:text-warning-500 mt-1">
                Selected data will be merged with your existing profile. Existing information may be updated or replaced.
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
      size="md"
      placement="right"
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
