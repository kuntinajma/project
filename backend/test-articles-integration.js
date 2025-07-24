/**
 * Test script untuk memverifikasi implementasi Articles
 *
 * Jalankan dengan: node test-articles-integration.js
 * Pastikan server backend sudah running di port 5000
 */

const axios = require("axios");

const BASE_URL = "http://localhost:3005/api";
let authToken = "";

// Test functions
const logSuccess = (message) => console.log(`✅ ${message}`);
const logError = (message) => console.log(`❌ ${message}`);
const logInfo = (message) => console.log(`ℹ️  ${message}`);

// Helper function untuk API request
const apiRequest = async (method, endpoint, data = null, token = null) => {
  try {
    const config = {
      method,
      url: `${BASE_URL}${endpoint}`,
      headers: {
        "Content-Type": "application/json",
      },
    };

    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }

    if (data) {
      config.data = data;
    }

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

// Test 1: Login untuk mendapatkan token
const testLogin = async () => {
  console.log("\n🔐 Testing Login...");

  const loginData = {
    email: "kontributor@laiya.com",
    password: "demo123",
  };

  const result = await apiRequest("POST", "/auth/login", loginData);

  if (result.success) {
    logSuccess("Login berhasil!");
    authToken = result.data.data.token;
    logInfo(`Token: ${authToken.substring(0, 20)}...`);
  } else {
    logError("Login gagal");
    logInfo(`Error: ${JSON.stringify(result.error, null, 2)}`);
  }

  return result.success;
};

// Test 2: Create Article
const testCreateArticle = async () => {
  console.log("\n📝 Testing Create Article...");

  const articleData = {
    title: "Test Artikel Wisata Pulau Laiya",
    content:
      "Ini adalah konten artikel test untuk memverifikasi bahwa sistem articles sudah berjalan dengan baik. Konten ini harus lebih dari 100 karakter sesuai dengan validation rules yang sudah ditetapkan.",
    excerpt: "Excerpt singkat untuk artikel test wisata Pulau Laiya",
    category: "tourism",
    featuredImage: "test-image.jpg",
    status: "published",
    isFeatured: true,
    tags: ["wisata", "pulau", "laiya"],
  };

  const result = await apiRequest("POST", "/articles", articleData, authToken);

  if (result.success) {
    logSuccess("Article berhasil dibuat!");
    logInfo(`Article ID: ${result.data.data.id}`);
    logInfo(`Title: ${result.data.data.title}`);
    logInfo(`Slug: ${result.data.data.slug}`);
    return result.data.data.id;
  } else {
    logError("Gagal membuat article");
    logInfo(`Error: ${JSON.stringify(result.error, null, 2)}`);
    return null;
  }
};

// Test 3: Get All Articles
const testGetAllArticles = async () => {
  console.log("\n📖 Testing Get All Articles...");

  const result = await apiRequest("GET", "/articles?page=1&limit=10");

  if (result.success) {
    logSuccess("Berhasil mengambil daftar articles!");
    logInfo(`Total articles: ${result.data.data.pagination.totalItems}`);
    logInfo(`Articles in page: ${result.data.data.articles.length}`);
  } else {
    logError("Gagal mengambil daftar articles");
    logInfo(`Error: ${JSON.stringify(result.error, null, 2)}`);
  }

  return result.success;
};

// Test 4: Get Article by ID
const testGetArticleById = async (articleId) => {
  if (!articleId) return false;

  console.log("\n🔍 Testing Get Article by ID...");

  const result = await apiRequest("GET", `/articles/${articleId}`);

  if (result.success) {
    logSuccess("Berhasil mengambil article by ID!");
    logInfo(`Title: ${result.data.data.title}`);
    logInfo(`View Count: ${result.data.data.viewCount}`);
    logInfo(`Author: ${result.data.data.authorName}`);
  } else {
    logError("Gagal mengambil article by ID");
    logInfo(`Error: ${JSON.stringify(result.error, null, 2)}`);
  }

  return result.success;
};

// Test 5: Get Featured Articles
const testGetFeaturedArticles = async () => {
  console.log("\n⭐ Testing Get Featured Articles...");

  const result = await apiRequest("GET", "/articles/featured?limit=5");

  if (result.success) {
    logSuccess("Berhasil mengambil featured articles!");
    logInfo(`Featured articles count: ${result.data.data.length}`);
  } else {
    logError("Gagal mengambil featured articles");
    logInfo(`Error: ${JSON.stringify(result.error, null, 2)}`);
  }

  return result.success;
};

// Test 6: Update Article
const testUpdateArticle = async (articleId) => {
  if (!articleId) return false;

  console.log("\n✏️ Testing Update Article...");

  const updateData = {
    title: "Test Artikel Wisata Pulau Laiya (Updated)",
    content:
      "Konten artikel yang sudah diupdate dengan informasi terbaru tentang wisata Pulau Laiya. Konten ini sudah diperbarui untuk testing update functionality.",
    excerpt: "Excerpt yang sudah diupdate untuk artikel test",
    category: "tourism",
    featuredImage: "updated-image.jpg",
    status: "published",
    isFeatured: false,
    tags: ["wisata", "updated", "test"],
  };

  const result = await apiRequest(
    "PUT",
    `/articles/${articleId}`,
    updateData,
    authToken
  );

  if (result.success) {
    logSuccess("Article berhasil diupdate!");
    logInfo(`Updated title: ${result.data.data.title}`);
    logInfo(`New slug: ${result.data.data.slug}`);
  } else {
    logError("Gagal update article");
    logInfo(`Error: ${JSON.stringify(result.error, null, 2)}`);
  }

  return result.success;
};

// Test 7: Delete Article
const testDeleteArticle = async (articleId) => {
  if (!articleId) return false;

  console.log("\n🗑️ Testing Delete Article...");

  const result = await apiRequest(
    "DELETE",
    `/articles/${articleId}`,
    null,
    authToken
  );

  if (result.success) {
    logSuccess("Article berhasil dihapus!");
  } else {
    logError("Gagal menghapus article");
    logInfo(`Error: ${JSON.stringify(result.error, null, 2)}`);
  }

  return result.success;
};

// Test 8: Verify Database Schema
const testDatabaseIntegration = async () => {
  console.log("\n🗄️ Testing Database Integration...");

  // Test dengan invalid data untuk memverifikasi validation
  const invalidData = {
    title: "A", // Too short
    content: "Short", // Too short
    excerpt: "Too short", // Too short
    category: "invalid", // Invalid category
  };

  const result = await apiRequest("POST", "/articles", invalidData, authToken);

  if (!result.success && result.status === 400) {
    logSuccess("Validation bekerja dengan baik!");
    logInfo("Validation errors properly caught");
  } else {
    logError("Validation tidak bekerja dengan baik");
  }

  return !result.success; // We expect this to fail
};

// Main test runner
const runAllTests = async () => {
  console.log("🚀 Starting Articles Integration Test");
  console.log("=====================================");

  const results = [];

  // Test login first
  const loginSuccess = await testLogin();
  if (!loginSuccess) {
    logError("Login gagal, tidak bisa melanjutkan test");
    return;
  }

  // Run all tests
  results.push(await testGetAllArticles());
  const articleId = await testCreateArticle();
  results.push(!!articleId);
  results.push(await testGetArticleById(articleId));
  results.push(await testGetFeaturedArticles());
  results.push(await testUpdateArticle(articleId));
  results.push(await testDatabaseIntegration());
  results.push(await testDeleteArticle(articleId));

  // Summary
  console.log("\n📊 Test Summary");
  console.log("===============");
  const passedTests = results.filter((r) => r).length;
  const totalTests = results.length;

  logInfo(`Tests passed: ${passedTests}/${totalTests}`);

  if (passedTests === totalTests) {
    logSuccess("🎉 Semua tests berhasil! Articles integration sudah siap!");
  } else {
    logError(`❌ ${totalTests - passedTests} tests gagal`);
  }
};

// Run tests if this file is executed directly
if (require.main === module) {
  runAllTests().catch(console.error);
}

module.exports = {
  runAllTests,
  testLogin,
  testCreateArticle,
  testGetAllArticles,
  testGetArticleById,
  testGetFeaturedArticles,
  testUpdateArticle,
  testDeleteArticle,
  testDatabaseIntegration,
};
