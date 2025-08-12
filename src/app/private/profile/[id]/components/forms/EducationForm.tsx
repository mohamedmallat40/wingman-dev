'use client';

import React from 'react';
import { Button, Card, CardBody, CardHeader, Input, Textarea } from '@heroui/react';
import { Icon } from '@iconify/react';
import { type IEducation } from 'modules/profile/types';

interface EducationFormProps {
  education: IEducation[];
  onAdd: () => void;
  onRemove: (index: number) => void;
  onUpdate: (index: number, data: IEducation) => void;
}

export const EducationForm: React.FC<EducationFormProps> = ({ education, onAdd, onRemove, onUpdate }) => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold">Education ({education.length})</h3>
          <p className="text-sm text-default-600">Your educational background</p>
        </div>
        <Button
          color="primary"
          variant="flat"
          startContent={<Icon icon="solar:add-circle-outline" className="h-4 w-4" />}
          onPress={onAdd}
        >
          Add Education
        </Button>
      </div>

      <div className="space-y-6 max-h-96 overflow-y-auto pr-2">
        {education.map((edu, index) => (
          <Card key={edu.id} className="border-2 border-default-200">
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start w-full">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-success/20 rounded-lg">
                    <Icon icon="solar:graduation-outline" className="h-5 w-5 text-success/70" />
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
                  onPress={() => onRemove(index)}
                >
                  <Icon icon="solar:trash-bin-trash-outline" className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardBody className="pt-0">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <Input
                  label="University/Institution"
                  variant="bordered"
                  value={edu.university}
                  onChange={(e) => onUpdate(index, { ...edu, university: e.target.value })}
                />
                <Input
                  label="Degree"
                  variant="bordered"
                  value={edu.degree}
                  onChange={(e) => onUpdate(index, { ...edu, degree: e.target.value })}
                />
                <Input
                  label="Start Date"
                  type="date"
                  variant="bordered"
                  value={edu.startDate}
                  onChange={(e) => onUpdate(index, { ...edu, startDate: e.target.value })}
                />
                <Input
                  label="End Date"
                  type="date"
                  variant="bordered"
                  value={edu.endDate}
                  onChange={(e) => onUpdate(index, { ...edu, endDate: e.target.value })}
                />
              </div>
              <Textarea
                label="Additional Information"
                variant="bordered"
                value={edu.description}
                onChange={(e) => onUpdate(index, { ...edu, description: e.target.value })}
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
