ALTER TABLE order_detail
ALTER COLUMN discount TYPE
NUMERIC
(5,2)
USING discount::NUMERIC;


-- can null customer_id order
ALTER TABLE "order"
ALTER COLUMN customer_id DROP NOT NULL;


-- chnage type discount interger to numeric
ALTER TABLE product
ALTER COLUMN discount TYPE
NUMERIC
(5,2)
USING discount::NUMERIC;


--  check table have type any field
SELECT column_name, data_type
FROM information_schema.columns
WHERE table_name = 'product';
