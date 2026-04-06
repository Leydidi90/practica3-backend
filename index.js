const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();

// --- CONFIGURACIÓN DE CORS ---
// Esto permite que SOLO tu página de Vercel acceda a los datos
app.use(cors({
  origin: "https://cliente-proyecto3.vercel.app",
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));

app.use(express.json());

// --- CONEXIÓN A MONGODB ---
// Asegúrate de tener MONGO_URI en las variables de entorno de Render
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB conectado exitosamente'))
  .catch((err) => {
    console.error('Error conectando a MongoDB:', err.message);
    process.exit(1);
  });

// --- MODELO DE DATOS ---
const usuarioSchema = new mongoose.Schema({
    nombre: String,
    edad: Number
});

const Usuario = mongoose.model("Usuario", usuarioSchema);

// --- RUTAS ---
app.post("/usuarios", async (req, res) => {
    try {
        const nuevoUsuario = new Usuario(req.body);
        await nuevoUsuario.save();
        res.status(201).json({ message: "Usuario guardado con éxito" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.get("/usuarios", async (req, res) => {
    try {
        const usuarios = await Usuario.find();
        res.json(usuarios);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// --- PUERTO DINÁMICO ---
// Render asigna un puerto automáticamente, por eso usamos process.env.PORT
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Servidor corriendo en el puerto ${PORT}`));