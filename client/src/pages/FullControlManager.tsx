import React, { useState, useEffect } from 'react';
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
import { Edit2, Plus, Save, Trash2, Eye, EyeOff, Settings, Globe, Image, Type, Phone, Mail, MapPin, Star, Car, Info, MessageCircle, Wrench } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { ContentSection, InsertContentSection } from '@shared/content-schema';
import { apiRequest } from '@/lib/queryClient';

interface EditableElement {
  id: string;
  type: 'text' | 'image' | 'badge' | 'button' | 'link' | 'phone' | 'email' | 'address' | 'price' | 'title' | 'subtitle' | 'description' | 'feature' | 'testimonial';
  page: string;
  section: string;
  label: string;
  value: string;
  placeholder?: string;
  required?: boolean;
  multiline?: boolean;
  options?: string[];
}

// Complete website elements that can be edited
const WEBSITE_ELEMENTS: EditableElement[] = [
  // HOME PAGE
  { id: 'hero_title', type: 'title', page: 'home', section: 'hero', label: 'Main Title', value: 'Find Your Perfect Vehicle at AUTO ANI', required: true },
  { id: 'hero_subtitle', type: 'subtitle', page: 'home', section: 'hero', label: 'Subtitle', value: 'Premium used cars imported from Finland and Germany with unbeatable quality and competitive prices.' },
  { id: 'hero_button1', type: 'button', page: 'home', section: 'hero', label: 'First Button Text', value: 'View Inventory' },
  { id: 'hero_button2', type: 'button', page: 'home', section: 'hero', label: 'Second Button Text', value: 'Custom Order' },
  { id: 'hero_stats_cars', type: 'text', page: 'home', section: 'hero', label: 'Cars Available Number', value: '100+' },
  { id: 'hero_stats_experience', type: 'text', page: 'home', section: 'hero', label: 'Years Experience', value: '10+' },
  { id: 'hero_stats_customers', type: 'text', page: 'home', section: 'hero', label: 'Happy Customers', value: '500+' },
  { id: 'hero_stats_cars_label', type: 'text', page: 'home', section: 'hero', label: 'Cars Available Label', value: 'Cars Available' },
  { id: 'hero_stats_experience_label', type: 'text', page: 'home', section: 'hero', label: 'Experience Label', value: 'Years Experience' },
  { id: 'hero_stats_customers_label', type: 'text', page: 'home', section: 'hero', label: 'Customers Label', value: 'Happy Customers' },
  
  // FEATURED SECTION
  { id: 'featured_title', type: 'title', page: 'home', section: 'featured', label: 'Featured Section Title', value: 'Featured Vehicles' },
  { id: 'featured_subtitle', type: 'subtitle', page: 'home', section: 'featured', label: 'Featured Section Subtitle', value: 'Handpicked premium vehicles ready for new owners' },
  
  // BRANDS SECTION
  { id: 'brands_title', type: 'title', page: 'home', section: 'brands', label: 'Brands Section Title', value: 'Premium Brands We Import' },
  { id: 'brands_subtitle', type: 'subtitle', page: 'home', section: 'brands', label: 'Brands Section Subtitle', value: 'Trusted automotive brands from Finland and Germany' },
  
  // SERVICES SECTION
  { id: 'services_title', type: 'title', page: 'home', section: 'services', label: 'Services Section Title', value: 'Our Services' },
  { id: 'services_subtitle', type: 'subtitle', page: 'home', section: 'services', label: 'Services Section Subtitle', value: 'Comprehensive automotive import solutions' },
  { id: 'service_import_title', type: 'title', page: 'home', section: 'services', label: 'Vehicle Import Service Title', value: 'Vehicle Import' },
  { id: 'service_import_desc', type: 'description', page: 'home', section: 'services', label: 'Vehicle Import Description', value: 'Professional import services from Finland and Germany with full documentation support.' },
  { id: 'service_inspection_title', type: 'title', page: 'home', section: 'services', label: 'Inspection Service Title', value: 'Quality Inspection' },
  { id: 'service_inspection_desc', type: 'description', page: 'home', section: 'services', label: 'Inspection Description', value: 'Thorough vehicle inspection to ensure quality and reliability before purchase.' },
  { id: 'service_custom_title', type: 'title', page: 'home', section: 'services', label: 'Custom Orders Title', value: 'Custom Orders' },
  { id: 'service_custom_desc', type: 'description', page: 'home', section: 'services', label: 'Custom Orders Description', value: 'Special vehicle orders tailored to your specific requirements and budget.' },
  
  // TESTIMONIALS
  { id: 'testimonials_title', type: 'title', page: 'home', section: 'testimonials', label: 'Testimonials Title', value: 'What Our Customers Say' },
  { id: 'testimonials_subtitle', type: 'subtitle', page: 'home', section: 'testimonials', label: 'Testimonials Subtitle', value: 'Real experiences from satisfied customers' },
  
  // ABOUT PAGE
  { id: 'about_hero_title', type: 'title', page: 'about', section: 'hero', label: 'About Hero Title', value: 'About AUTO ANI' },
  { id: 'about_hero_subtitle', type: 'subtitle', page: 'about', section: 'hero', label: 'About Hero Subtitle', value: 'Your trusted partner for premium used vehicles imported from Finland and Germany' },
  { id: 'about_description', type: 'description', page: 'about', section: 'content', label: 'About Description', value: 'AUTO ANI is your trusted partner for premium used vehicles imported from Finland and Germany. Located in Mitrovica, Kosovo, we specialize in providing high-quality vehicles with complete documentation and professional service.', multiline: true },
  { id: 'about_mission', type: 'description', page: 'about', section: 'content', label: 'Mission Statement', value: 'Our mission is to provide customers with reliable, high-quality vehicles at competitive prices, backed by exceptional service and complete transparency throughout the import process.', multiline: true },
  { id: 'about_experience', type: 'text', page: 'about', section: 'content', label: 'Years of Experience', value: '10+' },
  { id: 'about_vehicles', type: 'text', page: 'about', section: 'content', label: 'Vehicles Imported', value: '500+' },
  { id: 'about_customers', type: 'text', page: 'about', section: 'content', label: 'Happy Customers', value: '300+' },
  
  // INVENTORY PAGE
  { id: 'inventory_title', type: 'title', page: 'inventory', section: 'hero', label: 'Inventory Title', value: 'Our Vehicle Inventory' },
  { id: 'inventory_subtitle', type: 'subtitle', page: 'inventory', section: 'hero', label: 'Inventory Subtitle', value: 'Browse our selection of premium imported vehicles' },
  { id: 'inventory_filter_brand', type: 'text', page: 'inventory', section: 'filters', label: 'Brand Filter Label', value: 'Filter by Brand' },
  { id: 'inventory_filter_price', type: 'text', page: 'inventory', section: 'filters', label: 'Price Filter Label', value: 'Price Range' },
  { id: 'inventory_filter_year', type: 'text', page: 'inventory', section: 'filters', label: 'Year Filter Label', value: 'Year Range' },
  { id: 'inventory_no_results', type: 'text', page: 'inventory', section: 'content', label: 'No Results Message', value: 'No vehicles match your search criteria' },
  
  // SERVICES PAGE
  { id: 'services_hero_title', type: 'title', page: 'services', section: 'hero', label: 'Services Hero Title', value: 'Our Services' },
  { id: 'services_hero_subtitle', type: 'subtitle', page: 'services', section: 'hero', label: 'Services Hero Subtitle', value: 'Comprehensive automotive import and sales solutions' },
  { id: 'services_form_title', type: 'title', page: 'services', section: 'form', label: 'Custom Order Form Title', value: 'Custom Vehicle Order' },
  { id: 'services_form_subtitle', type: 'subtitle', page: 'services', section: 'form', label: 'Custom Order Form Subtitle', value: 'Tell us what you\'re looking for and we\'ll find it for you' },
  
  // CONTACT PAGE
  { id: 'contact_title', type: 'title', page: 'contact', section: 'hero', label: 'Contact Title', value: 'Contact Us' },
  { id: 'contact_subtitle', type: 'subtitle', page: 'contact', section: 'hero', label: 'Contact Subtitle', value: 'Get in touch with our team for any questions or inquiries' },
  { id: 'contact_form_title', type: 'title', page: 'contact', section: 'form', label: 'Contact Form Title', value: 'Send us a Message' },
  { id: 'contact_info_title', type: 'title', page: 'contact', section: 'info', label: 'Contact Info Title', value: 'Get in Touch' },
  
  // GLOBAL ELEMENTS
  { id: 'company_name', type: 'text', page: 'global', section: 'brand', label: 'Company Name', value: 'AUTO ANI' },
  { id: 'company_tagline', type: 'text', page: 'global', section: 'brand', label: 'Company Tagline', value: 'Premium Used Cars' },
  { id: 'company_phone', type: 'phone', page: 'global', section: 'contact', label: 'Phone Number', value: '049 204 242' },
  { id: 'company_email', type: 'email', page: 'global', section: 'contact', label: 'Email Address', value: 'aniautosallon@gmail.com' },
  { id: 'company_address', type: 'address', page: 'global', section: 'contact', label: 'Business Address', value: 'Gsmend Ballii, Mitrovica, Kosovo 40000' },
  { id: 'company_whatsapp', type: 'phone', page: 'global', section: 'contact', label: 'WhatsApp Number', value: '049 204 242' },
  { id: 'company_instagram', type: 'link', page: 'global', section: 'social', label: 'Instagram Handle', value: '@aniautosallon' },
  { id: 'company_facebook', type: 'link', page: 'global', section: 'social', label: 'Facebook Page', value: 'AUTO ANI' },
  
  // VEHICLE LABELS
  { id: 'vehicle_details_button', type: 'button', page: 'global', section: 'vehicles', label: 'View Details Button', value: 'View Details' },
  { id: 'vehicle_contact_button', type: 'button', page: 'global', section: 'vehicles', label: 'Contact Button', value: 'Contact' },
  { id: 'vehicle_negotiable_label', type: 'text', page: 'global', section: 'vehicles', label: 'Negotiable Label', value: 'Negotiable' },
  { id: 'vehicle_import_badge', type: 'badge', page: 'global', section: 'vehicles', label: 'Import Badge Text', value: 'Import from' },
  { id: 'vehicle_available_badge', type: 'badge', page: 'global', section: 'vehicles', label: 'Available Badge', value: 'Available' },
  { id: 'vehicle_sold_badge', type: 'badge', page: 'global', section: 'vehicles', label: 'Sold Badge', value: 'Sold' },
  
  // NAVIGATION
  { id: 'nav_home', type: 'text', page: 'global', section: 'navigation', label: 'Home Menu', value: 'Home' },
  { id: 'nav_inventory', type: 'text', page: 'global', section: 'navigation', label: 'Inventory Menu', value: 'Inventory' },
  { id: 'nav_services', type: 'text', page: 'global', section: 'navigation', label: 'Services Menu', value: 'Services' },
  { id: 'nav_about', type: 'text', page: 'global', section: 'navigation', label: 'About Menu', value: 'About' },
  { id: 'nav_contact', type: 'text', page: 'global', section: 'navigation', label: 'Contact Menu', value: 'Contact' },
  
  // FOOTER
  { id: 'footer_description', type: 'description', page: 'global', section: 'footer', label: 'Footer Description', value: 'AUTO ANI - Your trusted partner for premium used vehicles imported from Finland and Germany.', multiline: true },
  { id: 'footer_quick_links', type: 'text', page: 'global', section: 'footer', label: 'Quick Links Title', value: 'Quick Links' },
  { id: 'footer_services', type: 'text', page: 'global', section: 'footer', label: 'Services Title', value: 'Services' },
  { id: 'footer_contact_info', type: 'text', page: 'global', section: 'footer', label: 'Contact Info Title', value: 'Contact Info' },
  { id: 'footer_rights', type: 'text', page: 'global', section: 'footer', label: 'Rights Reserved Text', value: 'All rights reserved.' },
];

