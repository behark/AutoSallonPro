import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, Edit, Trash2, Save, X, Type, Image, Link, MessageSquare } from "lucide-react";

interface FreeTextElement {
  id: string;
  type: 'text' | 'title' | 'description' | 'button' | 'image' | 'link';
  content: string;
  styles: string;
  position: { x: number; y: number };
  page: string;
  section: string;
}

interface FreeTextEditorProps {
  page: string;
  section: string;
  onElementAdd: (element: FreeTextElement) => void;
  onElementEdit: (element: FreeTextElement) => void;
  onElementDelete: (elementId: string) => void;
  elements: FreeTextElement[];
}

export function FreeTextEditor({ page, section, onElementAdd, onElementEdit, onElementDelete, elements }: FreeTextEditorProps) {
  const [isAddingElement, setIsAddingElement] = useState(false);
  const [editingElement, setEditingElement] = useState<FreeTextElement | null>(null);
  const [newElement, setNewElement] = useState({
    type: 'text' as const,
    content: '',
    styles: '',
    position: { x: 0, y: 0 }
  });

  const handleAddElement = () => {
    const element: FreeTextElement = {
      id: `${page}_${section}_${Date.now()}`,
      type: newElement.type,
      content: newElement.content,
      styles: newElement.styles,
      position: newElement.position,
      page,
      section
    };
    
    onElementAdd(element);
    setIsAddingElement(false);
    setNewElement({
      type: 'text',
      content: '',
      styles: '',
      position: { x: 0, y: 0 }
    });
  };

  const handleEditElement = (element: FreeTextElement) => {
    setEditingElement(element);
  };

  const handleUpdateElement = () => {
    if (editingElement) {
      onElementEdit(editingElement);
      setEditingElement(null);
    }
  };

  const elementTypes = [
    { value: 'text', label: 'Text', icon: Type },
    { value: 'title', label: 'Title', icon: Type },
    { value: 'description', label: 'Description', icon: MessageSquare },
    { value: 'button', label: 'Button', icon: MessageSquare },
    { value: 'image', label: 'Image', icon: Image },
    { value: 'link', label: 'Link', icon: Link }
  ];

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <Card className="w-80 max-h-96 overflow-y-auto">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm flex items-center justify-between">
            <span>Free Text Editor</span>
            <Button
              onClick={() => setIsAddingElement(true)}
              size="sm"
              variant="outline"
              className="h-6 w-6 p-0"
            >
              <Plus className="h-3 w-3" />
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-2">
          <div className="text-xs text-gray-500 mb-2">
            Page: {page} | Section: {section}
          </div>
          
          {/* Add Element Form */}
          {isAddingElement && (
            <div className="border rounded p-2 mb-2 space-y-2">
              <select
                value={newElement.type}
                onChange={(e) => setNewElement(prev => ({ ...prev, type: e.target.value as any }))}
                className="w-full p-1 border rounded text-xs"
              >
                {elementTypes.map(type => (
                  <option key={type.value} value={type.value}>{type.label}</option>
                ))}
              </select>
              
              <Textarea
                placeholder="Enter content..."
                value={newElement.content}
                onChange={(e) => setNewElement(prev => ({ ...prev, content: e.target.value }))}
                className="text-xs"
                rows={2}
              />
              
              <Input
                placeholder="CSS classes (optional)"
                value={newElement.styles}
                onChange={(e) => setNewElement(prev => ({ ...prev, styles: e.target.value }))}
                className="text-xs"
              />
              
              <div className="flex gap-1">
                <Button onClick={handleAddElement} size="sm" className="h-6 text-xs">
                  <Save className="h-3 w-3 mr-1" />
                  Add
                </Button>
                <Button onClick={() => setIsAddingElement(false)} size="sm" variant="outline" className="h-6 text-xs">
                  <X className="h-3 w-3 mr-1" />
                  Cancel
                </Button>
              </div>
            </div>
          )}

          {/* Edit Element Form */}
          {editingElement && (
            <div className="border rounded p-2 mb-2 space-y-2">
              <div className="text-xs font-semibold">Editing: {editingElement.type}</div>
              
              <Textarea
                value={editingElement.content}
                onChange={(e) => setEditingElement(prev => prev ? { ...prev, content: e.target.value } : null)}
                className="text-xs"
                rows={2}
              />
              
              <Input
                placeholder="CSS classes"
                value={editingElement.styles}
                onChange={(e) => setEditingElement(prev => prev ? { ...prev, styles: e.target.value } : null)}
                className="text-xs"
              />
              
              <div className="flex gap-1">
                <Button onClick={handleUpdateElement} size="sm" className="h-6 text-xs">
                  <Save className="h-3 w-3 mr-1" />
                  Update
                </Button>
                <Button onClick={() => setEditingElement(null)} size="sm" variant="outline" className="h-6 text-xs">
                  <X className="h-3 w-3 mr-1" />
                  Cancel
                </Button>
              </div>
            </div>
          )}

          {/* Elements List */}
          <div className="space-y-1">
            {elements.filter(el => el.page === page && el.section === section).map(element => (
              <div key={element.id} className="flex items-center justify-between p-1 border rounded text-xs">
                <div className="flex items-center gap-1">
                  <Badge variant="outline" className="text-xs h-4">
                    {element.type}
                  </Badge>
                  <span className="truncate max-w-24">
                    {element.content.substring(0, 20)}...
                  </span>
                </div>
                <div className="flex gap-1">
                  <Button
                    onClick={() => handleEditElement(element)}
                    size="sm"
                    variant="outline"
                    className="h-4 w-4 p-0"
                  >
                    <Edit className="h-2 w-2" />
                  </Button>
                  <Button
                    onClick={() => onElementDelete(element.id)}
                    size="sm"
                    variant="outline"
                    className="h-4 w-4 p-0"
                  >
                    <Trash2 className="h-2 w-2" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}