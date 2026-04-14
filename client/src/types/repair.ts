export interface RepairStage {
  id: number;
  jobId: number;
  stage: "Received" | "Diagnosing" | "Repairing" | "Quality Check" | "Ready for Pickup";
  startedAt: Date;
  completedAt?: Date | null;
  technicianNotes?: string | null;
  technicianId?: number | null;
  createdAt: Date;
}

export interface RepairJob {
  id: number;
  trackingCode: string;
  trackingLink: string;
  customerName: string;
  customerEmail?: string | null;
  customerPhone?: string | null;
  deviceType: string;
  issueDescription: string;
  currentStage: "Received" | "Diagnosing" | "Repairing" | "Quality Check" | "Ready for Pickup";
  estimatedCompletionDate?: Date | null;
  actualCompletionDate?: Date | null;
  costEstimate?: string | null;
  actualCost?: string | null;
  partsReplaced?: string | null;
  warranty?: string | null;
  assignedTechnicianId?: number | null;
  createdAt: Date;
  updatedAt: Date;
  completedAt?: Date | null;
}

export interface Message {
  id: number;
  jobId: number;
  senderId: number;
  senderType: "customer" | "technician" | "admin";
  content: string;
  attachmentUrl?: string | null;
  isRead: boolean;
  createdAt: Date;
}

export interface Feedback {
  id: number;
  jobId: number;
  rating: number;
  serviceSpeedRating?: number | null;
  staffBehaviorRating?: number | null;
  repairQualityRating?: number | null;
  comment?: string | null;
  imageUrl?: string | null;
  videoUrl?: string | null;
  submittedAt: Date;
  createdAt: Date;
}
