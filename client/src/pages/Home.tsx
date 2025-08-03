import React, { useState, useEffect } from 'react';
import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { VehicleCard } from "../components/VehicleCard";
import { SocialMediaFeed } from "../components/SocialMediaFeed";
import { FacebookCarList } from "../components/FacebookCarList";
import { InstagramCarList } from "../components/InstagramCarList";
import { ErrorBoundary } from "../components/ErrorBoundary";
import { UniversalTextEditor } from "../components/UniversalTextEditor";
import { useTranslation } from "../lib/i18n";
// Define Vehicle type locally if not imported elsewhere
interface Vehicle {
  id: string;
  make: string;
  model: string;
  year: number;
  price: number;
  mileage?: number;
  condition?: string;
  fuelType?: string;
  transmission?: string;
  description?: string;
  images?: string[];
  featured?: boolean;
}
import { motion } from "framer-motion";
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
  Award,
  ChevronRight,
  Search,
  HeartHandshake,
  BadgeCheck,
  Sparkles,
  Clock,
  HistoryIcon,
  Instagram,
  MapPin,
  PhoneCall,
  Mail,
  Facebook,
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
    { name: "Volvo", image: "https://images.unsplash.com/photo-1549317336-206569e8475c?ixlib=rb-4.0.3&auto=format&fit=crop&w=80&h=80" },
    { name: "Mercedes", image: "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?ixlib=rb-4.0.3&auto=format&fit=crop&w=80&h=80" },
    { name: "BMW", image: "https://images.unsplash.com/photo-1555215695-3004980ad54e?ixlib=rb-4.0.3&auto=format&fit=crop&w=80&h=80" },
    { name: "Audi", image: "https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?ixlib=rb-4.0.3&auto=format&fit=crop&w=80&h=80" },
    { name: "Volkswagen", image: "https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?ixlib=rb-4.0.3&auto=format&fit=crop&w=80&h=80" },
    { name: "Toyota", image: "https://images.unsplash.com/photo-1549317336-206569e8475c?ixlib=rb-4.0.3&auto=format&fit=crop&w=80&h=80" },
  ];

  const testimonials = [
    {
      name: "Driton Berisha",
      location: "Pristina, Kosovo",
      text: "Excellent service from AUTO ANI. They helped me import a reliable Volvo from Finland and handled all the paperwork. Professional and trustworthy business!",
      rating: 5,
    },
    {
      name: "Fatima Krasniqi",
      location: "Mitrovica, Kosovo", 
      text: "Great experience buying my Mercedes from AUTO ANI. The car was exactly as described and the import process was transparent. Highly recommend for Finnish imports!",
      rating: 5,
    },
    {
      name: "Agron Mustafa",
      location: "Ferizaj, Kosovo",
      text: "AUTO ANI found me the perfect BMW through their Finland import service. Fair pricing and excellent customer service throughout the entire process.",
      rating: 5,
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative hero-section overflow-hidden flex items-center">
        {/* Modern Background with Overlay */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-transparent z-10"></div>
          <img 
            src="https://images.unsplash.com/photo-1617469767053-8a5eb08f672f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2400&q=80" 
            alt="Premium luxury vehicle"
            className="w-full h-full object-cover object-center"
          />
        </div>

        {/* Hero Content Container */}
        <div className="container mx-auto px-6 py-12 md:py-16 lg:py-20 relative z-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center min-h-[70vh] lg:min-h-[60vh]">
            {/* Left Content */}
            <div className="text-white max-w-2xl">
              <motion.div 
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, ease: "easeOut" }}
                className="space-y-8"
              >
                <Badge className="bg-gradient-to-r from-accent to-accent/80 text-white px-5 py-2 text-sm font-semibold rounded-full shadow-lg">
                  <Sparkles className="h-4 w-4 mr-2" />
                  <EditableText 
                    sectionKey="hero_badge_text"
                    defaultValue="Quality Finnish Cars Since 2005"
                    className=""
                    page="home"
                    section="hero"
                    as="span"
                  />
                </Badge>

                <EditableTitle 
                  sectionKey="hero_title"
                  defaultValue="Premium Used Cars from Finland"
                  className="text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-tight tracking-tight"
                  page="home"
                  section="hero"
                />
                
                <EditableDescription 
                  sectionKey="hero_subtitle"
                  defaultValue="Located in Mitrovica, Kosovo. We import quality used vehicles directly from Finland with complete service history and reliable condition reports."
                  className="text-xl text-white/90 max-w-lg"
                  page="home"
                  section="hero"
                />
                
                <div className="flex flex-wrap gap-6 pt-4">
                  <Link href="/inventory">
                    <Button className="bg-gradient-to-r from-accent to-accent/80 hover:from-accent/90 hover:to-accent/70 text-white font-medium px-8 py-6 rounded-xl hover:shadow-lg hover:scale-105 transition-all duration-300 text-base">
                      <Search className="mr-2.5 h-5 w-5" />
                      <EditableButton 
                        sectionKey="hero_button1"
                        defaultValue="Explore Our Collection"
                        page="home"
                        section="hero"
                      />
                    </Button>
                  </Link>
                  <Link href="/services">
                    <Button variant="outline" className="text-white border-white/30 backdrop-blur-sm bg-white/10 hover:bg-white/20 px-8 py-6 rounded-xl hover:shadow-lg hover:scale-105 transition-all duration-300 text-base font-medium">
                      <HeartHandshake className="mr-2.5 h-5 w-5" />
                      <EditableButton 
                        sectionKey="hero_button2"
                        defaultValue="Custom Import Service"
                        page="home"
                        section="hero"
                      />
                    </Button>
                  </Link>
                </div>

                {/* Stats Row */}
                <motion.div 
                  className="grid grid-cols-3 gap-8 pt-6 mt-8 border-t border-white/20"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.6 }}
                >
                  <div className="stat-item">
                    <EditableText 
                      sectionKey="hero_stats_cars"
                      defaultValue="300+"
                      className="text-4xl font-bold bg-gradient-to-r from-accent to-accent/70 bg-clip-text text-transparent"
                      page="home"
                      section="hero"
                      as="div"
                    />
                    <EditableText 
                      sectionKey="hero_stats_cars_label"
                      defaultValue="Cars Imported Yearly"
                      className="text-white/70 font-medium text-sm mt-1"
                      page="home"
                      section="hero"
                      as="div"
                    />
                  </div>
                  <div className="stat-item">
                    <EditableText 
                      sectionKey="hero_stats_experience"
                      defaultValue="19+"
                      className="text-4xl font-bold bg-gradient-to-r from-accent to-accent/70 bg-clip-text text-transparent"
                      page="home"
                      section="hero"
                      as="div"
                    />
                    <EditableText 
                      sectionKey="hero_stats_experience_label"
                      defaultValue="Years Experience"
                      className="text-white/70 font-medium text-sm mt-1"
                      page="home"
                      section="hero"
                      as="div"
                    />
                  </div>
                  <div className="stat-item">
                    <EditableText 
                      sectionKey="hero_stats_customers"
                      defaultValue="1500+"
                      className="text-4xl font-bold bg-gradient-to-r from-accent to-accent/70 bg-clip-text text-transparent"
                      page="home"
                      section="hero"
                      as="div"
                    />
                    <EditableText 
                      sectionKey="hero_stats_customers_label"
                      defaultValue="Happy Customers"
                      className="text-white/70 font-medium text-sm mt-1"
                      page="home"
                      section="hero"
                      as="div"
                    />
                  </div>
                </motion.div>
              </motion.div>
            </div>
            
            {/* Right Content - Featured Vehicle */}
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative hidden lg:block"
            >
              <div className="relative">
                {/* Feature Image Card */}
                <div className="relative rounded-2xl overflow-hidden shadow-2xl h-[500px] transform rotate-1 hover:rotate-0 transition-transform duration-500">
                  <img 
                    src="https://images.unsplash.com/photo-1617469767053-8a5eb08f672f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80" 
                    alt="Featured premium vehicle" 
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent flex flex-col justify-end">
                    <div className="p-8 text-white">
                      <Badge variant="secondary" className="mb-4 bg-accent text-white border-0 shadow-lg py-1.5 px-4">
                        Featured Vehicle
                      </Badge>
                      <h3 className="text-2xl font-bold mb-2">2023 Mercedes-Benz S-Class</h3>
                      <p className="text-white/80 mb-6">Premium German engineering with full service history</p>
                      <div className="flex items-center justify-between">
                        <span className="text-3xl font-bold">€89,900</span>
                        <Link href="/inventory/featured-mercedes">
                          <Button className="bg-white text-secondary-900 hover:bg-white/90 font-medium rounded-lg">
                            View Details
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Feature Cards - Absolute positioned */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.9 }}
                  className="absolute -bottom-16 -left-8 max-w-[260px] bg-white rounded-xl p-5 shadow-xl"
                >
                  <div className="flex items-center gap-3 mb-2">
                    <div className="bg-green-100 p-2 rounded-full">
                      <BadgeCheck className="h-5 w-5 text-green-600" />
                    </div>
                    <h3 className="font-bold text-secondary-800 text-sm">Certified Quality</h3>
                  </div>
                  <p className="text-xs text-secondary-600">Every vehicle undergoes a comprehensive 150-point inspection</p>
                </motion.div>
                
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 1.1 }}
                  className="absolute -top-10 -right-8 max-w-[260px] bg-white rounded-xl p-5 shadow-xl"
                >
                  <div className="flex items-center gap-3 mb-2">
                    <div className="bg-blue-100 p-2 rounded-full">
                      <HeartHandshake className="h-5 w-5 text-blue-600" />
                    </div>
                    <h3 className="font-bold text-secondary-800 text-sm">Personal Service</h3>
                  </div>
                  <p className="text-xs text-secondary-600">Dedicated support team for all your import and customization needs</p>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
        
        {/* Curved Bottom Edge */}
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-white" style={{ borderTopLeftRadius: '50% 100%', borderTopRightRadius: '50% 100%' }}></div>
      </section>

      {/* Brand Highlights */}
      <section className="py-16 bg-light-gray">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <EditableTitle 
              sectionKey="brands_title"
              defaultValue="Quality Brands from Finland"
              className="text-3xl font-bold text-dark-gray mb-4"
              page="home"
              section="brands"
            />
            <EditableDescription 
              sectionKey="brands_subtitle"
              defaultValue="Trusted automotive brands imported directly from Finland"
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
      <section className="py-24 bg-gradient-to-b from-white to-gray-50">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center mb-16">
            <div>
              <Badge className="bg-accent/10 text-accent px-4 py-1.5 mb-4 rounded-full font-medium text-sm">
                <Sparkles className="h-4 w-4 mr-2" />
                Premium Selection
              </Badge>
              <EditableTitle 
                sectionKey="featured_vehicles_title"
                defaultValue="Featured Vehicles"
                className="text-4xl font-bold text-secondary-900 tracking-tight"
                page="home"
                section="featured"
                as="h3"
              />
              <EditableDescription 
                sectionKey="featured_vehicles_subtitle"
                defaultValue="Hand-picked premium vehicles with verified history and top condition"
                className="text-lg text-secondary-600 mt-3 max-w-lg"
                page="home"
                section="featured"
              />
            </div>
            
            <div className="mt-6 md:mt-0">
              <Link href="/inventory">
                <Button className="group bg-white hover:bg-accent hover:text-white text-secondary-900 border border-secondary-200 px-6 py-3 rounded-xl font-medium transition-all duration-300 flex items-center gap-2">
                  <EditableButton 
                    sectionKey="featured_vehicles_view_all"
                    defaultValue="View All Vehicles"
                    page="home"
                    section="featured"
                  />
                  <ChevronRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </div>
          </div>
          
          {featuredLoading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <div className="animate-spin rounded-full h-14 w-14 border-b-2 border-t-2 border-accent mx-auto"></div>
              <p className="mt-6 text-secondary-600 font-medium">Loading premium vehicles...</p>
            </div>
          ) : featuredVehicles.length > 0 ? (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, staggerChildren: 0.1 }}
              className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              {featuredVehicles.slice(0, 3).map((vehicle, index) => (
                <motion.div
                  key={vehicle.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <VehicleCard vehicle={vehicle} />
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <div className="bg-gray-50 rounded-2xl p-12 text-center flex flex-col items-center justify-center shadow-inner">
              <Car className="h-16 w-16 text-secondary-400 mb-4" />
              <p className="text-secondary-600 mb-6 text-lg">No featured vehicles available at the moment.</p>
              <Link href="/inventory">
                <Button className="bg-accent text-white hover:bg-accent/90 px-6 py-3 rounded-xl font-medium shadow-md hover:shadow-lg transition-all duration-300">
                  Browse All Inventory
                </Button>
              </Link>
            </div>
          )}
          
          {featuredVehicles.length > 0 && (
            <div className="mt-16 flex justify-center">
              <div className="bg-secondary-100 px-8 py-4 rounded-2xl flex items-center max-w-3xl">
                <div className="bg-accent/10 p-3 rounded-full mr-5">
                  <BadgeCheck className="h-6 w-6 text-accent" />
                </div>
                <p className="text-secondary-700">
                  All our vehicles undergo a comprehensive 150-point inspection and come with a detailed history report.
                </p>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Services Section */}
      <section className="py-24 bg-gradient-to-b from-gray-50 to-white overflow-hidden relative">
        <div className="container mx-auto px-6">
          <div className="flex flex-col items-center text-center mb-16 relative z-10">
            <Badge className="bg-secondary-100 text-secondary-800 px-4 py-1.5 mb-4 rounded-full font-medium text-sm">
              <Star className="h-4 w-4 mr-2 text-accent" />
              Premium Services
            </Badge>
            <EditableTitle 
              sectionKey="services_section_title"
              defaultValue="Our Premium Services"
              className="text-4xl font-bold text-secondary-900 mb-4 tracking-tight"
              page="home"
              section="services"
            />
            <EditableDescription 
              sectionKey="services_section_subtitle"
              defaultValue="Experience exceptional automotive services tailored to your needs"
              className="text-lg text-secondary-600 max-w-2xl"
              page="home"
              section="services"
            />
          </div>
          
          {/* Abstract background elements */}
          <div className="absolute top-0 right-0 -mr-20 -mt-20 opacity-10">
            <div className="w-64 h-64 rounded-full bg-accent"></div>
          </div>
          <div className="absolute bottom-0 left-0 -ml-32 -mb-16 opacity-10">
            <div className="w-80 h-80 rounded-full bg-secondary-500"></div>
          </div>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, staggerChildren: 0.2 }}
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="group"
            >
              <Card className="bg-white border-none shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden rounded-2xl p-8 h-full relative">
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary-light/5 rounded-full -mr-16 -mt-16 transition-all duration-300 group-hover:bg-primary-light/10"></div>
                <div className="relative z-10">
                  <div className="bg-primary-light/10 w-16 h-16 rounded-full flex items-center justify-center mb-6 transition-all duration-300 group-hover:scale-110">
                    <Import className="text-primary-light w-7 h-7" />
                  </div>
                  <EditableTitle 
                    sectionKey="import_service_title"
                    defaultValue="Vehicle Import"
                    className="text-xl font-bold text-secondary-900 mb-4"
                    page="home"
                    section="services"
                  />
                  <EditableDescription 
                    sectionKey="import_service_description"
                    defaultValue="Professional vehicle import from Finland and Germany with full documentation"
                    className="text-secondary-600 mb-6"
                    page="home"
                    section="services"
                  />
                  <ul className="space-y-3 text-sm text-secondary-600 mb-6">
                    {t("services.import.features").split(',').map((feature: string, index: number) => (
                      <li key={index} className="flex items-start">
                        <BadgeCheck className="h-5 w-5 text-primary-light mt-0.5 mr-3 flex-shrink-0" />
                        <span>{feature.trim()}</span>
                      </li>
                    ))}
                  </ul>
                  <Link href="/services">
                    <Button className="w-full bg-primary-light text-white hover:bg-primary shadow-md hover:shadow-lg transition-all duration-300 rounded-xl py-2.5">
                      <EditableButton 
                        sectionKey="import_service_button"
                        defaultValue="Learn More"
                        page="home"
                        section="services"
                      />
                      <ChevronRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </Card>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="group"
            >
              <Card className="bg-white border-none shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden rounded-2xl p-8 h-full relative">
                <div className="absolute top-0 right-0 w-32 h-32 bg-accent/5 rounded-full -mr-16 -mt-16 transition-all duration-300 group-hover:bg-accent/10"></div>
                <div className="relative z-10">
                  <div className="bg-accent/10 w-16 h-16 rounded-full flex items-center justify-center mb-6 transition-all duration-300 group-hover:scale-110">
                    <ClipboardList className="text-accent w-7 h-7" />
                  </div>
                  <EditableTitle 
                    sectionKey="custom_order_service_title"
                    defaultValue="Custom Orders"
                    className="text-xl font-bold text-secondary-900 mb-4"
                    page="home"
                    section="services"
                  />
                  <EditableDescription 
                    sectionKey="custom_order_service_description"
                    defaultValue="Can't find what you're looking for? We'll source the perfect vehicle for you"
                    className="text-secondary-600 mb-6"
                    page="home"
                    section="services"
                  />
                  <ul className="space-y-3 text-sm text-secondary-600 mb-6">
                    {t("services.customOrder.features").split(',').map((feature: string, index: number) => (
                      <li key={index} className="flex items-start">
                        <BadgeCheck className="h-5 w-5 text-accent mt-0.5 mr-3 flex-shrink-0" />
                        <span>{feature.trim()}</span>
                      </li>
                    ))}
                  </ul>
                  <Link href="/services">
                    <Button className="w-full bg-accent text-white hover:bg-accent/90 shadow-md hover:shadow-lg transition-all duration-300 rounded-xl py-2.5">
                      <EditableButton 
                        sectionKey="custom_order_service_button"
                        defaultValue="Start Custom Order"
                        page="home"
                        section="services"
                      />
                      <ChevronRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </Card>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="group"
            >
              <Card className="bg-white border-none shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden rounded-2xl p-8 h-full relative">
                <div className="absolute top-0 right-0 w-32 h-32 bg-gold/5 rounded-full -mr-16 -mt-16 transition-all duration-300 group-hover:bg-gold/10"></div>
                <div className="relative z-10">
                  <div className="bg-gold/10 w-16 h-16 rounded-full flex items-center justify-center mb-6 transition-all duration-300 group-hover:scale-110">
                    <Wrench className="text-gold w-7 h-7" />
                  </div>
                  <EditableTitle 
                    sectionKey="inspection_service_title"
                    defaultValue="Vehicle Inspection"
                    className="text-xl font-bold text-secondary-900 mb-4"
                    page="home"
                    section="services"
                  />
                  <EditableDescription 
                    sectionKey="inspection_service_description"
                    defaultValue="Comprehensive vehicle inspection and verification services"
                    className="text-secondary-600 mb-6"
                    page="home"
                    section="services"
                  />
                  <ul className="space-y-3 text-sm text-secondary-600 mb-6">
                    {t("services.inspection.features").split(',').map((feature: string, index: number) => (
                      <li key={index} className="flex items-start">
                        <BadgeCheck className="h-5 w-5 text-gold mt-0.5 mr-3 flex-shrink-0" />
                        <span>{feature.trim()}</span>
                      </li>
                    ))}
                  </ul>
                  <Link href="/services">
                    <Button className="w-full bg-gold text-white hover:bg-gold/90 shadow-md hover:shadow-lg transition-all duration-300 rounded-xl py-2.5">
                      <EditableButton 
                        sectionKey="inspection_service_button"
                        defaultValue="Book Inspection"
                        page="home"
                        section="services"
                      />
                      <ChevronRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </Card>
            </motion.div>
          </motion.div>
          
          <div className="mt-16 text-center">
            <Link href="/services">
              <Button className="bg-secondary-900 hover:bg-accent text-white px-8 py-3 rounded-xl font-medium shadow-lg hover:shadow-xl transition-all duration-300">
                View All Services
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-24 bg-gradient-to-b from-white to-gray-50 relative overflow-hidden">
        {/* Abstract background elements */}
        <div className="absolute top-40 left-0 w-64 h-64 bg-primary-light opacity-5 rounded-full filter blur-3xl"></div>
        <div className="absolute bottom-20 right-0 w-80 h-80 bg-accent opacity-5 rounded-full filter blur-3xl"></div>
        
        <div className="container mx-auto px-6 relative z-10">
          <div className="flex flex-col lg:flex-row gap-16 items-center">
            <div className="lg:w-1/2 order-2 lg:order-1">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
                className="space-y-6"
              >
                <Badge className="bg-primary-50 text-primary px-4 py-1.5 rounded-full font-medium text-sm inline-flex items-center">
                  <History className="h-4 w-4 mr-1.5" />
                  Our Journey
                </Badge>
                
                <EditableTitle 
                  sectionKey="about_section_title"
                  defaultValue="About AUTO ANI"
                  className="text-4xl md:text-5xl font-bold text-secondary-900 tracking-tight"
                  page="home"
                  section="about"
                  as="h3"
                />
                
                <div className="h-1 w-24 bg-gradient-to-r from-primary to-accent rounded-full"></div>
                
                <EditableDescription 
                  sectionKey="about_section_description1"
                  defaultValue="Founded in 2014 in Mitrovica, Kosovo, AUTO ANI has become the leading automotive import specialist in the region."
                  className="text-lg text-secondary-700 font-medium"
                  page="home"
                  section="about"
                />
                
                <EditableDescription 
                  sectionKey="about_section_description2"
                  defaultValue="We specialize in importing premium vehicles from Finland and Germany, offering complete transparency and professional service throughout the entire process."
                  className="text-secondary-600"
                  page="home"
                  section="about"
                />
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 my-10">
                  <motion.div 
                    className="group"
                    whileHover={{ y: -5, transition: { duration: 0.2 } }}
                  >
                    <div className="p-6 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 h-full">
                      <div className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary-light mb-1 tabular-nums">
                        <EditableText 
                          sectionKey="about_stats_experience_number"
                          defaultValue="10+"
                          className=""
                          page="home"
                          section="about"
                          as="span"
                        />
                      </div>
                      <div className="text-secondary-600 font-medium">
                        <EditableText 
                          sectionKey="about_stats_experience_label"
                          defaultValue="Years Experience"
                          className=""
                          page="home"
                          section="about"
                          as="span"
                        />
                      </div>
                    </div>
                  </motion.div>
                  
                  <motion.div 
                    className="group"
                    whileHover={{ y: -5, transition: { duration: 0.2 } }}
                  >
                    <div className="p-6 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 h-full">
                      <div className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-accent to-pink-500 mb-1 tabular-nums">
                        <EditableText 
                          sectionKey="about_stats_customers_number"
                          defaultValue="500+"
                          className=""
                          page="home"
                          section="about"
                          as="span"
                        />
                      </div>
                      <div className="text-secondary-600 font-medium">
                        <EditableText 
                          sectionKey="about_stats_customers_label"
                          defaultValue="Happy Customers"
                          className=""
                          page="home"
                          section="about"
                          as="span"
                        />
                      </div>
                    </div>
                  </motion.div>
                  
                  <motion.div 
                    className="group"
                    whileHover={{ y: -5, transition: { duration: 0.2 } }}
                  >
                    <div className="p-6 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 h-full">
                      <div className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-secondary-800 to-secondary-500 mb-1 tabular-nums">
                        <EditableText 
                          sectionKey="about_stats_imports_number"
                          defaultValue="100+"
                          className=""
                          page="home"
                          section="about"
                          as="span"
                        />
                      </div>
                      <div className="text-secondary-600 font-medium">
                        <EditableText 
                          sectionKey="about_stats_imports_label"
                          defaultValue="Successful Imports"
                          className=""
                          page="home"
                          section="about"
                          as="span"
                        />
                      </div>
                    </div>
                  </motion.div>
                  
                  <motion.div 
                    className="group"
                    whileHover={{ y: -5, transition: { duration: 0.2 } }}
                  >
                    <div className="p-6 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 h-full">
                      <div className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gold to-yellow-500 mb-1 tabular-nums">
                        <EditableText 
                          sectionKey="about_stats_brands_number"
                          defaultValue="6"
                          className=""
                          page="home"
                          section="about"
                          as="span"
                        />
                      </div>
                      <div className="text-secondary-600 font-medium">
                        <EditableText 
                          sectionKey="about_stats_brands_label"
                          defaultValue="Premium Brands"
                          className=""
                          page="home"
                          section="about"
                          as="span"
                        />
                      </div>
                    </div>
                  </motion.div>
                </div>
                
                <div className="flex flex-col sm:flex-row items-center gap-4 mt-6">
                  <a
                    href="https://www.instagram.com/aniautosallon/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-3.5 rounded-xl font-medium shadow-lg hover:shadow-xl hover:from-purple-700 hover:to-pink-700 transition-all duration-300 w-full sm:w-auto justify-center"
                  >
                    <Instagram className="h-5 w-5" />
                    {t("about.followUs")}
                  </a>
                  <Link href="/about" className="w-full sm:w-auto">
                    <Button className="bg-secondary-900 hover:bg-secondary-800 text-white px-8 py-3.5 rounded-xl font-medium shadow-lg hover:shadow-xl transition-all duration-300 w-full inline-flex items-center justify-center gap-2">
                      <EditableButton 
                        sectionKey="about_section_our_story_button"
                        defaultValue="Our Story"
                        page="home"
                        section="about"
                      />
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </motion.div>
            </div>
            
            <motion.div 
              className="lg:w-1/2 order-1 lg:order-2"
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <div className="relative">
                {/* Main image with parallax effect */}
                <div className="relative overflow-hidden rounded-2xl shadow-2xl">
                  <img 
                    src="https://images.unsplash.com/photo-1560472354-b33ff0c44a43?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600&q=80" 
                    alt="Modern automotive showroom interior" 
                    className="w-full h-[450px] object-cover hover:scale-105 transition-transform duration-700"
                  />
                  
                  {/* Gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-60"></div>
                </div>
                
                {/* Award badge */}
                <motion.div 
                  className="absolute -bottom-6 -right-6"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                  viewport={{ once: true }}
                >
                  <div className="bg-white rounded-xl p-4 shadow-lg border border-gray-100">
                    <div className="flex items-center space-x-3">
                      <div className="bg-blue-50 p-2.5 rounded-lg">
                        <Award className="h-6 w-6 text-blue-600" />
                      </div>
                      <div>
                        <div className="font-semibold text-secondary-900">Trusted Partner</div>
                        <div className="text-sm text-secondary-600">Licensed Dealer</div>
                      </div>
                    </div>
                  </div>
                </motion.div>
                
                {/* Experience badge */}
                <motion.div 
                  className="absolute -top-6 -left-6"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                  viewport={{ once: true }}
                >
                  <div className="bg-white rounded-xl p-4 shadow-lg border border-gray-100">
                    <div className="flex items-center space-x-3">
                      <div className="bg-emerald-50 p-2.5 rounded-lg">
                        <Star className="h-6 w-6 text-emerald-600" />
                      </div>
                      <div>
                        <div className="font-semibold text-secondary-900">Premium Quality</div>
                        <div className="text-sm text-secondary-600">Expert Selection</div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </div>
            </motion.div>
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
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <Badge className="bg-blue-100 text-blue-800 px-4 py-1.5 mb-4 rounded-full font-medium text-sm">
              <Facebook className="h-4 w-4 mr-2" />
              Latest from Facebook
            </Badge>
            <h2 className="text-3xl font-bold text-secondary-900 mb-4">Cars from Our Facebook Page</h2>
            <p className="text-lg text-secondary-600 max-w-2xl mx-auto">
              Check out the latest vehicles we've posted on our Facebook page with real photos and details.
            </p>
          </div>
          <ErrorBoundary>
            <FacebookCarList pageId="723238287294850" />
          </ErrorBoundary>
        </div>
      </section>

      {/* Instagram Cars Section */}
      <section className="container mx-auto px-4 py-10">
        <h2 className="text-2xl font-bold mb-6">Instagram Cars</h2>
        <InstagramCarList />
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
              <Card key={index} className="bg-white p-8 shadow-lg rounded-xl transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
                <div className="flex items-center mb-4">
                  <div className="flex text-amber-500">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 fill-current" />
                    ))}
                  </div>
                </div>
                <EditableDescription
                  sectionKey={`testimonial_${index}_text`}
                  defaultValue={testimonial.text}
                  className="text-gray-600 mb-6 italic"
                  page="home"
                  section="testimonials"
                />
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full mr-4 flex items-center justify-center text-white font-bold text-lg">
                    {testimonial.name.charAt(0)}
                  </div>
                  <div>
                    <EditableText
                      sectionKey={`testimonial_${index}_name`}
                      defaultValue={testimonial.name}
                      className="font-semibold text-gray-900"
                      page="home"
                      section="testimonials"
                    />
                    <EditableText
                      sectionKey={`testimonial_${index}_location`}
                      defaultValue={testimonial.location}
                      className="text-sm text-gray-500"
                      page="home"
                      section="testimonials"
                    />
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-24 bg-gradient-to-br from-white to-blue-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <EditableTitle
                sectionKey="contact_title"
                defaultValue="Get In Touch With Us"
                className="text-4xl md:text-5xl font-bold text-gray-900 mb-4"
                page="home"
                section="contact"
              />
              <EditableDescription
                sectionKey="contact_subtitle"
                defaultValue="We're here to answer any questions about our vehicles and services"
                className="text-lg text-gray-600 max-w-2xl mx-auto"
                page="home"
                section="contact"
              />
            </motion.div>
          </div>
          
          <div className="grid lg:grid-cols-2 gap-12 items-start">
            {/* Contact Information */}
            <motion.div
              className="bg-white p-8 rounded-2xl shadow-xl"
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <div className="mb-10">
                <EditableTitle
                  sectionKey="contact_info_title"
                  defaultValue="Contact Information"
                  className="text-2xl font-bold text-gray-900 mb-6"
                  page="home"
                  section="contact"
                />
              
                <div className="space-y-6">
                  <div className="flex items-start">
                    <div className="bg-blue-50 p-3 rounded-lg mr-4">
                      <PhoneCall className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <div className="text-sm text-gray-500 mb-1">Call Us</div>
                      <EditableText
                        sectionKey="contact_phone"
                        defaultValue="+355 69 123 4567"
                        className="font-medium text-gray-900"
                        page="home"
                        section="contact"
                      />
                      <p className="text-sm text-gray-500 mt-1">Mon-Fri from 9am to 6pm</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="bg-blue-50 p-3 rounded-lg mr-4">
                      <Mail className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <div className="text-sm text-gray-500 mb-1">Email Us</div>
                      <EditableText
                        sectionKey="contact_email"
                        defaultValue="info@aniautosallon.com"
                        className="font-medium text-gray-900"
                        page="home"
                        section="contact"
                      />
                      <p className="text-sm text-gray-500 mt-1">We'll respond as soon as possible</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="bg-blue-50 p-3 rounded-lg mr-4">
                      <MapPin className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <div className="text-sm text-gray-500 mb-1">Visit Our Dealership</div>
                      <EditableText
                        sectionKey="contact_address"
                        defaultValue="Rruga Nacionale Prishtinë, Fushë Kosovë, Kosovo"
                        className="font-medium text-gray-900"
                        page="home"
                        section="contact"
                      />
                      <p className="text-sm text-gray-500 mt-1">Convenient location with parking</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="bg-blue-50 p-3 rounded-lg mr-4">
                      <Clock className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <div className="text-sm text-gray-500 mb-1">Business Hours</div>
                      <EditableText
                        sectionKey="contact_hours_weekdays"
                        defaultValue="Monday - Friday: 9:00 AM - 6:00 PM"
                        className="font-medium text-gray-900"
                        page="home"
                        section="contact"
                      />
                      <EditableText
                        sectionKey="contact_hours_weekend"
                        defaultValue="Saturday: 10:00 AM - 4:00 PM"
                        className="font-medium text-gray-900"
                        page="home"
                        section="contact"
                      />
                      <p className="text-sm text-gray-500 mt-1">Closed on Sundays</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="pt-6 border-t border-gray-200">
                <EditableTitle
                  sectionKey="social_title"
                  defaultValue="Follow Us"
                  className="text-xl font-bold text-gray-900 mb-4"
                  page="home"
                  section="contact"
                />
                <div className="flex space-x-4">
                  <a 
                    href="#" 
                    className="bg-blue-600 text-white p-3 rounded-full hover:bg-blue-700 transition-colors duration-300"
                    aria-label="Facebook"
                  >
                    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M22 12.061c0-5.523-4.477-10-10-10s-10 4.477-10 10c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54v-2.891h2.54V9.861c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562v1.873h2.773l-.443 2.891h-2.33v6.987C18.343 21.189 22 17.052 22 12.061z" />
                    </svg>
                  </a>
                  <a 
                    href="https://www.instagram.com/aniautosallon/" 
                    className="bg-gradient-to-r from-purple-600 to-pink-600 text-white p-3 rounded-full hover:from-purple-700 hover:to-pink-700 transition-colors duration-300"
                    aria-label="Instagram"
                  >
                    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                    </svg>
                  </a>
                  <a 
                    href="#" 
                    className="bg-sky-500 text-white p-3 rounded-full hover:bg-sky-600 transition-colors duration-300"
                    aria-label="Twitter"
                  >
                    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723 10.04 10.04 0 01-3.127 1.184 4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
                    </svg>
                  </a>
                </div>
              </div>
            </motion.div>
            
            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <div className="bg-white p-8 rounded-2xl shadow-xl">
                <EditableTitle
                  sectionKey="contact_form_title"
                  defaultValue="Send Us a Message"
                  className="text-2xl font-bold text-gray-900 mb-6"
                  page="home"
                  section="contact"
                />
                
                <form className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                      <input 
                        type="text" 
                        id="name" 
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200" 
                        placeholder="Your name"
                      />
                    </div>
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                      <input 
                        type="email" 
                        id="email" 
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200" 
                        placeholder="your.email@example.com"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                    <input 
                      type="tel" 
                      id="phone" 
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200" 
                      placeholder="+355 69 XXX XXXX"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
                    <select 
                      id="subject" 
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                    >
                      <option value="">Select a subject</option>
                      <option value="vehicle-inquiry">Vehicle Inquiry</option>
                      <option value="test-drive">Request a Test Drive</option>
                      <option value="financing">Financing Options</option>
                      <option value="service">Service Appointment</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  
                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                    <textarea 
                      id="message" 
                      rows={4} 
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200" 
                      placeholder="How can we help you today?"
                    ></textarea>
                  </div>
                  
                  <div className="pt-2">
                    <button 
                      type="submit" 
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3.5 px-6 rounded-lg shadow-lg hover:shadow-xl transition duration-300 flex items-center justify-center"
                    >
                      <EditableButton
                        sectionKey="contact_form_button"
                        defaultValue="Send Message"
                        page="home"
                        section="contact"
                      />
                      <ChevronRight className="h-5 w-5 ml-1" />
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          </div>
          
          {/* Map */}
          <motion.div 
            className="mt-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <div className="bg-white p-2 rounded-2xl shadow-xl overflow-hidden">
              <iframe 
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2934.586022367713!2d21.169766770761665!3d42.64969658117709!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x13549e8d5d607f25%3A0xa31728a9b5581854!2sRruga%20Nacionale%20Prishtin%C3%AB%2C%20Fush%C3%AB%20Kosov%C3%AB!5e0!3m2!1sen!2s!4v1683544268266!5m2!1sen!2s" 
                width="100%" 
                height="450" 
                style={{ border: 0 }} 
                allowFullScreen={true} 
                loading="lazy" 
                referrerPolicy="no-referrer-when-downgrade"
                title="Auto Ani Location"
                className="rounded-xl"
              ></iframe>
            </div>
          </motion.div>
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
