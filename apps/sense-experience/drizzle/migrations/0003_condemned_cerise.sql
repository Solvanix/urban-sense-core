CREATE TABLE `sx_claim_evidence` (
	`id` varchar(64) NOT NULL,
	`claim_id` varchar(64) NOT NULL,
	`kind` enum('provider_note','external_url','document_reference') NOT NULL,
	`reference` text NOT NULL,
	`summary` text NOT NULL,
	`created_at` timestamp NOT NULL,
	CONSTRAINT `sx_claim_evidence_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `sx_claim_review_decision` (
	`id` varchar(64) NOT NULL,
	`claim_id` varchar(64) NOT NULL,
	`reviewer_id` varchar(128) NOT NULL,
	`outcome` enum('needs_evidence','verified','rejected') NOT NULL,
	`reason` text NOT NULL,
	`decided_at` timestamp NOT NULL,
	CONSTRAINT `sx_claim_review_decision_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `sx_provider_claim` (
	`id` varchar(64) NOT NULL,
	`interest_id` varchar(64) NOT NULL,
	`type` enum('accessibility','safety','availability','sustainability','certification','membership') NOT NULL,
	`statement` text NOT NULL,
	`state` enum('provider_stated','needs_evidence','verified','rejected') NOT NULL,
	`created_at` timestamp NOT NULL,
	`updated_at` timestamp NOT NULL,
	CONSTRAINT `sx_provider_claim_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `sx_audit_event` MODIFY COLUMN `event_type` enum('interest_submitted','interest_decided','claim_submitted','claim_evidence_added','claim_decided','reviewer_role_assigned','reviewer_role_revoked') NOT NULL;--> statement-breakpoint
ALTER TABLE `sx_audit_event` ADD `claim_id` varchar(64);--> statement-breakpoint
ALTER TABLE `sx_claim_evidence` ADD CONSTRAINT `sx_claim_evidence_claim_id_sx_provider_claim_id_fk` FOREIGN KEY (`claim_id`) REFERENCES `sx_provider_claim`(`id`) ON DELETE restrict ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE `sx_claim_review_decision` ADD CONSTRAINT `sx_claim_review_decision_claim_id_sx_provider_claim_id_fk` FOREIGN KEY (`claim_id`) REFERENCES `sx_provider_claim`(`id`) ON DELETE restrict ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE `sx_provider_claim` ADD CONSTRAINT `sx_provider_claim_interest_id_sx_provider_interest_id_fk` FOREIGN KEY (`interest_id`) REFERENCES `sx_provider_interest`(`id`) ON DELETE restrict ON UPDATE cascade;--> statement-breakpoint
CREATE INDEX `sx_claim_evidence_claim_created_idx` ON `sx_claim_evidence` (`claim_id`,`created_at`);--> statement-breakpoint
CREATE INDEX `sx_claim_review_decision_claim_decided_idx` ON `sx_claim_review_decision` (`claim_id`,`decided_at`);--> statement-breakpoint
CREATE INDEX `sx_provider_claim_interest_created_idx` ON `sx_provider_claim` (`interest_id`,`created_at`);--> statement-breakpoint
CREATE INDEX `sx_provider_claim_state_updated_idx` ON `sx_provider_claim` (`state`,`updated_at`);--> statement-breakpoint
ALTER TABLE `sx_audit_event` ADD CONSTRAINT `sx_audit_event_claim_id_sx_provider_claim_id_fk` FOREIGN KEY (`claim_id`) REFERENCES `sx_provider_claim`(`id`) ON DELETE restrict ON UPDATE cascade;--> statement-breakpoint
CREATE INDEX `sx_audit_event_claim_idx` ON `sx_audit_event` (`claim_id`);