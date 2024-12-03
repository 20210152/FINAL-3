const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const app = express();
const PORT = 3001;
const JWT_SECRET = "your_jwt_secret";

app.use(cors());
app.use(express.json());

mongoose.connect("mongodb://127.0.0.1:27017/reservas_aulas", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  role: { type: String, default: "user" },
});

const reservaSchema = new mongoose.Schema({
  aula: String,
  fecha: String,
  horaInicio: String,
  horaFin: String,
  usuario: String,
});

const User = mongoose.model("User", userSchema);
const Reserva = mongoose.model("Reserva", reservaSchema);

app.post("/register", async (req, res) => {
  const { name, email, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    const newUser = new User({ name, email, password: hashedPassword });
    await newUser.save();
    res.status(201).send("Usuario registrado con éxito");
  } catch (error) {
    res.status(400).send("Error al registrar el usuario");
  }
});

app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(401).send("Credenciales inválidas");
  }

  const token = jwt.sign({ email: user.email, role: user.role }, JWT_SECRET, {
    expiresIn: "1h",
  });
  res.json({ token });
});

app.get("/reservas", async (req, res) => {
  const reservas = await Reserva.find();
  res.json(reservas);
});

app.post("/reservas", async (req, res) => {
  const { aula, fecha, horaInicio, horaFin, usuario } = req.body;

  const nuevaReserva = new Reserva({ aula, fecha, horaInicio, horaFin, usuario });
  try {
    await nuevaReserva.save();
    res.status(201).send("Reserva creada exitosamente");
  } catch (error) {
    res.status(400).send("Error al crear la reserva");
  }
});

app.listen(PORT, () => console.log(`Servidor corriendo en el puerto ${PORT}`));
