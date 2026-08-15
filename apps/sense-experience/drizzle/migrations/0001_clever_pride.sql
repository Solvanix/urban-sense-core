CREATE TABLE `sx_reviewer_identity` (
	`id` varchar(64) NOT NULL,
	`provider` enum('manus_oauth','external_oidc') NOT NULL,
	`subject` varchar(191) NOT NULL,
	`display_name` varchar(160),
	`state` enum('active','revoked') NOT NULL,
	`created_at` timestamp NOT NULL,
	`updated_at` timestamp NOT NULL,
	CONSTRAINT `sx_reviewer_identity_id` PRIMARY KEY(`id`),
	CONSTRAINT `sx_reviewer_identity_provider_subject_unique` UNIQUE(`provider`,`subject`)
);
--> statement-breakpoint
CREATE TABLE `sx_reviewer_role_assignment` (
	`id` varchar(64) NOT NULL,
	`reviewer_identity_id` varchar(64) NOT NULL,
	`role` enum('reviewer','administrator') NOT NULL,
	`state` enum('active','revoked') NOT NULL,
	`active_key` varchar(64),
	`assigned_by_identity_id` varchar(64),
	`reason` text NOT NULL,
	`assigned_at` timestamp NOT NULL,
	`revoked_at` timestamp,
	CONSTRAINT `sx_reviewer_role_assignment_id` PRIMARY KEY(`id`),
	CONSTRAINT `sx_reviewer_role_assignment_active_key_unique` UNIQUE(`active_key`)
);
--> statement-breakpoint
ALTER TABLE `sx_audit_event` MODIFY COLUMN `event_type` enum('interest_submitted','interest_decided','reviewer_role_assigned','reviewer_role_revoked') NOT NULL;--> statement-breakpoint
ALTER TABLE `sx_audit_event` MODIFY COLUMN `interest_id` varchar(64);--> statement-breakpoint
ALTER TABLE `sx_audit_event` ADD `reviewer_identity_id` varchar(64);--> statement-breakpoint
ALTER TABLE `sx_reviewer_role_assignment` ADD CONSTRAINT `sx_reviewer_role_assignment_reviewer_identity_id_sx_reviewer_identity_id_fk` FOREIGN KEY (`reviewer_identity_id`) REFERENCES `sx_reviewer_identity`(`id`) ON DELETE restrict ON UPDATE cascade;--> statement-breakpoint
CREATE INDEX `sx_reviewer_role_assignment_identity_state_idx` ON `sx_reviewer_role_assignment` (`reviewer_identity_id`,`state`);