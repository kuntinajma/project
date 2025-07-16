const axios = require('axios');

const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY;
const PLACE_ID = '0x2dbe4d2d70592b6f:0xd0751175262a2c69'; // Updated Place ID from user provided Google Maps link

async function getGoogleReviews(req, res) {
  if (!GOOGLE_API_KEY) {
    return res.status(500).json({ success: false, message: 'Google API key not configured' });
  }

  try {
    const response = await axios.get(
      "https://maps.googleapis.com/maps/api/place/details/json?place_id=" + PLACE_ID + "&fields=reviews&key=" + GOOGLE_API_KEY
    );

    if (response.data.status !== 'OK') {
      return res.status(500).json({ success: false, message: 'Failed to fetch reviews from Google Places API' });
    }

    const reviews = response.data.result.reviews || [];

    // Map reviews to the format expected by frontend
    const formattedReviews = reviews.map((review, index) => ({
      id: index.toString(),
      name: review.author_name,
      rating: review.rating,
      review: review.text.length > 100 ? review.text.substring(0, 100) + '...' : review.text,
      fullReview: review.text,
      date: new Date(review.time * 1000).toISOString().split('T')[0], // format as YYYY-MM-DD
    }));

    res.json({ success: true, reviews: formattedReviews });
  } catch (error) {
    console.error('Error fetching Google reviews:', error);
    res.status(500).json({ success: false, message: 'Error fetching Google reviews' });
  }
}

module.exports = { getGoogleReviews };
