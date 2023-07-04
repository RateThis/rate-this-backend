-- CreateTable
CREATE TABLE `refreshtokens` (
    `pk_user` INTEGER NOT NULL,
    `refresh_token` VARCHAR(512) NOT NULL,

    PRIMARY KEY (`pk_user`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
