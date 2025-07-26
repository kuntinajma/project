const axios = require("axios");

const API_BASE = "http://localhost:5000/api";
let authToken = "";
let testUserId = "";

// Colors for console output
const colors = {
  green: "\x1b[32m",
  red: "\x1b[31m",
  yellow: "\x1b[33m",
  blue: "\x1b[34m",
  reset: "\x1b[0m",
  bold: "\x1b[1m",
};

const log = (message, color = "reset") => {
  console.log(`${colors[color]}${message}${colors.reset}`);
};

const logTest = (testName) => {
  console.log(
    `\n${colors.bold}${colors.blue}🧪 Testing: ${testName}${colors.reset}`
  );
};

const logSuccess = (message) => {
  log(`✅ ${message}`, "green");
};

const logError = (message) => {
  log(`❌ ${message}`, "red");
};

const logInfo = (message) => {
  log(`ℹ️  ${message}`, "yellow");
};

// Helper function to make API requests
const apiRequest = async (method, endpoint, data = null, token = null) => {
  try {
    const config = {
      method,
      url: `${API_BASE}${endpoint}`,
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      ...(data && { data }),
    };

    const response = await axios(config);
    return { success: true, data: response.data, status: response.status };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data || error.message,
      status: error.response?.status,
    };
  }
};

// Test 1: Health Check
const testHealthCheck = async () => {
  logTest("Health Check");

  const result = await apiRequest("GET", "/health");

  if (result.success) {
    logSuccess("Server is running!");
    logInfo(`Response: ${JSON.stringify(result.data, null, 2)}`);
  } else {
    logError("Server health check failed");
    logInfo(`Error: ${JSON.stringify(result.error, null, 2)}`);
  }

  return result.success;
};

// Test 2: User Registration
const testUserRegistration = async () => {
  logTest("User Registration");

  const userData = {
    name: "Test Contributor",
    email: "testcontributor@laiya.com",
    password: "password123",
    role: "contributor",
    phone: "+6281234567890",
    university: "Universitas Indonesia",
    major: "Pariwisata",
  };

  const result = await apiRequest("POST", "/auth/register", userData);

  if (result.success) {
    logSuccess("User registered successfully!");
    logInfo(`User ID: ${result.data.data.user.id}`);
    logInfo(`Token received: ${result.data.data.token.substring(0, 20)}...`);

    // Save token and user ID for later tests
    authToken = result.data.data.token;
    testUserId = result.data.data.user.id;
  } else {
    logError("User registration failed");
    logInfo(`Error: ${JSON.stringify(result.error, null, 2)}`);
  }

  return result.success;
};

// Test 3: User Login
const testUserLogin = async () => {
  logTest("User Login");

  const loginData = {
    email: "testcontributor@laiya.com",
    password: "password123",
  };

  const result = await apiRequest("POST", "/auth/login", loginData);

  if (result.success) {
    logSuccess("Login successful!");
    logInfo(`Welcome: ${result.data.data.user.name}`);
    logInfo(`Role: ${result.data.data.user.role}`);

    // Update token
    authToken = result.data.data.token;
  } else {
    logError("Login failed");
    logInfo(`Error: ${JSON.stringify(result.error, null, 2)}`);
  }

  return result.success;
};

// Test 4: Get User Profile (Protected Route)
const testGetProfile = async () => {
  logTest("Get User Profile (Protected Route)");

  const result = await apiRequest("GET", "/auth/profile", null, authToken);

  if (result.success) {
    logSuccess("Profile retrieved successfully!");
    logInfo(`Name: ${result.data.data.name}`);
    logInfo(`Email: ${result.data.data.email}`);
    logInfo(`Role: ${result.data.data.role}`);
    logInfo(`University: ${result.data.data.university || "Not set"}`);
  } else {
    logError("Failed to get profile");
    logInfo(`Error: ${JSON.stringify(result.error, null, 2)}`);
  }

  return result.success;
};

// Test 5: Update Profile
const testUpdateProfile = async () => {
  logTest("Update User Profile");

  const updateData = {
    name: "Updated Test Contributor",
    phone: "+6281234567891",
    university: "Universitas Hasanuddin",
    major: "Manajemen Pariwisata",
    bio: "Passionate about sustainable tourism in Indonesia",
  };

  const result = await apiRequest(
    "PUT",
    "/auth/profile",
    updateData,
    authToken
  );

  if (result.success) {
    logSuccess("Profile updated successfully!");
    logInfo(`Updated name: ${result.data.data.name}`);
    logInfo(`Updated university: ${result.data.data.university}`);
  } else {
    logError("Failed to update profile");
    logInfo(`Error: ${JSON.stringify(result.error, null, 2)}`);
  }

  return result.success;
};

// Test 6: Test Authorization (Try to access admin-only endpoint)
const testAuthorization = async () => {
  logTest("Authorization Test (Should Fail for Contributor)");

  const result = await apiRequest("GET", "/users", null, authToken);

  if (!result.success && result.status === 403) {
    logSuccess(
      "Authorization working correctly! Contributor cannot access user management."
    );
    logInfo("Expected 403 Forbidden error received");
  } else if (result.success) {
    logError(
      "Authorization failed! Contributor should not access user management."
    );
  } else {
    logError("Unexpected error during authorization test");
    logInfo(`Error: ${JSON.stringify(result.error, null, 2)}`);
  }

  return !result.success && result.status === 403;
};

