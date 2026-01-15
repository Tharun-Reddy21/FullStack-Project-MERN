import multer from "multer";
import path from "path";

const storage = multer.diskStorage({
  destination: cb => {
    cb(null, "uploads/");
  },
  filename: ( file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const fileFilter = ( file, cb) => {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(new Error("Only image files are allowed"), false);
  }
};

export const uploadImage = multer({ storage, fileFilter }).single("image");
