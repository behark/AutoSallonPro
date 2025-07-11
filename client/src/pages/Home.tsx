import React, { useState } from "react";
import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { VehicleCard } from "../components/VehicleCard";
import { SocialMediaFeed } from "../components/SocialMediaFeed";
import { FacebookCarList } from "../components/FacebookCarList";
import { UniversalTextEditor } from "../components/UniversalTextEditor";
import { useTranslation } from "../lib/i18n";
import { Vehicle } from "@shared/schema";
import { 
  EditableText,
  EditableTitle,
  EditableSubtitle,
  EditableDescription,
  EditableButton
} from "../components/EditableText";
import { 
  Car, 
  ShieldCheck, 
  Import, 
  ClipboardList, 
  Wrench, 
  Star,
  TrendingUp,
  Users,
  Award
} from "lucide-react";

export default function Home() {
  const { t } = useTranslation();
  const [universalEditorActive, setUniversalEditorActive] = useState(false);

  const { data: featuredVehicles = [], isLoading: featuredLoading } = useQuery<Vehicle[]>({
    queryKey: ["/api/vehicles/featured"],
  });

  // Debug logging
  console.log("Featured vehicles data:", featuredVehicles);
  console.log("Featured vehicles count:", featuredVehicles.length);

  const brands = [
    { name: "Škoda", image: "https://images.unsplash.com/photo-1549317336-206569e8475c?ixlib=rb-4.0.3&auto=format&fit=crop&w=80&h=80" },
    { name: "Volkswagen", image: "https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?ixlib=rb-4.0.3&auto=format&fit=crop&w=80&h=80" },
    { name: "Seat", image: "https://images.unsplash.com/photo-1549317336-206569e8475c?ixlib=rb-4.0.3&auto=format&fit=crop&w=80&h=80" },
    { name: "Mercedes", image: "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?ixlib=rb-4.0.3&auto=format&fit=crop&w=80&h=80" },
    { name: "BMW", image: "https://images.unsplash.com/photo-1555215695-3004980ad54e?ixlib=rb-4.0.3&auto=format&fit=crop&w=80&h=80" },
    { name: "Audi", image: "https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?ixlib=rb-4.0.3&auto=format&fit=crop&w=80&h=80" },
  ];

  const testimonials = [
    {
      name: "Marko Petrović",
      location: "Pristina, Kosovo",
      text: "Excellent service from AUTO ANI. They helped me import my BMW from Germany and handled all the paperwork. Professional and trustworthy!",
      rating: 5,
    },
    {
      name: "Elena Vuković",
      location: "Mitrovica, Kosovo",
      text: "Great experience buying my Mercedes from AUTO ANI. The car was exactly as described and the import process was smooth. Highly recommend!",
      rating: 5,
    },
    {
      name: "Ahmed Rexhepi",
      location: "Ferizaj, Kosovo",
      text: "AUTO ANI found me the perfect Audi through their custom order service. Fair pricing and excellent customer service throughout the process.",
      rating: 5,
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-screen hero-section">
        <div className="container mx-auto px-4 py-20">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="text-white">
              <EditableTitle 
                sectionKey="hero_title"
                defaultValue="Find Your Perfect Vehicle at AUTO ANI"
                className="text-5xl font-bold mb-6"
                page="home"
                section="hero"
              />
              <EditableDescription 
                sectionKey="hero_subtitle"
                defaultValue="Premium used cars imported from Finland and Germany with unbeatable quality and competitive prices."
                className="text-xl mb-8 text-blue-100"
                page="home"
                section="hero"
              />
              
              <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 mb-12">
                <Link href="/inventory">
                  <Button className="btn-accent">
                    <Car className="mr-2 h-4 w-4" />
                    <EditableButton 
                      sectionKey="hero_button1"
                      defaultValue="View Inventory"
                      page="home"
                      section="hero"
                    />
                  </Button>
                </Link>
                <Link href="/services">
                  <Button variant="outline" className="btn-secondary text-white border-white hover:bg-white hover:text-primary">
                    <Import className="mr-2 h-4 w-4" />
                    <EditableButton 
                      sectionKey="hero_button2"
                      defaultValue="Custom Order"
                      page="home"
                      section="hero"
                    />
                  </Button>
                </Link>
              </div>
              
              <div className="flex items-center space-x-8">
                <div className="text-center">
                  <EditableText 
                    sectionKey="hero_stats_cars"
                    defaultValue="100+"
                    className="text-3xl font-bold"
                    page="home"
                    section="hero"
                    as="div"
                  />
                  <EditableText 
                    sectionKey="hero_stats_cars_label"
                    defaultValue="Cars Available"
                    className="text-blue-200"
                    page="home"
                    section="hero"
                    as="div"
                  />
                </div>
                <div className="text-center">
                  <EditableText 
                    sectionKey="hero_stats_experience"
                    defaultValue="10+"
                    className="text-3xl font-bold"
                    page="home"
                    section="hero"
                    as="div"
                  />
                  <EditableText 
                    sectionKey="hero_stats_experience_label"
                    defaultValue="Years Experience"
                    className="text-blue-200"
                    page="home"
                    section="hero"
                    as="div"
                  />
                </div>
                <div className="text-center">
                  <EditableText 
                    sectionKey="hero_stats_customers"
                    defaultValue="500+"
                    className="text-3xl font-bold"
                    page="home"
                    section="hero"
                    as="div"
                  />
                  <EditableText 
                    sectionKey="hero_stats_customers_label"
                    defaultValue="Happy Customers"
                    className="text-blue-200"
                    page="home"
                    section="hero"
                    as="div"
                  />
                </div>
              </div>
            </div>
            
            <div className="relative">
              <div className="relative overflow-hidden rounded-2xl shadow-2xl">
                <img 
                  src="https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600" 
                  alt="Premium BMW sedan in showroom" 
                  className="w-full h-96 object-cover"
                />
                <div className="absolute top-4 right-4 bg-black bg-opacity-50 text-white px-3 py-1 rounded-lg">
                  <span className="text-sm font-semibold">Featured</span>
                </div>
              </div>
              
              <div className="absolute -bottom-6 -left-6 bg-white rounded-xl p-4 shadow-lg">
                <div className="flex items-center space-x-3">
                  <div className="bg-green-100 p-2 rounded-lg">
                    <ShieldCheck className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <div className="font-semibold text-dark-gray">Quality Guaranteed</div>
                    <div className="text-sm text-secondary">Full Inspection Report</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Brand Highlights */}
      <section className="py-16 bg-light-gray">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <EditableTitle 
              sectionKey="brands_title"
              defaultValue="Premium Brands We Import"
              className="text-3xl font-bold text-dark-gray mb-4"
              page="home"
              section="brands"
              as="h3"
            />
            <EditableDescription 
              sectionKey="brands_subtitle"
              defaultValue="Trusted automotive brands from Finland and Germany"
              className="text-lg text-secondary"
              page="home"
              section="brands"
            />
          </div>
          
          <div className="grid grid-cols-3 md:grid-cols-6 gap-8">
            {brands.map((brand) => (
              <div key={brand.name} className="flex flex-col items-center group cursor-pointer">
                <div className="brand-highlight mb-4">
                  <img 
                    src={brand.image} 
                    alt={`${brand.name} vehicle`} 
                    className="w-12 h-12 object-cover rounded-full"
                  />
                </div>
                <span className="text-sm font-semibold text-dark-gray">{brand.name}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Vehicles */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <EditableTitle 
              sectionKey="featured_vehicles_title"
              defaultValue="Featured Vehicles"
              className="text-4xl font-bold text-dark-gray mb-4"
              page="home"
              section="featured"
              as="h3"
            />
            <EditableDescription 
              sectionKey="featured_vehicles_subtitle"
              defaultValue="Hand-picked premium vehicles from our inventory"
              className="text-lg text-secondary"
              page="home"
              section="featured"
            />
          </div>
          
          {featuredLoading ? (
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading featured vehicles...</p>
            </div>
          ) : featuredVehicles.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredVehicles.slice(0, 3).map((vehicle) => (
                <VehicleCard key={vehicle.id} vehicle={vehicle} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-600 mb-4">No featured vehicles available at the moment.</p>
              <Link href="/inventory">
                <Button className="btn-primary">View All Vehicles</Button>
              </Link>
            </div>
          )}
          
          {featuredVehicles.length > 0 && (
            <div className="text-center mt-12">
              <Link href="/inventory">
                <Button className="btn-primary">
                  <EditableButton 
                    sectionKey="featured_vehicles_view_all"
                    defaultValue="View All Vehicles"
                    page="home"
                    section="featured"
                  />
                </Button>
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20 bg-light-gray">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <EditableTitle 
              sectionKey="services_section_title"
              defaultValue="Our Services"
              className="text-4xl font-bold text-dark-gray mb-4"
              page="home"
              section="services"
              as="h3"
            />
            <EditableDescription 
              sectionKey="services_section_subtitle"
              defaultValue="Comprehensive automotive import and inspection services"
              className="text-lg text-secondary"
              page="home"
              section="services"
            />
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="service-card">
              <div className="bg-primary-light bg-opacity-10 w-16 h-16 rounded-full flex items-center justify-center mb-6">
                <Import className="text-primary-light text-2xl" />
              </div>
              <EditableTitle 
                sectionKey="import_service_title"
                defaultValue="Vehicle Import"
                className="text-xl font-bold text-dark-gray mb-4"
                page="home"
                section="services"
                as="h4"
              />
              <EditableDescription 
                sectionKey="import_service_description"
                defaultValue="Professional vehicle import from Finland and Germany with full documentation"
                className="text-secondary mb-6"
                page="home"
                section="services"
              />
              <ul className="space-y-2 text-sm text-secondary mb-6">
                {t("services.import.features").split(',').map((feature: string, index: number) => (
                  <li key={index} className="flex items-center">
                    <ShieldCheck className="h-4 w-4 text-green-500 mr-2" />
                    {feature.trim()}
                  </li>
                ))}
              </ul>
              <Link href="/services">
                <Button className="w-full btn-primary">
                  <EditableButton 
                    sectionKey="import_service_button"
                    defaultValue="Learn More"
                    page="home"
                    section="services"
                  />
                </Button>
              </Link>
            </Card>
            
            <Card className="service-card">
              <div className="bg-accent bg-opacity-10 w-16 h-16 rounded-full flex items-center justify-center mb-6">
                <ClipboardList className="text-accent text-2xl" />
              </div>
              <EditableTitle 
                sectionKey="custom_order_service_title"
                defaultValue="Custom Orders"
                className="text-xl font-bold text-dark-gray mb-4"
                page="home"
                section="services"
                as="h4"
              />
              <EditableDescription 
                sectionKey="custom_order_service_description"
                defaultValue="Can't find what you're looking for? We'll source the perfect vehicle for you"
                className="text-secondary mb-6"
                page="home"
                section="services"
              />
              <ul className="space-y-2 text-sm text-secondary mb-6">
                {t("services.customOrder.features").split(',').map((feature: string, index: number) => (
                  <li key={index} className="flex items-center">
                    <ShieldCheck className="h-4 w-4 text-green-500 mr-2" />
                    {feature.trim()}
                  </li>
                ))}
              </ul>
              <Link href="/services">
                <Button className="w-full btn-accent">
                  <EditableButton 
                    sectionKey="custom_order_service_button"
                    defaultValue="Start Custom Order"
                    page="home"
                    section="services"
                  />
                </Button>
              </Link>
            </Card>
            
            <Card className="service-card">
              <div className="bg-gold bg-opacity-10 w-16 h-16 rounded-full flex items-center justify-center mb-6">
                <Wrench className="text-gold text-2xl" />
              </div>
              <EditableTitle 
                sectionKey="inspection_service_title"
                defaultValue="Vehicle Inspection"
                className="text-xl font-bold text-dark-gray mb-4"
                page="home"
                section="services"
                as="h4"
              />
              <EditableDescription 
                sectionKey="inspection_service_description"
                defaultValue="Comprehensive vehicle inspection and verification services"
                className="text-secondary mb-6"
                page="home"
                section="services"
              />
              <ul className="space-y-2 text-sm text-secondary mb-6">
                {t("services.inspection.features").split(',').map((feature: string, index: number) => (
                  <li key={index} className="flex items-center">
                    <ShieldCheck className="h-4 w-4 text-green-500 mr-2" />
                    {feature.trim()}
                  </li>
                ))}
              </ul>
              <Link href="/services">
                <Button className="w-full bg-gold text-white hover:bg-yellow-600">
                  <EditableButton 
                    sectionKey="inspection_service_button"
                    defaultValue="Book Inspection"
                    page="home"
                    section="services"
                  />
                </Button>
              </Link>
            </Card>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <EditableTitle 
                sectionKey="about_section_title"
                defaultValue="About AUTO ANI"
                className="text-4xl font-bold text-dark-gray mb-6"
                page="home"
                section="about"
                as="h3"
              />
              <EditableDescription 
                sectionKey="about_section_description1"
                defaultValue="Founded in 2014 in Mitrovica, Kosovo, AUTO ANI has become the leading automotive import specialist in the region."
                className="text-lg text-secondary mb-6"
                page="home"
                section="about"
              />
              <EditableDescription 
                sectionKey="about_section_description2"
                defaultValue="We specialize in importing premium vehicles from Finland and Germany, offering complete transparency and professional service throughout the entire process."
                className="text-lg text-secondary mb-8"
                page="home"
                section="about"
              />
              
              <div className="grid grid-cols-2 gap-8 mb-8">
                <div className="text-center">
                  <EditableText 
                    sectionKey="about_stats_experience_number"
                    defaultValue="10+"
                    className="text-3xl font-bold text-primary mb-2"
                    page="home"
                    section="about"
                    as="div"
                  />
                  <EditableText 
                    sectionKey="about_stats_experience_label"
                    defaultValue="Years Experience"
                    className="text-secondary"
                    page="home"
                    section="about"
                    as="div"
                  />
                </div>
                <div className="text-center">
                  <EditableText 
                    sectionKey="about_stats_customers_number"
                    defaultValue="500+"
                    className="text-3xl font-bold text-primary mb-2"
                    page="home"
                    section="about"
                    as="div"
                  />
                  <EditableText 
                    sectionKey="about_stats_customers_label"
                    defaultValue="Happy Customers"
                    className="text-secondary"
                    page="home"
                    section="about"
                    as="div"
                  />
                </div>
                <div className="text-center">
                  <EditableText 
                    sectionKey="about_stats_imports_number"
                    defaultValue="100+"
                    className="text-3xl font-bold text-primary mb-2"
                    page="home"
                    section="about"
                    as="div"
                  />
                  <EditableText 
                    sectionKey="about_stats_imports_label"
                    defaultValue="Successful Imports"
                    className="text-secondary"
                    page="home"
                    section="about"
                    as="div"
                  />
                </div>
                <div className="text-center">
                  <EditableText 
                    sectionKey="about_stats_brands_number"
                    defaultValue="6"
                    className="text-3xl font-bold text-primary mb-2"
                    page="home"
                    section="about"
                    as="div"
                  />
                  <EditableText 
                    sectionKey="about_stats_brands_label"
                    defaultValue="Premium Brands"
                    className="text-secondary"
                    page="home"
                    section="about"
                    as="div"
                  />
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                <a
                  href="https://www.instagram.com/aniautosallon/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-lg font-semibold hover:from-purple-600 hover:to-pink-600 transition-colors"
                >
                  {t("about.followUs")}
                </a>
                <Link href="/about">
                  <Button className="btn-secondary">
                    <EditableButton 
                      sectionKey="about_section_our_story_button"
                      defaultValue="Our Story"
                      page="home"
                      section="about"
                    />
                  </Button>
                </Link>
              </div>
            </div>
            
            <div className="relative">
              <div className="relative overflow-hidden rounded-2xl shadow-2xl">
                <img 
                  src="https://images.unsplash.com/photo-1560472354-b33ff0c44a43?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600" 
                  alt="Modern automotive showroom interior" 
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

      {/* Social Media Feed */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <SocialMediaFeed />
        </div>
      </section>

      {/* Facebook Cars Section */}
      <section className="container mx-auto px-4 py-10">
        <h2 className="text-2xl font-bold mb-6">Facebook Cars</h2>
        <FacebookCarList pageId="2681347762153745" />
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-light-gray">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <EditableTitle 
              sectionKey="testimonials_title"
              defaultValue="What Our Customers Say"
              className="text-4xl font-bold text-dark-gray mb-4"
              page="home"
              section="testimonials"
              as="h3"
            />
            <EditableDescription 
              sectionKey="testimonials_subtitle"
              defaultValue="Real feedback from satisfied customers who trust AUTO ANI"
              className="text-lg text-secondary"
              page="home"
              section="testimonials"
            />
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="bg-white p-8 shadow-lg">
                <div className="flex items-center mb-4">
                  <div className="flex text-gold">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 fill-current" />
                    ))}
                  </div>
                </div>
                <EditableDescription
                  sectionKey={`testimonial_${index}_text`}
                  defaultValue={testimonial.text}
                  className="text-secondary mb-6 italic"
                  page="home"
                  section="testimonials"
                  as="p"
                />
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-gray-300 rounded-full mr-4"></div>
                  <div>
                    <EditableText
                      sectionKey={`testimonial_${index}_name`}
                      defaultValue={testimonial.name}
                      className="font-semibold text-dark-gray"
                      page="home"
                      section="testimonials"
                      as="div"
                    />
                    <EditableText
                      sectionKey={`testimonial_${index}_location`}
                      defaultValue={testimonial.location}
                      className="text-sm text-secondary"
                      page="home"
                      section="testimonials"
                      as="div"
                    />
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Universal Text Editor */}
      <UniversalTextEditor
        isActive={universalEditorActive}
        onToggle={() => setUniversalEditorActive(!universalEditorActive)}
      />
    </div>
  );
}
