/*
  Warnings:

  - The primary key for the `comments` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `creation_time` on the `comments` table. All the data in the column will be lost.
  - You are about to drop the column `fk_user` on the `comments` table. All the data in the column will be lost.
  - You are about to drop the column `id_comment` on the `comments` table. All the data in the column will be lost.
  - You are about to alter the column `id_review` on the `comments` table. The data in that column could be lost. The data in that column will be cast from `Char(15)` to `Int`.
  - The primary key for the `refreshtokens` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `pk_user` on the `refreshtokens` table. All the data in the column will be lost.
  - You are about to drop the column `creation_time` on the `reviews` table. All the data in the column will be lost.
  - You are about to drop the column `fk_user` on the `reviews` table. All the data in the column will be lost.
  - You are about to drop the column `id_external` on the `reviews` table. All the data in the column will be lost.
  - You are about to drop the column `id_review` on the `reviews` table. All the data in the column will be lost.
  - You are about to drop the column `review_type` on the `reviews` table. All the data in the column will be lost.
  - The primary key for the `users` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id_user` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `pk_user` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `username` on the `users` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[uuid]` on the table `reviews` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[id_user,id_entity,entity_type]` on the table `reviews` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[uuid]` on the table `users` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `id` to the `comments` table without a default value. This is not possible if the table is not empty.
  - Added the required column `id_user` to the `comments` table without a default value. This is not possible if the table is not empty.
  - Added the required column `id_user` to the `refreshtokens` table without a default value. This is not possible if the table is not empty.
  - Added the required column `entity_type` to the `reviews` table without a default value. This is not possible if the table is not empty.
  - Added the required column `id` to the `reviews` table without a default value. This is not possible if the table is not empty.
  - Added the required column `id_entity` to the `reviews` table without a default value. This is not possible if the table is not empty.
  - Added the required column `id_user` to the `reviews` table without a default value. This is not possible if the table is not empty.
  - Added the required column `rating` to the `reviews` table without a default value. This is not possible if the table is not empty.
  - Added the required column `uuid` to the `reviews` table without a default value. This is not possible if the table is not empty.
  - Added the required column `id` to the `users` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `users` table without a default value. This is not possible if the table is not empty.
  - Added the required column `uuid` to the `users` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX `fk_user` ON `comments`;

-- DropIndex
DROP INDEX `fk_user` ON `reviews`;

-- DropIndex
DROP INDEX `id_review` ON `reviews`;

-- DropIndex
DROP INDEX `id_user` ON `users`;

-- AlterTable
ALTER TABLE `comments` DROP PRIMARY KEY,
    DROP COLUMN `creation_time`,
    DROP COLUMN `fk_user`,
    DROP COLUMN `id_comment`,
    ADD COLUMN `create_time` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    ADD COLUMN `id` INTEGER NOT NULL AUTO_INCREMENT,
    ADD COLUMN `id_user` INTEGER NOT NULL,
    ADD COLUMN `last_edit_time` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    MODIFY `id_review` INTEGER NOT NULL,
    ADD PRIMARY KEY (`id`);

-- AlterTable
ALTER TABLE `refreshtokens` DROP PRIMARY KEY,
    DROP COLUMN `pk_user`,
    ADD COLUMN `id_user` INTEGER NOT NULL,
    ADD PRIMARY KEY (`id_user`);

-- AlterTable
ALTER TABLE `reviews` DROP COLUMN `creation_time`,
    DROP COLUMN `fk_user`,
    DROP COLUMN `id_external`,
    DROP COLUMN `id_review`,
    DROP COLUMN `review_type`,
    ADD COLUMN `create_time` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    ADD COLUMN `entity_type` ENUM('movie', 'series', 'game', 'book', 'music') NOT NULL,
    ADD COLUMN `id` INTEGER NOT NULL AUTO_INCREMENT,
    ADD COLUMN `id_entity` VARCHAR(200) NOT NULL,
    ADD COLUMN `id_user` INTEGER NOT NULL,
    ADD COLUMN `last_edit_time` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    ADD COLUMN `rating` TINYINT UNSIGNED NOT NULL,
    ADD COLUMN `uuid` CHAR(15) NOT NULL,
    ADD PRIMARY KEY (`id`);

-- AlterTable
ALTER TABLE `users` DROP PRIMARY KEY,
    DROP COLUMN `id_user`,
    DROP COLUMN `pk_user`,
    DROP COLUMN `username`,
    ADD COLUMN `id` INTEGER NOT NULL AUTO_INCREMENT,
    ADD COLUMN `name` VARCHAR(50) NOT NULL,
    ADD COLUMN `uuid` CHAR(15) NOT NULL,
    ADD PRIMARY KEY (`id`);

-- CreateIndex
CREATE INDEX `id_user` ON `comments`(`id_user`);

-- CreateIndex
CREATE UNIQUE INDEX `uuid` ON `reviews`(`uuid`);

-- CreateIndex
CREATE UNIQUE INDEX `id_user` ON `reviews`(`id_user`, `id_entity`, `entity_type`);

-- CreateIndex
CREATE UNIQUE INDEX `uuid` ON `users`(`uuid`);
