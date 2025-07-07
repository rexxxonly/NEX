const axios = require("axios");
const tf = require("@tensorflow/tfjs-node");
const Upscaler = require("upscaler").default;
const esrganThick = require("@upscalerjs/esrgan-thick");

module.exports = async (req, res) => {
  try {
    const { imageUrl, scale = 4 } = JSON.parse(req.body);

    // Validate input
    if (!imageUrl) throw new Error("Image URL required");
    const scaleFactor = parseInt(scale);
    if (scaleFactor < 2 || scaleFactor > 6) throw new Error("Scale must be 2-6");

    // Download image
    const { data: imageBuffer } = await axios.get(imageUrl, {
      responseType: "arraybuffer"
    });

    // AI upscaling
    const upscaler = new Upscaler({ model: esrganThick, scale: scaleFactor });
    const upscaledImage = await upscaler.upscale(imageBuffer, { output: "base64" });

    return res.json({
      status: "success",
      originalSize: `${(imageBuffer.length / 1024).toFixed(2)} KB`,
      upscaledSize: `${(Buffer.byteLength(upscaledImage, "base64") / 1024).toFixed(2)} KB`,
      scale: `${scaleFactor}x`,
      image: `data:image/png;base64,${upscaledImage}`
    });

  } catch (error) {
    return res.status(400).json({
      error: error.message,
      solution: "Provide valid image URL and scale (2-6)"
    });
  }
};
