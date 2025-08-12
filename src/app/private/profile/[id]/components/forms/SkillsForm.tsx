'use client';

import React from 'react';
import { Button, Card, CardBody, Input, Select, SelectItem } from '@heroui/react';
import { Icon } from '@iconify/react';
import { type Skill } from 'modules/profile/types';

interface SkillsFormProps {
  skills: Skill[];
  onAdd: () => void;
  onRemove: (index: number) => void;
  onUpdate: (index: number, data: Skill) => void;
}

export const SkillsForm: React.FC<SkillsFormProps> = ({ skills, onAdd, onRemove, onUpdate }) => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold">Skills ({skills.length})</h3>
          <p className="text-sm text-default-600">Manage your technical and soft skills</p>
        </div>
        <Button
          color="primary"
          variant="flat"
          startContent={<Icon icon="solar:add-circle-outline" className="h-4 w-4" />}
          onPress={onAdd}
        >
          Add Skill
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 max-h-96 overflow-y-auto pr-2">
        {skills.map((skill, index) => (
          <Card key={skill.id} className="border-2 border-default-200 hover:border-primary/50 transition-colors">
            <CardBody className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 flex-1">
                  <div className={`p-2 rounded-lg ${skill.type === 'SOFT' ? 'bg-secondary/20' : 'bg-primary/20'}`}>
                    <Icon 
                      icon={skill.type === 'SOFT' ? "solar:heart-outline" : "solar:code-outline"} 
                      className={`h-4 w-4 ${skill.type === 'SOFT' ? 'text-secondary/70' : 'text-primary/70'}`}
                    />
                  </div>
                  <div className="flex-1">
                    <Input
                      variant="bordered"
                      size="sm"
                      value={skill.key}
                      onChange={(e) => onUpdate(index, { ...skill, key: e.target.value })}
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
                      onUpdate(index, { ...skill, type });
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
