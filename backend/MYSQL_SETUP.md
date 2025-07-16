# 🗄️ MySQL Setup Guide for Laiya Tourism

## 📋 Prerequisites

Make sure you have MySQL installed and running:

### Windows:
- Download MySQL from https://dev.mysql.com/downloads/mysql/
- Or use XAMPP: https://www.apachefriends.org/

### macOS:
```bash
brew install mysql
brew services start mysql
```

### Linux (Ubuntu/Debian):
```bash
sudo apt update
sudo apt install mysql-server
sudo systemctl start mysql
sudo systemctl enable mysql
```

## 🚀 Quick Setup

### 1. Create Database
```sql
-- Login to MySQL
mysql -u root -p

-- Create database
CREATE DATABASE laiya_tourism CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Create user (optional)
CREATE USER 'laiya_user'@'localhost' IDENTIFIED BY 'your_password';
GRANT ALL PRIVILEGES ON laiya_tourism.* TO 'laiya_user'@'localhost';
FLUSH PRIVILEGES;

-- Exit MySQL
EXIT;
```

### 2. Configure Environment
Update `backend/.env` with your MySQL credentials:
```env
DB_HOST=localhost
DB_PORT=3306
DB_NAME=laiya_tourism
DB_USER=root
DB_PASSWORD=your_mysql_password
```

### 3. Initialize Database
```bash
cd backend
node scripts/init-mysql.js
```

### 4. Start Application
```bash
npm run dev
```

## 🔧 Manual Database Setup

If automatic initialization fails, run the SQL schema manually:

```bash
# Import schema
mysql -u root -p laiya_tourism < database/mysql-schema.sql

# Run sample data script
node scripts/init-mysql.js
```

## 📊 Database Structure

### Tables Created:
- **users** - User management with roles
- **destinations** - Tourism destinations
- **tour_packages** - Tour packages
- **msme_partners** - MSME business partners
- **products** - MSME products
- **articles** - Blog articles
- **testimonials** - User reviews
- **site_settings** - Website configuration

### Sample Data:
- 4 demo users (superadmin, admin, msme, contributor)
- 3 destinations (beaches, nature, culture)
- 2 tour packages
- 1 MSME partner with products
- Sample articles and testimonials

## 🔐 Demo Accounts

After initialization, you can login with:

- **Superadmin**: `superadmin@laiya.com` / `demo123`
- **Admin**: `admin@laiya.com` / `demo123`
- **UMKM**: `umkm@laiya.com` / `demo123`
- **Writer**: `writer@laiya.com` / `demo123`

## 🐛 Troubleshooting

### Connection Refused:
```bash
# Check if MySQL is running
sudo systemctl status mysql

# Start MySQL
sudo systemctl start mysql
```

### Access Denied:
```bash
# Reset MySQL root password
sudo mysql
ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY 'new_password';
FLUSH PRIVILEGES;
EXIT;
```

### Database Doesn't Exist:
```sql
-- Create database manually
mysql -u root -p
CREATE DATABASE laiya_tourism CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

## 🔄 Reset Database

To reset and recreate the database:
```bash
# Drop and recreate database
mysql -u root -p -e "DROP DATABASE IF EXISTS laiya_tourism; CREATE DATABASE laiya_tourism CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"

# Reinitialize
node scripts/init-mysql.js
```

## 📈 Production Considerations

For production deployment:

1. **Security**:
   - Use strong passwords
   - Create dedicated database user
   - Enable SSL connections
   - Configure firewall rules

2. **Performance**:
   - Optimize MySQL configuration
   - Add proper indexes
   - Enable query caching
   - Monitor slow queries

3. **Backup**:
   - Set up automated backups
   - Test restore procedures
   - Monitor disk space

---

🏝️ **Laiya Tourism - MySQL Database Ready!**