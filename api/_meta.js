const fs = require('fs');
const path = require('path');

// Sample API metadata structure
const apiTemplates = {
  animeinfo: {
    name: "Anime Info",
    path: "/animeinfo?url=",
    method: "GET",
    category: "Anime",
    description: "Get detailed anime information from MyAnimeList",
    parameters: [
      { name: "url", type: "string", required: true, description: "MyAnimeList anime URL" }
    ],
    exampleRequest: "https://yoursite.com/api/animeinfo?url=https://myanimelist.net/anime/5114",
    exampleResponse: {
      title: "Fullmetal Alchemist: Brotherhood",
      episodes: 64,
      rating: 9.1
    }
  },
  upscale: {
    name: "Image Upscaler",
    path: "/upscale",
    method: "POST",
    category: "AI",
    description: "Upscale images 2x-6x using AI",
    parameters: [
      { name: "imageUrl", type: "string", required: true, description: "Direct image URL" },
      { name: "scale", type: "number", required: false, description: "Upscale factor (2-6)", default: 4 }
    ],
    exampleRequest: {
      imageUrl: "https://example.com/image.jpg",
      scale: 4
    },
    exampleResponse: {
      status: "success",
      upscaledImage: "base64data..."
    }
  }
};

module.exports = (req, res) => {
  try {
    const apiPath = req.query.path;
    
    if (apiPath) {
      // Return single API details
      const apiKey = Object.keys(apiTemplates).find(key => 
        apiTemplates[key].path === apiPath
      );
      
      if (apiKey) {
        return res.json(apiTemplates[apiKey]);
      }
      return res.status(404).json({ error: "API not found" });
    }
    
    // Return all APIs
    const apis = Object.values(apiTemplates);
    
    // Group by category
    const categories = {};
    apis.forEach(api => {
      if (!categories[api.category]) {
        categories[api.category] = [];
      }
      categories[api.category].push(api);
    });
    
    res.json({
      total: apis.length,
      categories: Object.keys(categories).map(name => ({
        name,
        count: categories[name].length
      })),
      endpoints: apis
    });
    
  } catch (error) {
    res.status(500).json({
      error: "Failed to load API data",
      message: error.message
    });
  }
};
