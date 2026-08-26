CREATE TABLE `service_providers` (
	`id` int AUTO_INCREMENT NOT NULL,
	`ownerUserId` int NOT NULL,
	`municipalityId` int,
	`name` varchar(160) NOT NULL,
	`category` varchar(80) NOT NULL,
	`publicProfileUrl` varchar(520),
	`status` enum('pending','verified','suspended') NOT NULL DEFAULT 'pending',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `service_providers_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `product_identities` ADD `serviceProviderId` int;--> statement-breakpoint
ALTER TABLE `service_providers` ADD CONSTRAINT `service_providers_ownerUserId_users_id_fk` FOREIGN KEY (`ownerUserId`) REFERENCES `users`(`id`) ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `service_providers` ADD CONSTRAINT `service_providers_municipalityId_municipalities_id_fk` FOREIGN KEY (`municipalityId`) REFERENCES `municipalities`(`id`) ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE INDEX `service_provider_owner_idx` ON `service_providers` (`ownerUserId`,`status`);--> statement-breakpoint
CREATE INDEX `service_provider_municipality_idx` ON `service_providers` (`municipalityId`,`status`);--> statement-breakpoint
ALTER TABLE `product_identities` ADD CONSTRAINT `product_identities_serviceProviderId_service_providers_id_fk` FOREIGN KEY (`serviceProviderId`) REFERENCES `service_providers`(`id`) ON DELETE set null ON UPDATE no action;