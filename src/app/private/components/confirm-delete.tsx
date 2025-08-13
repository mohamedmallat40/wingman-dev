import { Button, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader } from '@heroui/react';
import { AlertTriangle } from 'lucide-react';

interface ConfirmDeleteModalProperties {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  title?: string;
  message?: string;
  itemName?: string;
  isLoading?: boolean;
  confirmText?: string;
  cancelText?: string;
}

export default function ConfirmDeleteModal({
  isOpen,
  onOpenChange,
  onConfirm,
  title = 'Confirm Delete',
  message,
  itemName,
  isLoading = false,
  confirmText = 'Delete',
  cancelText = 'Cancel'
}: Readonly<ConfirmDeleteModalProperties>) {
  const defaultMessage = itemName
    ? `Are you sure you want to delete "${itemName}"? This action cannot be undone.`
    : 'Are you sure you want to delete this item? This action cannot be undone.';

  const displayMessage = message ?? defaultMessage;

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      size='md'
      classNames={{
        base: 'max-w-md',
        backdrop: 'bg-black/50'
      }}
    >
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className='text-danger flex items-center gap-2'>
              <AlertTriangle size={20} />
              {title}
            </ModalHeader>
            <ModalBody>
              <p className='text-foreground-600'>{displayMessage}</p>
            </ModalBody>
            <ModalFooter>
              <Button variant='light' onPress={onClose} isDisabled={isLoading}>
                {cancelText}
              </Button>
              <Button
                color='danger'
                onPress={() => {
                  onConfirm();
                  onClose();
                }}
                isLoading={isLoading}
              >
                {confirmText}
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}
