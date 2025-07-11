import { vehicles, customOrders, contactMessages, type Vehicle, type InsertVehicle, type CustomOrder, type InsertCustomOrder, type ContactMessage, type InsertContactMessage } from "@shared/schema";
import { contentSections, type ContentSection, type InsertContentSection } from "@shared/content-schema";
import { db } from "./db";
import { eq } from "drizzle-orm";

export interface IStorage {
  // Vehicle methods
  getVehicles(): Promise<Vehicle[]>;
  getVehicle(id: number): Promise<Vehicle | undefined>;
  getFeaturedVehicles(): Promise<Vehicle[]>;
  getAvailableVehicles(): Promise<Vehicle[]>;
  createVehicle(vehicle: InsertVehicle): Promise<Vehicle>;
  updateVehicle(id: number, vehicle: Partial<InsertVehicle>): Promise<Vehicle | undefined>;
  deleteVehicle(id: number): Promise<boolean>;

  // Custom order methods
  getCustomOrders(): Promise<CustomOrder[]>;
  getCustomOrder(id: number): Promise<CustomOrder | undefined>;
  createCustomOrder(order: InsertCustomOrder): Promise<CustomOrder>;
  updateCustomOrderStatus(id: number, status: string): Promise<CustomOrder | undefined>;

  // Contact message methods
  getContactMessages(): Promise<ContactMessage[]>;
  getContactMessage(id: number): Promise<ContactMessage | undefined>;
  createContactMessage(message: InsertContactMessage): Promise<ContactMessage>;
  markMessageAsRead(id: number): Promise<ContactMessage | undefined>;

  // Content management methods
  getContentSections(): Promise<ContentSection[]>;
  getContentByPage(page: string): Promise<ContentSection[]>;
  getContentByKey(sectionKey: string): Promise<ContentSection | undefined>;
  createContentSection(content: InsertContentSection): Promise<ContentSection>;
  updateContentSection(id: number, content: Partial<InsertContentSection>): Promise<ContentSection | undefined>;
  deleteContentSection(id: number): Promise<boolean>;
}

export class MemStorage implements IStorage {
  private vehicles: Map<number, Vehicle>;
  private customOrders: Map<number, CustomOrder>;
  private contactMessages: Map<number, ContactMessage>;
  private contentSections: Map<number, ContentSection>;
  private currentVehicleId: number;
  private currentOrderId: number;
  private currentMessageId: number;
  private currentContentId: number;

  constructor() {
    this.vehicles = new Map();
    this.customOrders = new Map();
    this.contactMessages = new Map();
    this.contentSections = new Map();
    this.currentVehicleId = 1;
    this.currentOrderId = 1;
    this.currentMessageId = 1;
    this.currentContentId = 1;
    this.initializeSampleData();
    this.initializeContentSections();
  }

  private initializeSampleData() {
    // Real vehicles from AUTO ANI Facebook page
    const sampleVehicles: InsertVehicle[] = [
      {
        brand: "Volkswagen",
        model: "Tiguan Comfortline",
        year: 2019,
        price: 24900,
        mileage: 150000,
        fuelType: "Diesel",
        transmission: "DSG Automatic",
        engine: "2.0 DSG 150ps",
        images: [
          "https://images.unsplash.com/photo-1565043589221-1a6fd9ae45c7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600"
        ],
        description: "VW Tiguan Comfortline 2019, 2.0 Dsg 150ps, 150xxx Km, 1 pronar, Serviset në VW. Digital i modelit të ri, Lane Assist- Front Assist, Uled automat, Like me menne. Dy çelësa, webasto. Gepeku Elektronik / Hapje me çmendë. Hapje, Mbëje pa çeles. Kuke Elektronike. 049204242",
        features: ["Digital Cockpit", "Lane Assist", "Front Assist", "LED Auto Headlights", "Webasto Heating", "Electronic Trunk", "Keyless Entry", "Electronic Towbar"],
        importCountry: "Germany",
        isAvailable: true,
        isFeatured: true,
      }
    ];

    sampleVehicles.forEach(vehicle => {
      this.createVehicle(vehicle);
    });
  }

