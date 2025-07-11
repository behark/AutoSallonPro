import express, { type Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import {
  insertCustomOrderSchema,
  insertContactMessageSchema,
  insertVehicleSchema,
} from "@shared/schema";
import { insertContentSectionSchema } from "@shared/content-schema";
import { facebookService } from "./facebook";
import { z } from "zod";
import multer from "multer";
import path from "path";
import fs from "fs";

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(process.cwd(), "public", "uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configure multer for file uploads
const storage_multer = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    // Generate unique filename with timestamp
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(
      null,
      file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname),
    );
  },
});

const upload = multer({
  storage: storage_multer,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    // Only allow image files
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Only image files are allowed!"));
    }
  },
});

export async function registerRoutes(app: Express): Promise<Server> {
  // Vehicle routes
  app.get("/api/vehicles", async (req, res) => {
    try {
      const vehicles = await storage.getVehicles();
      res.json(vehicles);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch vehicles" });
    }
  });

  app.get("/api/vehicles/featured", async (req, res) => {
    try {
      const vehicles = await storage.getFeaturedVehicles();
      res.json(vehicles);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch featured vehicles" });
    }
  });

  app.get("/api/vehicles/available", async (req, res) => {
    try {
      const vehicles = await storage.getAvailableVehicles();
      res.json(vehicles);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch available vehicles" });
    }
  });

  app.get("/api/vehicles/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const vehicle = await storage.getVehicle(id);
      if (!vehicle) {
        return res.status(404).json({ message: "Vehicle not found" });
      }
      res.json(vehicle);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch vehicle" });
    }
  });

  // Vehicle management routes for admin
  app.post("/api/vehicles", async (req, res) => {
    try {
      const vehicleData = insertVehicleSchema.parse(req.body);
      const vehicle = await storage.createVehicle(vehicleData);
      res.status(201).json(vehicle);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res
          .status(400)
          .json({ message: "Invalid vehicle data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create vehicle" });
    }
  });

  app.put("/api/vehicles/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const vehicleData = insertVehicleSchema.partial().parse(req.body);
      const vehicle = await storage.updateVehicle(id, vehicleData);
      if (!vehicle) {
        return res.status(404).json({ message: "Vehicle not found" });
      }
      res.json(vehicle);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res
          .status(400)
          .json({ message: "Invalid vehicle data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to update vehicle" });
    }
  });

  app.delete("/api/vehicles/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const deleted = await storage.deleteVehicle(id);
      if (!deleted) {
        return res.status(404).json({ message: "Vehicle not found" });
      }
      res.json({ message: "Vehicle deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Failed to delete vehicle" });
    }
  });

  // File upload route
  app.post("/api/upload", upload.array("images", 10), (req, res) => {
    try {
      const files = req.files as Express.Multer.File[];
      if (!files || files.length === 0) {
        return res.status(400).json({ message: "No files uploaded" });
      }

      const fileUrls = files.map((file) => `/uploads/${file.filename}`);
      res.json({ urls: fileUrls });
    } catch (error) {
      console.error("Upload error:", error);
      res.status(500).json({ message: "Failed to upload images" });
    }
  });

  // Custom order routes
  app.post("/api/custom-orders", async (req, res) => {
    try {
      const orderData = insertCustomOrderSchema.parse(req.body);
      const order = await storage.createCustomOrder(orderData);
      res.status(201).json(order);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res
          .status(400)
          .json({ message: "Invalid order data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create custom order" });
    }
  });

  app.get("/api/custom-orders", async (req, res) => {
    try {
      const orders = await storage.getCustomOrders();
      res.json(orders);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch custom orders" });
    }
  });

  app.get("/api/custom-orders/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const order = await storage.getCustomOrder(id);
      if (!order) {
        return res.status(404).json({ message: "Custom order not found" });
      }
      res.json(order);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch custom order" });
    }
  });

  // Contact message routes
  app.post("/api/contact", async (req, res) => {
    try {
      const messageData = insertContactMessageSchema.parse(req.body);
      const message = await storage.createContactMessage(messageData);
      res.status(201).json(message);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res
          .status(400)
          .json({ message: "Invalid message data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to send message" });
    }
  });

  app.get("/api/contact-messages", async (req, res) => {
    try {
      const messages = await storage.getContactMessages();
      res.json(messages);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch messages" });
    }
  });

  // Content Management API routes
  app.get("/api/content", async (req, res) => {
    try {
      const page = req.query.page as string;
      if (page) {
        const content = await storage.getContentByPage(page);
        res.json(content);
      } else {
        const content = await storage.getContentSections();
        res.json(content);
      }
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch content" });
    }
  });

  app.get("/api/content/:sectionKey", async (req, res) => {
    try {
      const sectionKey = req.params.sectionKey;
      const content = await storage.getContentByKey(sectionKey);
      if (!content) {
        return res.status(404).json({ message: "Content section not found" });
      }
      res.json(content);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch content section" });
    }
  });

  app.post("/api/content", async (req, res) => {
    try {
      const contentData = insertContentSectionSchema.parse(req.body);
      const content = await storage.createContentSection(contentData);
      res.status(201).json(content);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res
          .status(400)
          .json({ message: "Invalid content data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create content section" });
    }
  });

  app.put("/api/content/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const contentData = insertContentSectionSchema.partial().parse(req.body);
      const content = await storage.updateContentSection(id, contentData);
      if (!content) {
        return res.status(404).json({ message: "Content section not found" });
      }
      res.json(content);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res
          .status(400)
          .json({ message: "Invalid content data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to update content section" });
    }
  });

  app.delete("/api/content/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const deleted = await storage.deleteContentSection(id);
      if (!deleted) {
        return res.status(404).json({ message: "Content section not found" });
      }
      res.json({ message: "Content section deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Failed to delete content section" });
    }
  });

  // Facebook/Instagram API routes
  app.get("/api/facebook/page-info", async (req, res) => {
    try {
      const pageInfo = await facebookService.getPageDetails();
      res.json(pageInfo);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch page info" });
    }
  });

  // Debug endpoint to test Facebook API access
  app.get("/api/facebook/debug", async (req, res) => {
    try {
      const accessToken = process.env.FACEBOOK_ACCESS_TOKEN;
      if (!accessToken) {
        return res.json({ error: "No access token found" });
      }

      // Test basic API access
      const response = await fetch(
        `https://graph.facebook.com/v18.0/me?access_token=${accessToken}`,
      );
      const data = await response.json();

      if (response.ok) {
        res.json({
          success: true,
          userInfo: data,
          message: "Token is valid for user access",
        });
      } else {
        res.json({
          success: false,
          error: data,
          message: "Token validation failed",
        });
      }
    } catch (error) {
      res.status(500).json({
        error: "Debug test failed",
        details: (error as Error).message,
      });
    }
  });

  app.get("/api/facebook/posts", async (req, res) => {
    try {
      const limit = parseInt(req.query.limit as string) || 10;
      const posts = await facebookService.getRecentPosts(limit);
      res.json(posts);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch posts" });
    }
  });

  app.get("/api/instagram/posts", async (req, res) => {
    try {
      const limit = parseInt(req.query.limit as string) || 10;
      const posts = await facebookService.getInstagramPosts(limit);
      res.json(posts);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch Instagram posts" });
    }
  });

  app.get("/api/facebook/reviews", async (req, res) => {
    try {
      const limit = parseInt(req.query.limit as string) || 5;
      const reviews = await facebookService.getPageReviews(limit);
      res.json(reviews);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch reviews" });
    }
  });

  // Serve static files from public directory
  app.use(express.static("public"));

  // Direct download route for the logo
  app.get("/download-logo", (req, res) => {
    const path = require("path");
    const iconPath = path.resolve(
      "public/autoani_app_icon_transparent_1024x1024.png",
    );
    res.download(iconPath, "autoani_app_icon_transparent_1024x1024.png");
  });

  const httpServer = createServer(app);
  return httpServer;
}
