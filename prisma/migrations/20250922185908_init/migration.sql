-- CreateEnum
CREATE TYPE "public"."Subscription" AS ENUM ('مجاني', 'مميز', 'حصري');

-- CreateEnum
CREATE TYPE "public"."PropertyType" AS ENUM ('شقة', 'فيلا', 'مكتب', 'محل_تجاري', 'مكتب_تجاري', 'مجمع_تجاري', 'مصنع', 'مستودع', 'أرض_فارغة', 'أرض_زراعية', 'عمارة', 'شاليه', 'استوديو', 'بيت_عربي', 'مزرعة', 'فندق', 'منتجع', 'عيادة', 'معرض', 'موقف_سيارات');

-- CreateEnum
CREATE TYPE "public"."Purpose" AS ENUM ('بيع', 'آجار', 'رهن');

-- CreateEnum
CREATE TYPE "public"."Direction" AS ENUM ('شرقي', 'غربي', 'جنوبي', 'شمالي', 'شرقي_جنوبي', 'شرقي_شمالي', 'شرقي_غربي', 'جنوبي_غربي', 'جنوبي_شمالي', 'غربي_شمالي', 'شرقي_جنوبي_غربي', 'شرقي_جنوبي_شمالي', 'جنوبي_غربي_شمالي', 'غربي_شرقي_شمالي', 'غربي_جنوبي_شرقي_شمالي');

-- CreateEnum
CREATE TYPE "public"."State" AS ENUM ('مقبول', 'مرفوض', 'قيد_المراجعة');

-- CreateEnum
CREATE TYPE "public"."Status" AS ENUM ('بحاجة_إلى_إكساء', 'عادي', 'سوبر', 'سوبر_ديلوكس');

-- CreateEnum
CREATE TYPE "public"."compTypes" AS ENUM ('شكوى', 'استفسار');

-- CreateTable
CREATE TABLE "public"."Governorate" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Governorate_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."City" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "governorateId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "City_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Region" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "cityId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Region_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."User" (
    "id" SERIAL NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "profileImage" TEXT,
    "password" TEXT NOT NULL,
    "phone" TEXT,
    "subscription" "public"."Subscription" NOT NULL DEFAULT 'مجاني',
    "until" TIMESTAMP(3),
    "hidePhone" BOOLEAN NOT NULL DEFAULT false,
    "hideEmail" BOOLEAN NOT NULL DEFAULT false,
    "hideFirstAndLast" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Property" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "regionId" INTEGER NOT NULL,
    "propertyType" "public"."PropertyType" NOT NULL,
    "purpose" "public"."Purpose" NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "area" INTEGER,
    "rooms" INTEGER,
    "floor" TEXT,
    "price" INTEGER,
    "direction" "public"."Direction",
    "subscription" "public"."Subscription" NOT NULL DEFAULT 'مجاني',
    "contactInfo" TEXT NOT NULL,
    "state" "public"."State" NOT NULL DEFAULT 'قيد_المراجعة',
    "status" "public"."Status" NOT NULL DEFAULT 'عادي',
    "video" TEXT,
    "street" TEXT,
    "views" INTEGER NOT NULL DEFAULT 0,
    "rating" DECIMAL(3,1) NOT NULL DEFAULT 0.0,
    "numOfRaters" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Property_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Amenity" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Amenity_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."PropertyAmenity" (
    "propertyId" INTEGER NOT NULL,
    "amenityId" INTEGER NOT NULL,
    "description" TEXT NOT NULL,

    CONSTRAINT "PropertyAmenity_pkey" PRIMARY KEY ("propertyId","amenityId")
);

-- CreateTable
CREATE TABLE "public"."Image" (
    "id" SERIAL NOT NULL,
    "propertyId" INTEGER NOT NULL,
    "legalImage" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Image_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."SubscriptionRequest" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "accepted" BOOLEAN NOT NULL DEFAULT false,
    "subtype" "public"."Subscription" NOT NULL,
    "image" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SubscriptionRequest_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Notification" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "data" TEXT NOT NULL,
    "isRead" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Notification_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."SavedProperty" (
    "propertyId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "SavedProperty_pkey" PRIMARY KEY ("propertyId","userId")
);

-- CreateTable
CREATE TABLE "public"."Review" (
    "propertyId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,
    "rating" DECIMAL(3,1) NOT NULL DEFAULT 0.0,
    "comment" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Review_pkey" PRIMARY KEY ("propertyId","userId")
);

-- CreateTable
CREATE TABLE "public"."Complaint" (
    "id" SERIAL NOT NULL,
    "propertyId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,
    "description" TEXT NOT NULL,
    "complaintType" "public"."compTypes" NOT NULL DEFAULT 'استفسار',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Complaint_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "public"."User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_phone_key" ON "public"."User"("phone");

-- AddForeignKey
ALTER TABLE "public"."City" ADD CONSTRAINT "City_governorateId_fkey" FOREIGN KEY ("governorateId") REFERENCES "public"."Governorate"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Region" ADD CONSTRAINT "Region_cityId_fkey" FOREIGN KEY ("cityId") REFERENCES "public"."City"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Property" ADD CONSTRAINT "Property_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Property" ADD CONSTRAINT "Property_regionId_fkey" FOREIGN KEY ("regionId") REFERENCES "public"."Region"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."PropertyAmenity" ADD CONSTRAINT "PropertyAmenity_propertyId_fkey" FOREIGN KEY ("propertyId") REFERENCES "public"."Property"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."PropertyAmenity" ADD CONSTRAINT "PropertyAmenity_amenityId_fkey" FOREIGN KEY ("amenityId") REFERENCES "public"."Amenity"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Image" ADD CONSTRAINT "Image_propertyId_fkey" FOREIGN KEY ("propertyId") REFERENCES "public"."Property"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."SubscriptionRequest" ADD CONSTRAINT "SubscriptionRequest_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Notification" ADD CONSTRAINT "Notification_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."SavedProperty" ADD CONSTRAINT "SavedProperty_propertyId_fkey" FOREIGN KEY ("propertyId") REFERENCES "public"."Property"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."SavedProperty" ADD CONSTRAINT "SavedProperty_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Review" ADD CONSTRAINT "Review_propertyId_fkey" FOREIGN KEY ("propertyId") REFERENCES "public"."Property"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Review" ADD CONSTRAINT "Review_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Complaint" ADD CONSTRAINT "Complaint_propertyId_fkey" FOREIGN KEY ("propertyId") REFERENCES "public"."Property"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Complaint" ADD CONSTRAINT "Complaint_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
