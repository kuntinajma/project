const { pool } = require("../config/database");

/**
 * Get all data needed for the home page
 */
const getHomeData = async (req, res) => {
  try {
    // Get general settings
    const [generalSettings] = await pool.query(
      "SELECT `key`, value FROM settings WHERE category = 'general'"
    );

    // Get contact settings
    const [contactSettings] = await pool.query(
      "SELECT `key`, value FROM settings WHERE category = 'contact'"
    );

    // Get media settings
    const [mediaSettings] = await pool.query(
      "SELECT `key`, value FROM settings WHERE category = 'media'"
    );

    // Get social media settings
    const [socialSettings] = await pool.query(
      "SELECT `key`, value FROM settings WHERE category = 'social'"
    );

    // Get available facilities
    const [facilities] = await pool.query(
      "SELECT id, icon, label, description, is_available FROM facilities WHERE is_available = TRUE"
    );

    // Get featured testimonials (limit to 5)
    const [testimonials] = await pool.query(
      `SELECT id, name, star as rating, message, origin 
       FROM testimonials 
       ORDER BY id DESC 
       LIMIT 5`
    );

    // Get featured destinations (limit to 3)
    const [destinations] = await pool.query(
      `SELECT id, title, short_description, image, category 
       FROM destinations 
       ORDER BY id DESC 
       LIMIT 3`
    );

    // Get featured articles (limit to 3)
    const [articles] = await pool.query(
      `SELECT a.id, a.title, a.excerpt, a.featured_image, a.category, a.published_at, u.name as author_name
       FROM articles a
       LEFT JOIN users u ON a.author_id = u.id
       WHERE a.status = 'published' AND a.is_featured = TRUE
       ORDER BY a.published_at DESC
       LIMIT 3`
    );

    // Get popular tour packages (limit to 3)
    const [tourPackages] = await pool.query(
      `SELECT id, name, description, price, duration, image, popular
       FROM tour_packages
       WHERE popular = TRUE
       ORDER BY id DESC
       LIMIT 3`
    );

    // Format settings into objects
    const formatSettings = (settingsArray) => {
      const result = {};
      settingsArray.forEach(item => {
        // Parse JSON values if the value is a JSON string
        try {
          if (item.value && (item.value.startsWith('[') || item.value.startsWith('{'))) {
            result[item.key] = JSON.parse(item.value);
          } else {
            result[item.key] = item.value;
          }
        } catch (e) {
          result[item.key] = item.value;
        }
      });
      return result;
    };

    // Format facilities
    const formattedFacilities = facilities.map(facility => ({
      id: facility.id,
      icon: facility.icon,
      label: facility.label,
      description: facility.description,
      available: Boolean(facility.is_available)
    }));

    // Format testimonials
    const formattedTestimonials = testimonials.map(testimonial => ({
      id: testimonial.id,
      name: testimonial.name,
      rating: testimonial.rating,
      message: testimonial.message,
      origin: testimonial.origin
    }));

    // Format destinations
    const formattedDestinations = destinations.map(destination => ({
      id: destination.id,
      title: destination.title,
      shortDescription: destination.short_description,
      image: destination.image,
      category: destination.category
    }));

    // Format articles
    const formattedArticles = articles.map(article => ({
      id: article.id,
      title: article.title,
      excerpt: article.excerpt,
      featuredImage: article.featured_image,
      category: article.category,
      publishedAt: article.published_at,
      authorName: article.author_name
    }));

    // Format tour packages
    const formattedTourPackages = tourPackages.map(pkg => ({
      id: pkg.id,
      name: pkg.name,
      description: pkg.description,
      price: pkg.price,
      duration: pkg.duration,
      image: pkg.image,
      popular: Boolean(pkg.popular)
    }));

    res.json({
      success: true,
      data: {
        settings: {
          general: formatSettings(generalSettings),
          contact: formatSettings(contactSettings),
          media: formatSettings(mediaSettings),
          social: formatSettings(socialSettings)
        },
        facilities: formattedFacilities,
        testimonials: formattedTestimonials,
        featuredDestinations: formattedDestinations,
        featuredArticles: formattedArticles,
        popularTourPackages: formattedTourPackages
      }
    });
  } catch (error) {
    console.error("Error getting home data:", error);
    res.status(500).json({
      success: false,
      message: "Server error saat mengambil data home page"
    });
  }
};

/**
 * Get transportation data for the home page
 */
const getTransportationData = async (req, res) => {
  try {
    // Get transportation options
    const [transportation] = await pool.query(
      `SELECT id, name, phone, departure_time, dock_location
       FROM transportation
       ORDER BY id ASC`
    );

    // Format transportation
    const formattedTransportation = transportation.map(item => ({
      id: item.id,
      name: item.name,
      phone: item.phone,
      departureTime: item.departure_time,
      dockLocation: item.dock_location
    }));

    res.json({
      success: true,
      data: formattedTransportation
    });
  } catch (error) {
    console.error("Error getting transportation data:", error);
    res.status(500).json({
      success: false,
      message: "Server error saat mengambil data transportasi"
    });
  }
};

module.exports = {
  getHomeData,
  getTransportationData
}; 