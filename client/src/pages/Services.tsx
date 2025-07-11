import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CustomOrderForm } from "../components/CustomOrderForm";
import { useTranslation } from "../lib/i18n";
import { EditableTitle, EditableDescription, EditableText, EditableButton } from "../components/EditableText";
import { 
  Import, 
  ClipboardList, 
  Wrench, 
  ShieldCheck, 
  FileText, 
  Truck, 
  CheckCircle,
  Search,
  DollarSign,
  HeartHandshake,
  Clipboard,
  TrendingUp,
  Award
} from "lucide-react";

export default function Services() {
  const { t } = useTranslation();

  const importProcess = [
    {
      step: 1,
      title: "Vehicle Selection",
      description: "Choose from our inventory or request a custom search",
      icon: Search,
    },
    {
      step: 2,
      title: "Documentation",
      description: "We handle all paperwork and customs documentation",
      icon: FileText,
    },
    {
      step: 3,
      title: "Transport",
      description: "Professional transport from Finland or Germany",
      icon: Truck,
    },
    {
      step: 4,
      title: "Delivery",
      description: "Vehicle delivered and registered in Kosovo",
      icon: CheckCircle,
    },
  ];

  const serviceFeatures = [
    {
      icon: ShieldCheck,
      title: "Quality Assurance",
      description: "Every vehicle undergoes comprehensive inspection before import",
    },
    {
      icon: FileText,
      title: "Full Documentation",
      description: "Complete handling of all import and registration paperwork",
    },
    {
      icon: DollarSign,
      title: "Transparent Pricing",
      description: "No hidden fees - clear pricing breakdown for all services",
    },
    {
      icon: HeartHandshake,
      title: "Personal Service",
      description: "Dedicated support throughout the entire import process",
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="hero-section py-20">
        <div className="container mx-auto px-4">
          <div className="text-center text-white">
            <EditableTitle 
              sectionKey="services_hero_title"
              defaultValue="Our Services"
              className="text-5xl font-bold mb-6"
              page="services"
              section="hero"
              as="h1"
            />
            <EditableDescription 
              sectionKey="services_hero_subtitle"
              defaultValue="Professional automotive import services from Finland and Germany to Kosovo"
              className="text-xl mb-8 text-blue-100 max-w-3xl mx-auto"
              page="services"
              section="hero"
            />
          </div>
        </div>
      </section>

      {/* Main Services */}
      <section className="py-20 bg-light-gray">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="service-card">
              <CardHeader>
                <div className="bg-primary-light bg-opacity-10 w-16 h-16 rounded-full flex items-center justify-center mb-4">
                  <Import className="text-primary-light text-2xl" />
                </div>
                <CardTitle className="text-xl font-bold text-dark-gray">
                  <EditableText 
                    sectionKey="services_import_title"
                    defaultValue="Vehicle Import Service"
                    className="text-xl font-bold text-dark-gray"
                    page="services"
                    section="import"
                    as="span"
                  />
                </CardTitle>
              </CardHeader>
              <CardContent>
                <EditableDescription 
                  sectionKey="services_import_description"
                  defaultValue="Professional vehicle import services from Finland and Germany to Kosovo"
                  className="text-secondary mb-6"
                  page="services"
                  section="import"
                  as="p"
                />
                <ul className="space-y-2 text-sm text-secondary mb-6">
                  {typeof t("services.import.features") === 'string' && 
                    t("services.import.features").split(',').map((feature: string, index: number) => (
                      <li key={index} className="flex items-center">
                        <ShieldCheck className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                        {feature.trim()}
                      </li>
                    ))
                  }
                </ul>
                <Button className="w-full btn-primary">
                  {t("services.import.button")}
                </Button>
              </CardContent>
            </Card>
            
            <Card className="service-card">
              <CardHeader>
                <div className="bg-accent bg-opacity-10 w-16 h-16 rounded-full flex items-center justify-center mb-4">
                  <ClipboardList className="text-accent text-2xl" />
                </div>
                <CardTitle className="text-xl font-bold text-dark-gray">
                  <EditableText 
                    sectionKey="services_custom_order_title"
                    defaultValue="Custom Vehicle Orders"
                    className="text-xl font-bold text-dark-gray"
                    page="services"
                    section="custom"
                    as="span"
                  />
                </CardTitle>
              </CardHeader>
              <CardContent>
                <EditableDescription 
                  sectionKey="services_custom_order_description"
                  defaultValue="Can't find what you're looking for? Let us source the perfect vehicle for you"
                  className="text-secondary mb-6"
                  page="services"
                  section="custom"
                  as="p"
                />
                <ul className="space-y-2 text-sm text-secondary mb-6">
                  {typeof t("services.customOrder.features") === 'string' && 
                    t("services.customOrder.features").split(',').map((feature: string, index: number) => (
                      <li key={index} className="flex items-center">
                        <ShieldCheck className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                        {feature.trim()}
                      </li>
                    ))
                  }
                </ul>
                <Button className="w-full btn-accent">
                  {t("services.customOrder.button")}
                </Button>
              </CardContent>
            </Card>
            
            <Card className="service-card">
              <CardHeader>
                <div className="bg-gold bg-opacity-10 w-16 h-16 rounded-full flex items-center justify-center mb-4">
                  <Wrench className="text-gold text-2xl" />
                </div>
                <CardTitle className="text-xl font-bold text-dark-gray">
                  <EditableText 
                    sectionKey="services_inspection_title"
                    defaultValue="Vehicle Inspection"
                    className="text-xl font-bold text-dark-gray"
                    page="services"
                    section="inspection"
                    as="span"
                  />
                </CardTitle>
              </CardHeader>
              <CardContent>
                <EditableDescription 
                  sectionKey="services_inspection_description"
                  defaultValue="Comprehensive vehicle inspection and quality assurance before purchase"
                  className="text-secondary mb-6"
                  page="services"
                  section="inspection"
                  as="p"
                />
                <ul className="space-y-2 text-sm text-secondary mb-6">
                  {typeof t("services.inspection.features") === 'string' && 
                    t("services.inspection.features").split(',').map((feature: string, index: number) => (
                      <li key={index} className="flex items-center">
                        <ShieldCheck className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                        {feature.trim()}
                      </li>
                    ))
                  }
                </ul>
                <Button className="w-full bg-gold text-white hover:bg-yellow-600">
                  {t("services.inspection.button")}
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Import Process */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <EditableTitle 
              sectionKey="services_process_title"
              defaultValue="Import Process"
              className="text-4xl font-bold text-dark-gray mb-4"
              page="services"
              section="process"
              as="h3"
            />
            <EditableDescription 
              sectionKey="services_process_subtitle"
              defaultValue="Simple steps to get your dream car from Europe"
              className="text-lg text-secondary"
              page="services"
              section="process"
            />
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {importProcess.map((step) => (
              <div key={step.step} className="text-center">
                <div className="relative mb-6">
                  <div className="bg-primary-light w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <step.icon className="h-8 w-8 text-white" />
                  </div>
                  <div className="absolute -top-2 -right-2 bg-accent text-white w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold">
                    {step.step}
                  </div>
                </div>
                <h4 className="text-xl font-bold text-dark-gray mb-2">{step.title}</h4>
                <p className="text-secondary">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Service Features */}
      <section className="py-20 bg-light-gray">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <EditableTitle 
              sectionKey="services_why_choose_title"
              defaultValue="Why Choose AUTO ANI"
              className="text-4xl font-bold text-dark-gray mb-4"
              page="services"
              section="why"
              as="h3"
            />
            <EditableDescription 
              sectionKey="services_why_choose_subtitle"
              defaultValue="Trusted expertise in European vehicle imports"
              className="text-lg text-secondary"
              page="services"
              section="why"
            />
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {serviceFeatures.map((feature, index) => (
              <Card key={index} className="text-center p-6">
                <div className="bg-primary-light bg-opacity-10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <feature.icon className="h-8 w-8 text-primary-light" />
                </div>
                <h4 className="text-lg font-bold text-dark-gray mb-2">{feature.title}</h4>
                <p className="text-secondary text-sm">{feature.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Custom Order Form */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <EditableTitle 
                sectionKey="services_custom_form_title"
                defaultValue="Request Custom Order"
                className="text-4xl font-bold text-dark-gray mb-4"
                page="services"
                section="form"
                as="h3"
              />
              <EditableDescription 
                sectionKey="services_custom_form_subtitle"
                defaultValue="Can't find what you're looking for? Let us help you find the perfect vehicle."
                className="text-lg text-secondary"
                page="services"
                section="form"
              />
            </div>
            <CustomOrderForm />
          </div>
        </div>
      </section>
    </div>
  );
}
