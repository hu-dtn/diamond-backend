-- CreateTable
CREATE TABLE "public"."Diamond" (
    "id" SERIAL NOT NULL,
    "stockId" TEXT NOT NULL,
    "shape" TEXT NOT NULL,
    "carat" DOUBLE PRECISION NOT NULL,
    "color" TEXT NOT NULL,
    "clarity" TEXT NOT NULL,
    "cut" TEXT NOT NULL,
    "polish" TEXT,
    "symmetry" TEXT,
    "measurements" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "lab" TEXT NOT NULL,
    "certNumber" TEXT,
    "certPdfUrl" TEXT,
    "price" DOUBLE PRECISION,
    "pricePerCarat" DOUBLE PRECISION,
    "currency" TEXT NOT NULL DEFAULT 'USD',
    "priceOnRequest" BOOLEAN NOT NULL DEFAULT false,
    "fluorescence" TEXT,
    "availability" TEXT NOT NULL DEFAULT 'In Stock',
    "images" JSONB,
    "videoUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Diamond_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Diamond_stockId_key" ON "public"."Diamond"("stockId");
