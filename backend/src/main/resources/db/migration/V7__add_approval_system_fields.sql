-- Migration V7: Add Professional Produce Approval & Verification Fields
-- Adds support for administrative inspection reasons, OTP fast-track verification, and audit timestamps

-- 1. Relax or update status check constraint on products table to support full lifecycle
ALTER TABLE products DROP CONSTRAINT IF EXISTS products_status_check;

ALTER TABLE products 
ADD CONSTRAINT products_status_check 
CHECK (status IN ('ACTIVE', 'INACTIVE', 'OUT_OF_STOCK', 'PENDING_APPROVAL', 'REJECTED', 'SUSPENDED'));

-- 2. Add approval, rejection, and OTP verification columns
ALTER TABLE products
ADD COLUMN IF NOT EXISTS rejection_reason TEXT,
ADD COLUMN IF NOT EXISTS approval_method VARCHAR(50) DEFAULT 'ADMIN',
ADD COLUMN IF NOT EXISTS approved_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS approval_notes TEXT,
ADD COLUMN IF NOT EXISTS otp_code VARCHAR(10),
ADD COLUMN IF NOT EXISTS otp_expires_at TIMESTAMP WITH TIME ZONE;

-- 3. Update existing active products to have approved_at and approval_method
UPDATE products
SET approval_method = 'ADMIN',
    approved_at = CURRENT_TIMESTAMP
WHERE status = 'ACTIVE' AND approved_at IS NULL;
