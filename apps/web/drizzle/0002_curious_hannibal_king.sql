ALTER TABLE `audit_events` ADD `previousHash` varchar(64);--> statement-breakpoint
ALTER TABLE `audit_events` ADD `eventHash` varchar(64) NOT NULL;--> statement-breakpoint
ALTER TABLE `audit_events` ADD CONSTRAINT `audit_events_eventHash_unique` UNIQUE(`eventHash`);