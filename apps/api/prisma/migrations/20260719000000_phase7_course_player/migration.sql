-- Phase 7 — Course Player

-- Module
CREATE TABLE `Module` (
  `id` VARCHAR(191) NOT NULL,
  `courseId` VARCHAR(191) NOT NULL,
  `title` VARCHAR(191) NOT NULL,
  `description` TEXT NULL,
  `order` INT NOT NULL DEFAULT 0,
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` DATETIME(3) NOT NULL,
  PRIMARY KEY (`id`),
  INDEX `Module_courseId_order_idx` (`courseId`, `order`),
  CONSTRAINT `Module_courseId_fkey` FOREIGN KEY (`courseId`) REFERENCES `Course`(`id`) ON DELETE CASCADE ON UPDATE CASCADE
) DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Lesson
CREATE TABLE `Lesson` (
  `id` VARCHAR(191) NOT NULL,
  `moduleId` VARCHAR(191) NOT NULL,
  `title` VARCHAR(191) NOT NULL,
  `kind` ENUM('video','pdf','text','quiz') NOT NULL DEFAULT 'video',
  `order` INT NOT NULL DEFAULT 0,
  `contentUrl` TEXT NULL,
  `body` LONGTEXT NULL,
  `durationMin` INT NULL,
  `isFreePreview` BOOLEAN NOT NULL DEFAULT false,
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` DATETIME(3) NOT NULL,
  PRIMARY KEY (`id`),
  INDEX `Lesson_moduleId_order_idx` (`moduleId`, `order`),
  CONSTRAINT `Lesson_moduleId_fkey` FOREIGN KEY (`moduleId`) REFERENCES `Module`(`id`) ON DELETE CASCADE ON UPDATE CASCADE
) DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- LessonProgress
CREATE TABLE `LessonProgress` (
  `id` VARCHAR(191) NOT NULL,
  `userId` VARCHAR(191) NOT NULL,
  `lessonId` VARCHAR(191) NOT NULL,
  `status` ENUM('not_started','in_progress','completed') NOT NULL DEFAULT 'not_started',
  `watchedSeconds` INT NOT NULL DEFAULT 0,
  `completedAt` DATETIME(3) NULL,
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` DATETIME(3) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `LessonProgress_userId_lessonId_key` (`userId`, `lessonId`),
  INDEX `LessonProgress_userId_idx` (`userId`),
  CONSTRAINT `LessonProgress_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `LessonProgress_lessonId_fkey` FOREIGN KEY (`lessonId`) REFERENCES `Lesson`(`id`) ON DELETE CASCADE ON UPDATE CASCADE
) DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Quiz
CREATE TABLE `Quiz` (
  `id` VARCHAR(191) NOT NULL,
  `lessonId` VARCHAR(191) NOT NULL,
  `title` VARCHAR(191) NOT NULL,
  `passMarks` INT NOT NULL DEFAULT 60,
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` DATETIME(3) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `Quiz_lessonId_key` (`lessonId`),
  CONSTRAINT `Quiz_lessonId_fkey` FOREIGN KEY (`lessonId`) REFERENCES `Lesson`(`id`) ON DELETE CASCADE ON UPDATE CASCADE
) DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- QuizQuestion
CREATE TABLE `QuizQuestion` (
  `id` VARCHAR(191) NOT NULL,
  `quizId` VARCHAR(191) NOT NULL,
  `order` INT NOT NULL DEFAULT 0,
  `prompt` TEXT NOT NULL,
  `options` JSON NOT NULL,
  `correctIndex` INT NOT NULL,
  `points` INT NOT NULL DEFAULT 10,
  PRIMARY KEY (`id`),
  INDEX `QuizQuestion_quizId_order_idx` (`quizId`, `order`),
  CONSTRAINT `QuizQuestion_quizId_fkey` FOREIGN KEY (`quizId`) REFERENCES `Quiz`(`id`) ON DELETE CASCADE ON UPDATE CASCADE
) DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- QuizAttempt
CREATE TABLE `QuizAttempt` (
  `id` VARCHAR(191) NOT NULL,
  `quizId` VARCHAR(191) NOT NULL,
  `userId` VARCHAR(191) NOT NULL,
  `score` INT NOT NULL DEFAULT 0,
  `totalMarks` INT NOT NULL DEFAULT 0,
  `passed` BOOLEAN NOT NULL DEFAULT false,
  `answers` JSON NOT NULL,
  `submittedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  INDEX `QuizAttempt_userId_idx` (`userId`),
  INDEX `QuizAttempt_quizId_submittedAt_idx` (`quizId`, `submittedAt`),
  CONSTRAINT `QuizAttempt_quizId_fkey` FOREIGN KEY (`quizId`) REFERENCES `Quiz`(`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `QuizAttempt_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE
) DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
