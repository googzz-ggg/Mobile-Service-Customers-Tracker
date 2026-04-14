#!/usr/bin/env node

import { drizzle } from "drizzle-orm/mysql2";
import { repairJobs, repairStages, messages, feedback } from "../drizzle/schema.ts";
import { nanoid } from "nanoid";
import * as dotenv from "dotenv";

dotenv.config();

const db = drizzle(process.env.DATABASE_URL || "");

const REPAIR_STAGES = ["Received", "Diagnosing", "Repairing", "Quality Check", "Ready for Pickup"];

async function createTestRepairs() {
  console.log("🔧 Creating test repair jobs...\n");

  const testRepairs = [
    {
      customerName: "Ahmed Goda",
      customerEmail: "ahmed@example.com",
      customerPhone: "+201001234567",
      deviceType: "iPhone 14 Pro",
      issueDescription: "Cracked screen and battery not charging",
      estimatedCompletionDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
      currentStage: "Diagnosing",
      costEstimate: "450.00",
    },
    {
      customerName: "Fatima Hassan",
      customerEmail: "fatima@example.com",
      customerPhone: "+201101234567",
      deviceType: "Samsung Galaxy S23",
      issueDescription: "Water damage, phone won't turn on",
      estimatedCompletionDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
      currentStage: "Repairing",
      costEstimate: "650.00",
    },
    {
      customerName: "Mohammed Ali",
      customerEmail: "mohammed@example.com",
      customerPhone: "+201201234567",
      deviceType: "iPad Air",
      issueDescription: "Screen flickering and touch issues",
      estimatedCompletionDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
      currentStage: "Quality Check",
      costEstimate: "550.00",
    },
    {
      customerName: "Layla Ibrahim",
      customerEmail: "layla@example.com",
      customerPhone: "+201301234567",
      deviceType: "MacBook Pro 14",
      issueDescription: "Keyboard not working, needs replacement",
      estimatedCompletionDate: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000),
      currentStage: "Received",
      costEstimate: "1200.00",
    },
    {
      customerName: "Omar Khaled",
      customerEmail: "omar@example.com",
      customerPhone: "+201401234567",
      deviceType: "Google Pixel 7",
      issueDescription: "Camera not focusing, software issue",
      estimatedCompletionDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
      currentStage: "Ready for Pickup",
      costEstimate: "350.00",
    },
  ];

  const createdRepairs = [];

  for (const repair of testRepairs) {
    const trackingCode = `TRACK-${Date.now()}-${nanoid(6).toUpperCase()}`;
    const trackingLink = `/track/${trackingCode}`;

    try {
      const result = await db.insert(repairJobs).values({
        trackingCode,
        trackingLink,
        customerName: repair.customerName,
        customerEmail: repair.customerEmail,
        customerPhone: repair.customerPhone,
        deviceType: repair.deviceType,
        issueDescription: repair.issueDescription,
        estimatedCompletionDate: repair.estimatedCompletionDate,
        currentStage: repair.currentStage,
        costEstimate: repair.costEstimate,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      console.log(`✅ Created repair for ${repair.customerName}`);
      console.log(`   Tracking Code: ${trackingCode}`);
      console.log(`   Device: ${repair.deviceType}`);
      console.log(`   Status: ${repair.currentStage}`);
      console.log(`   Cost: EGP ${repair.costEstimate}\n`);

      createdRepairs.push({
        trackingCode,
        customerName: repair.customerName,
        customerEmail: repair.customerEmail,
        deviceType: repair.deviceType,
        currentStage: repair.currentStage,
      });

      // Create sample repair stages
      const jobId = result.insertId;
      for (let i = 0; i < REPAIR_STAGES.indexOf(repair.currentStage) + 1; i++) {
        await db.insert(repairStages).values({
          jobId,
          stage: REPAIR_STAGES[i],
          completedAt: i < REPAIR_STAGES.indexOf(repair.currentStage) ? new Date() : null,
          technicianNotes: `Stage ${i + 1} completed. Device is in ${REPAIR_STAGES[i]} phase.`,
          createdAt: new Date(),
        });
      }

      // Add sample message if in later stages
      if (REPAIR_STAGES.indexOf(repair.currentStage) >= 1) {
        await db.insert(messages).values({
          jobId,
          senderType: "technician",
          senderName: "Moga Technician",
          message: `Hello ${repair.customerName}, we've started working on your ${repair.deviceType}. We'll keep you updated on the progress.`,
          createdAt: new Date(),
        });
      }

      // Add sample feedback if completed
      if (repair.currentStage === "Ready for Pickup") {
        await db.insert(feedback).values({
          jobId,
          rating: 5,
          serviceSpeedRating: 5,
          staffBehaviorRating: 5,
          repairQualityRating: 5,
          comment: "Excellent service! Very professional and quick. Highly recommended!",
          createdAt: new Date(),
        });
      }
    } catch (error) {
      console.error(`❌ Error creating repair for ${repair.customerName}:`, error.message);
    }
  }

  console.log("\n" + "=".repeat(70));
  console.log("📋 TEST REPAIR JOBS CREATED SUCCESSFULLY!");
  console.log("=".repeat(70) + "\n");

  console.log("🔗 TRACKING CODES FOR TESTING:\n");
  createdRepairs.forEach((repair, index) => {
    console.log(`${index + 1}. ${repair.customerName} (${repair.deviceType})`);
    console.log(`   Tracking Code: ${repair.trackingCode}`);
    console.log(`   Status: ${repair.currentStage}`);
    console.log(`   Track at: https://smarttrack-frvsuvab.manus.space/track/${repair.trackingCode}\n`);
  });

  console.log("=".repeat(70));
  console.log("✨ You can now test the customer tracking page!");
  console.log("=".repeat(70) + "\n");

  process.exit(0);
}

createTestRepairs().catch((error) => {
  console.error("Fatal error:", error);
  process.exit(1);
});
