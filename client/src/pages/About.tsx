import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useTranslation } from "../lib/i18n";
import { EditableTitle, EditableDescription, EditableText, EditableButton } from "../components/EditableText";
import { 
  Award, 
  Users, 
  TrendingUp, 
  MapPin, 
  Calendar, 
  Shield,
  Car,
  Globe,
  CheckCircle,
  Star
} from "lucide-react";

export default function About() {
  const { t } = useTranslation();

  const milestones = [
    {
      year: "2014",
      title: "Company Founded",
      description: "AUTO ANI established in Mitrovica, Kosovo",
      icon: Calendar,
    },
    {
      year: "2016",
      title: "First European Import",
      description: "Successfully imported first vehicle from Germany",
      icon: Car,
    },
    {
      year: "2018",
      title: "Finland Partnership",
      description: "Expanded import services to include Finland",
      icon: Globe,
    },
    {
      year: "2020",
      title: "500+ Happy Customers",
      description: "Reached milestone of 500 satisfied customers",
      icon: Users,
    },
    {
      year: "2024",
      title: "Premium Dealer Status",
      description: "Recognized as premium automotive dealer in Kosovo",
      icon: Award,
    },
  ];

  const values = [
    {
      icon: Shield,
      title: "Quality First",
      description: "Every vehicle undergoes rigorous inspection to ensure the highest quality standards.",
    },
    {
      icon: CheckCircle,
      title: "Transparency",
      description: "Complete transparency in pricing, vehicle history, and import process.",
    },
    {
      icon: Users,
      title: "Customer Focus",
      description: "Dedicated to providing exceptional customer service and support.",
    },
    {
      icon: TrendingUp,
      title: "Continuous Growth",
      description: "Constantly improving our services and expanding our offerings.",
    },
  ];

  const teamStats = [
    { number: "10+", label: t("about.stats.experience") },
    { number: "500+", label: t("about.stats.customers") },
    { number: "100+", label: t("about.stats.imports") },
    { number: "6", label: t("about.stats.brands") },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="hero-section py-20">
        <div className="container mx-auto px-4">
          <div className="text-center text-white">
            <EditableTitle 
              sectionKey="about_hero_title"
              defaultValue="About AUTO ANI"
              className="text-5xl font-bold mb-6"
              page="about"
              section="hero"
              as="h1"
            />
            <EditableDescription 
              sectionKey="about_hero_subtitle"
              defaultValue="Your trusted partner for premium automotive solutions in Kosovo since 2014"
              className="text-xl mb-8 text-blue-100 max-w-3xl mx-auto"
              page="about"
              section="hero"
            />
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <EditableTitle 
                sectionKey="about_story_title"
                defaultValue="Our Story"
                className="text-4xl font-bold text-dark-gray mb-6"
                page="about"
                section="story"
                as="h2"
              />
              <EditableDescription 
                sectionKey="about_story_description_1"
                defaultValue="AUTO ANI was founded in 2014 with a vision to bring premium European vehicles to Kosovo. Our journey began with a simple mission: to provide quality, reliable vehicles imported directly from Finland and Germany."
                className="text-lg text-secondary mb-6"
                page="about"
                section="story"
                as="p"
              />
              <EditableDescription 
                sectionKey="about_story_description_2"
                defaultValue="Today, we are proud to be one of Kosovo's leading automotive import specialists, having served over 500 satisfied customers and imported more than 100 premium vehicles."
                className="text-lg text-secondary mb-8"
                page="about"
                section="story"
                as="p"
              />
              
              <div className="grid grid-cols-2 gap-8 mb-8">
                {teamStats.map((stat, index) => (
                  <div key={index} className="text-center">
                    <EditableText
                      sectionKey={`about_stat_${index}_number`}
                      defaultValue={stat.number}
                      className="text-3xl font-bold text-primary mb-2"
                      page="about"
                      section="stats"
                      as="div"
                    />
                    <EditableText
                      sectionKey={`about_stat_${index}_label`}
                      defaultValue={stat.label}
                      className="text-secondary"
                      page="about"
                      section="stats"
                      as="div"
                    />
                  </div>
                ))}
              </div>
              
              <div className="flex items-center space-x-4">
                <a
                  href="https://www.instagram.com/aniautosallon/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-lg font-semibold hover:from-purple-600 hover:to-pink-600 transition-colors"
                >
                  <svg className="w-5 h-5 inline mr-2" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                  </svg>
                  {t("about.followUs")}
                </a>
              </div>
            </div>
            
            <div className="relative">
              <div className="relative overflow-hidden rounded-2xl shadow-2xl">
                <img 
                  src="https://images.unsplash.com/photo-1560472354-b33ff0c44a43?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600" 
                  alt="AUTO ANI showroom interior with premium vehicles" 
                  className="w-full h-96 object-cover"
                />
              </div>
              
              <div className="absolute -bottom-6 -right-6 bg-white rounded-xl p-4 shadow-lg">
                <div className="flex items-center space-x-3">
                  <div className="bg-blue-100 p-2 rounded-lg">
                    <Award className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <div className="font-semibold text-dark-gray">Trusted Partner</div>
                    <div className="text-sm text-secondary">Licensed Dealer</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-20 bg-light-gray">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <EditableTitle 
              sectionKey="about_journey_title"
              defaultValue="Our Journey"
              className="text-4xl font-bold text-dark-gray mb-4"
              page="about"
              section="journey"
              as="h3"
            />
            <EditableDescription 
              sectionKey="about_journey_subtitle"
              defaultValue="Key milestones in AUTO ANI's growth"
              className="text-lg text-secondary"
              page="about"
              section="journey"
            />
          </div>
          
          <div className="max-w-4xl mx-auto">
            <div className="space-y-8">
              {milestones.map((milestone, index) => (
                <div key={index} className="flex items-center">
                  <div className="flex-shrink-0 w-32">
                    <Badge variant="secondary" className="text-lg font-bold bg-primary text-white">
                      {milestone.year}
                    </Badge>
                  </div>
                  <div className="flex-shrink-0 mx-6">
                    <div className="bg-primary-light w-12 h-12 rounded-full flex items-center justify-center">
                      <milestone.icon className="h-6 w-6 text-white" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <EditableTitle
                      sectionKey={`about_milestone_${index}_title`}
                      defaultValue={milestone.title}
                      className="text-xl font-bold text-dark-gray mb-2"
                      page="about"
                      section="timeline"
                      as="h4"
                    />
                    <EditableDescription
                      sectionKey={`about_milestone_${index}_description`}
                      defaultValue={milestone.description}
                      className="text-secondary"
                      page="about"
                      section="timeline"
                      as="p"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <EditableTitle 
              sectionKey="about_values_title"
              defaultValue="Our Values"
              className="text-4xl font-bold text-dark-gray mb-4"
              page="about"
              section="values"
              as="h3"
            />
            <EditableDescription 
              sectionKey="about_values_subtitle"
              defaultValue="What drives us every day"
              className="text-lg text-secondary"
              page="about"
              section="values"
            />
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <Card key={index} className="text-center p-6 hover:shadow-lg transition-shadow">
                <div className="bg-primary-light bg-opacity-10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <value.icon className="h-8 w-8 text-primary-light" />
                </div>
                <EditableTitle
                  sectionKey={`about_value_${index}_title`}
                  defaultValue={value.title}
                  className="text-lg font-bold text-dark-gray mb-2"
                  page="about"
                  section="values"
                  as="h4"
                />
                <EditableDescription
                  sectionKey={`about_value_${index}_description`}
                  defaultValue={value.description}
                  className="text-secondary text-sm"
                  page="about"
                  section="values"
                  as="p"
                />
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Location */}
      <section className="py-20 bg-light-gray">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <EditableTitle 
                sectionKey="about_showroom_title"
                defaultValue="Visit Our Showroom"
                className="text-4xl font-bold text-dark-gray mb-6"
                page="about"
                section="showroom"
                as="h3"
              />
              <EditableDescription 
                sectionKey="about_showroom_description"
                defaultValue="Located in the heart of Mitrovica, our modern showroom features the latest premium vehicles from Europe. Come visit us to see our quality selection in person."
                className="text-lg text-secondary mb-8"
                page="about"
                section="showroom"
                as="p"
              />
              
              <div className="space-y-4 mb-8">
                <div className="flex items-center">
                  <MapPin className="h-5 w-5 text-primary-light mr-3" />
                  <EditableText
                    sectionKey="about_showroom_address"
                    defaultValue="Gsmend Ballii, Mitrovica, Kosovo 40000"
                    className="text-dark-gray"
                    page="about"
                    section="showroom"
                    as="span"
                  />
                </div>
                <div className="flex items-center">
                  <Calendar className="h-5 w-5 text-primary-light mr-3" />
                  <EditableText
                    sectionKey="about_showroom_hours"
                    defaultValue="Mon-Fri: 9AM-6PM, Sat: 9AM-4PM"
                    className="text-dark-gray"
                    page="about"
                    section="showroom"
                    as="span"
                  />
                </div>
              </div>
              
              <EditableButton
                sectionKey="about_showroom_button"
                defaultValue="Get Directions"
                className="btn-primary"
                page="about"
                section="showroom"
              />
            </div>
            
            <div className="relative">
              <div className="bg-gray-200 h-96 rounded-2xl flex items-center justify-center">
                <div className="text-center">
                  <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">Interactive Map</p>
                  <p className="text-sm text-gray-400">Gsmend Ballii, Mitrovica, Kosovo</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
