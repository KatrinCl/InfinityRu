import multer from "multer";

// На Vercel нельзя писать в файловую систему, используем MemoryStorage
// Изображения всё равно загружаются в Cloudinary
const storage = multer.memoryStorage();

const upload = multer({ 
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
});

export default upload;
