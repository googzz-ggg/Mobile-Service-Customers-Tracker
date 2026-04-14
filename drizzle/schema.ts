import {
  int,
  mysqlEnum,
  mysqlTable,
  text,
  timestamp,
  varchar,
  decimal,
  boolean,
  json,
  index,
} from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 * Extended with role-based access control for technicians and admins.
 */
export const users = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin", "technician"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/**
 * Repair jobs table - core entity representing each device repair
 */
export const repairJobs = mysqlTable(
  "repair_jobs",
  {
    id: int("id").autoincrement().primaryKey(),
    trackingCode: varchar("trackingCode", { length: 32 }).notNull().unique(),
    trackingLink: varchar("trackingLink", { length: 255 }).notNull().unique(),
    customerName: varchar("customerName", { length: 255 }).notNull(),
    customerEmail: varchar("customerEmail", { length: 320 }),
    customerPhone: varchar("customerPhone", { length: 20 }),
    deviceType: varchar("deviceType", { length: 100 }).notNull(), // e.g., "Samsung Galaxy S24"
    issueDescription: text("issueDescription").notNull(),
    currentStage: mysqlEnum("currentStage", [
      "Received",
      "Diagnosing",
      "Repairing",
      "Quality Check",
      "Ready for Pickup",
    ])
      .default("Received")
      .notNull(),
    estimatedCompletionDate: timestamp("estimatedCompletionDate"),
    actualCompletionDate: timestamp("actualCompletionDate"),
    costEstimate: decimal("costEstimate", { precision: 10, scale: 2 }),
    actualCost: decimal("actualCost", { precision: 10, scale: 2 }),
    partsReplaced: text("partsReplaced"), // JSON array of parts
    warranty: varchar("warranty", { length: 100 }), // e.g., "30 days"
    assignedTechnicianId: int("assignedTechnicianId"),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
    updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
    completedAt: timestamp("completedAt"),
  },
  (table) => ({
    trackingCodeIdx: index("trackingCode_idx").on(table.trackingCode),
    currentStageIdx: index("currentStage_idx").on(table.currentStage),
    assignedTechnicianIdx: index("assignedTechnician_idx").on(table.assignedTechnicianId),
  })
);

export type RepairJob = typeof repairJobs.$inferSelect;
export type InsertRepairJob = typeof repairJobs.$inferInsert;

/**
 * Repair stages table - tracks each stage of a repair with timestamps and notes
 */
export const repairStages = mysqlTable(
  "repair_stages",
  {
    id: int("id").autoincrement().primaryKey(),
    jobId: int("jobId").notNull(),
    stage: mysqlEnum("stage", [
      "Received",
      "Diagnosing",
      "Repairing",
      "Quality Check",
      "Ready for Pickup",
    ]).notNull(),
    startedAt: timestamp("startedAt").notNull(),
    completedAt: timestamp("completedAt"),
    technicianNotes: text("technicianNotes"),
    technicianId: int("technicianId"),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
  },
  (table) => ({
    jobIdIdx: index("jobId_idx").on(table.jobId),
    stageIdx: index("stage_idx").on(table.stage),
  })
);

export type RepairStage = typeof repairStages.$inferSelect;
export type InsertRepairStage = typeof repairStages.$inferInsert;

/**
 * Messages table - live chat between customers and technicians
 */
export const messages = mysqlTable(
  "messages",
  {
    id: int("id").autoincrement().primaryKey(),
    jobId: int("jobId").notNull(),
    senderId: int("senderId").notNull(),
    senderType: mysqlEnum("senderType", ["customer", "technician", "admin"]).notNull(),
    content: text("content").notNull(),
    attachmentUrl: varchar("attachmentUrl", { length: 500 }),
    isRead: boolean("isRead").default(false).notNull(),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
  },
  (table) => ({
    jobIdIdx: index("jobId_idx").on(table.jobId),
    senderIdIdx: index("senderId_idx").on(table.senderId),
  })
);

export type Message = typeof messages.$inferSelect;
export type InsertMessage = typeof messages.$inferInsert;

