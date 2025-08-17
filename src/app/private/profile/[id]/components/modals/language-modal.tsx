import React, { useEffect, useState } from 'react';

import {
  Autocomplete,
  AutocompleteItem,
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Select,
  SelectItem
} from '@heroui/react';
import { Icon } from '@iconify/react';
import ISO6391 from 'iso-639-1';

import wingManApi from '@/lib/axios';

export interface ILanguage {
  id: string;
  key: string | undefined;
  level: 'BEGINNER' | 'ELEMENTARY' | 'INTERMEDIATE' | 'CONVERSATIONAL' | 'PROFESSIONAL' | 'FLUENT' | 'NATIVE';
}

interface LanguageModalProps {
  isOpen: boolean;
  onClose: () => void;
  language?: ILanguage | null;
  onSuccess: () => void;
  addToast: (message: string, type: 'success' | 'error') => void;
}

// Common language codes for the autocomplete
const commonLanguages = [
  { code: 'en', name: 'English' },
  { code: 'es', name: 'Spanish' },
  { code: 'fr', name: 'French' },
  { code: 'de', name: 'German' },
  { code: 'it', name: 'Italian' },
  { code: 'pt', name: 'Portuguese' },
  { code: 'ru', name: 'Russian' },
  { code: 'ja', name: 'Japanese' },
  { code: 'ko', name: 'Korean' },
  { code: 'zh', name: 'Chinese' },
  { code: 'ar', name: 'Arabic' },
  { code: 'hi', name: 'Hindi' },
  { code: 'tr', name: 'Turkish' },
  { code: 'nl', name: 'Dutch' },
  { code: 'sv', name: 'Swedish' },
  { code: 'da', name: 'Danish' },
  { code: 'no', name: 'Norwegian' },
  { code: 'fi', name: 'Finnish' },
  { code: 'pl', name: 'Polish' },
  { code: 'cs', name: 'Czech' },
  { code: 'hu', name: 'Hungarian' },
  { code: 'ro', name: 'Romanian' },
  { code: 'bg', name: 'Bulgarian' },
  { code: 'hr', name: 'Croatian' },
  { code: 'sk', name: 'Slovak' },
  { code: 'sl', name: 'Slovenian' },
  { code: 'et', name: 'Estonian' },
  { code: 'lv', name: 'Latvian' },
  { code: 'lt', name: 'Lithuanian' },
  { code: 'el', name: 'Greek' },
  { code: 'he', name: 'Hebrew' },
  { code: 'th', name: 'Thai' },
  { code: 'vi', name: 'Vietnamese' },
  { code: 'id', name: 'Indonesian' },
  { code: 'ms', name: 'Malay' },
  { code: 'tl', name: 'Filipino' },
  { code: 'sw', name: 'Swahili' },
  { code: 'af', name: 'Afrikaans' },
  { code: 'sq', name: 'Albanian' },
  { code: 'eu', name: 'Basque' },
  { code: 'be', name: 'Belarusian' },
  { code: 'bn', name: 'Bengali' },
  { code: 'bs', name: 'Bosnian' },
  { code: 'ca', name: 'Catalan' },
  { code: 'cy', name: 'Welsh' },
  { code: 'eo', name: 'Esperanto' },
  { code: 'fa', name: 'Persian' },
  { code: 'ga', name: 'Irish' },
  { code: 'gl', name: 'Galician' },
  { code: 'gu', name: 'Gujarati' },
  { code: 'is', name: 'Icelandic' },
  { code: 'ka', name: 'Georgian' },
  { code: 'kk', name: 'Kazakh' },
  { code: 'km', name: 'Khmer' },
  { code: 'kn', name: 'Kannada' },
  { code: 'ky', name: 'Kyrgyz' },
  { code: 'lo', name: 'Lao' },
  { code: 'mk', name: 'Macedonian' },
  { code: 'ml', name: 'Malayalam' },
  { code: 'mn', name: 'Mongolian' },
  { code: 'mr', name: 'Marathi' },
  { code: 'mt', name: 'Maltese' },
  { code: 'my', name: 'Myanmar' },
  { code: 'ne', name: 'Nepali' },
  { code: 'pa', name: 'Punjabi' },
  { code: 'si', name: 'Sinhala' },
  { code: 'ta', name: 'Tamil' },
  { code: 'te', name: 'Telugu' },
  { code: 'uk', name: 'Ukrainian' },
  { code: 'ur', name: 'Urdu' },
  { code: 'uz', name: 'Uzbek' }
];

