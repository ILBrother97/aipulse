import { useState, useEffect } from 'react';
import { Modal, Button, Input, TextArea } from '../ui';
import type { Collection } from '../../types/index';
import { useToolsStore } from '../../stores/toolsStore';
import { toast } from '../../stores/toastStore';

interface CollectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  collection?: Collection | null;
}

const PRESET_COLORS = ['#00D9FF', '#A855F7', '#3B82F6', '#22C55E', '#F97316', '#EF4444', '#F59E0B', '#EC4899'];

export default function CollectionModal({ isOpen, onClose, collection }: CollectionModalProps) {
  const { addCollection, updateCollection } = useToolsStore();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [color, setColor] = useState(PRESET_COLORS[0]);
  const [isLoading, setIsLoading] = useState(false);

  const isEditing = !!collection;

  useEffect(() => {
    if (collection) {
      setName(collection.name);
      setDescription(collection.description || '');
      setColor(collection.color);
    } else {
      setName('');
      setDescription('');
      setColor(PRESET_COLORS[0]);
    }
  }, [collection, isOpen]);

  const handleSave = async () => {
    if (!name.trim()) return;
    setIsLoading(true);
    await new Promise((r) => setTimeout(r, 250));
    if (isEditing && collection) {
      updateCollection(collection.id, { name: name.trim(), description: description.trim(), color });
      toast.success(`Collection "${name}" updated`);
    } else {
      addCollection({ name: name.trim(), description: description.trim(), color, toolIds: [] });
      toast.success(`Collection "${name}" created`);
    }
    setIsLoading(false);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditing ? 'Edit Collection' : 'Create Collection'}
      description={isEditing ? 'Update collection details' : 'Organize tools into a custom collection'}
      size="sm"
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSave} isLoading={isLoading} disabled={!name.trim()}>
            {isEditing ? 'Save Changes' : 'Create'}
          </Button>
        </>
      }
    >
      <div className="space-y-4">
        <Input
          label="Name"
          placeholder="e.g., Daily Workflow"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <TextArea
          label="Description"
          placeholder="Brief description (optional)"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={2}
        />
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-text-secondary mb-2">Color</label>
          <div className="flex items-center gap-2 flex-wrap">
            {PRESET_COLORS.map((c) => (
              <button
                key={c}
                onClick={() => setColor(c)}
                className="w-8 h-8 rounded-full transition-all duration-200 hover:scale-110"
                style={{ backgroundColor: c, outline: color === c ? `3px solid ${c}` : 'none', outlineOffset: '2px' }}
              />
            ))}
          </div>
        </div>
      </div>
    </Modal>
  );
}
