'use client';

import React, { useMemo, useState } from 'react';

import {
  Autocomplete,
  AutocompleteItem,
  Badge,
  Button,
  Card,
  CardBody,
  Chip,
  Divider,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Progress,
  Select,
  SelectItem,
  Switch,
  Textarea
} from '@heroui/react';
import { Icon } from '@iconify/react';

import { LanguageService } from '../../services/language-service';
import { type CertificationLevel, type Language, type LanguageProficiencyLevel } from '../../types';

interface EnhancedLanguagesFormProps {
  languages: Language[];
  onAdd: () => void;
  onRemove: (index: number) => void;
  onUpdate: (index: number, data: Language) => void;
}

export const EnhancedLanguagesForm: React.FC<EnhancedLanguagesFormProps> = ({
  languages,
  onAdd,
  onRemove,
  onUpdate
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLanguageIndex, setSelectedLanguageIndex] = useState<number | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  const worldLanguages = useMemo(() => LanguageService.getWorldLanguages(), []);
  const filteredLanguages = useMemo(
    () => LanguageService.searchLanguages(searchQuery),
    [searchQuery]
  );

  const proficiencyLevels: LanguageProficiencyLevel[] = [
    'NATIVE',
    'FLUENT',
    'PROFESSIONAL',
    'CONVERSATIONAL',
    'INTERMEDIATE',
    'BEGINNER',
    'ELEMENTARY'
  ];

  const certificationLevels: CertificationLevel[] = ['NATIVE', 'C2', 'C1', 'B2', 'B1', 'A2', 'A1'];

  const handleLanguageSelect = (index: number, selectedKey: string) => {
    const selectedLang = worldLanguages.find((lang) => lang.code === selectedKey);
    if (selectedLang) {
      onUpdate(index, {
        ...languages[index],
        id: languages[index]?.id || crypto.randomUUID(),
        name: selectedLang.name,
        nativeName: selectedLang.nativeName,
        code: selectedLang.code,
        key: selectedLang.name, // For backwards compatibility
        countryFlag: selectedLang.countryFlag,
        level: languages[index]?.level || 'BEGINNER',
        isNative: languages[index]?.isNative || false,
        canRead: languages[index]?.canRead || false,
        canWrite: languages[index]?.canWrite || false,
        canSpeak: languages[index]?.canSpeak || false,
        canUnderstand: languages[index]?.canUnderstand || false
      });
    }
  };

  const handleOpenDetailModal = (index: number) => {
    setSelectedLanguageIndex(index);
    setIsDetailModalOpen(true);
  };

  const handleCloseDetailModal = () => {
    setSelectedLanguageIndex(null);
    setIsDetailModalOpen(false);
  };

  const handleSkillToggle = (
    index: number,
    skill: keyof Pick<Language, 'canRead' | 'canWrite' | 'canSpeak' | 'canUnderstand'>,
    value: boolean
  ) => {
    onUpdate(index, {
      ...languages[index],
      id: languages[index]?.id || crypto.randomUUID(),
      name: languages[index]?.name || '',
      code: languages[index]?.code || '',
      level: languages[index]?.level || 'BEGINNER',
      isNative: languages[index]?.isNative || false,
      canRead: languages[index]?.canRead || false,
      canWrite: languages[index]?.canWrite || false,
      canSpeak: languages[index]?.canSpeak || false,
      canUnderstand: languages[index]?.canUnderstand || false,
      key: languages[index]?.key || languages[index]?.name || '',
      [skill]: value
    });
  };

  const renderLanguageCard = (lang: Language, index: number) => {
    const levelInfo = LanguageService.getProficiencyLevelInfo(lang.level);
    const cefrInfo = lang.certificationLevel
      ? LanguageService.getCEFRLevelInfo(lang.certificationLevel)
      : null;
    const availableCertifications = LanguageService.getLanguageCertifications(lang.code);

    return (
      <Card
        key={lang.id}
        className='border-default-200 hover:border-primary/50 border-2 transition-all duration-200 hover:shadow-lg'
      >
        <CardBody className='p-4'>
          <div className='space-y-4'>
            {/* Header with flag, language name, and controls */}
            <div className='flex items-center justify-between'>
              <div className='flex items-center gap-3'>
                <div className='relative'>
                  {lang.countryFlag && (
                    <img
                      src={`https://flagcdn.com/32x24/${lang.countryFlag}.png`}
                      alt={`${lang.name} flag`}
                      className='h-6 w-8 rounded-sm shadow-sm'
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                      }}
                    />
                  )}
                  {!lang.countryFlag && (
                    <div className='bg-default-200 flex h-6 w-8 items-center justify-center rounded-sm'>
                      <Icon icon='solar:translation-outline' className='text-default-500 h-4 w-4' />
                    </div>
                  )}
                  {lang.isNative && (
                    <Badge color='success' size='sm' className='absolute -top-1 -right-1'>
                      N
                    </Badge>
                  )}
                </div>
                <div>
                  <h4 className='text-foreground font-semibold'>
                    {lang.name || 'Select Language'}
                  </h4>
                  {lang.nativeName && lang.nativeName !== lang.name && (
                    <p className='text-default-600 text-sm'>{lang.nativeName}</p>
                  )}
                </div>
              </div>

              <div className='flex items-center gap-2'>
                <Button
                  size='sm'
                  variant='flat'
                  color='primary'
                  onPress={() => handleOpenDetailModal(index)}
                  startContent={<Icon icon='solar:settings-linear' className='h-4 w-4' />}
                >
                  Details
                </Button>
                <Button
                  size='sm'
                  variant='light'
                  color='danger'
                  isIconOnly
                  onPress={() => onRemove(index)}
                >
                  <Icon icon='solar:trash-bin-minimalistic-linear' className='h-4 w-4' />
                </Button>
              </div>
            </div>

            {/* Language selection */}
            <Autocomplete
              label='Language'
              placeholder='Search and select a language...'
              value={lang.code}
              onSelectionChange={(key) => key && handleLanguageSelect(index, key as string)}
              onInputChange={setSearchQuery}
              variant='bordered'
              size='sm'
              startContent={
                <Icon icon='solar:translation-outline' className='text-default-400 h-4 w-4' />
              }
            >
              {filteredLanguages.map((worldLang) => (
                <AutocompleteItem
                  key={worldLang.code}
                  startContent={
                    <img
                      src={`https://flagcdn.com/16x12/${worldLang.countryFlag}.png`}
                      alt={`${worldLang.name} flag`}
                      className='h-3 w-4 rounded-sm'
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                      }}
                    />
                  }
                  textValue={worldLang.name}
                >
                  <div className='flex flex-col'>
                    <span>{worldLang.name}</span>
                    <span className='text-default-500 text-sm'>{worldLang.nativeName}</span>
                  </div>
                </AutocompleteItem>
              ))}
            </Autocomplete>

            {/* Proficiency level */}
            <div className='space-y-2'>
              <Select
                label='Proficiency Level'
                selectedKeys={[lang.level]}
                onSelectionChange={(keys) => {
                  const level = Array.from(keys)[0] as LanguageProficiencyLevel;
                  onUpdate(index, { ...lang, level });
                }}
                variant='bordered'
                size='sm'
                startContent={
                  <Icon icon='solar:chart-2-linear' className='text-default-400 h-4 w-4' />
                }
              >
                {proficiencyLevels.map((level) => {
                  const info = LanguageService.getProficiencyLevelInfo(level);
                  return (
                    <SelectItem
                      key={level}
                      startContent={
                        <Chip size='sm' color={info.color as any} variant='flat'>
                          {info.cefr}
                        </Chip>
                      }
                    >
                      <div className='flex flex-col'>
                        <span>{info.label}</span>
                        <span className='text-default-500 text-sm'>{info.description}</span>
                      </div>
                    </SelectItem>
                  );
                })}
              </Select>

              {/* Progress bar for proficiency level */}
              <div className='flex items-center gap-2'>
                <Progress
                  size='sm'
                  value={levelInfo.percentage}
                  color={levelInfo.color as any}
                  className='flex-1'
                />
                <span className='text-default-600 min-w-fit text-sm'>{levelInfo.percentage}%</span>
              </div>
            </div>

            {/* Skills indicators */}
            <div className='flex flex-wrap gap-2'>
              {[
                { key: 'canSpeak', label: 'Speaking', icon: 'solar:microphone-linear' },
                { key: 'canUnderstand', label: 'Listening', icon: 'solar:headphones-linear' },
                { key: 'canRead', label: 'Reading', icon: 'solar:book-linear' },
                { key: 'canWrite', label: 'Writing', icon: 'solar:pen-linear' }
              ].map((skill) => (
                <Chip
                  key={skill.key}
                  size='sm'
                  variant={lang[skill.key as keyof Language] ? 'solid' : 'bordered'}
                  color={lang[skill.key as keyof Language] ? 'primary' : 'default'}
                  startContent={<Icon icon={skill.icon} className='h-3 w-3' />}
                >
                  {skill.label}
                </Chip>
              ))}
            </div>

            {/* Certification info */}
            {lang.certificationName && (
              <div className='bg-success-50 flex items-center gap-2 rounded-lg p-2'>
                <Icon icon='solar:diploma-linear' className='text-success-600 h-4 w-4' />
                <div className='flex-1'>
                  <span className='text-success-800 text-sm font-medium'>
                    {lang.certificationName}
                  </span>
                  {lang.certificationScore && (
                    <span className='text-success-600 ml-2 text-sm'>
                      Score: {lang.certificationScore}
                    </span>
                  )}
                </div>
                {cefrInfo && (
                  <Chip size='sm' color='success' variant='flat'>
                    {cefrInfo.label}
                  </Chip>
                )}
              </div>
            )}

            {/* Years of experience */}
            {lang.yearsOfExperience && lang.yearsOfExperience > 0 && (
              <div className='text-default-600 flex items-center gap-2 text-sm'>
                <Icon icon='solar:calendar-linear' className='h-4 w-4' />
                <span>
                  {lang.yearsOfExperience} year{lang.yearsOfExperience !== 1 ? 's' : ''} of
                  experience
                </span>
              </div>
            )}
          </div>
        </CardBody>
      </Card>
    );
  };

  const selectedLanguage = selectedLanguageIndex !== null ? languages[selectedLanguageIndex] : null;
  const selectedLangCertifications = selectedLanguage
    ? LanguageService.getLanguageCertifications(selectedLanguage.code)
    : [];

  return (
    <div className='space-y-6'>
      <div className='flex items-center justify-between'>
        <div>
          <h3 className='text-lg font-semibold'>Languages ({languages.length})</h3>
          <p className='text-default-600 text-sm'>
            Languages you speak and your proficiency levels
          </p>
        </div>
        <Button
          color='primary'
          variant='flat'
          startContent={<Icon icon='solar:add-circle-outline' className='h-4 w-4' />}
          onPress={onAdd}
        >
          Add Language
        </Button>
      </div>

      <div className='grid max-h-96 grid-cols-1 gap-4 overflow-y-auto pr-2 lg:grid-cols-2'>
        {languages.map((lang, index) => renderLanguageCard(lang, index))}
      </div>

      {languages.length === 0 && (
        <div className='flex items-center justify-center py-12 text-center'>
          <div>
            <Icon
              icon='solar:translation-outline'
              className='text-default-300 mx-auto mb-4 h-12 w-12'
            />
            <p className='text-default-500 mb-4'>No languages added yet</p>
            <Button
              color='primary'
              variant='flat'
              startContent={<Icon icon='solar:add-circle-linear' className='h-4 w-4' />}
              onPress={onAdd}
            >
              Add your first language
            </Button>
          </div>
        </div>
      )}

      {/* Detailed Language Modal */}
      <Modal
        isOpen={isDetailModalOpen}
        onClose={handleCloseDetailModal}
        size='2xl'
        scrollBehavior='inside'
      >
        <ModalContent>
          <ModalHeader className='flex items-center gap-3'>
            <Icon icon='solar:settings-linear' className='text-primary h-5 w-5' />
            <div>
              <h3 className='text-xl font-semibold'>Language Details</h3>
              <p className='text-default-600 text-sm'>
                {selectedLanguage?.name
                  ? `Configure ${selectedLanguage.name}`
                  : 'Configure language'}
              </p>
            </div>
          </ModalHeader>
          <ModalBody>
            {selectedLanguage && selectedLanguageIndex !== null && (
              <div className='space-y-6'>
                {/* Native speaker toggle */}
                <div className='bg-default-50 flex items-center justify-between rounded-lg p-4'>
                  <div>
                    <h4 className='font-medium'>Native Speaker</h4>
                    <p className='text-default-600 text-sm'>This is your native language</p>
                  </div>
                  <Switch
                    isSelected={selectedLanguage.isNative}
                    onValueChange={(value) =>
                      onUpdate(selectedLanguageIndex, {
                        ...selectedLanguage,
                        isNative: value,
                        level: value ? 'NATIVE' : selectedLanguage.level
                      })
                    }
                    color='success'
                  />
                </div>

                {/* Language skills */}
                <div className='space-y-4'>
                  <h4 className='font-medium'>Language Skills</h4>
                  <div className='grid grid-cols-2 gap-4'>
                    {[
                      {
                        key: 'canSpeak',
                        label: 'Speaking',
                        icon: 'solar:microphone-linear',
                        description: 'I can speak this language'
                      },
                      {
                        key: 'canUnderstand',
                        label: 'Listening',
                        icon: 'solar:headphones-linear',
                        description: 'I can understand spoken language'
                      },
                      {
                        key: 'canRead',
                        label: 'Reading',
                        icon: 'solar:book-linear',
                        description: 'I can read in this language'
                      },
                      {
                        key: 'canWrite',
                        label: 'Writing',
                        icon: 'solar:pen-linear',
                        description: 'I can write in this language'
                      }
                    ].map((skill) => (
                      <div
                        key={skill.key}
                        className='flex items-center justify-between rounded-lg border p-3'
                      >
                        <div className='flex items-center gap-3'>
                          <Icon icon={skill.icon} className='text-default-600 h-5 w-5' />
                          <div>
                            <p className='font-medium'>{skill.label}</p>
                            <p className='text-default-600 text-sm'>{skill.description}</p>
                          </div>
                        </div>
                        <Switch
                          size='sm'
                          isSelected={selectedLanguage[skill.key as keyof Language] as boolean}
                          onValueChange={(value) =>
                            handleSkillToggle(selectedLanguageIndex, skill.key as any, value)
                          }
                          color='primary'
                        />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Years of experience */}
                <Input
                  label='Years of Experience'
                  type='number'
                  min='0'
                  max='100'
                  value={selectedLanguage.yearsOfExperience?.toString() || '0'}
                  onChange={(e) =>
                    onUpdate(selectedLanguageIndex, {
                      ...selectedLanguage,
                      yearsOfExperience: parseInt(e.target.value) || 0
                    })
                  }
                  variant='bordered'
                  startContent={
                    <Icon icon='solar:calendar-linear' className='text-default-400 h-4 w-4' />
                  }
                  description='How many years have you been using this language?'
                />

                <Divider />

                {/* Certification details */}
                <div className='space-y-4'>
                  <h4 className='font-medium'>Certification (Optional)</h4>

                  <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
                    <Select
                      label='Certification Name'
                      placeholder='Select certification'
                      selectedKeys={
                        selectedLanguage.certificationName
                          ? [selectedLanguage.certificationName]
                          : []
                      }
                      onSelectionChange={(keys) => {
                        const cert = Array.from(keys)[0] as string;
                        onUpdate(selectedLanguageIndex, {
                          ...selectedLanguage,
                          certificationName: cert
                        });
                      }}
                      variant='bordered'
                    >
                      {selectedLangCertifications.map((cert) => (
                        <SelectItem key={cert}>{cert}</SelectItem>
                      ))}
                    </Select>

                    <Select
                      label='CEFR Level'
                      placeholder='Select CEFR level'
                      selectedKeys={
                        selectedLanguage.certificationLevel
                          ? [selectedLanguage.certificationLevel]
                          : []
                      }
                      onSelectionChange={(keys) => {
                        const level = Array.from(keys)[0] as CertificationLevel;
                        onUpdate(selectedLanguageIndex, {
                          ...selectedLanguage,
                          certificationLevel: level
                        });
                      }}
                      variant='bordered'
                    >
                      {certificationLevels.map((level) => {
                        const info = LanguageService.getCEFRLevelInfo(level);
                        return (
                          <SelectItem key={level}>
                            <div className='flex items-center gap-2'>
                              <Chip size='sm' color={info.color as any} variant='flat'>
                                {info.label}
                              </Chip>
                              <span>{info.description}</span>
                            </div>
                          </SelectItem>
                        );
                      })}
                    </Select>
                  </div>

                  <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
                    <Input
                      label='Certification Score'
                      placeholder='e.g., 8.5/9, Advanced'
                      value={selectedLanguage.certificationScore || ''}
                      onChange={(e) =>
                        onUpdate(selectedLanguageIndex, {
                          ...selectedLanguage,
                          certificationScore: e.target.value
                        })
                      }
                      variant='bordered'
                    />

                    <Input
                      label='Certification Date'
                      type='date'
                      value={selectedLanguage.certificationDate?.split('T')[0] || ''}
                      onChange={(e) =>
                        onUpdate(selectedLanguageIndex, {
                          ...selectedLanguage,
                          certificationDate: e.target.value
                        })
                      }
                      variant='bordered'
                    />
                  </div>
                </div>

                {/* Description */}
                <Textarea
                  label='Additional Notes'
                  placeholder='Any additional information about your language skills...'
                  value={selectedLanguage.description || ''}
                  onChange={(e) =>
                    onUpdate(selectedLanguageIndex, {
                      ...selectedLanguage,
                      description: e.target.value
                    })
                  }
                  variant='bordered'
                  minRows={3}
                />
              </div>
            )}
          </ModalBody>
          <ModalFooter>
            <Button variant='light' onPress={handleCloseDetailModal}>
              Close
            </Button>
            <Button color='primary' onPress={handleCloseDetailModal}>
              Save Changes
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
};