const LanguageModal: React.FC<LanguageModalProps> = ({
  isOpen,
  onClose,
  language,
  onSuccess,
  addToast
}) => {
  const [formData, setFormData] = useState<ILanguage>({
    id: '',
    key: undefined,
    level: 'BEGINNER'
  });
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Partial<ILanguage>>({});

  const isEditing = Boolean(language?.id && !language.id.startsWith('temp_'));

  useEffect(() => {
    if (language) {
      setFormData({
        id: language.id || '',
        key: language.key,
        level: language.level || 'BEGINNER'
      });
    } else {
      setFormData({
        id: '',
        key: undefined,
        level: 'BEGINNER'
      });
    }
    setErrors({});
  }, [language, isOpen]);

  const validateForm = (): boolean => {
    const newErrors: Partial<ILanguage> = {};

    if (!formData.key || !formData.key.trim()) {
      newErrors.key = 'Language is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: keyof ILanguage, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const getLanguageName = (code: string | undefined) => {
    if (!code) return '';

    // Try to get name from iso-639-1
    const isoName = ISO6391.getName(code.toLowerCase());
    if (isoName) return isoName;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      if (isEditing) {
        // Update existing language
        const changedFields: Partial<ILanguage> = { id: formData.id };

        // Only include changed fields
        if (formData.key !== language?.key) changedFields.key = formData.key;
        if (formData.level !== language?.level) changedFields.level = formData.level;

        // Only make API call if there are actual changes
        if (Object.keys(changedFields).length > 1) {
          await wingManApi.patch(`/languages/${formData.id}`, changedFields);
          addToast('Language updated successfully', 'success');
        }
      } else {
        // Create new language
        const { id, ...languageData } = formData;
        const requestData = {
          ...languageData,
          key: languageData.key ? ISO6391.getCode(languageData.key.toLowerCase()).toUpperCase() : ''
        };
        await wingManApi.post('/languages', requestData);
        addToast('Language added successfully', 'success');
      }

      onSuccess();
      onClose();
    } catch (error: any) {
      console.error('Error saving language:', error);

      let errorMessage = isEditing ? 'Failed to update language' : 'Failed to add language';

      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.response?.status === 404) {
        errorMessage = 'Language record not found.';
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
      id: '',
      key: undefined,
      level: 'BEGINNER'
    });
    setErrors({});
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      size='md'
      scrollBehavior='inside'
      isDismissable={!isLoading}
      closeButton={!isLoading}
    >
      <ModalContent>
        <ModalHeader className='flex items-center gap-3'>
          <div className='bg-warning/20 rounded-xl p-2'>
            <Icon icon='solar:globe-linear' className='text-warning h-5 w-5' />
          </div>
          <div>
            <h2 className='text-xl font-semibold'>
              {isEditing ? 'Edit Language' : 'Add Language'}
            </h2>
            <p className='text-foreground-500 text-sm'>
              {isEditing ? 'Update this language skill' : 'Add a new language skill'}
            </p>
          </div>
        </ModalHeader>

        <ModalBody>
          <div className='space-y-4'>
            <Autocomplete
              label='Language *'
              placeholder='Select or type a language'
              selectedKey={formData.key || ''}
              onSelectionChange={(key) => handleInputChange('key', key)}
              onInputChange={(value) => {
                // Allow custom input for languages not in the list
                if (value && !commonLanguages.find((lang) => lang.code === value)) {
                  handleInputChange('key', value);
                }
              }}
              errorMessage={errors.key}
              isInvalid={!!errors.key}
              isDisabled={isLoading}
              allowsCustomValue
            >
              {commonLanguages.map((lang) => (
                <AutocompleteItem key={lang.code}>
                  {lang.name}
                </AutocompleteItem>
              ))}
            </Autocomplete>

            <Select
              label='Proficiency Level *'
              selectedKeys={formData.level ? [formData.level] : []}
              onSelectionChange={(keys) => {
                const level = [...keys][0] as ILanguage['level'];
                handleInputChange('level', level);
              }}
              isDisabled={isLoading}
            >
              <SelectItem key='NATIVE'>Native</SelectItem>
              <SelectItem key='PROFESSIONAL'>Professional</SelectItem>
              <SelectItem key='INTERMEDIATE'>Intermediate</SelectItem>
              <SelectItem key='BEGINNER'>Beginner</SelectItem>
            </Select>

            {/* Preview of selected language */}
            {formData.key && (
              <div className='bg-default-50 rounded-lg p-3'>
                <p className='text-foreground-600 text-sm'>
                  <strong>Selected:</strong> {getLanguageName(formData.key)} ({formData.key})
                </p>
              </div>
            )}
          </div>
        </ModalBody>

        <ModalFooter>
          <Button variant='light' onPress={handleClose} isDisabled={isLoading}>
            Cancel
          </Button>
          <Button
            color='primary'
            onPress={handleSubmit}
            isLoading={isLoading}
            startContent={
              !isLoading ? <Icon icon='solar:check-linear' className='h-4 w-4' /> : undefined
            }
          >
            {isEditing ? 'Update Language' : 'Add Language'}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default LanguageModal;
