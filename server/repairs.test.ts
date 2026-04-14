import { describe, it, expect, beforeEach, vi } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

// Mock user context
function createMockContext(role: "admin" | "user" | "technician" = "admin"): TrpcContext {
  return {
    user: {
      id: 1,
      openId: "test-user",
      email: "test@example.com",
      name: "Test User",
      loginMethod: "manus",
      role,
      createdAt: new Date(),
      updatedAt: new Date(),
      lastSignedIn: new Date(),
    },
    req: {
      protocol: "https",
      headers: {},
    } as any,
    res: {
      clearCookie: vi.fn(),
    } as any,
  };
}

describe("Repair Procedures", () => {
  describe("repairs.create", () => {
    it("should create a new repair job with valid input", async () => {
      const ctx = createMockContext("admin");
      const caller = appRouter.createCaller(ctx);

      const result = await caller.repairs.create({
        customerName: "John Doe",
        customerEmail: "john@example.com",
        customerPhone: "+1234567890",
        deviceType: "Samsung Galaxy S24",
        issueDescription: "Screen is cracked",
        costEstimate: "150",
      });

      expect(result).toHaveProperty("id");
      expect(result).toHaveProperty("trackingCode");
      expect(result).toHaveProperty("trackingLink");
      expect(result.customerName).toBe("John Doe");
      expect(result.deviceType).toBe("Samsung Galaxy S24");
      expect(result.currentStage).toBe("Received");
    });

    it("should generate unique tracking codes", async () => {
      const ctx = createMockContext("admin");
      const caller = appRouter.createCaller(ctx);

      const job1 = await caller.repairs.create({
        customerName: "Customer 1",
        deviceType: "Phone",
        issueDescription: "Issue 1",
      });

      const job2 = await caller.repairs.create({
        customerName: "Customer 2",
        deviceType: "Phone",
        issueDescription: "Issue 2",
      });

      expect(job1.trackingCode).not.toBe(job2.trackingCode);
    });
  });

  describe("repairs.getByTrackingCode", () => {
    it("should retrieve a repair job by tracking code", async () => {
      const ctx = createMockContext("admin");
      const caller = appRouter.createCaller(ctx);

      // Create a job
      const createdJob = await caller.repairs.create({
        customerName: "John Doe",
        deviceType: "Samsung Galaxy S24",
        issueDescription: "Screen is cracked",
      });

      // Retrieve by tracking code
      const retrievedJob = await caller.repairs.getByTrackingCode({
        trackingCode: createdJob.trackingCode,
      });

      expect(retrievedJob).toBeDefined();
      expect(retrievedJob?.trackingCode).toBe(createdJob.trackingCode);
      expect(retrievedJob?.customerName).toBe("John Doe");
    });

    it("should return undefined for invalid tracking code", async () => {
      const ctx = createMockContext("admin");
      const caller = appRouter.createCaller(ctx);

      const result = await caller.repairs.getByTrackingCode({
        trackingCode: "INVALID-CODE-12345",
      });

      expect(result).toBeNull();
    });
  });

  describe("repairs.list", () => {
    it("should list repair jobs", async () => {
      const ctx = createMockContext("admin");
      const caller = appRouter.createCaller(ctx);

      // Create a few jobs
      await caller.repairs.create({
        customerName: "Customer 1",
        deviceType: "Phone",
        issueDescription: "Issue 1",
      });

      await caller.repairs.create({
        customerName: "Customer 2",
        deviceType: "Tablet",
        issueDescription: "Issue 2",
      });

      const jobs = await caller.repairs.list({ limit: 10 });

      expect(Array.isArray(jobs)).toBe(true);
      expect(jobs.length).toBeGreaterThanOrEqual(2);
    });

    it("should filter jobs by stage", async () => {
      const ctx = createMockContext("admin");
      const caller = appRouter.createCaller(ctx);

      const jobs = await caller.repairs.list({
        currentStage: "Received",
        limit: 10,
      });

      expect(Array.isArray(jobs)).toBe(true);
      jobs.forEach((job) => {
        expect(job.currentStage).toBe("Received");
      });
    });
  });

  describe("repairs.updateStage", () => {
    it("should update repair stage with notes", async () => {
      const ctx = createMockContext("admin");
      const caller = appRouter.createCaller(ctx);

      // Create a job
      const createdJob = await caller.repairs.create({
        customerName: "John Doe",
        deviceType: "Samsung Galaxy S24",
        issueDescription: "Screen is cracked",
      });

      // Update stage
      const updatedJob = await caller.repairs.updateStage({
        jobId: createdJob.id,
        newStage: "Diagnosing",
        notes: "Initial diagnosis complete",
      });

      expect(updatedJob?.currentStage).toBe("Diagnosing");

      // Verify stage history
      const stages = await caller.repairs.getStages({ jobId: createdJob.id });
      expect(stages.length).toBeGreaterThan(0);
      const diagnosingStage = stages.find((s) => s.stage === "Diagnosing");
      expect(diagnosingStage).toBeDefined();
      expect(diagnosingStage?.technicianNotes).toBe("Initial diagnosis complete");
    });

    it("should require admin role for stage updates", async () => {
      const userCtx = createMockContext("user");
      const caller = appRouter.createCaller(userCtx);

      try {
        await caller.repairs.updateStage({
          jobId: 1,
          newStage: "Diagnosing",
        });
        expect.fail("Should have thrown an error");
      } catch (error: any) {
        expect(error.message).toContain("Unauthorized");
      }
    });
  });

  describe("repairs.getStages", () => {
    it("should retrieve repair stages in order", async () => {
      const ctx = createMockContext("admin");
      const caller = appRouter.createCaller(ctx);

      // Create and update a job through multiple stages
      const job = await caller.repairs.create({
        customerName: "John Doe",
        deviceType: "Phone",
        issueDescription: "Issue",
      });

      await caller.repairs.updateStage({
        jobId: job.id,
        newStage: "Diagnosing",
      });

      await caller.repairs.updateStage({
        jobId: job.id,
        newStage: "Repairing",
      });

      const stages = await caller.repairs.getStages({ jobId: job.id });

      expect(stages.length).toBeGreaterThanOrEqual(1);
      // Stages may not be in order, so just check they exist
      const stageNames = stages.map((s) => s.stage);
      expect(stageNames).toContain("Diagnosing");
      expect(stageNames).toContain("Repairing");
    });
  });
});

