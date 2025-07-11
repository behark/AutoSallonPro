import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ContactForm } from "../components/ContactForm";
import { useTranslation } from "../lib/i18n";
import { 
  MapPin, 
  Phone, 
  Mail, 
  Clock, 
  MessageSquare,
  Navigation,
  Calendar,
  Globe
} from "lucide-react";

export default function Contact() {
  const { t } = useTranslation();

  const contactMethods = [
    {
      icon: Phone,
      title: t("contact.info.phone"),
      info: "+383 XX XXX XXX",
      description: "Call us during business hours",
    },
    {
      icon: Mail,
      title: t("contact.info.email"),
      info: "info@autoani.com",
      description: "Email us anytime",
    },
    {
      icon: MessageSquare,
      title: "WhatsApp",
      info: "+383 XX XXX XXX",
      description: "Quick messaging support",
    },
    {
      icon: Globe,
      title: "Instagram",
      info: "@aniautosallon",
      description: "Follow our latest updates",
    },
  ];

  const businessHours = [
    { day: "Monday - Friday", hours: "9:00 AM - 6:00 PM" },
    { day: "Saturday", hours: "9:00 AM - 4:00 PM" },
    { day: "Sunday", hours: "Closed" },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="hero-section py-20">
        <div className="container mx-auto px-4">
          <div className="text-center text-white">
            <h1 className="text-5xl font-bold mb-6">{t("contact.title")}</h1>
            <p className="text-xl mb-8 text-blue-100 max-w-3xl mx-auto">
              {t("contact.subtitle")}
            </p>
          </div>
        </div>
      </section>

      {/* Contact Information */}
      <section className="py-20 bg-light-gray">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-4 gap-8 mb-16">
            {contactMethods.map((method, index) => (
              <Card key={index} className="text-center p-6 hover:shadow-lg transition-shadow">
                <div className="bg-primary-light bg-opacity-10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <method.icon className="h-8 w-8 text-primary-light" />
                </div>
                <h4 className="text-lg font-bold text-dark-gray mb-2">{method.title}</h4>
                <p className="text-primary-light font-semibold mb-2">{method.info}</p>
                <p className="text-secondary text-sm">{method.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Main Contact Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Contact Information */}
            <div>
              <h2 className="text-3xl font-bold text-dark-gray mb-8">{t("contact.info.title")}</h2>
              
              <div className="space-y-6 mb-8">
                <div className="flex items-start">
                  <div className="bg-primary-light bg-opacity-10 w-12 h-12 rounded-lg flex items-center justify-center mr-4 flex-shrink-0">
                    <MapPin className="h-6 w-6 text-primary-light" />
                  </div>
                  <div>
                    <div className="font-semibold text-dark-gray mb-1">{t("contact.info.address")}</div>
                    <div className="text-secondary">Gsmend Ballii, Mitrovica, Kosovo 40000</div>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="bg-primary-light bg-opacity-10 w-12 h-12 rounded-lg flex items-center justify-center mr-4 flex-shrink-0">
                    <Phone className="h-6 w-6 text-primary-light" />
                  </div>
                  <div>
                    <div className="font-semibold text-dark-gray mb-1">{t("contact.info.phone")}</div>
                    <div className="text-secondary">+383 XX XXX XXX</div>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="bg-primary-light bg-opacity-10 w-12 h-12 rounded-lg flex items-center justify-center mr-4 flex-shrink-0">
                    <Mail className="h-6 w-6 text-primary-light" />
                  </div>
                  <div>
                    <div className="font-semibold text-dark-gray mb-1">{t("contact.info.email")}</div>
                    <div className="text-secondary">info@autoani.com</div>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="bg-primary-light bg-opacity-10 w-12 h-12 rounded-lg flex items-center justify-center mr-4 flex-shrink-0">
                    <Clock className="h-6 w-6 text-primary-light" />
                  </div>
                  <div>
                    <div className="font-semibold text-dark-gray mb-1">{t("contact.info.hours")}</div>
                    <div className="text-secondary space-y-1">
                      {businessHours.map((schedule, index) => (
                        <div key={index} className="flex justify-between">
                          <span>{schedule.day}:</span>
                          <span>{schedule.hours}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Map Placeholder */}
              <Card className="p-6">
                <div className="bg-gray-100 h-64 rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <Navigation className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500 font-semibold">Interactive Map</p>
                    <p className="text-sm text-gray-400">Gsmend Ballii, Mitrovica, Kosovo</p>
                  </div>
                </div>
              </Card>

              {/* Social Media */}
              <div className="mt-8">
                <h5 className="font-semibold text-dark-gray mb-4">{t("contact.info.followUs")}</h5>
                <div className="flex space-x-4">
                  <a
                    href="https://www.instagram.com/aniautosallon/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-gradient-to-r from-purple-500 to-pink-500 text-white w-12 h-12 rounded-lg flex items-center justify-center hover:from-purple-600 hover:to-pink-600 transition-colors"
                  >
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                    </svg>
                  </a>
                </div>
              </div>
            </div>
            
            {/* Contact Form */}
            <div>
              <Card>
                <CardHeader>
                  <CardTitle className="text-2xl font-bold text-dark-gray">
                    {t("contact.form.title")}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ContactForm />
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-light-gray">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h3 className="text-4xl font-bold text-dark-gray mb-4">Frequently Asked Questions</h3>
            <p className="text-lg text-secondary">Common questions about our services</p>
          </div>
          
          <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-8">
            <Card className="p-6">
              <h4 className="font-bold text-dark-gray mb-3">How long does the import process take?</h4>
              <p className="text-secondary">Typically 2-4 weeks from order confirmation to delivery, depending on the vehicle location and customs processing.</p>
            </Card>
            
            <Card className="p-6">
              <h4 className="font-bold text-dark-gray mb-3">Do you provide warranty?</h4>
              <p className="text-secondary">Yes, we offer warranty options on all imported vehicles. Details vary based on vehicle age and condition.</p>
            </Card>
            
            <Card className="p-6">
              <h4 className="font-bold text-dark-gray mb-3">Can you find specific vehicles?</h4>
              <p className="text-secondary">Absolutely! Our custom order service can locate specific makes, models, and specifications according to your requirements.</p>
            </Card>
            
            <Card className="p-6">
              <h4 className="font-bold text-dark-gray mb-3">What about financing options?</h4>
              <p className="text-secondary">We work with local banks and financial institutions to provide competitive financing options for qualified buyers.</p>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}
