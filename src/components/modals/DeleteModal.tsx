import { Modal, Button } from '../ui';
import type { AITool } from '../../types/index';
import { AlertTriangle } from 'lucide-react';
import { useState } from 'react';
import { useToolsStore } from '../../stores/toolsStore';

interface DeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  tool: AITool | null;
}

export default function DeleteModal({ isOpen, onClose, tool }: DeleteModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const deleteTool = useToolsStore((state) => state.deleteTool);

  const handleDelete = async () => {
    if (!tool) return;

    setIsLoading(true);
    
    // Simulate a brief delay for better UX
    await new Promise((resolve) => setTimeout(resolve, 300));
    
    deleteTool(tool.id);
    setIsLoading(false);
    onClose();
  };

  if (!tool) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Delete Tool"
      size="sm"
      footer={
        <>
          <Button variant="secondary" onClick={onClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleDelete} isLoading={isLoading}>
            Delete
          </Button>
        </>
      }
    >
      <div className="flex flex-col items-center text-center py-4">
        <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center mb-4">
          <AlertTriangle className="w-8 h-8 text-red-500" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-text-primary mb-2">
          Are you sure?
        </h3>
        <p className="text-gray-600 dark:text-text-secondary">
          This will permanently delete{' '}
          <span className="font-medium text-gray-900 dark:text-text-primary">
            {tool.name}
          </span>{' '}
          from your collection. This action cannot be undone.
        </p>
      </div>
    </Modal>
  );
}
