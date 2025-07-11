import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Edit2, Plus, Save, Trash2, Eye, EyeOff } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { ContentSection, InsertContentSection } from '@shared/content-schema';
import { apiRequest } from '@/lib/queryClient';

interface ContentEditForm {
  sectionKey: string;
  title: string;
  content: string;
  contentType: string;
  page: string;
  category: string;
  isActive: boolean;
}

const CONTENT_TYPES = [
  { value: 'text', label: 'Text' },
  { value: 'html', label: 'HTML' },
  { value: 'image', label: 'Image URL' },
  { value: 'link', label: 'Link' },
  { value: 'number', label: 'Number' },
  { value: 'phone', label: 'Phone Number' },
  { value: 'email', label: 'Email Address' },
];

const PAGES = [
  { value: 'home', label: 'Home Page' },
  { value: 'about', label: 'About Page' },
  { value: 'inventory', label: 'Inventory Page' },
  { value: 'services', label: 'Services Page' },
  { value: 'contact', label: 'Contact Page' },
  { value: 'global', label: 'Global (All Pages)' },
];

const CATEGORIES = [
  { value: 'hero', label: 'Hero Section' },
  { value: 'intro', label: 'Introduction' },
  { value: 'services', label: 'Services' },
  { value: 'features', label: 'Features' },
  { value: 'testimonials', label: 'Testimonials' },
  { value: 'contact', label: 'Contact Info' },
  { value: 'footer', label: 'Footer' },
  { value: 'navigation', label: 'Navigation' },
  { value: 'misc', label: 'Miscellaneous' },
];

