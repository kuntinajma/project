# 🧪 Manual API Testing Guide

## Prerequisites
Make sure the backend server is running:
```bash
cd backend
npm run dev
```

Server should be running on `http://localhost:5000`

## 🔍 Test Endpoints Manually

### 1. Health Check
```bash
curl http://localhost:5000/api/health
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Laiya Tourism API is running",
  "timestamp": "2024-01-15T10:30:00.000Z",
  "environment": "development"
}
```

### 2. User Registration
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@laiya.com",
    "password": "password123",
    "role": "contributor",
    "phone": "+6281234567890",
    "university": "Universitas Indonesia",
    "major": "Pariwisata"
  }'
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Registrasi berhasil",
  "data": {
    "user": {
      "id": 1,
      "name": "Test User",
      "email": "test@laiya.com",
      "role": "contributor"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

### 3. User Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@laiya.com",
    "password": "password123"
  }'
```

### 4. Get Profile (Protected Route)
```bash
# Replace YOUR_TOKEN with the token from login response
curl -X GET http://localhost:5000/api/auth/profile \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### 5. Update Profile
```bash
curl -X PUT http://localhost:5000/api/auth/profile \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Updated Name",
    "phone": "+6281234567891",
    "bio": "Travel enthusiast from Indonesia"
  }'
```

### 6. Test Authorization (Should Fail)
```bash
# This should return 403 Forbidden for contributor role
curl -X GET http://localhost:5000/api/users \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### 7. Create Superadmin
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Super Admin",
    "email": "superadmin@laiya.com",
    "password": "admin123",
    "role": "superadmin"
  }'
```

### 8. Test Superadmin Access
```bash
# Login as superadmin first, then use the token
curl -X GET http://localhost:5000/api/users \
  -H "Authorization: Bearer SUPERADMIN_TOKEN"
```

## 🚨 Error Testing

### Invalid Email Format
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test",
    "email": "invalid-email",
    "password": "123",
    "role": "invalid"
  }'
```

### Missing Required Fields
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test"
  }'
```

### Wrong Password
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@laiya.com",
    "password": "wrongpassword"
  }'
```

### No Authorization Token
```bash
curl -X GET http://localhost:5000/api/auth/profile
```

## 📊 Expected HTTP Status Codes

- **200**: Success (GET, PUT)
- **201**: Created (POST registration/creation)
- **400**: Bad Request (validation errors)
- **401**: Unauthorized (no token or invalid token)
- **403**: Forbidden (insufficient permissions)
- **404**: Not Found
- **429**: Too Many Requests (rate limiting)
- **500**: Internal Server Error

## 🔐 Role-Based Testing

### Contributor Role
- ✅ Can register, login, update own profile
- ❌ Cannot access user management
- ❌ Cannot create admin users

### Admin Role
- ✅ Can manage content
- ✅ Can approve MSME accounts
- ❌ Cannot manage admin users

### Superadmin Role
- ✅ Can do everything
- ✅ Can manage all users
- ✅ Can change site settings

## 🎯 Testing Checklist

- [ ] Health check works
- [ ] User registration with all roles
- [ ] Login returns valid JWT token
- [ ] Protected routes require authentication
- [ ] Role-based authorization works
- [ ] Input validation catches errors
- [ ] Password hashing works
- [ ] Rate limiting (if enabled)
- [ ] Error responses are consistent
- [ ] Database operations work correctly