/**
 * Feedback and ratings table - customer reviews after repair completion
 */
export const feedback = mysqlTable(
  "feedback",
  {
    id: int("id").autoincrement().primaryKey(),
    jobId: int("jobId").notNull().unique(),
    rating: int("rating").notNull(), // 1-5 stars
    serviceSpeedRating: int("serviceSpeedRating"), // 1-5
    staffBehaviorRating: int("staffBehaviorRating"), // 1-5
    repairQualityRating: int("repairQualityRating"), // 1-5
    comment: text("comment"),
    imageUrl: varchar("imageUrl", { length: 500 }),
    videoUrl: varchar("videoUrl", { length: 500 }),
    submittedAt: timestamp("submittedAt").defaultNow().notNull(),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
  },
  (table) => ({
    jobIdIdx: index("jobId_idx").on(table.jobId),
  })
);

export type Feedback = typeof feedback.$inferSelect;
export type InsertFeedback = typeof feedback.$inferInsert;

/**
 * Notifications table - tracks notifications sent to customers
 */
export const notifications = mysqlTable(
  "notifications",
  {
    id: int("id").autoincrement().primaryKey(),
    jobId: int("jobId").notNull(),
    recipientEmail: varchar("recipientEmail", { length: 320 }).notNull(),
    type: mysqlEnum("type", ["status_change", "delay_alert", "ready_pickup", "feedback_request"]).notNull(),
    subject: varchar("subject", { length: 255 }).notNull(),
    message: text("message").notNull(),
    sentAt: timestamp("sentAt").defaultNow().notNull(),
    deliveryStatus: mysqlEnum("deliveryStatus", ["pending", "sent", "failed"]).default("pending").notNull(),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
  },
  (table) => ({
    jobIdIdx: index("jobId_idx").on(table.jobId),
    recipientIdx: index("recipientEmail_idx").on(table.recipientEmail),
  })
);

export type Notification = typeof notifications.$inferSelect;
export type InsertNotification = typeof notifications.$inferInsert;

/**
 * Analytics snapshots table - stores daily/weekly analytics for performance
 */
export const analyticsSnapshots = mysqlTable(
  "analytics_snapshots",
  {
    id: int("id").autoincrement().primaryKey(),
    snapshotDate: timestamp("snapshotDate").notNull(),
    totalJobsCreated: int("totalJobsCreated").default(0),
    totalJobsCompleted: int("totalJobsCompleted").default(0),
    averageRepairDuration: decimal("averageRepairDuration", { precision: 10, scale: 2 }), // in hours
    averageCustomerSatisfaction: decimal("averageCustomerSatisfaction", { precision: 3, scale: 2 }), // 0-5
    jobsByStatus: text("jobsByStatus"), // JSON object with counts per status
    createdAt: timestamp("createdAt").defaultNow().notNull(),
  },
  (table) => ({
    snapshotDateIdx: index("snapshotDate_idx").on(table.snapshotDate),
  })
);

export type AnalyticsSnapshot = typeof analyticsSnapshots.$inferSelect;
export type InsertAnalyticsSnapshot = typeof analyticsSnapshots.$inferInsert;

/**
 * AI Insights table - stores AI-generated insights and summaries
 */
export const aiInsights = mysqlTable(
  "ai_insights",
  {
    id: int("id").autoincrement().primaryKey(),
    generatedAt: timestamp("generatedAt").defaultNow().notNull(),
    repairTrends: text("repairTrends"), // JSON with trend analysis
    commonIssues: text("commonIssues"), // JSON array of common issues
    technicianPerformance: text("technicianPerformance"), // JSON with technician metrics
    averageTurnaroundTime: decimal("averageTurnaroundTime", { precision: 10, scale: 2 }), // in hours
    summaryText: text("summaryText"), // AI-generated summary
    createdAt: timestamp("createdAt").defaultNow().notNull(),
  }
);

export type AIInsight = typeof aiInsights.$inferSelect;
export type InsertAIInsight = typeof aiInsights.$inferInsert;