export default function AdvancedContentManager() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [editingContent, setEditingContent] = useState<ContentSection | null>(null);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [selectedPage, setSelectedPage] = useState<string>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const { data: contentSections = [], isLoading } = useQuery<ContentSection[]>({
    queryKey: ['/api/content'],
  });

  const createContentMutation = useMutation({
    mutationFn: (data: InsertContentSection) => apiRequest('/api/content', 'POST', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/content'] });
      toast({ title: 'Content created successfully!' });
      setIsAddingNew(false);
    },
    onError: (error) => {
      toast({ title: 'Error creating content', description: error.message, variant: 'destructive' });
    },
  });

  const updateContentMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<InsertContentSection> }) => 
      apiRequest(`/api/content/${id}`, 'PATCH', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/content'] });
      toast({ title: 'Content updated successfully!' });
      setEditingContent(null);
    },
    onError: (error) => {
      toast({ title: 'Error updating content', description: error.message, variant: 'destructive' });
    },
  });

  const deleteContentMutation = useMutation({
    mutationFn: (id: number) => apiRequest(`/api/content/${id}`, 'DELETE'),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/content'] });
      toast({ title: 'Content deleted successfully!' });
    },
    onError: (error) => {
      toast({ title: 'Error deleting content', description: error.message, variant: 'destructive' });
    },
  });

  const filteredContent = contentSections.filter(content => {
    const pageMatch = selectedPage === 'all' || content.page === selectedPage;
    const categoryMatch = selectedCategory === 'all' || content.category === selectedCategory;
    return pageMatch && categoryMatch;
  });

  const handleSubmit = (formData: ContentEditForm) => {
    if (editingContent) {
      updateContentMutation.mutate({
        id: editingContent.id,
        data: formData,
      });
    } else {
      createContentMutation.mutate(formData);
    }
  };

  const handleEdit = (content: ContentSection) => {
    setEditingContent(content);
    setIsAddingNew(false);
  };

  const handleDelete = (id: number) => {
    if (window.confirm('Are you sure you want to delete this content?')) {
      deleteContentMutation.mutate(id);
    }
  };

  const handleAddNew = () => {
    setIsAddingNew(true);
    setEditingContent(null);
  };

  const ContentForm = ({ 
    initialData, 
    onSubmit, 
    onCancel 
  }: { 
    initialData?: ContentSection; 
    onSubmit: (data: ContentEditForm) => void; 
    onCancel: () => void;
  }) => {
    const [formData, setFormData] = useState<ContentEditForm>({
      sectionKey: initialData?.sectionKey || '',
      title: initialData?.title || '',
      content: initialData?.content || '',
      contentType: initialData?.contentType || 'text',
      page: initialData?.page || 'home',
      category: initialData?.category || 'hero',
      isActive: initialData?.isActive ?? true,
    });

    return (
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>
            {initialData ? 'Edit Content' : 'Add New Content'}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="sectionKey">Section Key</Label>
              <Input
                id="sectionKey"
                value={formData.sectionKey}
                onChange={(e) => setFormData(prev => ({ ...prev, sectionKey: e.target.value }))}
                placeholder="e.g., hero_title, contact_phone"
              />
            </div>
            <div>
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                placeholder="Display title for this content"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="content">Content</Label>
            <Textarea
              id="content"
              value={formData.content}
              onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
              placeholder="Enter your content here..."
              rows={4}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="contentType">Content Type</Label>
              <Select value={formData.contentType} onValueChange={(value) => setFormData(prev => ({ ...prev, contentType: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  {CONTENT_TYPES.map(type => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="page">Page</Label>
              <Select value={formData.page} onValueChange={(value) => setFormData(prev => ({ ...prev, page: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select page" />
                </SelectTrigger>
                <SelectContent>
                  {PAGES.map(page => (
                    <SelectItem key={page.value} value={page.value}>
                      {page.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="category">Category</Label>
              <Select value={formData.category} onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {CATEGORIES.map(category => (
                    <SelectItem key={category.value} value={category.value}>
                      {category.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="isActive"
              checked={formData.isActive}
              onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isActive: checked }))}
            />
            <Label htmlFor="isActive">Active (visible on website)</Label>
          </div>

          <div className="flex space-x-2">
            <Button onClick={() => onSubmit(formData)} className="flex-1">
              <Save className="w-4 h-4 mr-2" />
              {initialData ? 'Update' : 'Create'}
            </Button>
            <Button variant="outline" onClick={onCancel} className="flex-1">
              Cancel
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Advanced Content Manager</h1>
            <p className="text-gray-600 mt-2">Manage all website content, text, images, and settings</p>
          </div>
          <Button onClick={handleAddNew} className="bg-blue-600 hover:bg-blue-700">
            <Plus className="w-4 h-4 mr-2" />
            Add New Content
          </Button>
        </div>

        {(isAddingNew || editingContent) && (
          <ContentForm
            initialData={editingContent || undefined}
            onSubmit={handleSubmit}
            onCancel={() => {
              setIsAddingNew(false);
              setEditingContent(null);
            }}
          />
        )}

        <Tabs defaultValue="all" className="w-full">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="all">All Content</TabsTrigger>
            <TabsTrigger value="home">Home</TabsTrigger>
            <TabsTrigger value="about">About</TabsTrigger>
            <TabsTrigger value="inventory">Inventory</TabsTrigger>
            <TabsTrigger value="services">Services</TabsTrigger>
            <TabsTrigger value="contact">Contact</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-4">
            <div className="flex space-x-4 mb-6">
              <Select value={selectedPage} onValueChange={setSelectedPage}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Filter by page" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Pages</SelectItem>
                  {PAGES.map(page => (
                    <SelectItem key={page.value} value={page.value}>
                      {page.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Filter by category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {CATEGORIES.map(category => (
                    <SelectItem key={category.value} value={category.value}>
                      {category.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredContent.map((content) => (
                <Card key={content.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg">{content.title}</CardTitle>
                        <p className="text-sm text-gray-600 mt-1">{content.sectionKey}</p>
                      </div>
                      <div className="flex space-x-1">
                        {content.isActive ? (
                          <Badge variant="default" className="bg-green-100 text-green-800">
                            <Eye className="w-3 h-3 mr-1" />
                            Active
                          </Badge>
                        ) : (
                          <Badge variant="secondary" className="bg-gray-100 text-gray-800">
                            <EyeOff className="w-3 h-3 mr-1" />
                            Inactive
                          </Badge>
                        )}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex space-x-2">
                        <Badge variant="outline">{content.page}</Badge>
                        <Badge variant="outline">{content.category}</Badge>
                        <Badge variant="outline">{content.contentType}</Badge>
                      </div>
                      
                      <div className="text-sm text-gray-700 line-clamp-3">
                        {content.content}
                      </div>
                      
                      <div className="flex justify-between items-center pt-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(content)}
                        >
                          <Edit2 className="w-4 h-4 mr-1" />
                          Edit
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDelete(content.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="w-4 h-4 mr-1" />
                          Delete
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {filteredContent.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-500">No content found matching your filters.</p>
                <Button onClick={handleAddNew} className="mt-4">
                  Add Your First Content
                </Button>
              </div>
            )}
          </TabsContent>

          {PAGES.slice(0, 5).map(page => (
            <TabsContent key={page.value} value={page.value} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {contentSections
                  .filter(content => content.page === page.value)
                  .map((content) => (
                    <Card key={content.id} className="hover:shadow-lg transition-shadow">
                      <CardHeader className="pb-3">
                        <div className="flex justify-between items-start">
                          <div>
                            <CardTitle className="text-lg">{content.title}</CardTitle>
                            <p className="text-sm text-gray-600 mt-1">{content.sectionKey}</p>
                          </div>
                          <div className="flex space-x-1">
                            {content.isActive ? (
                              <Badge variant="default" className="bg-green-100 text-green-800">
                                <Eye className="w-3 h-3 mr-1" />
                                Active
                              </Badge>
                            ) : (
                              <Badge variant="secondary" className="bg-gray-100 text-gray-800">
                                <EyeOff className="w-3 h-3 mr-1" />
                                Inactive
                              </Badge>
                            )}
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          <div className="flex space-x-2">
                            <Badge variant="outline">{content.category}</Badge>
                            <Badge variant="outline">{content.contentType}</Badge>
                          </div>
                          
                          <div className="text-sm text-gray-700 line-clamp-3">
                            {content.content}
                          </div>
                          
                          <div className="flex justify-between items-center pt-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleEdit(content)}
                            >
                              <Edit2 className="w-4 h-4 mr-1" />
                              Edit
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDelete(content.id)}
                              className="text-red-600 hover:text-red-700"
                            >
                              <Trash2 className="w-4 h-4 mr-1" />
                              Delete
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </div>
  );
}