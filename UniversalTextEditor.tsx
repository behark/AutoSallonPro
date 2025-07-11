import React, { useState, useEffect, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  Plus, 
  Edit, 
  Trash2, 
  Save, 
  X, 
  Type, 
  Image, 
  Link2, 
  MessageSquare, 
  Hash,
  Eye,
  EyeOff,
  Move,
  Palette
} from "lucide-react";

interface UniversalElement {
  id: string;
  type: 'text' | 'title' | 'subtitle' | 'description' | 'button' | 'image' | 'link' | 'badge' | 'custom';
  content: string;
  styles: string;
  containerStyles: string;
  position: 'before' | 'after' | 'replace';
  targetElement?: string;
  visible: boolean;
  order: number;
}

interface UniversalTextEditorProps {
  isActive: boolean;
  onToggle: () => void;
}

export function UniversalTextEditor({ isActive, onToggle }: UniversalTextEditorProps) {
  const [elements, setElements] = useState<UniversalElement[]>([]);
  const [isAddingElement, setIsAddingElement] = useState(false);
  const [editingElement, setEditingElement] = useState<UniversalElement | null>(null);
  const [newElement, setNewElement] = useState({
    type: 'text' as const,
    content: '',
    styles: '',
    containerStyles: '',
    position: 'after' as const,
    targetElement: ''
  });
  const [currentPage, setCurrentPage] = useState('');
  const [selectedElement, setSelectedElement] = useState<string>('');
  const editorRef = useRef<HTMLDivElement>(null);

  // Auto-detect current page
  useEffect(() => {
    const path = window.location.pathname;
    const page = path === '/' ? 'home' : path.substring(1);
    setCurrentPage(page);
  }, []);

  // Load elements from localStorage
  useEffect(() => {
    const savedElements = localStorage.getItem('universalTextElements');
    if (savedElements) {
      try {
        setElements(JSON.parse(savedElements));
      } catch (error) {
        console.error('Error loading elements:', error);
      }
    }
  }, []);

  // Save elements to localStorage
  useEffect(() => {
    if (elements.length > 0) {
      localStorage.setItem('universalTextElements', JSON.stringify(elements));
    }
  }, [elements]);

  // Inject elements into the page
  useEffect(() => {
    if (!isActive) return;

    // Clean up existing injected elements
    document.querySelectorAll('[data-universal-element]').forEach(el => el.remove());

    // Inject new elements
    elements.forEach(element => {
      if (!element.visible) return;

      const targetSelector = element.targetElement || 'body';
      const targetEl = document.querySelector(targetSelector);
      
      if (targetEl) {
        const newEl = document.createElement('div');
        newEl.setAttribute('data-universal-element', element.id);
        newEl.className = element.containerStyles || '';
        newEl.style.cssText = 'position: relative; z-index: 10;';
        
        // Create content based on type
        let content = '';
        switch (element.type) {
          case 'title':
            content = `<h2 class="${element.styles || 'text-2xl font-bold'}">${element.content}</h2>`;
            break;
          case 'subtitle':
            content = `<h3 class="${element.styles || 'text-xl font-semibold'}">${element.content}</h3>`;
            break;
          case 'description':
            content = `<p class="${element.styles || 'text-gray-600'}">${element.content}</p>`;
            break;
          case 'button':
            content = `<button class="${element.styles || 'bg-blue-600 text-white px-4 py-2 rounded'}">${element.content}</button>`;
            break;
          case 'image':
            content = `<img src="${element.content}" class="${element.styles || 'max-w-full h-auto'}" alt="Custom image" />`;
            break;
          case 'link':
            content = `<a href="${element.content}" class="${element.styles || 'text-blue-600 underline'}">${element.content}</a>`;
            break;
          case 'badge':
            content = `<span class="${element.styles || 'bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm'}">${element.content}</span>`;
            break;
          default:
            content = `<span class="${element.styles || ''}">${element.content}</span>`;
        }
        
        newEl.innerHTML = content;
        
        // Position the element
        if (element.position === 'before') {
          targetEl.insertBefore(newEl, targetEl.firstChild);
        } else if (element.position === 'after') {
          targetEl.appendChild(newEl);
        } else if (element.position === 'replace') {
          targetEl.innerHTML = '';
          targetEl.appendChild(newEl);
        }
      }
    });
  }, [elements, isActive]);

  const handleAddElement = () => {
    const element: UniversalElement = {
      id: `element_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      type: newElement.type,
      content: newElement.content,
      styles: newElement.styles,
      containerStyles: newElement.containerStyles,
      position: newElement.position,
      targetElement: newElement.targetElement,
      visible: true,
      order: elements.length
    };
    
    setElements(prev => [...prev, element]);
    setIsAddingElement(false);
    setNewElement({
      type: 'text',
      content: '',
      styles: '',
      containerStyles: '',
      position: 'after',
      targetElement: ''
    });
  };

  const handleEditElement = (element: UniversalElement) => {
    setEditingElement(element);
  };

  const handleUpdateElement = () => {
    if (editingElement) {
      setElements(prev => 
        prev.map(el => 
          el.id === editingElement.id ? editingElement : el
        )
      );
      setEditingElement(null);
    }
  };

  const handleDeleteElement = (elementId: string) => {
    setElements(prev => prev.filter(el => el.id !== elementId));
  };

  const handleToggleVisibility = (elementId: string) => {
    setElements(prev => 
      prev.map(el => 
        el.id === elementId ? { ...el, visible: !el.visible } : el
      )
    );
  };

  const elementTypes = [
    { value: 'text', label: 'Text', icon: Type },
    { value: 'title', label: 'Title', icon: Hash },
    { value: 'subtitle', label: 'Subtitle', icon: Hash },
    { value: 'description', label: 'Description', icon: MessageSquare },
    { value: 'button', label: 'Button', icon: MessageSquare },
    { value: 'image', label: 'Image', icon: Image },
    { value: 'link', label: 'Link', icon: Link2 },
    { value: 'badge', label: 'Badge', icon: Badge },
    { value: 'custom', label: 'Custom HTML', icon: Type }
  ];

  const commonSelectors = [
    { value: 'body', label: 'Page Body' },
    { value: '.container', label: 'Container' },
    { value: 'header', label: 'Header' },
    { value: 'main', label: 'Main Content' },
    { value: 'footer', label: 'Footer' },
    { value: '.hero-section', label: 'Hero Section' },
    { value: 'section', label: 'Any Section' },
    { value: '.text-center', label: 'Centered Text' },
    { value: '.mb-4', label: 'Margin Bottom' },
    { value: '.py-20', label: 'Padding Section' }
  ];

  const stylePresets = [
    { value: 'text-xl font-bold text-gray-800', label: 'Large Bold Text' },
    { value: 'text-lg text-gray-600', label: 'Medium Gray Text' },
    { value: 'text-sm text-blue-600', label: 'Small Blue Text' },
    { value: 'bg-blue-600 text-white px-4 py-2 rounded', label: 'Blue Button' },
    { value: 'bg-red-600 text-white px-4 py-2 rounded', label: 'Red Button' },
    { value: 'bg-green-600 text-white px-4 py-2 rounded', label: 'Green Button' },
    { value: 'border border-gray-300 p-4 rounded', label: 'Bordered Box' },
    { value: 'shadow-lg p-6 rounded-lg bg-white', label: 'Card Style' }
  ];

  if (!isActive) {
    return (
      <Button
        onClick={onToggle}
        className="fixed bottom-4 right-4 z-50 bg-purple-600 hover:bg-purple-700"
        size="lg"
      >
        <Edit className="h-5 w-5 mr-2" />
        Universal Editor
      </Button>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 z-50" ref={editorRef}>
      <Card className="w-96 max-h-[80vh] overflow-y-auto shadow-xl">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Edit className="h-5 w-5" />
              Universal Text Editor
            </span>
            <div className="flex gap-2">
              <Button
                onClick={() => setIsAddingElement(true)}
                size="sm"
                className="h-8 w-8 p-0"
              >
                <Plus className="h-4 w-4" />
              </Button>
              <Button
                onClick={onToggle}
                size="sm"
                variant="outline"
                className="h-8 w-8 p-0"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-2">
          <div className="text-sm text-gray-500 mb-4">
            Current Page: <Badge variant="outline">{currentPage}</Badge>
          </div>
          
          {/* Add Element Form */}
          {isAddingElement && (
            <div className="border rounded-lg p-4 mb-4 space-y-3 bg-gray-50">
              <div className="font-semibold text-sm">Add New Element</div>
              
              <div>
                <label className="text-xs font-medium">Element Type</label>
                <select
                  value={newElement.type}
                  onChange={(e) => setNewElement(prev => ({ ...prev, type: e.target.value as any }))}
                  className="w-full p-2 border rounded text-sm"
                >
                  {elementTypes.map(type => (
                    <option key={type.value} value={type.value}>{type.label}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="text-xs font-medium">Content</label>
                <Textarea
                  placeholder="Enter your content..."
                  value={newElement.content}
                  onChange={(e) => setNewElement(prev => ({ ...prev, content: e.target.value }))}
                  className="text-sm"
                  rows={3}
                />
              </div>
              
              <div>
                <label className="text-xs font-medium">Target Element (CSS Selector)</label>
                <div className="flex gap-2">
                  <Input
                    placeholder="body, .container, #header"
                    value={newElement.targetElement}
                    onChange={(e) => setNewElement(prev => ({ ...prev, targetElement: e.target.value }))}
                    className="text-sm"
                  />
                  <select
                    value={newElement.targetElement}
                    onChange={(e) => setNewElement(prev => ({ ...prev, targetElement: e.target.value }))}
                    className="p-2 border rounded text-sm"
                  >
                    <option value="">Select...</option>
                    {commonSelectors.map(selector => (
                      <option key={selector.value} value={selector.value}>{selector.label}</option>
                    ))}
                  </select>
                </div>
              </div>
              
              <div>
                <label className="text-xs font-medium">Position</label>
                <select
                  value={newElement.position}
                  onChange={(e) => setNewElement(prev => ({ ...prev, position: e.target.value as any }))}
                  className="w-full p-2 border rounded text-sm"
                >
                  <option value="before">Before Element</option>
                  <option value="after">After Element</option>
                  <option value="replace">Replace Element</option>
                </select>
              </div>
              
              <div>
                <label className="text-xs font-medium">Styling (CSS Classes)</label>
                <div className="space-y-2">
                  <Input
                    placeholder="text-xl font-bold text-blue-600"
                    value={newElement.styles}
                    onChange={(e) => setNewElement(prev => ({ ...prev, styles: e.target.value }))}
                    className="text-sm"
                  />
                  <select
                    value=""
                    onChange={(e) => setNewElement(prev => ({ ...prev, styles: e.target.value }))}
                    className="w-full p-2 border rounded text-sm"
                  >
                    <option value="">Style Presets...</option>
                    {stylePresets.map(preset => (
                      <option key={preset.value} value={preset.value}>{preset.label}</option>
                    ))}
                  </select>
                </div>
              </div>
              
              <div>
                <label className="text-xs font-medium">Container Styling</label>
                <Input
                  placeholder="p-4 mb-4 bg-gray-100 rounded"
                  value={newElement.containerStyles}
                  onChange={(e) => setNewElement(prev => ({ ...prev, containerStyles: e.target.value }))}
                  className="text-sm"
                />
              </div>
              
              <div className="flex gap-2">
                <Button onClick={handleAddElement} size="sm" className="flex-1">
                  <Save className="h-4 w-4 mr-2" />
                  Add Element
                </Button>
                <Button onClick={() => setIsAddingElement(false)} size="sm" variant="outline">
                  <X className="h-4 w-4 mr-2" />
                  Cancel
                </Button>
              </div>
            </div>
          )}

          {/* Edit Element Form */}
          {editingElement && (
            <div className="border rounded-lg p-4 mb-4 space-y-3 bg-blue-50">
              <div className="font-semibold text-sm">Edit Element</div>
              
              <div>
                <label className="text-xs font-medium">Content</label>
                <Textarea
                  value={editingElement.content}
                  onChange={(e) => setEditingElement(prev => prev ? { ...prev, content: e.target.value } : null)}
                  className="text-sm"
                  rows={3}
                />
              </div>
              
              <div>
                <label className="text-xs font-medium">Target Element</label>
                <Input
                  value={editingElement.targetElement || ''}
                  onChange={(e) => setEditingElement(prev => prev ? { ...prev, targetElement: e.target.value } : null)}
                  className="text-sm"
                />
              </div>
              
              <div>
                <label className="text-xs font-medium">Styling</label>
                <Input
                  value={editingElement.styles}
                  onChange={(e) => setEditingElement(prev => prev ? { ...prev, styles: e.target.value } : null)}
                  className="text-sm"
                />
              </div>
              
              <div>
                <label className="text-xs font-medium">Container Styling</label>
                <Input
                  value={editingElement.containerStyles}
                  onChange={(e) => setEditingElement(prev => prev ? { ...prev, containerStyles: e.target.value } : null)}
                  className="text-sm"
                />
              </div>
              
              <div className="flex gap-2">
                <Button onClick={handleUpdateElement} size="sm" className="flex-1">
                  <Save className="h-4 w-4 mr-2" />
                  Update
                </Button>
                <Button onClick={() => setEditingElement(null)} size="sm" variant="outline">
                  <X className="h-4 w-4 mr-2" />
                  Cancel
                </Button>
              </div>
            </div>
          )}

          {/* Elements List */}
          <div className="space-y-2">
            <div className="font-semibold text-sm">Your Elements ({elements.length})</div>
            
            {elements.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <Type className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">No elements added yet</p>
                <p className="text-xs">Click + to add your first element</p>
              </div>
            ) : (
              elements.map(element => (
                <div key={element.id} className="border rounded-lg p-3 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-xs">
                        {element.type}
                      </Badge>
                      {element.visible ? (
                        <Eye className="h-3 w-3 text-green-600" />
                      ) : (
                        <EyeOff className="h-3 w-3 text-gray-400" />
                      )}
                    </div>
                    <div className="flex gap-1">
                      <Button
                        onClick={() => handleToggleVisibility(element.id)}
                        size="sm"
                        variant="ghost"
                        className="h-6 w-6 p-0"
                      >
                        {element.visible ? (
                          <Eye className="h-3 w-3" />
                        ) : (
                          <EyeOff className="h-3 w-3" />
                        )}
                      </Button>
                      <Button
                        onClick={() => handleEditElement(element)}
                        size="sm"
                        variant="ghost"
                        className="h-6 w-6 p-0"
                      >
                        <Edit className="h-3 w-3" />
                      </Button>
                      <Button
                        onClick={() => handleDeleteElement(element.id)}
                        size="sm"
                        variant="ghost"
                        className="h-6 w-6 p-0 text-red-600"
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                  
                  <div className="text-xs text-gray-600">
                    <div className="truncate">
                      <strong>Content:</strong> {element.content.substring(0, 50)}...
                    </div>
                    <div className="truncate">
                      <strong>Target:</strong> {element.targetElement || 'body'}
                    </div>
                    <div className="truncate">
                      <strong>Position:</strong> {element.position}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}