  // Vehicle methods
  async getVehicles(): Promise<Vehicle[]> {
    return Array.from(this.vehicles.values());
  }

  async getVehicle(id: number): Promise<Vehicle | undefined> {
    return this.vehicles.get(id);
  }

  async getFeaturedVehicles(): Promise<Vehicle[]> {
    return Array.from(this.vehicles.values()).filter(v => v.isFeatured);
  }

  async getAvailableVehicles(): Promise<Vehicle[]> {
    return Array.from(this.vehicles.values()).filter(v => v.isAvailable);
  }

  async createVehicle(insertVehicle: InsertVehicle): Promise<Vehicle> {
    const id = this.currentVehicleId++;
    const vehicle: Vehicle = {
      ...insertVehicle,
      id,
      description: insertVehicle.description || null,
      images: Array.isArray(insertVehicle.images) ? insertVehicle.images : [],
      features: Array.isArray(insertVehicle.features) ? insertVehicle.features : [],
      isAvailable: insertVehicle.isAvailable !== undefined ? insertVehicle.isAvailable : true,
      isFeatured: insertVehicle.isFeatured !== undefined ? insertVehicle.isFeatured : false,
      createdAt: new Date(),
    };
    this.vehicles.set(id, vehicle);
    return vehicle;
  }

  async updateVehicle(id: number, updateData: Partial<InsertVehicle>): Promise<Vehicle | undefined> {
    const vehicle = this.vehicles.get(id);
    if (!vehicle) return undefined;

    const updatedVehicle: Vehicle = { 
      ...vehicle, 
      ...updateData,
      images: Array.isArray(updateData.images) ? updateData.images : vehicle.images,
      features: Array.isArray(updateData.features) ? updateData.features : vehicle.features,
    };
    this.vehicles.set(id, updatedVehicle);
    return updatedVehicle;
  }

  async deleteVehicle(id: number): Promise<boolean> {
    return this.vehicles.delete(id);
  }

  // Custom order methods
  async getCustomOrders(): Promise<CustomOrder[]> {
    return Array.from(this.customOrders.values());
  }

  async getCustomOrder(id: number): Promise<CustomOrder | undefined> {
    return this.customOrders.get(id);
  }

  async createCustomOrder(insertOrder: InsertCustomOrder): Promise<CustomOrder> {
    const id = this.currentOrderId++;
    const order: CustomOrder = {
      id,
      firstName: insertOrder.firstName,
      lastName: insertOrder.lastName,
      email: insertOrder.email,
      phone: insertOrder.phone || null,
      preferredBrand: insertOrder.preferredBrand || null,
      preferredModel: insertOrder.preferredModel || null,
      maxBudget: insertOrder.maxBudget || null,
      minYear: insertOrder.minYear || null,
      maxMileage: insertOrder.maxMileage || null,
      fuelType: insertOrder.fuelType || null,
      transmission: insertOrder.transmission || null,
      additionalRequirements: insertOrder.additionalRequirements || null,
      status: "pending",
      createdAt: new Date(),
    };
    this.customOrders.set(id, order);
    return order;
  }

  async updateCustomOrderStatus(id: number, status: string): Promise<CustomOrder | undefined> {
    const order = this.customOrders.get(id);
    if (!order) return undefined;

    const updatedOrder = { ...order, status };
    this.customOrders.set(id, updatedOrder);
    return updatedOrder;
  }

  // Contact message methods
  async getContactMessages(): Promise<ContactMessage[]> {
    return Array.from(this.contactMessages.values());
  }

  async getContactMessage(id: number): Promise<ContactMessage | undefined> {
    return this.contactMessages.get(id);
  }

