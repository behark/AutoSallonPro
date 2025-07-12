#!/bin/bash
# Database Backup Script for Auto Ani Used Car Dealership

# Configuration
BACKUP_DIR="/Users/behar/backups/aniautosallon/database"
DATE=$(date +"%Y-%m-%d-%H-%M-%S")
BACKUP_FILE="$BACKUP_DIR/backup-$DATE.sql"
LOG_FILE="$BACKUP_DIR/backup-log.txt"

# Database connection details (replace these with your actual database details)
DB_HOST="${DB_HOST:-localhost}"
DB_PORT="${DB_PORT:-5432}"
DB_NAME="${DB_NAME:-aniautosallon}"
DB_USER="${DB_USER:-dbuser}"
DB_PASSWORD="${DB_PASSWORD:-dbpassword}"

# Create backup directory if it doesn't exist
mkdir -p "$BACKUP_DIR"

# Log function
log() {
  echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1" | tee -a "$LOG_FILE"
}

# Check if pg_dump is installed (for PostgreSQL)
check_pg_dump() {
  if ! command -v pg_dump &> /dev/null; then
    log "ERROR: pg_dump command not found. Please install PostgreSQL client tools."
    exit 1
  fi
}

# Check if mysqldump is installed (for MySQL)
check_mysqldump() {
  if ! command -v mysqldump &> /dev/null; then
    log "ERROR: mysqldump command not found. Please install MySQL client tools."
    exit 1
  fi
}

# Backup PostgreSQL database
backup_postgres() {
  log "Starting PostgreSQL database backup..."
  
  PGPASSWORD="$DB_PASSWORD" pg_dump -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$DB_NAME" -F c -b -v -f "$BACKUP_FILE.dump"
  
  if [ $? -eq 0 ]; then
    log "PostgreSQL backup completed successfully: $BACKUP_FILE.dump"
    # Compress the backup
    gzip -9 "$BACKUP_FILE.dump"
    log "Backup compressed: $BACKUP_FILE.dump.gz"
    
    # Keep only the last 7 backups to save space (adjust as needed)
    find "$BACKUP_DIR" -name "backup-*.dump.gz" -type f -mtime +7 -delete
    log "Old backups cleaned up"
  else
    log "ERROR: PostgreSQL backup failed!"
  fi
}

# Backup MySQL database
backup_mysql() {
  log "Starting MySQL database backup..."
  
  mysqldump --host="$DB_HOST" --port="$DB_PORT" --user="$DB_USER" --password="$DB_PASSWORD" --databases "$DB_NAME" > "$BACKUP_FILE.sql"
  
  if [ $? -eq 0 ]; then
    log "MySQL backup completed successfully: $BACKUP_FILE.sql"
    # Compress the backup
    gzip -9 "$BACKUP_FILE.sql"
    log "Backup compressed: $BACKUP_FILE.sql.gz"
    
    # Keep only the last 7 backups to save space (adjust as needed)
    find "$BACKUP_DIR" -name "backup-*.sql.gz" -type f -mtime +7 -delete
    log "Old backups cleaned up"
  else
    log "ERROR: MySQL backup failed!"
  fi
}

# Menu to select database type
echo "Select your database type:"
echo "1) PostgreSQL"
echo "2) MySQL"
read -r db_choice

case $db_choice in
  1)
    check_pg_dump
    backup_postgres
    ;;
  2)
    check_mysqldump
    backup_mysql
    ;;
  *)
    log "Invalid choice. Exiting."
    exit 1
    ;;
esac

# Upload backup to cloud storage (uncomment and configure as needed)
# This is an example using AWS S3
# if command -v aws &> /dev/null; then
#   log "Uploading backup to AWS S3..."
#   aws s3 cp "$BACKUP_FILE.gz" "s3://your-bucket/database-backups/"
#   log "Backup uploaded to S3"
# else
#   log "AWS CLI not found. Skipping S3 upload."
# fi

log "Backup process completed!"

# How to use this script:
# 1. Make the script executable: chmod +x database-backup.sh
# 2. Configure your database connection details at the top of the script
# 3. Run manually: ./database-backup.sh
# 4. Set up a cron job for automated daily backups:
#    0 2 * * * /path/to/database-backup.sh > /dev/null 2>&1
