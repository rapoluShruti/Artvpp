const pool = require("../config/db");
const cloudinary = require("../config/cloudinary");
const { Readable } = require("stream");

// Helper function to upload to Cloudinary with error handling
function uploadToCloudinary(stream, resourceType) {
  return new Promise((resolve, reject) => {
    const timeout = setTimeout(() => {
      reject(new Error(`Cloudinary ${resourceType} upload timeout (120s)`));
    }, 120000);

    const upload = cloudinary.uploader.upload_stream(
      { resource_type: resourceType, timeout: 120000 },
      (error, result) => {
        clearTimeout(timeout);
        if (error) {
          reject(new Error(`Cloudinary error: ${error.message}`));
        } else {
          resolve(result);
        }
      }
    );

    upload.on("error", (err) => {
      clearTimeout(timeout);
      reject(new Error(`Upload stream error: ${err.message}`));
    });

    stream.on("error", (err) => {
      clearTimeout(timeout);
      reject(new Error(`Buffer stream error: ${err.message}`));
    });

    stream.pipe(upload);
  });
}

exports.createPhysicalArtProduct = async (req, res) => {
  let productId = null;

  try {
    const {
      title,
      description,
      price,
      subcategory,
      quantity,
      size,
      weight,
      is_fragile,
      category_id
    } = req.body;

    console.log("✓ Starting product creation...");

    let finalQty = quantity || 1;
    let is_unique = false;

    if (subcategory === "original_artwork") {
      finalQty = 1;
      is_unique = true;
    }

    // Log the values we received
    console.log("Received:", { title, description, price, subcategory, quantity, size, weight, is_fragile, category_id });
    console.log("Weight type:", typeof weight, "Value:", JSON.stringify(weight));

    // Validate files
    if (!req.files || !req.files.images || req.files.images.length === 0)
      return res.status(400).json({ message: "At least one image required" });

    if (req.files.images.length > 4)
      return res.status(400).json({ message: "Maximum 4 images allowed" });

    if (req.files.video && req.files.video.length > 1)
      return res.status(400).json({ message: "Only one video allowed" });

    // Validate form fields
    if (!title || !description || !price || !category_id || !subcategory)
      return res.status(400).json({ message: "Missing required fields" });

    // Insert product
    console.log("✓ Inserting product into database...");
    const result = await pool.query(
      `INSERT INTO products
      (artist_id,category_id,title,description,price,
       product_type,subcategory,quantity,is_unique,
       size,weight,is_fragile)
      VALUES ($1,$2,$3,$4,$5,'physical_art',$6,$7,$8,$9,$10,$11)
      RETURNING id`,
      [
        req.user.id,
        category_id,
        title,
        description,
        price,
        subcategory,
        finalQty,
        is_unique,
        size && size.trim() && size !== "N/A" ? size : null,
        weight && weight.trim() && weight !== "N/A" && !isNaN(weight) ? parseFloat(weight) : null,
        is_fragile === "true" || is_fragile === true
      ]
    );

    productId = result.rows[0].id;
    console.log("✓ Product inserted with ID:", productId);

    // Upload images
    console.log("✓ Starting image uploads...");
    for (let i = 0; i < req.files.images.length; i++) {
      const file = req.files.images[i];
      console.log(`  Uploading image ${i + 1}/${req.files.images.length}...`);

      const stream = Readable.from(file.buffer);
      const uploadImg = await uploadToCloudinary(stream, "image");

      await pool.query(
        "INSERT INTO product_media(product_id,media_url,media_type) VALUES($1,$2,'image')",
        [productId, uploadImg.secure_url]
      );
      console.log(`  ✓ Image ${i + 1} saved`);
    }

    // Upload video if present
    if (req.files.video && req.files.video.length > 0) {
      console.log("✓ Uploading video...");
      const videoFile = req.files.video[0];
      const stream = Readable.from(videoFile.buffer);
      const uploadVid = await uploadToCloudinary(stream, "video");

      await pool.query(
        "INSERT INTO product_media(product_id,media_url,media_type) VALUES($1,$2,'video')",
        [productId, uploadVid.secure_url]
      );
      console.log("✓ Video saved");
    }

    console.log("✓✓✓ Product creation completed successfully!");
    res.status(201).json({ message: "Physical Art Product Created", productId });

  } catch (err) {
    console.error("✗ Product creation error:", err.message);
    if (err.stack) console.error("Stack:", err.stack);
    
    if (!res.headersSent) {
      res.status(500).json({ error: err.message || "Internal server error" });
    }
  }
};
