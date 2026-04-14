import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import { z } from "zod";
import { nanoid } from "nanoid";
import { invokeLLM } from "./_core/llm";
import {
  createRepairJob,
  getRepairJobByTrackingCode,
  getRepairJobById,
  listRepairJobs,
  updateRepairJobStage,
  createMessage,
  getMessagesByJobId,
  createFeedback,
  getFeedbackByJobId,
  listAllFeedback,
  createNotification,
  getNotificationsByJobId,
  deleteNotification,
  getRepairStagesByJobId,
  getAverageCustomerSatisfaction,
  getJobsByStatus,
  createAIInsight,
  getLatestAIInsight,
} from "./db";

const REPAIR_STAGES = ["Received", "Diagnosing", "Repairing", "Quality Check", "Ready for Pickup"] as const;

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query((opts) => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  // ===== REPAIR JOB PROCEDURES =====
  repairs: router({
    // Create a new repair job (admin/technician only)
    create: protectedProcedure
      .input(
        z.object({
          customerName: z.string().min(1),
          customerEmail: z.string().email().optional(),
          customerPhone: z.string().optional(),
          deviceType: z.string().min(1),
          issueDescription: z.string().min(1),
          estimatedCompletionDate: z.date().optional(),
          costEstimate: z.string().optional(),
          assignedTechnicianId: z.number().optional(),
        })
      )
      .mutation(async ({ input, ctx }) => {
        if (ctx.user.role !== "admin" && ctx.user.role !== "technician") {
          throw new Error("Unauthorized: Only admins and technicians can create repair jobs");
        }

        const trackingCode = nanoid(8).toUpperCase();
        const trackingLink = `/track/${trackingCode}`;

        const result = await createRepairJob({
          trackingCode,
          trackingLink,
          customerName: input.customerName,
          customerEmail: input.customerEmail,
          customerPhone: input.customerPhone,
          deviceType: input.deviceType,
          issueDescription: input.issueDescription,
          estimatedCompletionDate: input.estimatedCompletionDate,
          costEstimate: input.costEstimate,
          assignedTechnicianId: input.assignedTechnicianId,
        });

        // Get the created job to return full object
        const createdJob = await getRepairJobByTrackingCode(trackingCode);

        return createdJob || { trackingCode, trackingLink, success: true };
      }),

    // Get repair job by tracking code (public - no auth required)
    getByTrackingCode: publicProcedure
      .input(z.object({ trackingCode: z.string() }))
      .query(async ({ input }) => {
        const job = await getRepairJobByTrackingCode(input.trackingCode);
        return job || null;
      }),

    // Get repair job by ID (protected)
    getById: protectedProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input }) => {
        const job = await getRepairJobById(input.id);
        return job || null;
      }),

    // List all repair jobs with filters (admin/technician)
    list: protectedProcedure
      .input(
        z.object({
          currentStage: z.string().optional(),
          assignedTechnicianId: z.number().optional(),
          limit: z.number().default(20),
          offset: z.number().default(0),
        })
      )
      .query(async ({ input, ctx }) => {
        if (ctx.user.role !== "admin" && ctx.user.role !== "technician") {
          throw new Error("Unauthorized");
        }

        const jobs = await listRepairJobs({
          currentStage: input.currentStage,
          assignedTechnicianId: input.assignedTechnicianId,
          limit: input.limit,
          offset: input.offset,
        });

        return jobs;
      }),

    // Update repair stage (admin/technician)
    updateStage: protectedProcedure
      .input(
        z.object({
          jobId: z.number(),
          newStage: z.enum(REPAIR_STAGES),
          notes: z.string().optional(),
        })
      )
      .mutation(async ({ input, ctx }) => {
        if (ctx.user.role !== "admin" && ctx.user.role !== "technician") {
          throw new Error("Unauthorized");
        }

        await updateRepairJobStage(input.jobId, input.newStage, ctx.user.id, input.notes);

        // Get updated job
        const job = await getRepairJobById(input.jobId);
        if (job && job.customerEmail) {
          await createNotification({
            jobId: input.jobId,
            recipientEmail: job.customerEmail,
            type: "status_change",
            subject: `Your repair is now in ${input.newStage} stage`,
            message: `Your ${job.deviceType} repair has progressed to the ${input.newStage} stage. ${input.notes ? `Technician notes: ${input.notes}` : ""}`,
          });
        }

        return job || { success: true };
      }),

    // Get repair timeline/stages
    getStages: publicProcedure
      .input(z.object({ jobId: z.number() }))
      .query(async ({ input }) => {
        const stages = await getRepairStagesByJobId(input.jobId);
        return stages;
      }),
  }),

  // ===== MESSAGING PROCEDURES =====
  messages: router({
    // Send a message
    send: publicProcedure
      .input(
        z.object({
          jobId: z.number(),
          trackingCode: z.string().optional(),
          content: z.string().min(1),
          senderType: z.enum(["customer", "technician", "admin"]),
          senderId: z.number().optional(),
        })
      )
      .mutation(async ({ input, ctx }) => {
        // Verify access: either authenticated user or customer with valid tracking code
        let senderId = input.senderId || ctx.user?.id || 0;
        let senderType = input.senderType;

        if (input.senderType === "customer" && input.trackingCode) {
          const job = await getRepairJobByTrackingCode(input.trackingCode);
          if (!job || job.id !== input.jobId) {
            throw new Error("Invalid tracking code");
          }
        }

        await createMessage({
          jobId: input.jobId,
          senderId,
          senderType,
          content: input.content,
        });

        return { success: true };
      }),

    // Get messages for a repair job
    getByJobId: publicProcedure
      .input(
        z.object({
          jobId: z.number(),
          trackingCode: z.string().optional(),
          limit: z.number().default(50),
          offset: z.number().default(0),
        })
      )
      .query(async ({ input }) => {
        // Verify access via tracking code
        if (input.trackingCode) {
          const job = await getRepairJobByTrackingCode(input.trackingCode);
          if (!job || job.id !== input.jobId) {
            throw new Error("Invalid tracking code");
          }
        }

        const messages = await getMessagesByJobId(input.jobId, input.limit, input.offset);
        return messages;
      }),
  }),

  // ===== FEEDBACK PROCEDURES =====
  feedback: router({
    // Submit feedback (customer - public)
    submit: publicProcedure
      .input(
        z.object({
          jobId: z.number(),
          trackingCode: z.string(),
          rating: z.number().min(1).max(5),
          serviceSpeedRating: z.number().min(1).max(5).optional(),
          staffBehaviorRating: z.number().min(1).max(5).optional(),
          repairQualityRating: z.number().min(1).max(5).optional(),
          comment: z.string().optional(),
          imageUrl: z.string().optional(),
          videoUrl: z.string().optional(),
        })
      )
      .mutation(async ({ input }) => {
        // Verify tracking code
        const job = await getRepairJobByTrackingCode(input.trackingCode);
        if (!job || job.id !== input.jobId) {
          throw new Error("Invalid tracking code");
        }

        await createFeedback({
          jobId: input.jobId,
          rating: input.rating,
          serviceSpeedRating: input.serviceSpeedRating,
          staffBehaviorRating: input.staffBehaviorRating,
          repairQualityRating: input.repairQualityRating,
          comment: input.comment,
          imageUrl: input.imageUrl,
          videoUrl: input.videoUrl,
        });

        return { success: true };
      }),

    // Get feedback for a job
    getByJobId: protectedProcedure
      .input(z.object({ jobId: z.number() }))
      .query(async ({ input }) => {
        const fb = await getFeedbackByJobId(input.jobId);
        return fb;
      }),

    // List all feedback (admin only)
    listAll: protectedProcedure
      .input(
        z.object({
          limit: z.number().default(50),
          offset: z.number().default(0),
        })
      )
      .query(async ({ input, ctx }) => {
        if (ctx.user.role !== "admin") {
          throw new Error("Unauthorized: Admin only");
        }

        const allFeedback = await listAllFeedback(input.limit, input.offset);
        return allFeedback;
      }),
  }),

  // ===== ANALYTICS & INSIGHTS PROCEDURES =====
  analytics: router({
    // Get job status distribution
    getJobsByStatus: protectedProcedure.query(async ({ ctx }) => {
      if (ctx.user.role !== "admin") {
        throw new Error("Unauthorized");
      }

      const statusCounts = await getJobsByStatus();
      return statusCounts;
    }),

    // Get average customer satisfaction
    getAverageSatisfaction: protectedProcedure.query(async ({ ctx }) => {
      if (ctx.user.role !== "admin") {
        throw new Error("Unauthorized");
      }

      const avgSatisfaction = await getAverageCustomerSatisfaction();
      return parseFloat(avgSatisfaction as any);
    }),

    // Generate AI insights (admin only)
    generateInsights: protectedProcedure.mutation(async ({ ctx }) => {
      if (ctx.user.role !== "admin") {
        throw new Error("Unauthorized: Admin only");
      }

      try {
        // Get data for analysis
        const allJobs = await listRepairJobs({ limit: 1000 });
        const allFeedback = await listAllFeedback(1000);
        const statusCounts = await getJobsByStatus();

        // Prepare data for LLM
        const jobData = {
          totalJobs: allJobs.length,
          statusDistribution: statusCounts,
          averageFeedbackRating:
            allFeedback.length > 0
              ? (allFeedback.reduce((sum, f) => sum + f.rating, 0) / allFeedback.length).toFixed(2)
              : "N/A",
          recentJobs: allJobs.slice(0, 10).map((j) => ({
            deviceType: j.deviceType,
            stage: j.currentStage,
            issueDescription: j.issueDescription,
          })),
        };

        // Call LLM for insights
        const response = await invokeLLM({
          messages: [
            {
              role: "system",
              content:
                "You are an expert repair service analyst. Analyze the provided repair data and generate actionable insights about trends, common issues, and performance metrics.",
            },
            {
              role: "user",
              content: `Analyze this repair service data and provide insights:\n${JSON.stringify(jobData, null, 2)}\n\nProvide insights in JSON format with fields: trends, commonIssues, performanceMetrics, recommendations`,
            },
          ],
          response_format: {
            type: "json_schema",
            json_schema: {
              name: "repair_insights",
              strict: true,
              schema: {
                type: "object",
                properties: {
                  trends: {
                    type: "string",
                    description: "Key trends in repair data",
                  },
                  commonIssues: {
                    type: "string",
                    description: "Most common repair issues",
                  },
                  performanceMetrics: {
                    type: "string",
                    description: "Performance analysis",
                  },
                  recommendations: {
                    type: "string",
                    description: "Actionable recommendations",
                  },
                },
                required: ["trends", "commonIssues", "performanceMetrics", "recommendations"],
                additionalProperties: false,
              },
            },
          },
        });

        const insightText = typeof response.choices[0]?.message.content === 'string' 
          ? response.choices[0].message.content 
          : JSON.stringify(response.choices[0]?.message.content);
        const insights = JSON.parse(insightText);

        // Store insights
        await createAIInsight({
          repairTrends: JSON.stringify(insights.trends),
          commonIssues: JSON.stringify(insights.commonIssues),
          technicianPerformance: JSON.stringify(insights.performanceMetrics),
          summaryText: insights.recommendations,
        });

        return insights;
      } catch (error) {
        console.error("Error generating AI insights:", error);
        throw new Error("Failed to generate insights");
      }
    }),

    // Get latest AI insights
    getLatestInsights: protectedProcedure.query(async ({ ctx }) => {
      if (ctx.user.role !== "admin") {
        throw new Error("Unauthorized");
      }

      const insights = await getLatestAIInsight();
      return insights;
    }),
  }),

  // ===== NOTIFICATIONS PROCEDURES =====
  notifications: router({
    // Get notifications for a job
    getByJobId: protectedProcedure
      .input(z.object({ jobId: z.number() }))
      .query(async ({ input }) => {
        const notifs = await getNotificationsByJobId(input.jobId);
        return notifs;
      }),

    // Create notification (internal use)
    create: protectedProcedure
      .input(
        z.object({
          jobId: z.number(),
          recipientEmail: z.string().email(),
          type: z.enum(["status_change", "delay_alert", "ready_pickup", "feedback_request"]),
          subject: z.string(),
          message: z.string(),
        })
      )
      .mutation(async ({ input, ctx }) => {
        if (ctx.user.role !== "admin") {
          throw new Error("Unauthorized");
        }

        await createNotification({
          jobId: input.jobId,
          recipientEmail: input.recipientEmail,
          type: input.type,
          subject: input.subject,
          message: input.message,
        });

        return { success: true };
      }),

    // Delete notification
    delete: protectedProcedure
      .input(z.object({ notificationId: z.number() }))
      .mutation(async ({ input }) => {
        await deleteNotification(input.notificationId);
        return { success: true };
      }),
  }),
});

export type AppRouter = typeof appRouter;
