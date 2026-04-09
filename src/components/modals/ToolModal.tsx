import { useState, useEffect } from 'react';
import { Modal, Button, Input, TextArea, Select } from '../ui';
import type { AITool, ToolFormData } from '../../types/index';
import { useToolsStore } from '../../stores/toolsStore';
import { iconOptions } from '../../constants/defaultTools';
import * as LucideIcons from 'lucide-react';
import { Plus } from 'lucide-react';

interface ToolModalProps {
  isOpen: boolean;
  onClose: () => void;
  tool?: AITool | null;
}

const initialFormData: ToolFormData = {
  name: '',
  url: '',
  category: '',
  description: '',
  icon: 'Zap',
};

export default function ToolModal({ isOpen, onClose, tool }: ToolModalProps) {
  const { categories, addTool, updateTool, addCategory } = useToolsStore();
  const [formData, setFormData] = useState<ToolFormData>(initialFormData);
  const [errors, setErrors] = useState<Partial<Record<keyof ToolFormData, string>>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [newCategory, setNewCategory] = useState('');
  const [showNewCategoryInput, setShowNewCategoryInput] = useState(false);

  const isEditing = !!tool;

  useEffect(() => {
    if (tool) {
      setFormData({
        name: tool.name,
        url: tool.url,
        category: tool.category,
        description: tool.description || '',
        icon: tool.icon || 'Zap',
      });
    } else {
      setFormData(initialFormData);
    }
    setErrors({});
    setShowNewCategoryInput(false);
    setNewCategory('');
  }, [tool, isOpen]);

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof ToolFormData, string>> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.url.trim()) {
      newErrors.url = 'URL is required';
    } else if (!isValidUrl(formData.url)) {
      newErrors.url = 'Please enter a valid URL';
    }

    if (!formData.category.trim()) {
      newErrors.category = 'Category is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const isValidUrl = (url: string): boolean => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setIsLoading(true);

    // Simulate a brief delay for better UX
    await new Promise((resolve) => setTimeout(resolve, 300));

    if (isEditing && tool) {
      updateTool(tool.id, {
        name: formData.name,
        url: formData.url,
        category: formData.category,
        description: formData.description,
        icon: formData.icon,
      });
    } else {
      addTool({
        name: formData.name,
        url: formData.url,
        category: formData.category,
        description: formData.description,
        icon: formData.icon,
      });
    }

    setIsLoading(false);
    onClose();
  };

  const handleAddNewCategory = () => {
    if (newCategory.trim()) {
      addCategory(newCategory.trim());
      setFormData((prev) => ({ ...prev, category: newCategory.trim() }));
      setNewCategory('');
      setShowNewCategoryInput(false);
    }
  };

  const categoryOptions = [
    { value: '', label: 'Select a category' },
    ...categories.map((cat) => ({ value: cat.name, label: cat.name })),
    { value: 'new', label: '+ Create new category' },
  ];

  const iconSelectOptions = iconOptions.map((icon) => ({
    value: icon,
    label: icon,
  }));

  const isFormValid = formData.name.trim() && formData.url.trim() && formData.category.trim();

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditing ? 'Edit Tool' : 'Add New Tool'}
      description={isEditing ? 'Update your AI tool details' : 'Add a new AI tool to your collection'}
      size="md"
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            isLoading={isLoading}
            disabled={!isFormValid}
          >
            {isEditing ? 'Save Changes' : 'Add Tool'}
          </Button>
        </>
      }
    >
      <div className="space-y-4">
        <Input
          label="Name"
          placeholder="e.g., AI-Pulse"
          value={formData.name}
          onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
          error={errors.name}
          required
        />

        <Input
          label="URL"
          placeholder="e.g., https://aipulse-tool.vercel.app/"
          value={formData.url}
          onChange={(e) => setFormData((prev) => ({ ...prev, url: e.target.value }))}
          error={errors.url}
          required
        />

        {showNewCategoryInput ? (
          <div className="flex gap-2">
            <Input
              label="New Category"
              placeholder="Enter category name"
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              className="flex-1"
            />
            <div className="flex items-end gap-2">
              <Button size="sm" onClick={handleAddNewCategory}>
                Add
              </Button>
              <Button
                size="sm"
                variant="secondary"
                onClick={() => setShowNewCategoryInput(false)}
              >
                Cancel
              </Button>
            </div>
          </div>
        ) : (
          <Select
            label="Category"
            value={formData.category}
            onChange={(e) => {
              if (e.target.value === 'new') {
                setShowNewCategoryInput(true);
              } else {
                setFormData((prev) => ({ ...prev, category: e.target.value }));
              }
            }}
            options={categoryOptions}
            error={errors.category}
            required
          />
        )}

        <TextArea
          label="Description"
          placeholder="What does this AI tool do?"
          value={formData.description}
          onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
          rows={3}
        />

        {/* Icon Selection */}
        <div>
          <label className="block text-[11px] font-medium text-[#475569] uppercase tracking-[0.08em] mb-2">
            Icon
          </label>
          {/* Icon Grid - Mobile: 2 columns side by side (8 left, 8 right), Desktop: 8 columns */}
          <div className="flex sm:grid sm:grid-cols-4 md:grid-cols-8 gap-2">
            {/* Left column - first 8 icons (mobile) */}
            <div className="flex flex-col gap-2 w-1/2 sm:w-auto sm:contents">
              {iconOptions.slice(0, 8).map((iconName) => {
                const IconComponent = LucideIcons[iconName as keyof typeof LucideIcons] as React.ComponentType<{
                  className?: string;
                }>;
                const isSelected = formData.icon === iconName;

                return (
                  <button
                    key={iconName}
                    onClick={() => setFormData((prev) => ({ ...prev, icon: iconName }))}
                    className={`p-2.5 sm:p-2 rounded-lg sm:rounded-[6px] transition-all duration-200 border flex items-center justify-center ${
                      isSelected
                        ? 'bg-[var(--color-accent)] text-[#0a0e1a] border-[var(--color-accent)]'
                        : 'bg-gray-100 dark:bg-[#111827] border-gray-200 dark:border-[rgba(255,255,255,0.06)] text-[#475569] hover:border-[rgba(255,255,255,0.2)] hover:text-[#94a3b8]'
                    }`}
                    title={iconName}
                  >
                    {IconComponent && <IconComponent className="w-5 h-5" />}
                  </button>
                );
              })}
            </div>
            {/* Right column - next 8 icons (mobile) */}
            <div className="flex flex-col gap-2 w-1/2 sm:w-auto sm:contents">
              {iconOptions.slice(8, 16).map((iconName) => {
                const IconComponent = LucideIcons[iconName as keyof typeof LucideIcons] as React.ComponentType<{
                  className?: string;
                }>;
                const isSelected = formData.icon === iconName;

                return (
                  <button
                    key={iconName}
                    onClick={() => setFormData((prev) => ({ ...prev, icon: iconName }))}
                    className={`p-2.5 sm:p-2 rounded-lg sm:rounded-[6px] transition-all duration-200 border flex items-center justify-center ${
                      isSelected
                        ? 'bg-[var(--color-accent)] text-[#0a0e1a] border-[var(--color-accent)]'
                        : 'bg-gray-100 dark:bg-[#111827] border-gray-200 dark:border-[rgba(255,255,255,0.06)] text-[#475569] hover:border-[rgba(255,255,255,0.2)] hover:text-[#94a3b8]'
                    }`}
                    title={iconName}
                  >
                    {IconComponent && <IconComponent className="w-5 h-5" />}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
}
