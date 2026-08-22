ALTER TABLE `sx_provider_interest` ADD `public_reference` varchar(32);--> statement-breakpoint
ALTER TABLE `sx_provider_interest` ADD `status_access_hash` varchar(128);--> statement-breakpoint
UPDATE `sx_provider_interest` SET `public_reference` = CONCAT('SX-L-', SUBSTR(SHA2(`id`, 256), 1, 27)), `status_access_hash` = 'legacy-record-without-status-access' WHERE `public_reference` IS NULL;--> statement-breakpoint
ALTER TABLE `sx_provider_interest` MODIFY COLUMN `public_reference` varchar(32) NOT NULL;--> statement-breakpoint
ALTER TABLE `sx_provider_interest` MODIFY COLUMN `status_access_hash` varchar(128) NOT NULL;--> statement-breakpoint
ALTER TABLE `sx_provider_interest` ADD CONSTRAINT `sx_provider_interest_public_reference_unique` UNIQUE(`public_reference`);
