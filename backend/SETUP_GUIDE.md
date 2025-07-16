# 🚀 Panduan Lengkap Setup Backend Wisata Pulau Laiya

## 📋 Prerequisites

Pastikan Anda sudah menginstall:
- **Node.js** (versi 16 atau lebih baru)
- **MySQL** (versi 8.0 atau lebih baru)
- **npm** atau **yarn**

## 🛠️ Step 1: Setup Project

### 1.1 Install Dependencies
```bash
cd backend
npm install
```

### 1.2 Setup Environment Variables
```bash
# Copy file environment
cp .env.example .env

# Edit file .env dengan editor favorit Anda
nano .env
```

Isi file `.env` dengan konfigurasi Anda:
```env
# Database Configuration
DB_HOST=localhost
DB_PORT=3306
DB_NAME=laiya_tourism
DB_USER=root
DB_PASSWORD=your_mysql_password

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_here_make_it_long_and_random
JWT_EXPIRES_IN=7d

# Server Configuration
PORT=5000
NODE_ENV=development

# File Upload Configuration
UPLOAD_PATH=./uploads
MAX_FILE_SIZE=5242880

# CORS Configuration
FRONTEND_URL=http://localhost:3000
```

## 🗄️ Step 2: Setup Database

### 2.1 Buat Database
```bash
# Login ke MySQL
mysql -u root -p

# Buat database
CREATE DATABASE laiya_tourism CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
EXIT;
```

### 2.2 Import Schema
```bash
# Import schema database
mysql -u root -p laiya_tourism < database/schema.sql
```

### 2.3 Verifikasi Database
```bash
mysql -u root -p laiya_tourism

# Cek tabel yang sudah dibuat
SHOW TABLES;

# Cek struktur tabel users
DESCRIBE users;
```

## 🚀 Step 3: Start Server

### 3.1 Development Mode
```bash
npm run dev
```

### 3.2 Production Mode
```bash
npm start
```

### 3.3 Verifikasi Server
Buka browser dan akses: `http://localhost:5000/api/health`

Anda harus melihat response:
```json
{
  "success": true,
  "message": "Laiya Tourism API is running",
  "timestamp": "2024-01-15T10:30:00.000Z",
  "environment": "development"
}
```

## 👤 Step 4: Create First User (Superadmin)

### 4.1 Register Superadmin
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Super Admin",
    "email": "superadmin@laiya.com",
    "password": "admin123456",
    "role": "superadmin"
  }'
```

### 4.2 Login dan Dapatkan Token
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "superadmin@laiya.com",
    "password": "admin123456"
  }'
```

Simpan `token` dari response untuk digunakan di request selanjutnya.

## 🧪 Step 5: Test API Endpoints

### 5.1 Test Authentication
```bash
# Get profile (ganti YOUR_TOKEN dengan token dari login)
curl -X GET http://localhost:5000/api/auth/profile \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### 5.2 Test User Management
```bash
# Get all users (superadmin only)
curl -X GET http://localhost:5000/api/users \
  -H "Authorization: Bearer YOUR_TOKEN"

# Create new admin user
curl -X POST http://localhost:5000/api/users \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Admin User",
    "email": "admin@laiya.com",
    "password": "admin123",
    "role": "admin"
  }'
```

## 📱 Step 6: Connect Frontend

### 6.1 Update Frontend API Base URL
Di frontend Anda, set base URL API:
```javascript
const API_BASE_URL = 'http://localhost:5000/api';
```

### 6.2 Example Frontend Integration
```javascript
// Login function
const login = async (email, password) => {
  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
  });
  
  const data = await response.json();
  if (data.success) {
    localStorage.setItem('token', data.data.token);
    return data.data.user;
  }
  throw new Error(data.message);
};