  async createContactMessage(insertMessage: InsertContactMessage): Promise<ContactMessage> {
    const id = this.currentMessageId++;
    const message: ContactMessage = {
      ...insertMessage,
      id,
      phone: insertMessage.phone || null,
      serviceInterest: insertMessage.serviceInterest || null,
      isRead: false,
      createdAt: new Date(),
    };
    this.contactMessages.set(id, message);
    return message;
  }

  async markMessageAsRead(id: number): Promise<ContactMessage | undefined> {
    const message = this.contactMessages.get(id);
    if (!message) return undefined;

    const updatedMessage = { ...message, isRead: true };
    this.contactMessages.set(id, updatedMessage);
    return updatedMessage;
  }

  private initializeContentSections() {
    const defaultContent = [
      {
        sectionKey: "hero_title",
        title: "Hero Section Title",
        content: "Find Your Perfect Vehicle at AUTO ANI",
        contentType: "text",
        page: "home",
        category: "hero",
        isActive: true
      },
      {
        sectionKey: "hero_subtitle",
        title: "Hero Section Subtitle", 
        content: "Premium used cars imported from Finland and Germany with guaranteed quality and competitive prices.",
        contentType: "text",
        page: "home",
        category: "hero",
        isActive: true
      },
      {
        sectionKey: "about_title",
        title: "About Section Title",
        content: "About AUTO ANI",
        contentType: "text",
        page: "about",
        category: "intro",
        isActive: true
      },
      {
        sectionKey: "about_description",
        title: "About Description",
        content: "AUTO ANI is your trusted partner for premium used vehicles imported from Finland and Germany. Located in Mitrovica, Kosovo, we specialize in providing high-quality cars with complete documentation and service history.",
        contentType: "text",
        page: "about",
        category: "intro",
        isActive: true
      },
      {
        sectionKey: "contact_phone",
        title: "Contact Phone",
        content: "049 204 242",
        contentType: "text",
        page: "contact",
        category: "info",
        isActive: true
      },
      {
        sectionKey: "contact_email",
        title: "Contact Email",
        content: "aniautosallon@gmail.com",
        contentType: "text",
        page: "contact",
        category: "info",
        isActive: true
      },
      {
        sectionKey: "business_address",
        title: "Business Address",
        content: "Mitrovica, Kosovo",
        contentType: "text",
        page: "contact",
        category: "info",
        isActive: true
      }
    ];

    defaultContent.forEach(content => {
      this.createContentSection(content);
    });
  }

  // Content management methods
  async getContentSections(): Promise<ContentSection[]> {
    return Array.from(this.contentSections.values());
  }

  async getContentByPage(page: string): Promise<ContentSection[]> {
    return Array.from(this.contentSections.values()).filter(c => c.page === page);
  }

  async getContentByKey(sectionKey: string): Promise<ContentSection | undefined> {
    return Array.from(this.contentSections.values()).find(c => c.sectionKey === sectionKey);
  }

  async createContentSection(insertContent: InsertContentSection): Promise<ContentSection> {
    const id = this.currentContentId++;
    const content: ContentSection = {
      ...insertContent,
      id,
      contentType: insertContent.contentType || "text",
      isActive: insertContent.isActive !== undefined ? insertContent.isActive : true,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.contentSections.set(id, content);
    return content;
  }

  async updateContentSection(id: number, updateData: Partial<InsertContentSection>): Promise<ContentSection | undefined> {
    const content = this.contentSections.get(id);
    if (!content) return undefined;

    const updatedContent = { 
      ...content, 
      ...updateData, 
      updatedAt: new Date() 
    };
    this.contentSections.set(id, updatedContent);
    return updatedContent;
  }

  async deleteContentSection(id: number): Promise<boolean> {
    return this.contentSections.delete(id);
  }
}

export class DatabaseStorage implements IStorage {
  async getVehicles(): Promise<Vehicle[]> {
    return await db.select().from(vehicles);
  }

