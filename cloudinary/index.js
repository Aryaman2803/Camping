const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");

// *Specify Cloudinary credintials.
//  ! Don't upload .env file on Git with your credintials
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_KEY,
  api_secret: process.env.CLOUDINARY_SECRET,
});

//instantiating an instance of cloudinary and pass it through multer instead of doing local storage (uploads folder)
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "Camping",
    allowedFormats: ["jpeg", "png", "jpg"],
  },
  responsive_breakpoints: {
    max_images: 3,
  },
});

module.exports = {
  cloudinary,
  storage,
};

// ?Then we change the upload multer destionation instead of dest: "uploads/" in index.js
