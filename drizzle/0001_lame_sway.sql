CREATE TABLE `audit_events` (
	`id` int AUTO_INCREMENT NOT NULL,
	`municipalityId` int,
	`actorUserId` int,
	`entityType` varchar(80) NOT NULL,
	`entityId` varchar(80) NOT NULL,
	`action` varchar(120) NOT NULL,
	`previousValue` text,
	`nextValue` text,
	`reason` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `audit_events_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `field_assignments` (
	`id` int AUTO_INCREMENT NOT NULL,
	`reportId` int NOT NULL,
	`assignedToUserId` int NOT NULL,
	`assignedByUserId` int NOT NULL,
	`dueAt` timestamp,
	`status` enum('assigned','in_progress','completed','cancelled') NOT NULL DEFAULT 'assigned',
	`notes` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `field_assignments_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `municipalities` (
	`id` int AUTO_INCREMENT NOT NULL,
	`nameAr` varchar(160) NOT NULL,
	`code` varchar(40) NOT NULL,
	`isActive` boolean NOT NULL DEFAULT true,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `municipalities_id` PRIMARY KEY(`id`),
	CONSTRAINT `municipalities_code_unique` UNIQUE(`code`)
);
--> statement-breakpoint
CREATE TABLE `municipality_memberships` (
	`id` int AUTO_INCREMENT NOT NULL,
	`municipalityId` int NOT NULL,
	`userId` int NOT NULL,
	`role` enum('citizen','service_officer','field_worker','supervisor','municipality_admin','platform_admin') NOT NULL,
	`isActive` boolean NOT NULL DEFAULT true,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `municipality_memberships_id` PRIMARY KEY(`id`),
	CONSTRAINT `municipality_membership_unique` UNIQUE(`municipalityId`,`userId`)
);
--> statement-breakpoint
CREATE TABLE `report_evidence` (
	`id` int AUTO_INCREMENT NOT NULL,
	`reportId` int NOT NULL,
	`assignmentId` int,
	`uploadedByUserId` int NOT NULL,
	`kind` enum('before','after') NOT NULL,
	`storageKey` varchar(520) NOT NULL,
	`storageUrl` varchar(520) NOT NULL,
	`originalFileName` varchar(255) NOT NULL,
	`mimeType` varchar(100) NOT NULL,
	`sizeBytes` int NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `report_evidence_id` PRIMARY KEY(`id`),
	CONSTRAINT `report_evidence_storageKey_unique` UNIQUE(`storageKey`)
);
--> statement-breakpoint
CREATE TABLE `report_ratings` (
	`id` int AUTO_INCREMENT NOT NULL,
	`reportId` int NOT NULL,
	`citizenId` int NOT NULL,
	`score` int NOT NULL,
	`comment` varchar(500),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `report_ratings_id` PRIMARY KEY(`id`),
	CONSTRAINT `report_rating_once_per_report` UNIQUE(`reportId`)
);
--> statement-breakpoint
CREATE TABLE `report_reviews` (
	`id` int AUTO_INCREMENT NOT NULL,
	`reportId` int NOT NULL,
	`reviewerUserId` int NOT NULL,
	`categoryId` int,
	`decision` enum('accepted','rejected') NOT NULL,
	`notes` text NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `report_reviews_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `report_status_history` (
	`id` int AUTO_INCREMENT NOT NULL,
	`reportId` int NOT NULL,
	`fromStatus` varchar(32),
	`toStatus` enum('pending','under_review','assigned','in_progress','awaiting_verification','resolved','rejected','cancelled','reopened') NOT NULL,
	`actorUserId` int NOT NULL,
	`reason` text NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `report_status_history_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `reports` (
	`id` int AUTO_INCREMENT NOT NULL,
	`publicReference` varchar(32) NOT NULL,
	`municipalityId` int NOT NULL,
	`citizenId` int NOT NULL,
	`categoryId` int,
	`title` varchar(140) NOT NULL,
	`description` text NOT NULL,
	`locationDescription` varchar(500) NOT NULL,
	`status` enum('pending','under_review','assigned','in_progress','awaiting_verification','resolved','rejected','cancelled','reopened') NOT NULL DEFAULT 'pending',
	`priority` enum('normal','high','critical') NOT NULL DEFAULT 'normal',
	`closedAt` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `reports_id` PRIMARY KEY(`id`),
	CONSTRAINT `reports_publicReference_unique` UNIQUE(`publicReference`)
);
--> statement-breakpoint
CREATE TABLE `service_categories` (
	`id` int AUTO_INCREMENT NOT NULL,
	`municipalityId` int NOT NULL,
	`nameAr` varchar(120) NOT NULL,
	`code` varchar(48) NOT NULL,
	`isActive` boolean NOT NULL DEFAULT true,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `service_categories_id` PRIMARY KEY(`id`),
	CONSTRAINT `service_category_code_unique` UNIQUE(`municipalityId`,`code`)
);
--> statement-breakpoint
ALTER TABLE `users` MODIFY COLUMN `role` enum('citizen','service_officer','field_worker','supervisor','municipality_admin','platform_admin') NOT NULL DEFAULT 'citizen';--> statement-breakpoint
ALTER TABLE `audit_events` ADD CONSTRAINT `audit_events_municipalityId_municipalities_id_fk` FOREIGN KEY (`municipalityId`) REFERENCES `municipalities`(`id`) ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `audit_events` ADD CONSTRAINT `audit_events_actorUserId_users_id_fk` FOREIGN KEY (`actorUserId`) REFERENCES `users`(`id`) ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `field_assignments` ADD CONSTRAINT `field_assignments_reportId_reports_id_fk` FOREIGN KEY (`reportId`) REFERENCES `reports`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `field_assignments` ADD CONSTRAINT `field_assignments_assignedToUserId_users_id_fk` FOREIGN KEY (`assignedToUserId`) REFERENCES `users`(`id`) ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `field_assignments` ADD CONSTRAINT `field_assignments_assignedByUserId_users_id_fk` FOREIGN KEY (`assignedByUserId`) REFERENCES `users`(`id`) ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `municipality_memberships` ADD CONSTRAINT `municipality_memberships_municipalityId_municipalities_id_fk` FOREIGN KEY (`municipalityId`) REFERENCES `municipalities`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `municipality_memberships` ADD CONSTRAINT `municipality_memberships_userId_users_id_fk` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `report_evidence` ADD CONSTRAINT `report_evidence_reportId_reports_id_fk` FOREIGN KEY (`reportId`) REFERENCES `reports`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `report_evidence` ADD CONSTRAINT `report_evidence_assignmentId_field_assignments_id_fk` FOREIGN KEY (`assignmentId`) REFERENCES `field_assignments`(`id`) ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `report_evidence` ADD CONSTRAINT `report_evidence_uploadedByUserId_users_id_fk` FOREIGN KEY (`uploadedByUserId`) REFERENCES `users`(`id`) ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `report_ratings` ADD CONSTRAINT `report_ratings_reportId_reports_id_fk` FOREIGN KEY (`reportId`) REFERENCES `reports`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `report_ratings` ADD CONSTRAINT `report_ratings_citizenId_users_id_fk` FOREIGN KEY (`citizenId`) REFERENCES `users`(`id`) ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `report_reviews` ADD CONSTRAINT `report_reviews_reportId_reports_id_fk` FOREIGN KEY (`reportId`) REFERENCES `reports`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `report_reviews` ADD CONSTRAINT `report_reviews_reviewerUserId_users_id_fk` FOREIGN KEY (`reviewerUserId`) REFERENCES `users`(`id`) ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `report_reviews` ADD CONSTRAINT `report_reviews_categoryId_service_categories_id_fk` FOREIGN KEY (`categoryId`) REFERENCES `service_categories`(`id`) ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `report_status_history` ADD CONSTRAINT `report_status_history_reportId_reports_id_fk` FOREIGN KEY (`reportId`) REFERENCES `reports`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `report_status_history` ADD CONSTRAINT `report_status_history_actorUserId_users_id_fk` FOREIGN KEY (`actorUserId`) REFERENCES `users`(`id`) ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `reports` ADD CONSTRAINT `reports_municipalityId_municipalities_id_fk` FOREIGN KEY (`municipalityId`) REFERENCES `municipalities`(`id`) ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `reports` ADD CONSTRAINT `reports_citizenId_users_id_fk` FOREIGN KEY (`citizenId`) REFERENCES `users`(`id`) ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `reports` ADD CONSTRAINT `reports_categoryId_service_categories_id_fk` FOREIGN KEY (`categoryId`) REFERENCES `service_categories`(`id`) ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `service_categories` ADD CONSTRAINT `service_categories_municipalityId_municipalities_id_fk` FOREIGN KEY (`municipalityId`) REFERENCES `municipalities`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX `audit_events_entity_idx` ON `audit_events` (`entityType`,`entityId`,`createdAt`);--> statement-breakpoint
CREATE INDEX `field_assignment_worker_idx` ON `field_assignments` (`assignedToUserId`,`status`);--> statement-breakpoint
CREATE INDEX `municipality_membership_user_idx` ON `municipality_memberships` (`userId`);--> statement-breakpoint
CREATE INDEX `report_evidence_report_idx` ON `report_evidence` (`reportId`);--> statement-breakpoint
CREATE INDEX `report_status_history_report_idx` ON `report_status_history` (`reportId`,`createdAt`);--> statement-breakpoint
CREATE INDEX `reports_municipality_status_idx` ON `reports` (`municipalityId`,`status`);--> statement-breakpoint
CREATE INDEX `reports_citizen_idx` ON `reports` (`citizenId`);