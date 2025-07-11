import React, { useState, useEffect, useRef } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Edit2, Save, X, Check } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useContent } from '@/hooks/useContent';
import { ContentSection, InsertContentSection } from '@shared/content-schema';
import { apiRequest } from '@/lib/queryClient';
import { useQuery } from '@tanstack/react-query';

interface EditableTextProps {
  sectionKey: string;
  defaultValue: string;
  type?: 'text' | 'title' | 'subtitle' | 'description' | 'button' | 'badge';
  page?: string;
  section?: string;
  multiline?: boolean;
  className?: string;
  children?: React.ReactNode;
  placeholder?: string;
  as?: keyof JSX.IntrinsicElements;
}

export function EditableText({
  sectionKey,
  defaultValue,
  type = 'text',
  page = 'home',
  section = 'content',
  multiline = false,
  className = '',
  children,
  placeholder,
  as = 'div'
}: EditableTextProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState('');
  const [isHovered, setIsHovered] = useState(false);
  const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: contentSections = [] } = useQuery<ContentSection[]>({
    queryKey: ['/api/content'],
  });

  const content = useContent(sectionKey, defaultValue);

  const updateContentMutation = useMutation({
    mutationFn: async (newContent: string) => {
      const contentData: InsertContentSection = {
        sectionKey,
        title: sectionKey.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
        content: newContent,
        contentType: type,
        page,
        category: section,
        isActive: true,
      };

      const existingContent = contentSections.find(c => c.sectionKey === sectionKey);
      if (existingContent) {
        return apiRequest(`/api/content/${existingContent.id}`, 'PATCH', contentData);
      } else {
        return apiRequest('/api/content', 'POST', contentData);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/content'] });
      toast({ title: 'Content updated successfully!' });
      setIsEditing(false);
    },
    onError: (error) => {
      toast({ title: 'Error updating content', description: error.message, variant: 'destructive' });
    },
  });

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      if (inputRef.current.type !== 'textarea') {
        inputRef.current.select();
      }
    }
  }, [isEditing]);

  const handleDoubleClick = () => {
    setEditValue(content);
    setIsEditing(true);
  };

  const handleSave = () => {
    if (editValue.trim() !== content) {
      updateContentMutation.mutate(editValue.trim());
    } else {
      setIsEditing(false);
    }
  };

  const handleCancel = () => {
    setEditValue(content);
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !multiline) {
      e.preventDefault();
      handleSave();
    } else if (e.key === 'Escape') {
      handleCancel();
    } else if (e.key === 'Enter' && e.ctrlKey && multiline) {
      handleSave();
    }
  };

  const Component = as;

  if (isEditing) {
    return (
      <div className="relative inline-block w-full">
        {multiline ? (
          <Textarea
            ref={inputRef as React.RefObject<HTMLTextAreaElement>}
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            onKeyDown={handleKeyDown}
            className={`${className} min-h-[80px] resize-none`}
            placeholder={placeholder}
            rows={3}
          />
        ) : (
          <Input
            ref={inputRef as React.RefObject<HTMLInputElement>}
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            onKeyDown={handleKeyDown}
            className={className}
            placeholder={placeholder}
          />
        )}
        <div className="flex items-center gap-2 mt-2">
          <Button 
            size="sm" 
            onClick={handleSave}
            disabled={updateContentMutation.isPending}
            className="h-8"
          >
            <Check className="w-3 h-3 mr-1" />
            Save
          </Button>
          <Button 
            size="sm" 
            variant="outline" 
            onClick={handleCancel}
            className="h-8"
          >
            <X className="w-3 h-3 mr-1" />
            Cancel
          </Button>
          {multiline && (
            <span className="text-xs text-gray-500">
              Ctrl+Enter to save, Esc to cancel
            </span>
          )}
        </div>
      </div>
    );
  }

  return (
    <Component
      className={`${className} relative group cursor-pointer transition-all duration-200 ${
        isHovered ? 'ring-2 ring-blue-300 ring-opacity-50' : ''
      }`}
      onDoubleClick={handleDoubleClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      title="Double-click to edit"
    >
      {children || content}
      {isHovered && (
        <div className="absolute -top-2 -right-2 z-10">
          <Badge variant="secondary" className="text-xs bg-blue-100 text-blue-800 border-blue-300">
            <Edit2 className="w-3 h-3 mr-1" />
            Edit
          </Badge>
        </div>
      )}
    </Component>
  );
}

// Convenience components for common use cases
export function EditableTitle({ sectionKey, defaultValue, className = '', ...props }: Omit<EditableTextProps, 'type' | 'as'>) {
  return (
    <EditableText
      sectionKey={sectionKey}
      defaultValue={defaultValue}
      type="title"
      className={className}
      as="h1"
      {...props}
    />
  );
}

export function EditableSubtitle({ sectionKey, defaultValue, className = '', ...props }: Omit<EditableTextProps, 'type' | 'as'>) {
  return (
    <EditableText
      sectionKey={sectionKey}
      defaultValue={defaultValue}
      type="subtitle"
      className={className}
      as="h2"
      {...props}
    />
  );
}

export function EditableDescription({ sectionKey, defaultValue, className = '', ...props }: Omit<EditableTextProps, 'type' | 'multiline' | 'as'>) {
  return (
    <EditableText
      sectionKey={sectionKey}
      defaultValue={defaultValue}
      type="description"
      className={className}
      multiline={true}
      as="p"
      {...props}
    />
  );
}

export function EditableButton({ sectionKey, defaultValue, className = '', ...props }: Omit<EditableTextProps, 'type' | 'as'>) {
  return (
    <EditableText
      sectionKey={sectionKey}
      defaultValue={defaultValue}
      type="button"
      className={className}
      as="span"
      {...props}
    />
  );
}

export function EditableBadge({ sectionKey, defaultValue, className = '', ...props }: Omit<EditableTextProps, 'type' | 'as'>) {
  return (
    <EditableText
      sectionKey={sectionKey}
      defaultValue={defaultValue}
      type="badge"
      className={className}
      as="span"
      {...props}
    />
  );
}