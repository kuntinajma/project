# Laiya Tourism Backend API

Backend API untuk Website Wisata Pulau Laiya - Proyek KKN Kebangsaan XIII

## 🚀 Features

### Role-Based Access Control
- **Superadmin**: Full system control, user management, content management
- **Admin**: Content management (destinations, packages, articles), MSME approval
- **MSME Partner**: Product management, order tracking, business profile
- **Contributor**: Article writing and management

### Core Modules
- **Authentication & Authorization**: JWT-based with role permissions
- **User Management**: Complete CRUD with role-based access
- **Destinations**: Tourist attractions with categories and gallery
- **Tour Packages**: Complete tour packages with facilities
- **MSME Products**: Local business products with full e-commerce features
- **Articles**: Content management with categories and search
- **Testimonials**: Google Maps reviews integration
- **Site Settings**: Dynamic homepage, header, footer content

## 🛠️ Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MySQL 8.0+
- **Authentication**: JWT (JSON Web Tokens)
- **Password Hashing**: bcryptjs
- **Validation**: express-validator, Joi
- **File Upload**: Multer
- **Security**: Helmet, CORS, Rate Limiting

## 📋 Prerequisites

- Node.js 16+ 
- MySQL 8.0+
- npm or yarn

## ⚡ Quick Start

### 1. Installation
```bash
# Clone repository
git clone <repository-url>
cd backend

# Install dependencies
npm install
```

### 2. Environment Setup
```bash
# Copy environment file
cp .env.example .env

# Edit .env with your configuration
nano .env
```

### 3. Database Setup
```bash
# Create database and tables
mysql -u root -p < database/schema.sql

# Or run migration script
npm run migrate
```

### 4. Start Development Server
```bash
# Development mode with auto-reload
npm run dev

# Production mode
npm start
```

## 📚 API Documentation

### Base URL
```
http://localhost:5000/api
```

### Authentication Endpoints

#### Register
```http
POST /api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "contributor",
  "phone": "081234567890",
  "university": "University Name",
  "major": "Tourism Management"
}
```

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

#### Get Profile
```http
GET /api/auth/profile
Authorization: Bearer <jwt_token>
```

### User Management (Superadmin Only)

#### Get All Users
```http
GET /api/users?page=1&limit=10&role=contributor&search=john
Authorization: Bearer <jwt_token>
```

#### Create User
```http
POST /api/users
Authorization: Bearer <jwt_token>
Content-Type: application/json

{
  "name": "Admin User",
  "email": "admin@laiya.com",
  "password": "admin123",
  "role": "admin"
}
```

## 🗄️ Database Schema

### Users Table
```sql
- id (Primary Key)
- name, email, password
- role (superadmin, admin, msme, contributor)
- phone, avatar, university, major, bio
- is_active, is_verified
- timestamps
```

### Destinations Table
```sql
- id, title, slug, description
- category (beaches, culture, nature, adventure)
- latitude, longitude
- featured_image, gallery (separate table)
- is_featured, is_published, view_count
- SEO fields, timestamps
```

### Tour Packages Table
```sql
- id, name, description, price
- duration, min_persons, max_persons
- facilities (separate table)
- whatsapp_contact, booking_count, rating
- timestamps
```

### MSME & Products Tables
```sql
MSME Partners:
- business_name, description, contact info
- social media links, verification status

Products:
- name, description, price, stock
- material, durability, delivery_time
- gallery, ratings, sales_count
```

### Articles Table
```sql
- title, slug, excerpt, content
- category (tips, tourism, culture, msmes, environment)
- status (draft, pending, published, rejected)
- SEO optimization, full-text search
- tags system
```

## 🔐 Security Features

- **JWT Authentication**: Secure token-based auth
- **Password Hashing**: bcrypt with salt rounds
- **Rate Limiting**: Prevent API abuse
- **Input Validation**: Comprehensive validation rules
- **SQL Injection Protection**: Parameterized queries
- **CORS Configuration**: Controlled cross-origin access
- **Helmet Security**: Security headers

## 🚦 Role Permissions

### Superadmin
- ✅ All user CRUD operations
- ✅ All content management
- ✅ Site settings management
- ✅ System analytics

### Admin  
- ✅ Destinations CRUD
- ✅ Tour packages CRUD
- ✅ Article moderation
- ✅ MSME account approval
- ❌ User management (except MSME creation)

### MSME Partner
- ✅ Own products CRUD
- ✅ Order management
- ✅ Business profile update
- ❌ Other users' content

### Contributor
- ✅ Own articles CRUD
- ✅ Profile management
- ❌ Other users' content

## 📁 Project Structure

```
backend/
├── config/
│   └── database.js          # Database configuration
├── controllers/
│   ├── authController.js    # Authentication logic
│   └── userController.js    # User management
├── middleware/
│   ├── auth.js             # JWT & authorization
│   └── validation.js       # Input validation
├── routes/
│   ├── auth.js            # Auth routes
│   └── users.js           # User routes
├── database/
│   └── schema.sql         # Database schema
├── uploads/               # File uploads
├── .env.example          # Environment template
├── package.json
└── server.js            # Main server file
```

## 🔧 Environment Variables

```env
# Database
DB_HOST=localhost
DB_PORT=3306
DB_NAME=laiya_tourism
DB_USER=root
DB_PASSWORD=your_password

# JWT
JWT_SECRET=your_secret_key
JWT_EXPIRES_IN=7d

# Server
PORT=5000
NODE_ENV=development

# Security
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

## 🧪 Testing

```bash
# Run tests
npm test

# Test specific endpoint
curl -X GET http://localhost:5000/api/health
```

## 📦 Deployment

### Production Setup
1. Set `NODE_ENV=production`
2. Use strong JWT secret
3. Configure proper database credentials
4. Set up reverse proxy (nginx)
5. Enable SSL/HTTPS
6. Configure file upload limits

### Docker Deployment
```dockerfile
FROM node:16-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 5000
CMD ["npm", "start"]
```

## 🤝 Contributing

1. Fork the repository
2. Create feature branch
3. Follow coding standards
4. Add tests for new features
5. Submit pull request

## 📄 License

MIT License - KKN Kebangsaan XIII Project

## 👥 Team

**KKN Kebangsaan XIII - Tim Pulau Laiya**
- Backend Development
- Database Design
- API Architecture
- Security Implementation

---

🏝️ **Pulau Laiya Tourism API** - Membangun Pariwisata Digital Indonesia
```

This backend design provides:

1. **Complete Role-Based System** with proper authorization
2. **Comprehensive Database Schema** for all tourism features
3. **RESTful API Structure** with proper validation
4. **Security Best Practices** with JWT, rate limiting, and input validation
5. **Scalable Architecture** ready for production deployment
6. **Full Documentation** for easy development and maintenance

The system supports all your requirements for superadmin, admin, MSME partner, and contributor roles with appropriate permissions and data management capabilities.