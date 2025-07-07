const fs = require('fs');
const path = require('path');

module.exports = (req, res) => {
  try {
    const apiDir = path.join(__dirname);
    const files = fs.readdirSync(apiDir);
    
    const endpoints = [];
    const categories = new Map();
    
    files.forEach(file => {
      if (file.endsWith('.js') && file !== '_meta.js' && file !== 'endpoints.js') {
        const modulePath = path.join(apiDir, file);
        const apiModule = require(modulePath);
        
        if (apiModule.meta) {
          // Add to endpoints list
          endpoints.push({
            name: apiModule.meta.name,
            path: apiModule.meta.path,
            method: apiModule.meta.method,
            category: apiModule.meta.category,
            description: apiModule.meta.description
          });
          
          // Count categories
          const categoryName = apiModule.meta.category || 'Other';
          const currentCount = categories.get(categoryName) || 0;
          categories.set(categoryName, currentCount + 1);
        }
      }
    });
    
    // Convert categories to array
    const categoryArray = Array.from(categories).map(([name, count]) => ({
      name,
      count
    }));
    
    res.json({
      total: endpoints.length,
      categories: categoryArray.length,
      endpoints,
      categories: categoryArray
    });
    
  } catch (error) {
    res.status(500).json({
      error: "Failed to discover endpoints",
      message: error.message
    });
  }
};
