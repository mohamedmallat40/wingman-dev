'use client';

import React from 'react';
import { Button, Card, CardBody, Input, Select, SelectItem } from '@heroui/react';
import { Icon } from '@iconify/react';
import { type ILanguage } from 'modules/profile/types';

interface LanguagesFormProps {
  languages: ILanguage[];
  onAdd: () => void;
  onRemove: (index: number) => void;
  onUpdate: (index: number, data: ILanguage) => void;
}

export const LanguagesForm: React.FC<LanguagesFormProps> = ({ languages, onAdd, onRemove, onUpdate }) => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold">Languages ({languages.length})</h3>
          <p className="text-sm text-default-600">Languages you speak</p>
        </div>
        <Button
          color="primary"
          variant="flat"
          startContent={<Icon icon="solar:add-circle-outline" className="h-4 w-4" />}
          onPress={onAdd}
        >
          Add Language
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 max-h-96 overflow-y-auto pr-2">
        {languages.map((lang, index) => (
          <Card key={lang.id} className="border-2 border-default-200">
            <CardBody className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 flex-1">
                  <div className="p-2 bg-warning/20 rounded-lg">
                    <Icon icon="solar:translation-outline" className="h-4 w-4 text-warning/70" />
                  </div>
                  <div className="flex-1 space-y-2">
                    <Input
                      variant="bordered"
                      size="sm"
                      value={lang.key}
                      onChange={(e) => onUpdate(index, { ...lang, key: e.target.value })}
                      placeholder="Language name"
                    />
                    <Select
                      variant="bordered"
                      size="sm"
                      selectedKeys={[lang.level]}
                      onSelectionChange={(keys) => {
                        const level = Array.from(keys)[0] as typeof lang.level;
                        onUpdate(index, { ...lang, level });
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
                  onPress={() => onRemove(index)}
                >
                  <Icon icon="solar:trash-bin-trash-outline" className="h-4 w-4" />
                </Button>
              </div>
            </CardBody>
          </Card>
        ))}
      </div>
    </div>
  );
};