// Authenticated request
const getProfile = async () => {
  const token = localStorage.getItem('token');
  const response = await fetch(`${API_BASE_URL}/auth/profile`, {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
  
  return response.json();
};
```

## 🔧 Step 7: Common Operations

### 7.1 Create Sample Data
```bash
# Create MSME Partner
curl -X POST http://localhost:5000/api/users \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "UMKM Owner",
    "email": "umkm@laiya.com",
    "password": "umkm123",
    "role": "msme"
  }'

# Create Contributor
curl -X POST http://localhost:5000/api/users \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Article Writer",
    "email": "writer@laiya.com",
    "password": "writer123",
    "role": "contributor",
    "university": "Universitas Indonesia",
    "major": "Pariwisata"
  }'
```

### 7.2 File Upload Setup
```bash
# Buat folder uploads
mkdir uploads
mkdir uploads/avatars
mkdir uploads/destinations
mkdir uploads/products
mkdir uploads/articles

# Set permissions (Linux/Mac)
chmod 755 uploads
chmod 755 uploads/*
```

## 🐛 Troubleshooting

### Database Connection Issues
```bash
# Test koneksi database
mysql -u root -p -h localhost -P 3306

# Cek apakah database exists
SHOW DATABASES LIKE 'laiya_tourism';
```

### Port Already in Use
```bash
# Cek port yang digunakan
lsof -i :5000

# Kill process jika perlu
kill -9 PID_NUMBER
```

### JWT Token Issues
- Pastikan `JWT_SECRET` di `.env` cukup panjang dan random
- Token expired? Login ulang untuk mendapatkan token baru
- Cek format Authorization header: `Bearer YOUR_TOKEN`

### CORS Issues
- Pastikan `FRONTEND_URL` di `.env` sesuai dengan URL frontend
- Untuk development, bisa set `FRONTEND_URL=*` (tidak untuk production)

## 📊 Monitoring & Logs

### 7.1 Check Server Logs
```bash
# Development mode sudah include logging
npm run dev

# Production dengan PM2
npm install -g pm2
pm2 start server.js --name "laiya-api"
pm2 logs laiya-api
```

### 7.2 Database Monitoring
```bash
# Cek active connections
mysql -u root -p -e "SHOW PROCESSLIST;"

# Cek database size
mysql -u root -p -e "
SELECT 
  table_schema AS 'Database',
  ROUND(SUM(data_length + index_length) / 1024 / 1024, 2) AS 'Size (MB)'
FROM information_schema.tables 
WHERE table_schema = 'laiya_tourism'
GROUP BY table_schema;
"
```

## 🚀 Production Deployment

### 8.1 Environment Setup
```bash
# Set production environment
NODE_ENV=production

# Use strong JWT secret
JWT_SECRET=very_long_random_string_for_production

# Use production database
DB_HOST=your_production_db_host
```

### 8.2 Process Management
```bash
# Install PM2
npm install -g pm2

# Start with PM2
pm2 start server.js --name "laiya-api" --instances max

# Save PM2 configuration
pm2 save
pm2 startup
```

### 8.3 Nginx Reverse Proxy
```nginx
server {
    listen 80;
    server_name api.laiya.com;
    
    location / {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

## 📚 API Documentation

Setelah server berjalan, Anda bisa mengakses:
- **Health Check**: `GET /api/health`
- **Authentication**: `POST /api/auth/login`, `POST /api/auth/register`
- **User Management**: `GET /api/users`, `POST /api/users`, `PUT /api/users/:id`
- **Profile**: `GET /api/auth/profile`, `PUT /api/auth/profile`

Untuk dokumentasi lengkap, lihat file `README.md` di folder backend.

## 🎯 Next Steps

1. **Extend API**: Tambahkan endpoints untuk destinations, tour packages, products, articles
2. **File Upload**: Implement multer untuk upload gambar
3. **Email Service**: Tambahkan email verification dan notifications
4. **Caching**: Implement Redis untuk caching
5. **Testing**: Tambahkan unit tests dan integration tests

---

🏝️ **Selamat! Backend Wisata Pulau Laiya siap digunakan!**

Jika ada pertanyaan atau masalah, silakan buka issue atau hubungi tim development.