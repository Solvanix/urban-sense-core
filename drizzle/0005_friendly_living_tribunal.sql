CREATE TABLE `product_events` (
	`id` int AUTO_INCREMENT NOT NULL,
	`productId` int NOT NULL,
	`eventType` enum('issued','verified_purchase','transferred','reported_lost','found','handoff','returned') NOT NULL,
	`actorUserId` int,
	`municipalityId` int,
	`publicNote` varchar(500),
	`evidenceHash` varchar(128),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `product_events_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `product_identities` (
	`id` int AUTO_INCREMENT NOT NULL,
	`publicReference` varchar(40) NOT NULL,
	`tagToken` varchar(96) NOT NULL,
	`providerUserId` int NOT NULL,
	`municipalityId` int,
	`productType` varchar(80) NOT NULL,
	`title` varchar(160) NOT NULL,
	`description` text NOT NULL,
	`provenance` text NOT NULL,
	`purchaseReferenceHash` varchar(128),
	`status` enum('active','suspended','claimed') NOT NULL DEFAULT 'active',
	`recoveryStatus` enum('protected','reported_lost','found','handoff_ready','returned') NOT NULL DEFAULT 'protected',
	`publicContactEnabled` boolean NOT NULL DEFAULT true,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `product_identities_id` PRIMARY KEY(`id`),
	CONSTRAINT `product_identities_publicReference_unique` UNIQUE(`publicReference`),
	CONSTRAINT `product_identities_tagToken_unique` UNIQUE(`tagToken`)
);
--> statement-breakpoint
CREATE TABLE `recovery_cases` (
	`id` int AUTO_INCREMENT NOT NULL,
	`publicReference` varchar(40) NOT NULL,
	`productId` int NOT NULL,
	`finderUserId` int,
	`municipalityId` int,
	`status` enum('open','under_review','found','handoff_ready','returned','closed') NOT NULL DEFAULT 'open',
	`finderMessage` varchar(700),
	`municipalityNote` varchar(700),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `recovery_cases_id` PRIMARY KEY(`id`),
	CONSTRAINT `recovery_cases_publicReference_unique` UNIQUE(`publicReference`)
);
--> statement-breakpoint
ALTER TABLE `product_events` ADD CONSTRAINT `product_events_productId_product_identities_id_fk` FOREIGN KEY (`productId`) REFERENCES `product_identities`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `product_events` ADD CONSTRAINT `product_events_actorUserId_users_id_fk` FOREIGN KEY (`actorUserId`) REFERENCES `users`(`id`) ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `product_events` ADD CONSTRAINT `product_events_municipalityId_municipalities_id_fk` FOREIGN KEY (`municipalityId`) REFERENCES `municipalities`(`id`) ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `product_identities` ADD CONSTRAINT `product_identities_providerUserId_users_id_fk` FOREIGN KEY (`providerUserId`) REFERENCES `users`(`id`) ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `product_identities` ADD CONSTRAINT `product_identities_municipalityId_municipalities_id_fk` FOREIGN KEY (`municipalityId`) REFERENCES `municipalities`(`id`) ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `recovery_cases` ADD CONSTRAINT `recovery_cases_productId_product_identities_id_fk` FOREIGN KEY (`productId`) REFERENCES `product_identities`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `recovery_cases` ADD CONSTRAINT `recovery_cases_finderUserId_users_id_fk` FOREIGN KEY (`finderUserId`) REFERENCES `users`(`id`) ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `recovery_cases` ADD CONSTRAINT `recovery_cases_municipalityId_municipalities_id_fk` FOREIGN KEY (`municipalityId`) REFERENCES `municipalities`(`id`) ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE INDEX `product_events_product_idx` ON `product_events` (`productId`,`createdAt`);--> statement-breakpoint
CREATE INDEX `product_identity_provider_idx` ON `product_identities` (`providerUserId`,`status`);--> statement-breakpoint
CREATE INDEX `product_identity_municipality_idx` ON `product_identities` (`municipalityId`,`recoveryStatus`);--> statement-breakpoint
CREATE INDEX `recovery_cases_product_idx` ON `recovery_cases` (`productId`,`status`);--> statement-breakpoint
CREATE INDEX `recovery_cases_municipality_idx` ON `recovery_cases` (`municipalityId`,`status`);