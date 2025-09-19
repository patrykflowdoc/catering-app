import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertOrderSchema, type Order } from "@shared/schema";
import { z } from "zod";

// Webhook configuration
const WEBHOOK_URL = "https://n8n.flowdoc.pl/webhook/25d0ed48-aef7-489c-98ac-dd3de3ad14e9";

// Function to send order data to n8n webhook
async function sendOrderToWebhook(order: Order): Promise<void> {
  try {
    console.log(`[WEBHOOK] Sending order ${order.id} to webhook...`);
    
    const response = await fetch(WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(order),
    });

    if (response.ok) {
      console.log(`[WEBHOOK] Successfully sent order ${order.id} to webhook (Status: ${response.status})`);
    } else {
      console.error(`[WEBHOOK] Failed to send order ${order.id} to webhook (Status: ${response.status})`);
    }
  } catch (error) {
    console.error(`[WEBHOOK] Error sending order ${order.id} to webhook:`, error);
  }
}

export async function registerRoutes(app: Express): Promise<Server> {
  // Create order endpoint
  app.post("/api/orders", async (req, res) => {
    try {
      const validatedData = insertOrderSchema.parse(req.body);
      console.log(`[ORDER] Creating new order...`);
      
      // Save order to storage first
      const order = await storage.createOrder(validatedData);
      console.log(`[ORDER] Order ${order.id} created successfully in storage`);
      
      // Send order to webhook (non-blocking - don't fail order creation if webhook fails)
      sendOrderToWebhook(order).catch((error) => {
        console.error(`[WEBHOOK] Failed to send order ${order.id} to webhook (async):`, error);
      });
      
      // Return successful response regardless of webhook status
      res.status(201).json(order);
    } catch (error) {
      if (error instanceof z.ZodError) {
        console.error(`[ORDER] Validation failed:`, error.errors);
        res.status(400).json({ 
          message: "Validation failed", 
          errors: error.errors 
        });
      } else {
        console.error(`[ORDER] Internal server error:`, error);
        res.status(500).json({ 
          message: "Internal server error" 
        });
      }
    }
  });

  // Get all orders endpoint
  app.get("/api/orders", async (req, res) => {
    try {
      const orders = await storage.getAllOrders();
      res.json(orders);
    } catch (error) {
      res.status(500).json({ 
        message: "Internal server error" 
      });
    }
  });

  // Get order by ID endpoint
  app.get("/api/orders/:id", async (req, res) => {
    try {
      const order = await storage.getOrder(req.params.id);
      if (!order) {
        res.status(404).json({ 
          message: "Order not found" 
        });
        return;
      }
      res.json(order);
    } catch (error) {
      res.status(500).json({ 
        message: "Internal server error" 
      });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
