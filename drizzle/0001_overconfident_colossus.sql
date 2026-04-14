CREATE TABLE `ai_insights` (
	`id` int AUTO_INCREMENT NOT NULL,
	`generatedAt` timestamp NOT NULL DEFAULT (now()),
	`repairTrends` text,
	`commonIssues` text,
	`technicianPerformance` text,
	`averageTurnaroundTime` decimal(10,2),
	`summaryText` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `ai_insights_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `analytics_snapshots` (
	`id` int AUTO_INCREMENT NOT NULL,
	`snapshotDate` timestamp NOT NULL,
	`totalJobsCreated` int DEFAULT 0,
	`totalJobsCompleted` int DEFAULT 0,
	`averageRepairDuration` decimal(10,2),
	`averageCustomerSatisfaction` decimal(3,2),
	`jobsByStatus` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `analytics_snapshots_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `feedback` (
	`id` int AUTO_INCREMENT NOT NULL,
	`jobId` int NOT NULL,
	`rating` int NOT NULL,
	`serviceSpeedRating` int,
	`staffBehaviorRating` int,
	`repairQualityRating` int,
	`comment` text,
	`imageUrl` varchar(500),
	`videoUrl` varchar(500),
	`submittedAt` timestamp NOT NULL DEFAULT (now()),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `feedback_id` PRIMARY KEY(`id`),
	CONSTRAINT `feedback_jobId_unique` UNIQUE(`jobId`)
);
--> statement-breakpoint
CREATE TABLE `messages` (
	`id` int AUTO_INCREMENT NOT NULL,
	`jobId` int NOT NULL,
	`senderId` int NOT NULL,
	`senderType` enum('customer','technician','admin') NOT NULL,
	`content` text NOT NULL,
	`attachmentUrl` varchar(500),
	`isRead` boolean NOT NULL DEFAULT false,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `messages_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `notifications` (
	`id` int AUTO_INCREMENT NOT NULL,
	`jobId` int NOT NULL,
	`recipientEmail` varchar(320) NOT NULL,
	`type` enum('status_change','delay_alert','ready_pickup','feedback_request') NOT NULL,
	`subject` varchar(255) NOT NULL,
	`message` text NOT NULL,
	`sentAt` timestamp NOT NULL DEFAULT (now()),
	`deliveryStatus` enum('pending','sent','failed') NOT NULL DEFAULT 'pending',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `notifications_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `repair_jobs` (
	`id` int AUTO_INCREMENT NOT NULL,
	`trackingCode` varchar(32) NOT NULL,
	`trackingLink` varchar(255) NOT NULL,
	`customerName` varchar(255) NOT NULL,
	`customerEmail` varchar(320),
	`customerPhone` varchar(20),
	`deviceType` varchar(100) NOT NULL,
	`issueDescription` text NOT NULL,
	`currentStage` enum('Received','Diagnosing','Repairing','Quality Check','Ready for Pickup') NOT NULL DEFAULT 'Received',
	`estimatedCompletionDate` timestamp,
	`actualCompletionDate` timestamp,
	`costEstimate` decimal(10,2),
	`actualCost` decimal(10,2),
	`partsReplaced` text,
	`warranty` varchar(100),
	`assignedTechnicianId` int,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	`completedAt` timestamp,
	CONSTRAINT `repair_jobs_id` PRIMARY KEY(`id`),
	CONSTRAINT `repair_jobs_trackingCode_unique` UNIQUE(`trackingCode`),
	CONSTRAINT `repair_jobs_trackingLink_unique` UNIQUE(`trackingLink`)
);
--> statement-breakpoint
CREATE TABLE `repair_stages` (
	`id` int AUTO_INCREMENT NOT NULL,
	`jobId` int NOT NULL,
	`stage` enum('Received','Diagnosing','Repairing','Quality Check','Ready for Pickup') NOT NULL,
	`startedAt` timestamp NOT NULL,
	`completedAt` timestamp,
	`technicianNotes` text,
	`technicianId` int,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `repair_stages_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `users` MODIFY COLUMN `role` enum('user','admin','technician') NOT NULL DEFAULT 'user';--> statement-breakpoint
CREATE INDEX `snapshotDate_idx` ON `analytics_snapshots` (`snapshotDate`);--> statement-breakpoint
CREATE INDEX `jobId_idx` ON `feedback` (`jobId`);--> statement-breakpoint
CREATE INDEX `jobId_idx` ON `messages` (`jobId`);--> statement-breakpoint
CREATE INDEX `senderId_idx` ON `messages` (`senderId`);--> statement-breakpoint
CREATE INDEX `jobId_idx` ON `notifications` (`jobId`);--> statement-breakpoint
CREATE INDEX `recipientEmail_idx` ON `notifications` (`recipientEmail`);--> statement-breakpoint
CREATE INDEX `trackingCode_idx` ON `repair_jobs` (`trackingCode`);--> statement-breakpoint
CREATE INDEX `currentStage_idx` ON `repair_jobs` (`currentStage`);--> statement-breakpoint
CREATE INDEX `assignedTechnician_idx` ON `repair_jobs` (`assignedTechnicianId`);--> statement-breakpoint
CREATE INDEX `jobId_idx` ON `repair_stages` (`jobId`);--> statement-breakpoint
CREATE INDEX `stage_idx` ON `repair_stages` (`stage`);