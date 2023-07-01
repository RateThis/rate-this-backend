-- CreateTable
CREATE TABLE `comments` (
    `id_comment` INTEGER NOT NULL AUTO_INCREMENT,
    `fk_user` INTEGER NOT NULL,
    `id_review` CHAR(15) NOT NULL,
    `text` VARCHAR(10000) NULL,
    `creation_time` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    INDEX `fk_user`(`fk_user`),
    INDEX `id_review`(`id_review`),
    PRIMARY KEY (`id_comment`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `reviews` (
    `id_review` CHAR(15) NOT NULL,
    `id_external` VARCHAR(200) NOT NULL,
    `fk_user` INTEGER NOT NULL,
    `review_type` ENUM('movie', 'series', 'game', 'book', 'music') NOT NULL,
    `text` VARCHAR(10000) NULL,
    `creation_time` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    UNIQUE INDEX `id_review`(`id_review`),
    INDEX `fk_user`(`fk_user`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `users` (
    `pk_user` INTEGER NOT NULL AUTO_INCREMENT,
    `id_user` CHAR(15) NOT NULL,
    `email` VARCHAR(255) NOT NULL,
    `username` VARCHAR(50) NOT NULL,
    `password` CHAR(60) NOT NULL,
    `register_time` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    UNIQUE INDEX `id_user`(`id_user`),
    UNIQUE INDEX `email`(`email`),
    PRIMARY KEY (`pk_user`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

