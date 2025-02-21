CREATE TABLE `games_table` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`hltbId` integer,
	`title` text NOT NULL,
	`cover` text NOT NULL,
	`platform` text NOT NULL,
	`timeToComplete` integer NOT NULL,
	`status` text NOT NULL,
	`owner_email` text,
	FOREIGN KEY (`owner_email`) REFERENCES `users_table`(`email`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `games_table_hltbId_unique` ON `games_table` (`hltbId`);--> statement-breakpoint
CREATE TABLE `users_table` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`email` text NOT NULL,
	`picture` text NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `users_table_email_unique` ON `users_table` (`email`);