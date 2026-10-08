-- Fix password_reset_tokens database schema to match PasswordResetToken entity
SET @dbname = DATABASE();
SET @tablename = 'password_reset_tokens';
SET @columnname = 'expiry_date';
SET @preparedStatement = (SELECT IF(
    (
        SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS
        WHERE TABLE_SCHEMA = @dbname
        AND TABLE_NAME = @tablename
        AND COLUMN_NAME = @columnname
    ) > 0,
    'ALTER TABLE password_reset_tokens DROP COLUMN expiry_date;',
    'SELECT 1;'
));
PREPARE drop_col FROM @preparedStatement;
EXECUTE drop_col;
DEALLOCATE PREPARE drop_col;