  async getVehicle(id: number): Promise<Vehicle | undefined> {
    const [vehicle] = await db.select().from(vehicles).where(eq(vehicles.id, id));
    return vehicle || undefined;
  }

  async getFeaturedVehicles(): Promise<Vehicle[]> {
    return await db.select().from(vehicles).where(eq(vehicles.isFeatured, true));
  }

  async getAvailableVehicles(): Promise<Vehicle[]> {
    return await db.select().from(vehicles).where(eq(vehicles.isAvailable, true));
  }

  async createVehicle(insertVehicle: InsertVehicle): Promise<Vehicle> {
    const [vehicle] = await db
      .insert(vehicles)
      .values(insertVehicle)
      .returning();
    return vehicle;
  }

  async updateVehicle(id: number, updateData: Partial<InsertVehicle>): Promise<Vehicle | undefined> {
    const [vehicle] = await db
      .update(vehicles)
      .set(updateData)
      .where(eq(vehicles.id, id))
      .returning();
    return vehicle || undefined;
  }

  async deleteVehicle(id: number): Promise<boolean> {
    const result = await db.delete(vehicles).where(eq(vehicles.id, id));
    return result.rowCount ? result.rowCount > 0 : false;
  }

  async getCustomOrders(): Promise<CustomOrder[]> {
    return await db.select().from(customOrders);
  }

  async getCustomOrder(id: number): Promise<CustomOrder | undefined> {
    const [order] = await db.select().from(customOrders).where(eq(customOrders.id, id));
    return order || undefined;
  }

  async createCustomOrder(insertOrder: InsertCustomOrder): Promise<CustomOrder> {
    const [order] = await db
      .insert(customOrders)
      .values(insertOrder)
      .returning();
    return order;
  }

  async updateCustomOrderStatus(id: number, status: string): Promise<CustomOrder | undefined> {
    const [order] = await db
      .update(customOrders)
      .set({ status })
      .where(eq(customOrders.id, id))
      .returning();
    return order || undefined;
  }

  async getContactMessages(): Promise<ContactMessage[]> {
    return await db.select().from(contactMessages);
  }

  async getContactMessage(id: number): Promise<ContactMessage | undefined> {
    const [message] = await db.select().from(contactMessages).where(eq(contactMessages.id, id));
    return message || undefined;
  }

  async createContactMessage(insertMessage: InsertContactMessage): Promise<ContactMessage> {
    const [message] = await db
      .insert(contactMessages)
      .values(insertMessage)
      .returning();
    return message;
  }

  async markMessageAsRead(id: number): Promise<ContactMessage | undefined> {
    const [message] = await db
      .update(contactMessages)
      .set({ isRead: true })
      .where(eq(contactMessages.id, id))
      .returning();
    return message || undefined;
  }

  // Content management methods for database
  async getContentSections(): Promise<ContentSection[]> {
    return await db.select().from(contentSections);
  }

  async getContentByPage(page: string): Promise<ContentSection[]> {
    return await db.select().from(contentSections).where(eq(contentSections.page, page));
  }

  async getContentByKey(sectionKey: string): Promise<ContentSection | undefined> {
    const [content] = await db.select().from(contentSections).where(eq(contentSections.sectionKey, sectionKey));
    return content || undefined;
  }

  async createContentSection(insertContent: InsertContentSection): Promise<ContentSection> {
    const [content] = await db
      .insert(contentSections)
      .values(insertContent)
      .returning();
    return content;
  }

  async updateContentSection(id: number, updateData: Partial<InsertContentSection>): Promise<ContentSection | undefined> {
    const [content] = await db
      .update(contentSections)
      .set({ ...updateData, updatedAt: new Date() })
      .where(eq(contentSections.id, id))
      .returning();
    return content || undefined;
  }

  async deleteContentSection(id: number): Promise<boolean> {
    const result = await db.delete(contentSections).where(eq(contentSections.id, id));
    return result.rowCount ? result.rowCount > 0 : false;
  }
}

export const storage = new MemStorage();
