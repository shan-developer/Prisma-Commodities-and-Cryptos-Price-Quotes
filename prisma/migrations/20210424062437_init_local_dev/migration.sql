-- CreateTable
CREATE TABLE "_commoditiesothers" (
    "commoditytype" TEXT NOT NULL,
    "price" TEXT NOT NULL,
    "changevalue" TEXT NOT NULL,
    "changepercentage" TEXT NOT NULL,
    "lowprice" TEXT NOT NULL,
    "highprice" TEXT NOT NULL,
    "shorttime" TEXT NOT NULL,
    "quotejson" JSONB NOT NULL,
    "createdat" TIMESTAMP(6) NOT NULL,
    "updatedat" TIMESTAMP(6) NOT NULL,

    PRIMARY KEY ("commoditytype")
);

-- CreateTable
CREATE TABLE "_pmquotes" (
    "pmtype" TEXT NOT NULL,
    "bid" TEXT NOT NULL,
    "ask" TEXT NOT NULL,
    "low" TEXT NOT NULL,
    "high" TEXT NOT NULL,
    "changevalue" TEXT NOT NULL,
    "changepercentage" TEXT NOT NULL,
    "month1changevalue" TEXT NOT NULL,
    "month1changepercentage" TEXT NOT NULL,
    "year1changevalue" TEXT NOT NULL,
    "year1changepercentage" TEXT NOT NULL,
    "year1lowprice" TEXT NOT NULL,
    "year1highprice" TEXT NOT NULL,
    "longtime" TEXT NOT NULL,
    "quotejson" JSONB NOT NULL,
    "createdat" TIMESTAMP(6) NOT NULL,
    "updatedat" TIMESTAMP(6) NOT NULL,

    PRIMARY KEY ("pmtype")
);

-- CreateIndex
CREATE INDEX "_commoditiesothers_createdat_idx" ON "_commoditiesothers"("createdat");

-- CreateIndex
CREATE INDEX "_commoditiesothers_updatedat_idx" ON "_commoditiesothers"("updatedat");

-- CreateIndex
CREATE INDEX "_pmquotes_createdat_idx" ON "_pmquotes"("createdat");

-- CreateIndex
CREATE INDEX "_pmquotes_updatedat_idx" ON "_pmquotes"("updatedat");
