const meta = {
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
};

// Actual API implementation would go here
module.exports = (req, res) => {
  // Implementation code...
};

// Export meta for discovery
module.exports.meta = meta;
