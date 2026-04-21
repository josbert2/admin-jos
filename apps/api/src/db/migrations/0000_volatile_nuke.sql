CREATE TABLE `contact_messages` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(200) NOT NULL,
	`email` varchar(200) NOT NULL,
	`subject` varchar(300),
	`message` text NOT NULL,
	`status` enum('new','read','archived') NOT NULL DEFAULT 'new',
	`created_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `contact_messages_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `experiences` (
	`id` int AUTO_INCREMENT NOT NULL,
	`company` varchar(200) NOT NULL,
	`role` varchar(200) NOT NULL,
	`location` varchar(200),
	`description` text,
	`start_date` date NOT NULL,
	`end_date` date,
	`current` boolean NOT NULL DEFAULT false,
	`order` int NOT NULL DEFAULT 0,
	`is_published` boolean NOT NULL DEFAULT true,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `experiences_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `projects` (
	`id` int AUTO_INCREMENT NOT NULL,
	`title` varchar(200) NOT NULL,
	`slug` varchar(200) NOT NULL,
	`summary` varchar(500),
	`description` text,
	`content` text,
	`cover_image` varchar(500),
	`images` json DEFAULT ('[]'),
	`tags` json DEFAULT ('[]'),
	`stack` json DEFAULT ('[]'),
	`link_live` varchar(500),
	`link_repo` varchar(500),
	`client` varchar(200),
	`date` date,
	`order` int NOT NULL DEFAULT 0,
	`is_best` boolean NOT NULL DEFAULT false,
	`is_published` boolean NOT NULL DEFAULT true,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `projects_id` PRIMARY KEY(`id`),
	CONSTRAINT `projects_slug_unique` UNIQUE(`slug`)
);
--> statement-breakpoint
CREATE TABLE `skills` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(120) NOT NULL,
	`category` varchar(120),
	`level` int NOT NULL DEFAULT 0,
	`icon` varchar(500),
	`order` int NOT NULL DEFAULT 0,
	`is_published` boolean NOT NULL DEFAULT true,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `skills_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` int AUTO_INCREMENT NOT NULL,
	`email` varchar(190) NOT NULL,
	`password_hash` varchar(255) NOT NULL,
	`name` varchar(120),
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `users_id` PRIMARY KEY(`id`),
	CONSTRAINT `users_email_unique` UNIQUE(`email`)
);
