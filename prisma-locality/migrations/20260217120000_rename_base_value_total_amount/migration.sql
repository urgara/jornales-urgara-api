-- RenameColumn
ALTER TABLE "WorkerAssignmentDetail" RENAME COLUMN "baseValue" TO "gross";

-- RenameColumn
ALTER TABLE "WorkerAssignmentDetail" RENAME COLUMN "totalAmount" TO "net";
