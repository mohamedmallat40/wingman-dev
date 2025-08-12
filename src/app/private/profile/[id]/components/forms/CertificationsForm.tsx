'use client';

import React from 'react';
import { Button, Card, CardBody, Input } from '@heroui/react';
import { Icon } from '@iconify/react';

interface Certification {
  id: string;
  name: string;
  issuer: string;
  issueDate: string;
  expiryDate?: string;
  credentialId?: string;
}

interface CertificationsFormProps {
  certifications: Certification[];
  onAdd: () => void;
  onRemove: (index: number) => void;
  onUpdate: (index: number, data: Certification) => void;
}

export const CertificationsForm: React.FC<CertificationsFormProps> = ({ certifications, onAdd, onRemove, onUpdate }) => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold">Certifications ({certifications.length})</h3>
          <p className="text-sm text-default-600">Professional certifications and achievements</p>
        </div>
        <Button
          color="primary"
          variant="flat"
          startContent={<Icon icon="solar:add-circle-outline" className="h-4 w-4" />}
          onPress={onAdd}
        >
          Add Certification
        </Button>
      </div>

      <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
        {certifications.map((cert, index) => (
          <Card key={cert.id} className="border-2 border-default-200">
            <CardBody className="p-4">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-secondary/20 rounded-lg">
                    <Icon icon="solar:medal-star-outline" className="h-5 w-5 text-secondary/70" />
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
                  onPress={() => onRemove(index)}
                >
                  <Icon icon="solar:trash-bin-trash-outline" className="h-4 w-4" />
                </Button>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <Input
                  label="Certification Name"
                  variant="bordered"
                  value={cert.name}
                  onChange={(e) => onUpdate(index, { ...cert, name: e.target.value })}
                />
                <Input
                  label="Issuing Organization"
                  variant="bordered"
                  value={cert.issuer}
                  onChange={(e) => onUpdate(index, { ...cert, issuer: e.target.value })}
                />
                <Input
                  label="Issue Date"
                  type="date"
                  variant="bordered"
                  value={cert.issueDate}
                  onChange={(e) => onUpdate(index, { ...cert, issueDate: e.target.value })}
                />
                <Input
                  label="Expiry Date"
                  type="date"
                  variant="bordered"
                  value={cert.expiryDate || ''}
                  onChange={(e) => onUpdate(index, { ...cert, expiryDate: e.target.value })}
                />
              </div>
              <Input
                label="Credential ID"
                variant="bordered"
                value={cert.credentialId || ''}
                onChange={(e) => onUpdate(index, { ...cert, credentialId: e.target.value })}
                className="mt-4"
              />
            </CardBody>
          </Card>
        ))}
      </div>
    </div>
  );
};
