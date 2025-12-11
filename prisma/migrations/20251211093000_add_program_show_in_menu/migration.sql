-- Add showInMenu flag to Program to control menu visibility
ALTER TABLE "Program" ADD COLUMN "showInMenu" BOOLEAN NOT NULL DEFAULT TRUE;

