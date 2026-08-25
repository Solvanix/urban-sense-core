CREATE TABLE `earned_point_events` (
	`id` int AUTO_INCREMENT NOT NULL,
	`publicReference` varchar(40) NOT NULL,
	`beneficiaryUserId` int NOT NULL,
	`points` int NOT NULL,
	`status` enum('pending_review','approved','voided') NOT NULL DEFAULT 'pending_review',
	`reason` varchar(500) NOT NULL,
	`evidenceReference` varchar(500) NOT NULL,
	`createdByUserId` int NOT NULL,
	`reviewedByUserId` int,
	`reviewReason` varchar(500),
	`reviewedAt` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `earned_point_events_id` PRIMARY KEY(`id`),
	CONSTRAINT `earned_point_events_publicReference_unique` UNIQUE(`publicReference`)
);
--> statement-breakpoint
ALTER TABLE `earned_point_events` ADD CONSTRAINT `earned_point_events_beneficiaryUserId_users_id_fk` FOREIGN KEY (`beneficiaryUserId`) REFERENCES `users`(`id`) ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `earned_point_events` ADD CONSTRAINT `earned_point_events_createdByUserId_users_id_fk` FOREIGN KEY (`createdByUserId`) REFERENCES `users`(`id`) ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `earned_point_events` ADD CONSTRAINT `earned_point_events_reviewedByUserId_users_id_fk` FOREIGN KEY (`reviewedByUserId`) REFERENCES `users`(`id`) ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
CREATE INDEX `earned_point_events_beneficiary_idx` ON `earned_point_events` (`beneficiaryUserId`,`status`);--> statement-breakpoint
CREATE INDEX `earned_point_events_status_idx` ON `earned_point_events` (`status`,`createdAt`);