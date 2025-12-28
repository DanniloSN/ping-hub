-- DropForeignKey
ALTER TABLE `InstancePing` DROP FOREIGN KEY `InstancePing_instanceId_fkey`;

-- DropIndex
DROP INDEX `InstancePing_instanceId_fkey` ON `InstancePing`;

-- AlterTable
ALTER TABLE `User` ADD COLUMN `settings` JSON NOT NULL,
    ADD COLUMN `type` ENUM('ADMIN', 'USER') NOT NULL DEFAULT 'USER',
    ADD COLUMN `whatsappApiInstanceName` VARCHAR(191) NOT NULL DEFAULT '',
    ADD COLUMN `whatsappApiInstanceToken` TEXT NOT NULL DEFAULT '';

-- AddForeignKey
ALTER TABLE `InstancePing` ADD CONSTRAINT `InstancePing_instanceId_fkey` FOREIGN KEY (`instanceId`) REFERENCES `Instance`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
