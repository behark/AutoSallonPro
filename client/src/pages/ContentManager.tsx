import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Edit, Plus, Trash2, Save, X } from "lucide-react";
import type { ContentSection, InsertContentSection } from "@shared/content-schema";

interface ContentManagerProps {}

function ContentManager({}: ContentManagerProps) {
  const [selectedPage, setSelectedPage] = useState<string>("all");
  const [editingSection, setEditingSection] = useState<ContentSection | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newSection, setNewSection] = useState<InsertContentSection>({
    sectionKey: "",
    title: "",
    content: "",
    contentType: "text",
    page: "home",
    category: "general",
    isActive: true
  });

  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch all content sections
  const { data: contentSections, isLoading } = useQuery({
    queryKey: ["/api/content"],
    queryFn: () => apiRequest("/api/content"),
  });

  // Filter sections by page
  const filteredSections = contentSections?.filter((section: ContentSection) => 
    selectedPage === "all" || section.page === selectedPage
  ) || [];

  // Create mutation
  const createMutation = useMutation({
    mutationFn: (data: InsertContentSection) => 
      apiRequest("/api/content", {
        method: "POST",
        body: JSON.stringify(data),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/content"] });
      setIsDialogOpen(false);
      setNewSection({
        sectionKey: "",
        title: "",
        content: "",
        contentType: "text",
        page: "home",
        category: "general",
        isActive: true
      });
      toast({
        title: "Success",
        description: "Content section created successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to create content section",
        variant: "destructive",
      });
    },
  });

  // Update mutation
  const updateMutation = useMutation({
    mutationFn: (data: { id: number; updates: Partial<InsertContentSection> }) =>
      apiRequest(`/api/content/${data.id}`, {
        method: "PUT",
        body: JSON.stringify(data.updates),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/content"] });
      setEditingSection(null);
      toast({
        title: "Success",
        description: "Content section updated successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update content section",
        variant: "destructive",
      });
    },
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: (id: number) =>
      apiRequest(`/api/content/${id}`, {
        method: "DELETE",
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/content"] });
      toast({
        title: "Success",
        description: "Content section deleted successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to delete content section",
        variant: "destructive",
      });
    },
  });

  const handleCreate = () => {
    createMutation.mutate(newSection);
  };

  const handleUpdate = (section: ContentSection, updates: Partial<InsertContentSection>) => {
    updateMutation.mutate({ id: section.id, updates });
  };

  const handleDelete = (id: number) => {
    if (confirm("Are you sure you want to delete this content section?")) {
      deleteMutation.mutate(id);
    }
  };

  const pages = [
    { value: "all", label: "All Pages" },
    { value: "home", label: "Home" },
    { value: "about", label: "About" },
    { value: "inventory", label: "Inventory" },
    { value: "services", label: "Services" },
    { value: "contact", label: "Contact" },
  ];

  const contentTypes = [
    { value: "text", label: "Text" },
    { value: "html", label: "HTML" },
    { value: "image_url", label: "Image URL" },
    { value: "list", label: "List" },
  ];

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-lg">Loading content sections...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Content Management System</h1>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add New Content
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Add New Content Section</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="sectionKey">Section Key</Label>
                  <Input
                    id="sectionKey"
                    value={newSection.sectionKey}
                    onChange={(e) => setNewSection({ ...newSection, sectionKey: e.target.value })}
                    placeholder="e.g., hero_title"
                  />
                </div>
                <div>
                  <Label htmlFor="title">Display Title</Label>
                  <Input
                    id="title"
                    value={newSection.title}
                    onChange={(e) => setNewSection({ ...newSection, title: e.target.value })}
                    placeholder="e.g., Hero Section Title"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="page">Page</Label>
                  <Select
                    value={newSection.page}
                    onValueChange={(value) => setNewSection({ ...newSection, page: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {pages.slice(1).map((page) => (
                        <SelectItem key={page.value} value={page.value}>
                          {page.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="category">Category</Label>
                  <Input
                    id="category"
                    value={newSection.category}
                    onChange={(e) => setNewSection({ ...newSection, category: e.target.value })}
                    placeholder="e.g., hero, features"
                  />
                </div>
                <div>
                  <Label htmlFor="contentType">Content Type</Label>
                  <Select
                    value={newSection.contentType}
                    onValueChange={(value) => setNewSection({ ...newSection, contentType: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {contentTypes.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="content">Content</Label>
                <Textarea
                  id="content"
                  value={newSection.content}
                  onChange={(e) => setNewSection({ ...newSection, content: e.target.value })}
                  placeholder="Enter your content here..."
                  rows={4}
                />
              </div>

              <div className="flex justify-end space-x-2">
                <Button
                  variant="outline"
                  onClick={() => setIsDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleCreate}
                  disabled={createMutation.isPending}
                >
                  {createMutation.isPending ? "Creating..." : "Create"}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="mb-6">
        <Label htmlFor="pageFilter">Filter by Page</Label>
        <Select value={selectedPage} onValueChange={setSelectedPage}>
          <SelectTrigger className="w-48">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {pages.map((page) => (
              <SelectItem key={page.value} value={page.value}>
                {page.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-4">
        {filteredSections.map((section: ContentSection) => (
          <Card key={section.id} className="w-full">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg">{section.title}</CardTitle>
                  <div className="flex space-x-2 mt-2">
                    <Badge variant="outline">{section.page}</Badge>
                    <Badge variant="outline">{section.category}</Badge>
                    <Badge variant="outline">{section.contentType}</Badge>
                    <Badge variant={section.isActive ? "default" : "secondary"}>
                      {section.isActive ? "Active" : "Inactive"}
                    </Badge>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setEditingSection(section)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDelete(section.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="text-sm text-gray-600">
                  <strong>Section Key:</strong> {section.sectionKey}
                </div>
                <div className="text-sm">
                  <strong>Content:</strong>
                  <div className="mt-1 p-3 bg-gray-50 rounded border">
                    {section.contentType === "image_url" ? (
                      <img 
                        src={section.content} 
                        alt={section.title}
                        className="max-w-xs h-auto rounded"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                        }}
                      />
                    ) : (
                      <div className="whitespace-pre-wrap">{section.content}</div>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Edit Dialog */}
      {editingSection && (
        <Dialog open={!!editingSection} onOpenChange={() => setEditingSection(null)}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Edit Content Section</DialogTitle>
            </DialogHeader>
            <EditContentForm
              section={editingSection}
              onSave={handleUpdate}
              onCancel={() => setEditingSection(null)}
              isLoading={updateMutation.isPending}
            />
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}

interface EditContentFormProps {
  section: ContentSection;
  onSave: (section: ContentSection, updates: Partial<InsertContentSection>) => void;
  onCancel: () => void;
  isLoading: boolean;
}

function EditContentForm({ section, onSave, onCancel, isLoading }: EditContentFormProps) {
  const [formData, setFormData] = useState({
    title: section.title,
    content: section.content,
    contentType: section.contentType,
    page: section.page,
    category: section.category,
    isActive: section.isActive,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(section, formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="editTitle">Display Title</Label>
        <Input
          id="editTitle"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="editPage">Page</Label>
          <Select
            value={formData.page}
            onValueChange={(value) => setFormData({ ...formData, page: value })}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="home">Home</SelectItem>
              <SelectItem value="about">About</SelectItem>
              <SelectItem value="inventory">Inventory</SelectItem>
              <SelectItem value="services">Services</SelectItem>
              <SelectItem value="contact">Contact</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="editCategory">Category</Label>
          <Input
            id="editCategory"
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
          />
        </div>
      </div>

      <div>
        <Label htmlFor="editContent">Content</Label>
        <Textarea
          id="editContent"
          value={formData.content}
          onChange={(e) => setFormData({ ...formData, content: e.target.value })}
          rows={6}
        />
      </div>

      <div className="flex items-center space-x-2">
        <input
          type="checkbox"
          id="editActive"
          checked={formData.isActive}
          onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
        />
        <Label htmlFor="editActive">Active</Label>
      </div>

      <div className="flex justify-end space-x-2">
        <Button variant="outline" onClick={onCancel} type="button">
          Cancel
        </Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Saving..." : "Save Changes"}
        </Button>
      </div>
    </form>
  );
}

export default ContentManager;