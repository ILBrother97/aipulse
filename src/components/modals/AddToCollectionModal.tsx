import { Modal, Button } from '../ui';
import type { AITool } from '../../types/index';
import { useToolsStore } from '../../stores/toolsStore';
import { FolderOpen, Check, Plus } from 'lucide-react';
import { toast } from '../../stores/toastStore';

interface AddToCollectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  tool: AITool | null;
  onCreateCollection: () => void;
}

export default function AddToCollectionModal({ isOpen, onClose, tool, onCreateCollection }: AddToCollectionModalProps) {
  const { collections, addToolToCollection, removeToolFromCollection } = useToolsStore();

  if (!tool) return null;

  const handleToggle = (collectionId: string) => {
    const col = collections.find((c) => c.id === collectionId);
    if (!col) return;
    if (col.toolIds.includes(tool.id)) {
      removeToolFromCollection(tool.id, collectionId);
      toast.info(`Removed from "${col.name}"`);
    } else {
      addToolToCollection(tool.id, collectionId);
      toast.success(`Added to "${col.name}"`);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Add to Collection"
      description={`Add "${tool.name}" to a collection`}
      size="sm"
      footer={<Button onClick={onClose}>Done</Button>}
    >
      {collections.length === 0 ? (
        <div className="flex flex-col items-center py-6 text-center">
          <FolderOpen className="w-10 h-10 text-gray-400 dark:text-text-muted mb-3" />
          <p className="text-gray-600 dark:text-text-secondary mb-4">No collections yet.</p>
          <Button onClick={() => { onClose(); onCreateCollection(); }} leftIcon={<Plus className="w-4 h-4" />}>
            Create Collection
          </Button>
        </div>
      ) : (
        <div className="space-y-2">
          {collections.map((col) => {
            const inCollection = col.toolIds.includes(tool.id);
            return (
              <button
                key={col.id}
                onClick={() => handleToggle(col.id)}
                className="w-full flex items-center justify-between px-4 py-3 rounded-xl bg-gray-100 dark:bg-background-dark border-2 border-gray-200 dark:border-border hover:border-primary/50 transition-all duration-200"
              >
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 rounded-full" style={{ backgroundColor: col.color }} />
                  <div className="text-left">
                    <p className="text-sm font-medium text-gray-900 dark:text-text-primary">{col.name}</p>
                    <p className="text-xs text-gray-500 dark:text-text-muted">{col.toolIds.length} tools</p>
                  </div>
                </div>
                {inCollection && <Check className="w-4 h-4 text-primary" />}
              </button>
            );
          })}
        </div>
      )}
    </Modal>
  );
}
