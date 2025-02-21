PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_games_table` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`hltbId` integer NOT NULL,
	`title` text NOT NULL,
	`cover` text NOT NULL,
	`platform` text NOT NULL,
	`timeToComplete` integer NOT NULL,
	`status` text NOT NULL,
	`owner_email` text,
	FOREIGN KEY (`owner_email`) REFERENCES `users_table`(`email`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
INSERT INTO `__new_games_table`("id", "hltbId", "title", "cover", "platform", "timeToComplete", "status", "owner_email") SELECT "id", "hltbId", "title", "cover", "platform", "timeToComplete", "status", "owner_email" FROM `games_table`;--> statement-breakpoint
DROP TABLE `games_table`;--> statement-breakpoint
ALTER TABLE `__new_games_table` RENAME TO `games_table`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
CREATE UNIQUE INDEX `games_table_hltbId_unique` ON `games_table` (`hltbId`);