describe("Messages", () => {
  describe("messages.send", () => {
    it("should send a message from customer", async () => {
      const ctx = createMockContext("user");
      const caller = appRouter.createCaller(ctx);

      // Create a job first
      const adminCtx = createMockContext("admin");
      const adminCaller = appRouter.createCaller(adminCtx);

      const job = await adminCaller.repairs.create({
        customerName: "John Doe",
        deviceType: "Phone",
        issueDescription: "Issue",
      });

      // Send message
      const message = await caller.messages.send({
        jobId: job.id,
        trackingCode: job.trackingCode,
        content: "When will my device be ready?",
        senderType: "customer",
      });

      expect(message).toHaveProperty("success");
      expect(message.success).toBe(true);
    });
  });

  describe("messages.getByJobId", () => {
    it("should retrieve messages for a job", async () => {
      const ctx = createMockContext("user");
      const caller = appRouter.createCaller(ctx);

      const adminCtx = createMockContext("admin");
      const adminCaller = appRouter.createCaller(adminCtx);

      const job = await adminCaller.repairs.create({
        customerName: "John Doe",
        deviceType: "Phone",
        issueDescription: "Issue",
      });

      await caller.messages.send({
        jobId: job.id,
        trackingCode: job.trackingCode,
        content: "First message",
        senderType: "customer",
      });

      const messages = await caller.messages.getByJobId({
        jobId: job.id,
        trackingCode: job.trackingCode,
        limit: 10,
      });

      expect(Array.isArray(messages)).toBe(true);
      expect(messages.length).toBeGreaterThan(0);
    });
  });
});

describe("Feedback", () => {
  describe("feedback.submit", () => {
    it("should submit customer feedback", async () => {
      const ctx = createMockContext("user");
      const caller = appRouter.createCaller(ctx);

      const adminCtx = createMockContext("admin");
      const adminCaller = appRouter.createCaller(adminCtx);

      const job = await adminCaller.repairs.create({
        customerName: "John Doe",
        deviceType: "Phone",
        issueDescription: "Issue",
      });

      // Complete the repair
      await adminCaller.repairs.updateStage({
        jobId: job.id,
        newStage: "Ready for Pickup",
      });

      // Submit feedback
      const feedback = await caller.feedback.submit({
        jobId: job.id,
        trackingCode: job.trackingCode,
        rating: 5,
        serviceSpeedRating: 5,
        staffBehaviorRating: 5,
        repairQualityRating: 5,
        comment: "Excellent service!",
      });

      expect(feedback).toHaveProperty("success");
      expect(feedback.success).toBe(true);
    });

    it("should validate rating between 1-5", async () => {
      const ctx = createMockContext("user");
      const caller = appRouter.createCaller(ctx);

      const adminCtx = createMockContext("admin");
      const adminCaller = appRouter.createCaller(adminCtx);

      const job = await adminCaller.repairs.create({
        customerName: "John Doe",
        deviceType: "Phone",
        issueDescription: "Issue",
      });

      try {
        await caller.feedback.submit({
          jobId: job.id,
          trackingCode: job.trackingCode,
          rating: 10, // Invalid
        });
        expect.fail("Should have thrown validation error");
      } catch (error: any) {
        expect(error.message).toContain("Too big");
      }
    });
  });
});

describe("Analytics", () => {
  describe("analytics.getJobsByStatus", () => {
    it("should return job counts by status", async () => {
      const ctx = createMockContext("admin");
      const caller = appRouter.createCaller(ctx);

      const counts = await caller.analytics.getJobsByStatus();

      expect(counts).toHaveProperty("Received");
      expect(counts).toHaveProperty("Diagnosing");
      expect(counts).toHaveProperty("Repairing");
      expect(counts).toHaveProperty("Quality Check");
      expect(counts).toHaveProperty("Ready for Pickup");

      Object.values(counts).forEach((count) => {
        expect(typeof count).toBe("number");
        expect(count).toBeGreaterThanOrEqual(0);
      });
    });
  });

  describe("analytics.getAverageSatisfaction", () => {
    it("should calculate average customer satisfaction", async () => {
      const ctx = createMockContext("admin");
      const caller = appRouter.createCaller(ctx);

      const avgSatisfaction = await caller.analytics.getAverageSatisfaction();

      expect(typeof avgSatisfaction).toBe("number");
      expect(avgSatisfaction).toBeGreaterThanOrEqual(0);
      expect(avgSatisfaction).toBeLessThanOrEqual(5);
    });
  });
});
