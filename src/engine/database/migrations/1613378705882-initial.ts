import {MigrationInterface, QueryRunner} from "typeorm";

export class initial1613378705882 implements MigrationInterface {
    name = 'initial1613378705882'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "settings" ("id" varchar(20) PRIMARY KEY NOT NULL, "valueJSON" text NOT NULL)`);
        await queryRunner.query(`CREATE TABLE "urls" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "address" varchar NOT NULL, "handler" varchar NOT NULL, "processed" boolean NOT NULL DEFAULT (0), "failed" boolean NOT NULL DEFAULT (0), "failureReason" text, "completedUTC" integer NOT NULL DEFAULT (0), "fileId" integer)`);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_792ca9643eaf7971a9dd1112a5" ON "urls" ("address") `);
        await queryRunner.query(`CREATE INDEX "IDX_b911a51a0637a4e27e0dd1ce23" ON "urls" ("fileId") `);
        await queryRunner.query(`CREATE TABLE "files" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "path" varchar NOT NULL, "mimeType" varchar NOT NULL, "size" integer NOT NULL, "shaHash" varchar(64) NOT NULL, "dHash" varchar, "hash1" varchar, "hash2" varchar, "hash3" varchar, "hash4" varchar, CONSTRAINT "UQ_93c04123b9642879843a20d971a" UNIQUE ("path"))`);
        await queryRunner.query(`CREATE INDEX "IDX_f6abfcac75948edeaea5b22678" ON "files" ("hash1") `);
        await queryRunner.query(`CREATE INDEX "IDX_2194756621203ab8d1de83e3c7" ON "files" ("hash2") `);
        await queryRunner.query(`CREATE INDEX "IDX_b0bdbefd12ad3b08dcd4b1671f" ON "files" ("hash3") `);
        await queryRunner.query(`CREATE INDEX "IDX_9560d52d1e438c4e75a9dade8c" ON "files" ("hash4") `);
        await queryRunner.query(`CREATE TABLE "sources" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "type" varchar(15) NOT NULL, "name" varchar(36) NOT NULL, "dataJSON" text NOT NULL DEFAULT (''), "sourceGroupId" integer NOT NULL)`);
        await queryRunner.query(`CREATE INDEX "IDX_f7b0aefc1003477ea326af1ac5" ON "sources" ("sourceGroupId") `);
        await queryRunner.query(`CREATE TABLE "source_groups" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "name" varchar(36) NOT NULL, "color" varchar(36) NOT NULL)`);
        await queryRunner.query(`CREATE TABLE "filters" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "forSubmissions" boolean NOT NULL, "field" varchar(20) NOT NULL, "comparator" varchar(2) NOT NULL, "valueJSON" text NOT NULL, "sourceGroupId" integer)`);
        await queryRunner.query(`CREATE INDEX "IDX_a1110777a20270c18440d32c4c" ON "filters" ("sourceGroupId") `);
        await queryRunner.query(`CREATE TABLE "downloads" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "albumID" text, "isAlbumParent" boolean NOT NULL DEFAULT (0), "parentSubmissionId" varchar, "parentCommentId" varchar, "urlId" integer)`);
        await queryRunner.query(`CREATE INDEX "IDX_337604abe2c3c9ab698cc9d294" ON "downloads" ("albumID") `);
        await queryRunner.query(`CREATE INDEX "IDX_eb6849e986a0678a61d97504bc" ON "downloads" ("parentSubmissionId") `);
        await queryRunner.query(`CREATE INDEX "IDX_5d63d7c074e60a34a228f9855d" ON "downloads" ("parentCommentId") `);
        await queryRunner.query(`CREATE INDEX "IDX_96db2e076ee5f721b37fd2ad5f" ON "downloads" ("urlId") `);
        await queryRunner.query(`CREATE TABLE "submissions" ("id" varchar PRIMARY KEY NOT NULL, "title" text NOT NULL, "author" varchar NOT NULL, "subreddit" varchar NOT NULL, "selfText" text NOT NULL, "score" integer NOT NULL, "isSelf" boolean NOT NULL, "createdUTC" integer NOT NULL, "firstFoundUTC" integer NOT NULL, "over18" boolean NOT NULL, "flairText" text, "processed" boolean NOT NULL DEFAULT (0), "shouldProcess" boolean NOT NULL DEFAULT (1))`);
        await queryRunner.query(`CREATE TABLE "comments" ("id" varchar PRIMARY KEY NOT NULL, "author" varchar NOT NULL, "subreddit" varchar NOT NULL, "selfText" text NOT NULL, "score" integer NOT NULL, "createdUTC" integer NOT NULL, "firstFoundUTC" integer NOT NULL, "parentRedditID" varchar NOT NULL, "permaLink" varchar NOT NULL, "rootSubmissionID" varchar NOT NULL, "processed" boolean NOT NULL DEFAULT (0), "parentSubmissionId" varchar, "parentCommentId" varchar)`);
        await queryRunner.query(`CREATE INDEX "IDX_e505fea3909af1657e54bc3049" ON "comments" ("parentSubmissionId") `);
        await queryRunner.query(`CREATE INDEX "IDX_4875672591221a61ace66f2d4f" ON "comments" ("parentCommentId") `);
        await queryRunner.query(`DROP INDEX "IDX_792ca9643eaf7971a9dd1112a5"`);
        await queryRunner.query(`DROP INDEX "IDX_b911a51a0637a4e27e0dd1ce23"`);
        await queryRunner.query(`CREATE TABLE "temporary_urls" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "address" varchar NOT NULL, "handler" varchar NOT NULL, "processed" boolean NOT NULL DEFAULT (0), "failed" boolean NOT NULL DEFAULT (0), "failureReason" text, "completedUTC" integer NOT NULL DEFAULT (0), "fileId" integer, CONSTRAINT "FK_b911a51a0637a4e27e0dd1ce23a" FOREIGN KEY ("fileId") REFERENCES "files" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "temporary_urls"("id", "address", "handler", "processed", "failed", "failureReason", "completedUTC", "fileId") SELECT "id", "address", "handler", "processed", "failed", "failureReason", "completedUTC", "fileId" FROM "urls"`);
        await queryRunner.query(`DROP TABLE "urls"`);
        await queryRunner.query(`ALTER TABLE "temporary_urls" RENAME TO "urls"`);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_792ca9643eaf7971a9dd1112a5" ON "urls" ("address") `);
        await queryRunner.query(`CREATE INDEX "IDX_b911a51a0637a4e27e0dd1ce23" ON "urls" ("fileId") `);
        await queryRunner.query(`DROP INDEX "IDX_f7b0aefc1003477ea326af1ac5"`);
        await queryRunner.query(`CREATE TABLE "temporary_sources" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "type" varchar(15) NOT NULL, "name" varchar(36) NOT NULL, "dataJSON" text NOT NULL DEFAULT (''), "sourceGroupId" integer NOT NULL, CONSTRAINT "FK_f7b0aefc1003477ea326af1ac54" FOREIGN KEY ("sourceGroupId") REFERENCES "source_groups" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "temporary_sources"("id", "type", "name", "dataJSON", "sourceGroupId") SELECT "id", "type", "name", "dataJSON", "sourceGroupId" FROM "sources"`);
        await queryRunner.query(`DROP TABLE "sources"`);
        await queryRunner.query(`ALTER TABLE "temporary_sources" RENAME TO "sources"`);
        await queryRunner.query(`CREATE INDEX "IDX_f7b0aefc1003477ea326af1ac5" ON "sources" ("sourceGroupId") `);
        await queryRunner.query(`DROP INDEX "IDX_a1110777a20270c18440d32c4c"`);
        await queryRunner.query(`CREATE TABLE "temporary_filters" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "forSubmissions" boolean NOT NULL, "field" varchar(20) NOT NULL, "comparator" varchar(2) NOT NULL, "valueJSON" text NOT NULL, "sourceGroupId" integer, CONSTRAINT "FK_a1110777a20270c18440d32c4c3" FOREIGN KEY ("sourceGroupId") REFERENCES "source_groups" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "temporary_filters"("id", "forSubmissions", "field", "comparator", "valueJSON", "sourceGroupId") SELECT "id", "forSubmissions", "field", "comparator", "valueJSON", "sourceGroupId" FROM "filters"`);
        await queryRunner.query(`DROP TABLE "filters"`);
        await queryRunner.query(`ALTER TABLE "temporary_filters" RENAME TO "filters"`);
        await queryRunner.query(`CREATE INDEX "IDX_a1110777a20270c18440d32c4c" ON "filters" ("sourceGroupId") `);
        await queryRunner.query(`DROP INDEX "IDX_337604abe2c3c9ab698cc9d294"`);
        await queryRunner.query(`DROP INDEX "IDX_eb6849e986a0678a61d97504bc"`);
        await queryRunner.query(`DROP INDEX "IDX_5d63d7c074e60a34a228f9855d"`);
        await queryRunner.query(`DROP INDEX "IDX_96db2e076ee5f721b37fd2ad5f"`);
        await queryRunner.query(`CREATE TABLE "temporary_downloads" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "albumID" text, "isAlbumParent" boolean NOT NULL DEFAULT (0), "parentSubmissionId" varchar, "parentCommentId" varchar, "urlId" integer, CONSTRAINT "FK_eb6849e986a0678a61d97504bcd" FOREIGN KEY ("parentSubmissionId") REFERENCES "submissions" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION, CONSTRAINT "FK_5d63d7c074e60a34a228f9855de" FOREIGN KEY ("parentCommentId") REFERENCES "comments" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION, CONSTRAINT "FK_96db2e076ee5f721b37fd2ad5f8" FOREIGN KEY ("urlId") REFERENCES "urls" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "temporary_downloads"("id", "albumID", "isAlbumParent", "parentSubmissionId", "parentCommentId", "urlId") SELECT "id", "albumID", "isAlbumParent", "parentSubmissionId", "parentCommentId", "urlId" FROM "downloads"`);
        await queryRunner.query(`DROP TABLE "downloads"`);
        await queryRunner.query(`ALTER TABLE "temporary_downloads" RENAME TO "downloads"`);
        await queryRunner.query(`CREATE INDEX "IDX_337604abe2c3c9ab698cc9d294" ON "downloads" ("albumID") `);
        await queryRunner.query(`CREATE INDEX "IDX_eb6849e986a0678a61d97504bc" ON "downloads" ("parentSubmissionId") `);
        await queryRunner.query(`CREATE INDEX "IDX_5d63d7c074e60a34a228f9855d" ON "downloads" ("parentCommentId") `);
        await queryRunner.query(`CREATE INDEX "IDX_96db2e076ee5f721b37fd2ad5f" ON "downloads" ("urlId") `);
        await queryRunner.query(`DROP INDEX "IDX_e505fea3909af1657e54bc3049"`);
        await queryRunner.query(`DROP INDEX "IDX_4875672591221a61ace66f2d4f"`);
        await queryRunner.query(`CREATE TABLE "temporary_comments" ("id" varchar PRIMARY KEY NOT NULL, "author" varchar NOT NULL, "subreddit" varchar NOT NULL, "selfText" text NOT NULL, "score" integer NOT NULL, "createdUTC" integer NOT NULL, "firstFoundUTC" integer NOT NULL, "parentRedditID" varchar NOT NULL, "permaLink" varchar NOT NULL, "rootSubmissionID" varchar NOT NULL, "processed" boolean NOT NULL DEFAULT (0), "parentSubmissionId" varchar, "parentCommentId" varchar, CONSTRAINT "FK_e505fea3909af1657e54bc30494" FOREIGN KEY ("parentSubmissionId") REFERENCES "submissions" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION, CONSTRAINT "FK_4875672591221a61ace66f2d4f9" FOREIGN KEY ("parentCommentId") REFERENCES "comments" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "temporary_comments"("id", "author", "subreddit", "selfText", "score", "createdUTC", "firstFoundUTC", "parentRedditID", "permaLink", "rootSubmissionID", "processed", "parentSubmissionId", "parentCommentId") SELECT "id", "author", "subreddit", "selfText", "score", "createdUTC", "firstFoundUTC", "parentRedditID", "permaLink", "rootSubmissionID", "processed", "parentSubmissionId", "parentCommentId" FROM "comments"`);
        await queryRunner.query(`DROP TABLE "comments"`);
        await queryRunner.query(`ALTER TABLE "temporary_comments" RENAME TO "comments"`);
        await queryRunner.query(`CREATE INDEX "IDX_e505fea3909af1657e54bc3049" ON "comments" ("parentSubmissionId") `);
        await queryRunner.query(`CREATE INDEX "IDX_4875672591221a61ace66f2d4f" ON "comments" ("parentCommentId") `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "IDX_4875672591221a61ace66f2d4f"`);
        await queryRunner.query(`DROP INDEX "IDX_e505fea3909af1657e54bc3049"`);
        await queryRunner.query(`ALTER TABLE "comments" RENAME TO "temporary_comments"`);
        await queryRunner.query(`CREATE TABLE "comments" ("id" varchar PRIMARY KEY NOT NULL, "author" varchar NOT NULL, "subreddit" varchar NOT NULL, "selfText" text NOT NULL, "score" integer NOT NULL, "createdUTC" integer NOT NULL, "firstFoundUTC" integer NOT NULL, "parentRedditID" varchar NOT NULL, "permaLink" varchar NOT NULL, "rootSubmissionID" varchar NOT NULL, "processed" boolean NOT NULL DEFAULT (0), "parentSubmissionId" varchar, "parentCommentId" varchar)`);
        await queryRunner.query(`INSERT INTO "comments"("id", "author", "subreddit", "selfText", "score", "createdUTC", "firstFoundUTC", "parentRedditID", "permaLink", "rootSubmissionID", "processed", "parentSubmissionId", "parentCommentId") SELECT "id", "author", "subreddit", "selfText", "score", "createdUTC", "firstFoundUTC", "parentRedditID", "permaLink", "rootSubmissionID", "processed", "parentSubmissionId", "parentCommentId" FROM "temporary_comments"`);
        await queryRunner.query(`DROP TABLE "temporary_comments"`);
        await queryRunner.query(`CREATE INDEX "IDX_4875672591221a61ace66f2d4f" ON "comments" ("parentCommentId") `);
        await queryRunner.query(`CREATE INDEX "IDX_e505fea3909af1657e54bc3049" ON "comments" ("parentSubmissionId") `);
        await queryRunner.query(`DROP INDEX "IDX_96db2e076ee5f721b37fd2ad5f"`);
        await queryRunner.query(`DROP INDEX "IDX_5d63d7c074e60a34a228f9855d"`);
        await queryRunner.query(`DROP INDEX "IDX_eb6849e986a0678a61d97504bc"`);
        await queryRunner.query(`DROP INDEX "IDX_337604abe2c3c9ab698cc9d294"`);
        await queryRunner.query(`ALTER TABLE "downloads" RENAME TO "temporary_downloads"`);
        await queryRunner.query(`CREATE TABLE "downloads" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "albumID" text, "isAlbumParent" boolean NOT NULL DEFAULT (0), "parentSubmissionId" varchar, "parentCommentId" varchar, "urlId" integer)`);
        await queryRunner.query(`INSERT INTO "downloads"("id", "albumID", "isAlbumParent", "parentSubmissionId", "parentCommentId", "urlId") SELECT "id", "albumID", "isAlbumParent", "parentSubmissionId", "parentCommentId", "urlId" FROM "temporary_downloads"`);
        await queryRunner.query(`DROP TABLE "temporary_downloads"`);
        await queryRunner.query(`CREATE INDEX "IDX_96db2e076ee5f721b37fd2ad5f" ON "downloads" ("urlId") `);
        await queryRunner.query(`CREATE INDEX "IDX_5d63d7c074e60a34a228f9855d" ON "downloads" ("parentCommentId") `);
        await queryRunner.query(`CREATE INDEX "IDX_eb6849e986a0678a61d97504bc" ON "downloads" ("parentSubmissionId") `);
        await queryRunner.query(`CREATE INDEX "IDX_337604abe2c3c9ab698cc9d294" ON "downloads" ("albumID") `);
        await queryRunner.query(`DROP INDEX "IDX_a1110777a20270c18440d32c4c"`);
        await queryRunner.query(`ALTER TABLE "filters" RENAME TO "temporary_filters"`);
        await queryRunner.query(`CREATE TABLE "filters" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "forSubmissions" boolean NOT NULL, "field" varchar(20) NOT NULL, "comparator" varchar(2) NOT NULL, "valueJSON" text NOT NULL, "sourceGroupId" integer)`);
        await queryRunner.query(`INSERT INTO "filters"("id", "forSubmissions", "field", "comparator", "valueJSON", "sourceGroupId") SELECT "id", "forSubmissions", "field", "comparator", "valueJSON", "sourceGroupId" FROM "temporary_filters"`);
        await queryRunner.query(`DROP TABLE "temporary_filters"`);
        await queryRunner.query(`CREATE INDEX "IDX_a1110777a20270c18440d32c4c" ON "filters" ("sourceGroupId") `);
        await queryRunner.query(`DROP INDEX "IDX_f7b0aefc1003477ea326af1ac5"`);
        await queryRunner.query(`ALTER TABLE "sources" RENAME TO "temporary_sources"`);
        await queryRunner.query(`CREATE TABLE "sources" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "type" varchar(15) NOT NULL, "name" varchar(36) NOT NULL, "dataJSON" text NOT NULL DEFAULT (''), "sourceGroupId" integer NOT NULL)`);
        await queryRunner.query(`INSERT INTO "sources"("id", "type", "name", "dataJSON", "sourceGroupId") SELECT "id", "type", "name", "dataJSON", "sourceGroupId" FROM "temporary_sources"`);
        await queryRunner.query(`DROP TABLE "temporary_sources"`);
        await queryRunner.query(`CREATE INDEX "IDX_f7b0aefc1003477ea326af1ac5" ON "sources" ("sourceGroupId") `);
        await queryRunner.query(`DROP INDEX "IDX_b911a51a0637a4e27e0dd1ce23"`);
        await queryRunner.query(`DROP INDEX "IDX_792ca9643eaf7971a9dd1112a5"`);
        await queryRunner.query(`ALTER TABLE "urls" RENAME TO "temporary_urls"`);
        await queryRunner.query(`CREATE TABLE "urls" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "address" varchar NOT NULL, "handler" varchar NOT NULL, "processed" boolean NOT NULL DEFAULT (0), "failed" boolean NOT NULL DEFAULT (0), "failureReason" text, "completedUTC" integer NOT NULL DEFAULT (0), "fileId" integer)`);
        await queryRunner.query(`INSERT INTO "urls"("id", "address", "handler", "processed", "failed", "failureReason", "completedUTC", "fileId") SELECT "id", "address", "handler", "processed", "failed", "failureReason", "completedUTC", "fileId" FROM "temporary_urls"`);
        await queryRunner.query(`DROP TABLE "temporary_urls"`);
        await queryRunner.query(`CREATE INDEX "IDX_b911a51a0637a4e27e0dd1ce23" ON "urls" ("fileId") `);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_792ca9643eaf7971a9dd1112a5" ON "urls" ("address") `);
        await queryRunner.query(`DROP INDEX "IDX_4875672591221a61ace66f2d4f"`);
        await queryRunner.query(`DROP INDEX "IDX_e505fea3909af1657e54bc3049"`);
        await queryRunner.query(`DROP TABLE "comments"`);
        await queryRunner.query(`DROP TABLE "submissions"`);
        await queryRunner.query(`DROP INDEX "IDX_96db2e076ee5f721b37fd2ad5f"`);
        await queryRunner.query(`DROP INDEX "IDX_5d63d7c074e60a34a228f9855d"`);
        await queryRunner.query(`DROP INDEX "IDX_eb6849e986a0678a61d97504bc"`);
        await queryRunner.query(`DROP INDEX "IDX_337604abe2c3c9ab698cc9d294"`);
        await queryRunner.query(`DROP TABLE "downloads"`);
        await queryRunner.query(`DROP INDEX "IDX_a1110777a20270c18440d32c4c"`);
        await queryRunner.query(`DROP TABLE "filters"`);
        await queryRunner.query(`DROP TABLE "source_groups"`);
        await queryRunner.query(`DROP INDEX "IDX_f7b0aefc1003477ea326af1ac5"`);
        await queryRunner.query(`DROP TABLE "sources"`);
        await queryRunner.query(`DROP INDEX "IDX_9560d52d1e438c4e75a9dade8c"`);
        await queryRunner.query(`DROP INDEX "IDX_b0bdbefd12ad3b08dcd4b1671f"`);
        await queryRunner.query(`DROP INDEX "IDX_2194756621203ab8d1de83e3c7"`);
        await queryRunner.query(`DROP INDEX "IDX_f6abfcac75948edeaea5b22678"`);
        await queryRunner.query(`DROP TABLE "files"`);
        await queryRunner.query(`DROP INDEX "IDX_b911a51a0637a4e27e0dd1ce23"`);
        await queryRunner.query(`DROP INDEX "IDX_792ca9643eaf7971a9dd1112a5"`);
        await queryRunner.query(`DROP TABLE "urls"`);
        await queryRunner.query(`DROP TABLE "settings"`);
    }

}