// Test 7: Create Superadmin and Test User Management
const testSuperadminFunctions = async () => {
  logTest("Superadmin User Management");

  // First, register a superadmin
  const superadminData = {
    name: "Super Administrator",
    email: "superadmin@laiya.com",
    password: "admin123",
    role: "superadmin",
  };

  const registerResult = await apiRequest(
    "POST",
    "/auth/register",
    superadminData
  );

  if (!registerResult.success) {
    logError("Failed to create superadmin");
    return false;
  }

  const superadminToken = registerResult.data.data.token;
  logSuccess("Superadmin created successfully!");

  // Test getting all users (superadmin only)
  const usersResult = await apiRequest("GET", "/users", null, superadminToken);

  if (usersResult.success) {
    logSuccess("Superadmin can access user management!");
    logInfo(`Total users found: ${usersResult.data.data.users.length}`);
    logInfo(
      `Users: ${usersResult.data.data.users
        .map((u) => `${u.name} (${u.role})`)
        .join(", ")}`
    );
  } else {
    logError("Superadmin failed to access user management");
    logInfo(`Error: ${JSON.stringify(usersResult.error, null, 2)}`);
  }

  return usersResult.success;
};

// Test 8: Input Validation
const testInputValidation = async () => {
  logTest("Input Validation");

  // Test with invalid email
  const invalidData = {
    name: "A", // Too short
    email: "invalid-email", // Invalid format
    password: "123", // Too short
    role: "invalid-role", // Invalid role
  };

  const result = await apiRequest("POST", "/auth/register", invalidData);

  if (!result.success && result.status === 400) {
    logSuccess("Input validation working correctly!");
    logInfo("Validation errors caught as expected");
    if (result.error.errors) {
      result.error.errors.forEach((err) => {
        logInfo(`- ${err.msg}`);
      });
    }
  } else {
    logError("Input validation failed");
    logInfo(`Unexpected result: ${JSON.stringify(result, null, 2)}`);
  }

  return !result.success && result.status === 400;
};

// Test 9: Rate Limiting (if enabled)
const testRateLimiting = async () => {
  logTest("Rate Limiting Test");

  logInfo("Sending multiple rapid requests...");

  const promises = [];
  for (let i = 0; i < 10; i++) {
    promises.push(apiRequest("GET", "/health"));
  }

  const results = await Promise.all(promises);
  const successCount = results.filter((r) => r.success).length;
  const rateLimitedCount = results.filter((r) => r.status === 429).length;

  logInfo(`Successful requests: ${successCount}`);
  logInfo(`Rate limited requests: ${rateLimitedCount}`);

  if (rateLimitedCount > 0) {
    logSuccess("Rate limiting is working!");
  } else {
    logInfo("Rate limiting may not be triggered with current settings");
  }

  return true;
};

// Main test runner
const runAllTests = async () => {
  console.log(
    `${colors.bold}${colors.blue}🚀 Starting Laiya Tourism Backend API Tests${colors.reset}\n`
  );

  const tests = [
    { name: "Health Check", fn: testHealthCheck },
    { name: "User Registration", fn: testUserRegistration },
    { name: "User Login", fn: testUserLogin },
    { name: "Get Profile", fn: testGetProfile },
    { name: "Update Profile", fn: testUpdateProfile },
    { name: "Authorization Test", fn: testAuthorization },
    { name: "Superadmin Functions", fn: testSuperadminFunctions },
    { name: "Input Validation", fn: testInputValidation },
    { name: "Rate Limiting", fn: testRateLimiting },
  ];

  let passedTests = 0;
  let totalTests = tests.length;

  for (const test of tests) {
    try {
      const result = await test.fn();
      if (result) {
        passedTests++;
      }

      // Wait a bit between tests
      await new Promise((resolve) => setTimeout(resolve, 500));
    } catch (error) {
      logError(`Test "${test.name}" threw an error: ${error.message}`);
    }
  }

  // Final results
  console.log(`\n${colors.bold}${colors.blue}📊 Test Results${colors.reset}`);
  console.log(
    `${colors.bold}Passed: ${colors.green}${passedTests}${colors.reset}${colors.bold}/${totalTests}${colors.reset}`
  );

  if (passedTests === totalTests) {
    log("\n🎉 All tests passed! Backend is working perfectly!", "green");
  } else {
    log(
      `\n⚠️  ${totalTests - passedTests} test(s) failed. Check the logs above.`,
      "yellow"
    );
  }

  console.log(
    `\n${colors.bold}${colors.blue}🔗 API Endpoints Available:${colors.reset}`
  );
  console.log("• POST /api/auth/register - User registration");
  console.log("• POST /api/auth/login - User login");
  console.log("• GET /api/auth/profile - Get user profile (protected)");
  console.log("• PUT /api/auth/profile - Update profile (protected)");
  console.log("• GET /api/users - Get all users (superadmin only)");
  console.log("• GET /api/health - Health check");
};

// Run tests if this file is executed directly
if (require.main === module) {
  runAllTests().catch(console.error);
}

module.exports = { runAllTests, apiRequest };