export default function FullControlManager() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [elements, setElements] = useState<EditableElement[]>(WEBSITE_ELEMENTS);
  const [editingElement, setEditingElement] = useState<EditableElement | null>(null);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [selectedPage, setSelectedPage] = useState<string>('home');
  const [selectedSection, setSelectedSection] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');

  const { data: contentSections = [] } = useQuery<ContentSection[]>({
    queryKey: ['/api/content'],
  });

  const updateElementMutation = useMutation({
    mutationFn: (element: EditableElement) => {
      // Convert to content section format
      const contentData: InsertContentSection = {
        sectionKey: element.id,
        title: element.label,
        content: element.value,
        contentType: element.type,
        page: element.page,
        category: element.section,
        isActive: true,
      };

      // Check if content exists
      const existingContent = contentSections.find(c => c.sectionKey === element.id);
      if (existingContent) {
        return apiRequest(`/api/content/${existingContent.id}`, 'PATCH', contentData);
      } else {
        return apiRequest('/api/content', 'POST', contentData);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/content'] });
      toast({ title: 'Element updated successfully!' });
      setEditingElement(null);
    },
    onError: (error) => {
      toast({ title: 'Error updating element', description: error.message, variant: 'destructive' });
    },
  });

  const addNewElementMutation = useMutation({
    mutationFn: (element: EditableElement) => {
      const contentData: InsertContentSection = {
        sectionKey: element.id,
        title: element.label,
        content: element.value,
        contentType: element.type,
        page: element.page,
        category: element.section,
        isActive: true,
      };
      return apiRequest('/api/content', 'POST', contentData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/content'] });
      toast({ title: 'New element added successfully!' });
      setIsAddingNew(false);
    },
    onError: (error) => {
      toast({ title: 'Error adding element', description: error.message, variant: 'destructive' });
    },
  });

  useEffect(() => {
    // Sync with existing content sections
    const updatedElements = elements.map(element => {
      const existingContent = contentSections.find(c => c.sectionKey === element.id);
      if (existingContent) {
        return { ...element, value: existingContent.content };
      }
      return element;
    });
    setElements(updatedElements);
  }, [contentSections]);

  const filteredElements = elements.filter(element => {
    const pageMatch = selectedPage === 'all' || element.page === selectedPage;
    const sectionMatch = selectedSection === 'all' || element.section === selectedSection;
    const searchMatch = searchTerm === '' || 
      element.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
      element.value.toLowerCase().includes(searchTerm.toLowerCase());
    return pageMatch && sectionMatch && searchMatch;
  });

  const pages = [...new Set(elements.map(e => e.page))];
  const sections = [...new Set(elements.filter(e => selectedPage === 'all' || e.page === selectedPage).map(e => e.section))];

  const handleEdit = (element: EditableElement) => {
    setEditingElement(element);
    setIsAddingNew(false);
  };

  const handleSave = (element: EditableElement) => {
    if (editingElement) {
      // Update existing element
      setElements(prev => prev.map(e => e.id === element.id ? element : e));
      updateElementMutation.mutate(element);
    } else {
      // Add new element
      const newElement = { ...element, id: `custom_${Date.now()}` };
      setElements(prev => [...prev, newElement]);
      addNewElementMutation.mutate(newElement);
    }
  };

  const handleDelete = (elementId: string) => {
    if (window.confirm('Are you sure you want to delete this element?')) {
      setElements(prev => prev.filter(e => e.id !== elementId));
      const existingContent = contentSections.find(c => c.sectionKey === elementId);
      if (existingContent) {
        apiRequest(`/api/content/${existingContent.id}`, 'DELETE');
      }
      toast({ title: 'Element deleted successfully!' });
    }
  };

  const getElementIcon = (type: string) => {
    switch (type) {
      case 'title': return <Type className="w-4 h-4" />;
      case 'image': return <Image className="w-4 h-4" />;
      case 'phone': return <Phone className="w-4 h-4" />;
      case 'email': return <Mail className="w-4 h-4" />;
      case 'address': return <MapPin className="w-4 h-4" />;
      case 'price': return <Star className="w-4 h-4" />;
      case 'button': return <Settings className="w-4 h-4" />;
      case 'badge': return <Badge className="w-4 h-4" />;
      default: return <Type className="w-4 h-4" />;
    }
  };

  const EditElementForm = ({ element, onSave, onCancel }: { 
    element: EditableElement | null; 
    onSave: (element: EditableElement) => void; 
    onCancel: () => void; 
  }) => {
    const [formData, setFormData] = useState<EditableElement>(
      element || {
        id: '',
        type: 'text',
        page: 'home',
        section: 'content',
        label: '',
        value: '',
        required: false,
        multiline: false,
      }
    );

    return (
      <Card className="mb-6 border-2 border-blue-500">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {getElementIcon(formData.type)}
            {element ? 'Edit Element' : 'Add New Element'}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="label">Element Label</Label>
              <Input
                id="label"
                value={formData.label}
                onChange={(e) => setFormData(prev => ({ ...prev, label: e.target.value }))}
                placeholder="What is this element?"
                required
              />
            </div>
            <div>
              <Label htmlFor="type">Element Type</Label>
              <Select value={formData.type} onValueChange={(value) => setFormData(prev => ({ ...prev, type: value as any }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="text">Text</SelectItem>
                  <SelectItem value="title">Title</SelectItem>
                  <SelectItem value="subtitle">Subtitle</SelectItem>
                  <SelectItem value="description">Description</SelectItem>
                  <SelectItem value="button">Button</SelectItem>
                  <SelectItem value="badge">Badge</SelectItem>
                  <SelectItem value="image">Image URL</SelectItem>
                  <SelectItem value="link">Link</SelectItem>
                  <SelectItem value="phone">Phone Number</SelectItem>
                  <SelectItem value="email">Email</SelectItem>
                  <SelectItem value="address">Address</SelectItem>
                  <SelectItem value="price">Price</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label htmlFor="value">Content Value</Label>
            {formData.multiline ? (
              <Textarea
                id="value"
                value={formData.value}
                onChange={(e) => setFormData(prev => ({ ...prev, value: e.target.value }))}
                placeholder="Enter the content..."
                rows={3}
              />
            ) : (
              <Input
                id="value"
                value={formData.value}
                onChange={(e) => setFormData(prev => ({ ...prev, value: e.target.value }))}
                placeholder="Enter the content..."
              />
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="page">Page</Label>
              <Select value={formData.page} onValueChange={(value) => setFormData(prev => ({ ...prev, page: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select page" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="home">Home Page</SelectItem>
                  <SelectItem value="about">About Page</SelectItem>
                  <SelectItem value="inventory">Inventory Page</SelectItem>
                  <SelectItem value="services">Services Page</SelectItem>
                  <SelectItem value="contact">Contact Page</SelectItem>
                  <SelectItem value="global">Global (All Pages)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="section">Section</Label>
              <Input
                id="section"
                value={formData.section}
                onChange={(e) => setFormData(prev => ({ ...prev, section: e.target.value }))}
                placeholder="e.g., hero, content, footer"
              />
            </div>

            <div className="flex items-center space-x-2 pt-6">
              <Switch
                id="multiline"
                checked={formData.multiline}
                onCheckedChange={(checked) => setFormData(prev => ({ ...prev, multiline: checked }))}
              />
              <Label htmlFor="multiline">Multi-line text</Label>
            </div>
          </div>

          <div className="flex space-x-2">
            <Button onClick={() => onSave(formData)} className="flex-1">
              <Save className="w-4 h-4 mr-2" />
              {element ? 'Update' : 'Add'} Element
            </Button>
            <Button variant="outline" onClick={onCancel} className="flex-1">
              Cancel
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
              <Globe className="w-8 h-8" />
              Full Website Control
            </h1>
            <p className="text-gray-600 mt-2">Edit, add, or delete ANY element on your website. Complete control!</p>
          </div>
          <Button onClick={() => setIsAddingNew(true)} className="bg-green-600 hover:bg-green-700">
            <Plus className="w-4 h-4 mr-2" />
            Add New Element
          </Button>
        </div>

        {(isAddingNew || editingElement) && (
          <EditElementForm
            element={editingElement}
            onSave={handleSave}
            onCancel={() => {
              setIsAddingNew(false);
              setEditingElement(null);
            }}
          />
        )}

        <div className="flex flex-wrap gap-4 mb-6">
          <div className="flex-1 min-w-64">
            <Input
              placeholder="Search elements..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full"
            />
          </div>
          <Select value={selectedPage} onValueChange={setSelectedPage}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="All Pages" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Pages</SelectItem>
              {pages.map(page => (
                <SelectItem key={page} value={page}>
                  {page.charAt(0).toUpperCase() + page.slice(1)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={selectedSection} onValueChange={setSelectedSection}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="All Sections" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Sections</SelectItem>
              {sections.map(section => (
                <SelectItem key={section} value={section}>
                  {section.charAt(0).toUpperCase() + section.slice(1)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredElements.map((element) => (
            <Card key={element.id} className="hover:shadow-lg transition-shadow group">
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-2">
                    {getElementIcon(element.type)}
                    <div>
                      <CardTitle className="text-lg">{element.label}</CardTitle>
                      <p className="text-sm text-gray-600">{element.page} • {element.section}</p>
                    </div>
                  </div>
                  <Badge variant="outline" className="text-xs">
                    {element.type}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <p className="text-sm font-mono text-gray-700 line-clamp-2">
                      {element.value}
                    </p>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(element)}
                      className="flex-1 mr-2"
                    >
                      <Edit2 className="w-4 h-4 mr-1" />
                      Edit
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(element.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredElements.length === 0 && (
          <div className="text-center py-12">
            <Globe className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">No elements found matching your criteria.</p>
            <Button onClick={() => setIsAddingNew(true)} className="mt-4">
              Add Your First Element
            </Button>
          </div>
        )}

        <div className="mt-12 p-6 bg-blue-50 rounded-lg">
          <h3 className="text-lg font-semibold text-blue-900 mb-2">🎯 Full Website Control</h3>
          <p className="text-blue-800 mb-4">You now have complete control over every text, image, button, and element on your website:</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-blue-700">
            <div>
              <strong>• All Page Content:</strong> Home, About, Inventory, Services, Contact
            </div>
            <div>
              <strong>• Global Elements:</strong> Navigation, Footer, Company Info
            </div>
            <div>
              <strong>• Vehicle Elements:</strong> Buttons, Labels, Import Badges
            </div>
            <div>
              <strong>• Contact Information:</strong> Phone, Email, Address
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}