import express from "express";
import multer from "multer";
import path from "path";
import cors from "cors";

const app = express();
const PORT = 3000;

app.use(express.json());

// Configuración de CORS
app.use(
  cors({
    origin: "http://sistema_correo.test", // Permitir solicitudes desde este origen
    optionsSuccessStatus: 200,
  })
);

// Configuración de multer para almacenar archivos en la carpeta 'uploads' con extensión
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `${file.fieldname}-${Date.now()}${ext}`);
  },
});

const upload = multer({ storage: storage });

// Ruta básica
app.get("/", (req, res) => {
  res.send("Servidor funcionando");
});

// Ruta para verificar el servidor
app.get("/verify", (req, res) => {
  res.status(200).json({ message: "El servidor está disponible." });
});

// Ruta para subir archivos
app.post("/upload", upload.single("image"), (req, res) => {
  const file = req.file;
  const filePath = path.join(process.cwd(), file.path);

  if (!file) {
    return res.status(400).send("No se ha subido ningún archivo");
  }

  res.send({
    message: "Archivo subido exitosamente",
    file: {
      originalname: file.originalname,
      mimetype: file.mimetype,
      size: file.size,
      path: filePath,
    },
  });
});

app.listen(PORT, () => {
  console.log(`Servidor ejecutándose en http://localhost:${PORT}`);
});
