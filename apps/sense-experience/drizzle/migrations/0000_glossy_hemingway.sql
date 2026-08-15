CREATE TABLE `sx_audit_event` (
	`id` varchar(64) NOT NULL,
	`event_type` enum('interest_submitted','interest_decided') NOT NULL,
	`interest_id` varchar(64) NOT NULL,
	`actor_id` varchar(128),
	`occurred_at` timestamp NOT NULL,
	CONSTRAINT `sx_audit_event_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `sx_interest_review_decision` (
	`id` varchar(64) NOT NULL,
	`interest_id` varchar(64) NOT NULL,
	`reviewer_id` varchar(128) NOT NULL,
	`outcome` enum('invited_to_onboard','not_in_current_pilot') NOT NULL,
	`reason` text NOT NULL,
	`decided_at` timestamp NOT NULL,
	CONSTRAINT `sx_interest_review_decision_id` PRIMARY KEY(`id`),
	CONSTRAINT `sx_interest_review_decision_one_per_interest` UNIQUE(`interest_id`)
);
--> statement-breakpoint
CREATE TABLE `sx_provider_interest` (
	`id` varchar(64) NOT NULL,
	`brand_name` varchar(120) NOT NULL,
	`provider_type` varchar(64) NOT NULL,
	`area` varchar(120) NOT NULL,
	`contact_name` varchar(120) NOT NULL,
	`contact_channel` varchar(160) NOT NULL,
	`short_description` text NOT NULL,
	`review_consent` enum('granted') NOT NULL,
	`status` enum('interest_submitted','invited_to_onboard','not_in_current_pilot') NOT NULL,
	`created_at` timestamp NOT NULL,
	`updated_at` timestamp NOT NULL,
	CONSTRAINT `sx_provider_interest_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `sx_audit_event` ADD CONSTRAINT `sx_audit_event_interest_id_sx_provider_interest_id_fk` FOREIGN KEY (`interest_id`) REFERENCES `sx_provider_interest`(`id`) ON DELETE restrict ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE `sx_interest_review_decision` ADD CONSTRAINT `sx_interest_review_decision_interest_id_sx_provider_interest_id_fk` FOREIGN KEY (`interest_id`) REFERENCES `sx_provider_interest`(`id`) ON DELETE restrict ON UPDATE cascade;--> statement-breakpoint
CREATE INDEX `sx_audit_event_interest_idx` ON `sx_audit_event` (`interest_id`);--> statement-breakpoint
CREATE INDEX `sx_interest_review_decision_interest_idx` ON `sx_interest_review_decision` (`interest_id`);--> statement-breakpoint
CREATE INDEX `sx_provider_interest_status_created_idx` ON `sx_provider_interest` (`status`,`created_at`);