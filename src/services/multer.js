import multer from "multer";

export const multerValidation = {
  image: ["image/jpeg", "image/png", "image/jif"],
  pdf: ["application/pdf"],
};

export const HME = (err, req, res, next) => {
  if (err) {
    res.status(400).json({ message: "Multer error", err });
  } else {
    next();
  }
};
export function myMulter(customValidation) {
  if (!customValidation) {
    customValidation = multerValidation.image;
  }

  const storage = multer.diskStorage({});
  function fileFilter(req, file, cb) {
    if (customValidation.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb("In-valid format", false);
    }
  }
  const upload = multer({ dest: "upload", fileFilter, storage });
  return upload;
}
