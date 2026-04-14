import { eq, desc, and, gte, lte } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import {
  InsertUser,
  users,
  repairJobs,
  repairStages,
  messages,
  feedback,
  notifications,
  analyticsSnapshots,
  aiInsights,
} from "../drizzle/schema";
import { ENV } from "./_core/env";

let _db: ReturnType<typeof drizzle> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = "admin";
      updateSet.role = "admin";
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db
    .select()
    .from(users)
    .where(eq(users.openId, openId))
    .limit(1);

  return result.length > 0 ? result[0] : undefined;
}

// ===== REPAIR JOB HELPERS =====

export async function createRepairJob(data: {
  trackingCode: string;
  trackingLink: string;
  customerName: string;
  customerEmail?: string;
  customerPhone?: string;
  deviceType: string;
  issueDescription: string;
  estimatedCompletionDate?: Date;
  costEstimate?: string;
  assignedTechnicianId?: number;
}) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const result = await db.insert(repairJobs).values(data);
  return result;
}

export async function getRepairJobByTrackingCode(trackingCode: string) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const result = await db
    .select()
    .from(repairJobs)
    .where(eq(repairJobs.trackingCode, trackingCode))
    .limit(1);

  return result.length > 0 ? result[0] : undefined;
}

export async function getRepairJobById(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const result = await db
    .select()
    .from(repairJobs)
    .where(eq(repairJobs.id, id))
    .limit(1);

  return result.length > 0 ? result[0] : undefined;
}

export async function listRepairJobs(filters?: {
  currentStage?: string;
  assignedTechnicianId?: number;
  limit?: number;
  offset?: number;
}) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const whereConditions: any[] = [];

  if (filters?.currentStage) {
    whereConditions.push(eq(repairJobs.currentStage, filters.currentStage as any));
  }

  if (filters?.assignedTechnicianId) {
    whereConditions.push(eq(repairJobs.assignedTechnicianId, filters.assignedTechnicianId));
  }

  const whereClause = whereConditions.length > 0 ? and(...whereConditions) : undefined;

  const result = await db
    .select()
    .from(repairJobs)
    .where(whereClause)
    .orderBy(desc(repairJobs.createdAt))
    .limit(filters?.limit || 100)
    .offset(filters?.offset || 0);

  return result;
}

export async function updateRepairJobStage(
  jobId: number,
  newStage: string,
  technicianId?: number,
  notes?: string
) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  // Update repair job current stage
  await db
    .update(repairJobs)
    .set({
      currentStage: newStage as any,
      updatedAt: new Date(),
    })
    .where(eq(repairJobs.id, jobId));

  // Create repair stage record
  await db.insert(repairStages).values({
    jobId,
    stage: newStage as any,
    startedAt: new Date(),
    technicianId,
    technicianNotes: notes,
  });
}

// ===== MESSAGE HELPERS =====

export async function createMessage(data: {
  jobId: number;
  senderId: number;
  senderType: "customer" | "technician" | "admin";
  content: string;
  attachmentUrl?: string;
}) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const result = await db.insert(messages).values(data);
  return result;
}

export async function getMessagesByJobId(jobId: number, limit = 50, offset = 0) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const result = await db
    .select()
    .from(messages)
    .where(eq(messages.jobId, jobId))
    .orderBy(desc(messages.createdAt))
    .limit(limit)
    .offset(offset);

  return result.reverse(); // Return in chronological order
}

// ===== FEEDBACK HELPERS =====

export async function createFeedback(data: {
  jobId: number;
  rating: number;
  serviceSpeedRating?: number;
  staffBehaviorRating?: number;
  repairQualityRating?: number;
  comment?: string;
  imageUrl?: string;
  videoUrl?: string;
}) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const result = await db.insert(feedback).values(data);
  return result;
}

export async function getFeedbackByJobId(jobId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const result = await db
    .select()
    .from(feedback)
    .where(eq(feedback.jobId, jobId))
    .limit(1);

  return result.length > 0 ? result[0] : undefined;
}

export async function listAllFeedback(limit = 100, offset = 0) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const result = await db
    .select()
    .from(feedback)
    .orderBy(desc(feedback.submittedAt))
    .limit(limit)
    .offset(offset);

  return result;
}

// ===== NOTIFICATION HELPERS =====

export async function createNotification(data: {
  jobId: number;
  recipientEmail: string;
  type: "status_change" | "delay_alert" | "ready_pickup" | "feedback_request";
  subject: string;
  message: string;
}) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const result = await db.insert(notifications).values(data);
  return result;
}

export async function getNotificationsByJobId(jobId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const result = await db
    .select()
    .from(notifications)
    .where(eq(notifications.jobId, jobId))
    .orderBy(desc(notifications.createdAt));

  return result;
}

// ===== REPAIR STAGE HELPERS =====

export async function getRepairStagesByJobId(jobId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const result = await db
    .select()
    .from(repairStages)
    .where(eq(repairStages.jobId, jobId))
    .orderBy(desc(repairStages.createdAt));

  return result;
}

// ===== ANALYTICS HELPERS =====

export async function getAverageRepairDuration() {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const result = await db
    .select()
    .from(analyticsSnapshots)
    .orderBy(desc(analyticsSnapshots.snapshotDate))
    .limit(1);

  return result.length > 0 ? result[0] : undefined;
}

export async function getAverageCustomerSatisfaction() {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const allFeedback = await db.select().from(feedback);

  if (allFeedback.length === 0) return 0;

  const totalRating = allFeedback.reduce((sum, f) => sum + f.rating, 0);
  return (totalRating / allFeedback.length).toFixed(2);
}

export async function getJobsByStatus() {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const result = await db.select().from(repairJobs);

  const statusCounts = {
    Received: 0,
    Diagnosing: 0,
    Repairing: 0,
    "Quality Check": 0,
    "Ready for Pickup": 0,
  };

  result.forEach((job) => {
    statusCounts[job.currentStage as keyof typeof statusCounts]++;
  });

  return statusCounts;
}

// ===== AI INSIGHTS HELPERS =====

export async function createAIInsight(data: {
  repairTrends?: string;
  commonIssues?: string;
  technicianPerformance?: string;
  averageTurnaroundTime?: string;
  summaryText?: string;
}) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const result = await db.insert(aiInsights).values(data);
  return result;
}

export async function getLatestAIInsight() {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const result = await db
    .select()
    .from(aiInsights)
    .orderBy(desc(aiInsights.generatedAt))
    .limit(1);

  return result.length > 0 ? result[0] : undefined;
}
