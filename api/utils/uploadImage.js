import multer from "multer";


const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  if (file && file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(new Error("Only image files are allowed"), false);
  }
};

export const uploadImage = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 3 * 1024 * 1024, // 3 MB images only can be changed
  },
}).single("image");
