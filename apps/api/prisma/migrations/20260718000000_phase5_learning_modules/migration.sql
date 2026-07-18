-- Phase 5: Learning modules (assignments, exams, notices, notifications, payments, events)
-- + Course gap-fill columns.

-- Course additions
ALTER TABLE `Course`
  ADD COLUMN `category`        VARCHAR(191) NULL,
  ADD COLUMN `courseType`      VARCHAR(191) NULL,
  ADD COLUMN `durationMinutes` INT NULL,
  ADD COLUMN `longDescription` TEXT NULL;

CREATE INDEX `Course_category_idx` ON `Course`(`category`);

-- Assignments ---------------------------------------------------
CREATE TABLE `Assignment` (
  `id`          VARCHAR(191) NOT NULL,
  `courseId`    VARCHAR(191) NOT NULL,
  `title`       VARCHAR(191) NOT NULL,
  `description` TEXT NULL,
  `dueAt`       DATETIME(3) NULL,
  `points`      INT NOT NULL DEFAULT 100,
  `createdAt`   DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt`   DATETIME(3) NOT NULL,
  INDEX `Assignment_courseId_idx`(`courseId`),
  INDEX `Assignment_dueAt_idx`(`dueAt`),
  PRIMARY KEY (`id`),
  CONSTRAINT `Assignment_courseId_fkey` FOREIGN KEY (`courseId`) REFERENCES `Course`(`id`) ON DELETE CASCADE ON UPDATE CASCADE
) DEFAULT CHARSET=utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE `AssignmentSubmission` (
  `id`           VARCHAR(191) NOT NULL,
  `assignmentId` VARCHAR(191) NOT NULL,
  `userId`       VARCHAR(191) NOT NULL,
  `status`       ENUM('pending','submitted','graded','late') NOT NULL DEFAULT 'pending',
  `score`        INT NULL,
  `feedback`     TEXT NULL,
  `submittedAt`  DATETIME(3) NULL,
  `createdAt`    DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt`    DATETIME(3) NOT NULL,
  UNIQUE KEY `AssignmentSubmission_assignmentId_userId_key`(`assignmentId`,`userId`),
  INDEX `AssignmentSubmission_userId_idx`(`userId`),
  PRIMARY KEY (`id`),
  CONSTRAINT `AssignmentSubmission_assignmentId_fkey` FOREIGN KEY (`assignmentId`) REFERENCES `Assignment`(`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `AssignmentSubmission_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE
) DEFAULT CHARSET=utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Exams ---------------------------------------------------------
CREATE TABLE `Exam` (
  `id`          VARCHAR(191) NOT NULL,
  `courseId`    VARCHAR(191) NOT NULL,
  `title`       VARCHAR(191) NOT NULL,
  `description` TEXT NULL,
  `scheduledAt` DATETIME(3) NOT NULL,
  `durationMin` INT NOT NULL DEFAULT 60,
  `totalMarks`  INT NOT NULL DEFAULT 100,
  `createdAt`   DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt`   DATETIME(3) NOT NULL,
  INDEX `Exam_courseId_idx`(`courseId`),
  INDEX `Exam_scheduledAt_idx`(`scheduledAt`),
  PRIMARY KEY (`id`),
  CONSTRAINT `Exam_courseId_fkey` FOREIGN KEY (`courseId`) REFERENCES `Course`(`id`) ON DELETE CASCADE ON UPDATE CASCADE
) DEFAULT CHARSET=utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE `ExamAttempt` (
  `id`          VARCHAR(191) NOT NULL,
  `examId`      VARCHAR(191) NOT NULL,
  `userId`      VARCHAR(191) NOT NULL,
  `score`       INT NULL,
  `status`      ENUM('pending','submitted','graded','late') NOT NULL DEFAULT 'pending',
  `submittedAt` DATETIME(3) NULL,
  `createdAt`   DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt`   DATETIME(3) NOT NULL,
  UNIQUE KEY `ExamAttempt_examId_userId_key`(`examId`,`userId`),
  INDEX `ExamAttempt_userId_idx`(`userId`),
  PRIMARY KEY (`id`),
  CONSTRAINT `ExamAttempt_examId_fkey` FOREIGN KEY (`examId`) REFERENCES `Exam`(`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `ExamAttempt_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE
) DEFAULT CHARSET=utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Notices & notifications --------------------------------------
CREATE TABLE `Notice` (
  `id`          VARCHAR(191) NOT NULL,
  `title`       VARCHAR(191) NOT NULL,
  `body`        TEXT NOT NULL,
  `audience`    ENUM('all','students','teachers') NOT NULL DEFAULT 'all',
  `publishedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `createdAt`   DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt`   DATETIME(3) NOT NULL,
  INDEX `Notice_publishedAt_idx`(`publishedAt`),
  INDEX `Notice_audience_idx`(`audience`),
  PRIMARY KEY (`id`)
) DEFAULT CHARSET=utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE `Notification` (
  `id`        VARCHAR(191) NOT NULL,
  `userId`    VARCHAR(191) NOT NULL,
  `title`     VARCHAR(191) NOT NULL,
  `body`      TEXT NOT NULL,
  `link`      VARCHAR(191) NULL,
  `readAt`    DATETIME(3) NULL,
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  INDEX `Notification_userId_readAt_idx`(`userId`,`readAt`),
  INDEX `Notification_createdAt_idx`(`createdAt`),
  PRIMARY KEY (`id`),
  CONSTRAINT `Notification_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE
) DEFAULT CHARSET=utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Payments ------------------------------------------------------
CREATE TABLE `Payment` (
  `id`          VARCHAR(191) NOT NULL,
  `userId`      VARCHAR(191) NOT NULL,
  `courseId`    VARCHAR(191) NULL,
  `amountCents` INT NOT NULL,
  `currency`    VARCHAR(191) NOT NULL DEFAULT 'BDT',
  `method`      VARCHAR(191) NOT NULL,
  `status`      ENUM('pending','success','failed','refunded') NOT NULL DEFAULT 'pending',
  `txnId`       VARCHAR(191) NULL,
  `note`        VARCHAR(191) NULL,
  `createdAt`   DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt`   DATETIME(3) NOT NULL,
  INDEX `Payment_userId_createdAt_idx`(`userId`,`createdAt`),
  INDEX `Payment_status_idx`(`status`),
  PRIMARY KEY (`id`),
  CONSTRAINT `Payment_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `Payment_courseId_fkey` FOREIGN KEY (`courseId`) REFERENCES `Course`(`id`) ON DELETE SET NULL ON UPDATE CASCADE
) DEFAULT CHARSET=utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Events --------------------------------------------------------
CREATE TABLE `Event` (
  `id`          VARCHAR(191) NOT NULL,
  `title`       VARCHAR(191) NOT NULL,
  `description` TEXT NULL,
  `startAt`     DATETIME(3) NOT NULL,
  `endAt`       DATETIME(3) NULL,
  `courseId`    VARCHAR(191) NULL,
  `kind`        ENUM('class_session','exam','holiday','other') NOT NULL DEFAULT 'other',
  `createdAt`   DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt`   DATETIME(3) NOT NULL,
  INDEX `Event_startAt_idx`(`startAt`),
  INDEX `Event_courseId_idx`(`courseId`),
  PRIMARY KEY (`id`),
  CONSTRAINT `Event_courseId_fkey` FOREIGN KEY (`courseId`) REFERENCES `Course`(`id`) ON DELETE SET NULL ON UPDATE CASCADE
) DEFAULT CHARSET=utf8mb4 COLLATE utf8mb4_unicode_ci;
